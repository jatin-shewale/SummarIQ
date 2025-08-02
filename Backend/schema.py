from pydantic import BaseModel, Field
from typing import Optional
import time

class BookSummary(BaseModel):
    title: str = Field(..., description="The title of the book or chapter")
    summary: str = Field(..., description="Condensed summary of the input")
    saved_path: str = Field(..., description="Path where the summary is saved")

class SummaryRequest(BaseModel):
    text: str = Field(..., description="Text content to summarize")
    additional_context: Optional[str] = Field(None, description="Additional context or notes")
    title: Optional[str] = Field(None, description="Optional title for the summary")

class SummaryResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    summary: str = Field(..., description="The generated summary")
    title: str = Field(..., description="Title of the summarized content")
    word_count: int = Field(..., description="Number of words in original text")
    processing_time: float = Field(..., description="Time taken to process in seconds")
    saved_path: str = Field(..., description="Path where summary is saved")
    original_filename: Optional[str] = Field(None, description="Original filename for PDF uploads")

class AIResult(BaseModel):
    title: str
    summary: str
    saved_path: str
    processing_time: float