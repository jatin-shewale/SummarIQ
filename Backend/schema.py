from pydantic import BaseModel, Field

class BookSummary(BaseModel):
    title: str = Field(..., description="The title of the book or chapter")
    summary: str = Field(..., description="Condensed summary of the input")
    saved_path: str = Field(..., description="Path where the summary is saved")