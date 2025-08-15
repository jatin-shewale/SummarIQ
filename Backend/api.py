from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
from dotenv import load_dotenv
import PyPDF2
import io

# Import LangChain components
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.messages import HumanMessage, AIMessage
from tools import tools
from schema import BookSummary
from prompts import SYSTEM_PROMPT

# Load environment variables
load_dotenv()

# Initialize AI components
agent_executor = None
parser = None

# Get API key
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    try:
        # Create LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.4,
            google_api_key=api_key
        )
        
        # Create parser
        parser = PydanticOutputParser(pydantic_object=BookSummary)
        
        # Create prompt
        def escape_curly_braces(text):
            return text.replace("{", "{{").replace("}", "}}")
        
        format_instructions = escape_curly_braces(parser.get_format_instructions())
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("placeholder", "{chat_history}"),
            ("human", "{query}"),
            ("placeholder", "{agent_scratchpad}"),
        ]).partial(format_instructions=format_instructions)
        
        # Create agent
        agent = create_tool_calling_agent(
            llm=llm,
            tools=tools,
            prompt=prompt
        )
        
        # Create agent executor
        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True
        )
        
        print("AI components initialized successfully")
        
    except Exception as e:
        print(f"Error initializing AI components: {e}")
        agent_executor = None
        parser = None
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables")
    print("Please create a .env file with your Google Gemini API key")
    print("Example: GOOGLE_API_KEY=your_api_key_here")

app = FastAPI(
    title="SummarIQ API",
    description="AI-powered document and text summarization API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class TextSummaryRequest(BaseModel):
    text: str
    additional_context: Optional[str] = None

class SummaryResponse(BaseModel):
    title: str
    summary: str
    success: bool
    message: str

# Global chat history for the session
chat_history = []

def extract_text_from_pdf(pdf_file: UploadFile) -> str:
    """Extract text from uploaded PDF file"""
    try:
        # Read the PDF file
        pdf_content = pdf_file.file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to SummarIQ API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "SummarIQ API is running"}

@app.post("/api/summarize/text", response_model=SummaryResponse)
async def summarize_text(request: TextSummaryRequest):
    """Summarize text input"""
    if not agent_executor or not parser:
        raise HTTPException(status_code=500, detail="AI components not initialized. Please check your API key.")
    
    try:
        # Prepare the query with additional context if provided
        query = request.text
        if request.additional_context:
            query = f"Text to summarize: {request.text}\n\nAdditional context: {request.additional_context}"
        
        # Add to chat history
        chat_history.append(HumanMessage(content=query))
        
        # Get summary from AI agent
        response = agent_executor.invoke({
            "query": query,
            "chat_history": chat_history
        })
        
        # Parse the response
        try:
            result = parser.parse(response['output'])
            chat_history.append(AIMessage(content=result.summary))
            
            return SummaryResponse(
                title=result.title,
                summary=result.summary,
                success=True,
                message="Summary generated successfully"
            )
        except Exception as parse_error:
            # If parsing fails, return the raw output
            chat_history.append(AIMessage(content=response['output']))
            
            return SummaryResponse(
                title="Generated Summary",
                summary=response['output'],
                success=True,
                message="Summary generated (parsing warning)"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@app.post("/api/summarize/pdf", response_model=SummaryResponse)
async def summarize_pdf(
    file: UploadFile = File(...),
    additional_context: Optional[str] = Form(None)
):
    """Summarize PDF file"""
    if not agent_executor or not parser:
        raise HTTPException(status_code=500, detail="AI components not initialized. Please check your API key.")
    
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file)
        
        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Prepare the query
        query = f"PDF content to summarize: {pdf_text}"
        if additional_context:
            query += f"\n\nAdditional context: {additional_context}"
        
        # Add to chat history
        chat_history.append(HumanMessage(content=query))
        
        # Get summary from AI agent
        response = agent_executor.invoke({
            "query": query,
            "chat_history": chat_history
        })
        
        # Parse the response
        try:
            result = parser.parse(response['output'])
            chat_history.append(AIMessage(content=result.summary))
            
            return SummaryResponse(
                title=result.title,
                summary=result.summary,
                success=True,
                message="PDF summarized successfully"
            )
        except Exception as parse_error:
            # If parsing fails, return the raw output
            chat_history.append(AIMessage(content=response['output']))
            
            return SummaryResponse(
                title="PDF Summary",
                summary=response['output'],
                success=True,
                message="PDF summarized (parsing warning)"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/api/clear-history")
async def clear_history():
    """Clear chat history"""
    global chat_history
    chat_history = []
    return {"message": "Chat history cleared successfully"}

@app.get("/api/history")
async def get_history():
    """Get current chat history"""
    return {"history": [{"role": "user" if isinstance(msg, HumanMessage) else "assistant", "content": msg.content} for msg in chat_history]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 