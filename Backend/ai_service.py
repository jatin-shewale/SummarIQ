import os
import time
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.messages import HumanMessage, AIMessage
from tools import tools
from schema import BookSummary, AIResult
from prompts import SYSTEM_PROMPT

# Load environment variables
load_dotenv()

class SummaryService:
    def __init__(self):
        """Initialize the AI summarization service"""
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.4,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        
        self.parser = PydanticOutputParser(pydantic_object=BookSummary)
        self.chat_history = []
        
        # Create prompt template
        format_instructions = self._escape_curly_braces(self.parser.get_format_instructions())
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("placeholder", "{chat_history}"),
            ("human", "{query}"),
            ("placeholder", "{agent_scratchpad}"),
        ]).partial(format_instructions=format_instructions)
        
        # Create agent
        self.agent = create_tool_calling_agent(
            llm=self.llm,
            tools=tools,
            prompt=self.prompt
        )
        
        # Create agent executor
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=tools,
            verbose=False  # Set to False for production
        )
    
    def _escape_curly_braces(self, text):
        """Escape curly braces in format instructions"""
        return text.replace("{", "{{").replace("}", "}}")
    
    async def generate_summary(self, text: str, additional_context: str = None, title: str = "Summary") -> AIResult:
        """
        Generate an AI summary for the given text
        
        Args:
            text: The text to summarize
            additional_context: Optional additional context
            title: Optional title for the summary
            
        Returns:
            AIResult: The summarization result
        """
        start_time = time.time()
        
        try:
            # Prepare the query
            query = text
            if additional_context:
                query += f"\n\nAdditional Context: {additional_context}"
            
            # Add to chat history
            self.chat_history.append(HumanMessage(content=query))
            
            # Generate summary using the agent
            response = self.agent_executor.invoke({
                "query": query,
                "chat_history": self.chat_history
            })
            
            # Parse the response
            try:
                result = self.parser.parse(response['output'])
                
                # Add to chat history
                self.chat_history.append(AIMessage(content=result.summary))
                
                processing_time = time.time() - start_time
                
                return AIResult(
                    title=result.title,
                    summary=result.summary,
                    saved_path=result.saved_path,
                    processing_time=processing_time
                )
                
            except Exception as parse_error:
                # If parsing fails, try to extract summary from raw output
                raw_summary = response.get('output', 'Summary generation failed')
                
                # Create a fallback result
                from tools import save_summary
                saved_path = save_summary(raw_summary, title)
                
                processing_time = time.time() - start_time
                
                return AIResult(
                    title=title,
                    summary=raw_summary,
                    saved_path=saved_path,
                    processing_time=processing_time
                )
                
        except Exception as e:
            processing_time = time.time() - start_time
            error_message = f"Error generating summary: {str(e)}"
            
            # Save error for debugging
            from tools import save_summary
            saved_path = save_summary(error_message, f"error_{title}")
            
            raise Exception(error_message)
    
    def clear_history(self):
        """Clear the chat history"""
        self.chat_history = []
    
    def get_history_length(self):
        """Get the current chat history length"""
        return len(self.chat_history)