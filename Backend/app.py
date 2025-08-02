from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import PyPDF2
import io
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our existing modules
from ai_service import SummaryService
from schema import BookSummary, SummaryRequest, SummaryResponse

app = FastAPI(
    title="AI Document Summarizer API",
    description="Backend API for AI-powered document and text summarization",
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

# Initialize the summary service
summary_service = SummaryService()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "AI Document Summarizer API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "AI Document Summarizer",
        "version": "1.0.0",
        "ai_model": "gemini-1.5-flash"
    }

@app.post("/summarize/text", response_model=SummaryResponse)
async def summarize_text(request: SummaryRequest):
    """
    Summarize text content
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text content is required")
        
        # Generate summary using AI service
        summary_result = await summary_service.generate_summary(
            text=request.text,
            additional_context=request.additional_context,
            title=request.title or "Text Summary"
        )
        
        return SummaryResponse(
            success=True,
            summary=summary_result.summary,
            title=summary_result.title,
            word_count=len(request.text.split()),
            processing_time=summary_result.processing_time,
            saved_path=summary_result.saved_path
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@app.post("/summarize/pdf", response_model=SummaryResponse)
async def summarize_pdf(
    file: UploadFile = File(...),
    additional_context: Optional[str] = Form(None),
    title: Optional[str] = Form(None)
):
    """
    Summarize PDF document
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Check file size (10MB limit)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File size too large. Maximum 10MB allowed.")
        
        # Extract text from PDF
        try:
            pdf_text = extract_text_from_pdf(content)
            if not pdf_text.strip():
                raise HTTPException(status_code=400, detail="No text content found in PDF")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
        
        # Generate summary using AI service
        summary_result = await summary_service.generate_summary(
            text=pdf_text,
            additional_context=additional_context,
            title=title or file.filename.replace('.pdf', '')
        )
        
        return SummaryResponse(
            success=True,
            summary=summary_result.summary,
            title=summary_result.title,
            word_count=len(pdf_text.split()),
            processing_time=summary_result.processing_time,
            saved_path=summary_result.saved_path,
            original_filename=file.filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """
    Extract text from PDF content
    """
    try:
        pdf_file = io.BytesIO(pdf_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

@app.get("/summaries")
async def list_summaries():
    """
    List all saved summaries
    """
    try:
        summaries_dir = "summaries"
        if not os.path.exists(summaries_dir):
            return {"summaries": []}
        
        summaries = []
        for filename in os.listdir(summaries_dir):
            if filename.endswith('.txt'):
                file_path = os.path.join(summaries_dir, filename)
                file_stat = os.stat(file_path)
                summaries.append({
                    "filename": filename,
                    "created_at": file_stat.st_ctime,
                    "size": file_stat.st_size
                })
        
        # Sort by creation time (newest first)
        summaries.sort(key=lambda x: x['created_at'], reverse=True)
        
        return {"summaries": summaries}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing summaries: {str(e)}")

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )