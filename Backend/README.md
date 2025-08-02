# AI Document Summarizer - Backend

A powerful FastAPI backend service for AI-powered document and text summarization using Google's Gemini AI.

## 🚀 Features

### 📄 Document Processing
- **PDF Upload**: Extract and summarize text from PDF documents
- **Text Input**: Direct text summarization
- **File Validation**: Size limits and type checking
- **Error Handling**: Comprehensive error management

### 🧠 AI-Powered Summarization
- **Google Gemini AI**: Advanced language model for high-quality summaries
- **Context Awareness**: Incorporates additional user context
- **Structured Output**: Well-formatted summaries with bullet points
- **Chat History**: Maintains conversation context

### 🔗 API Endpoints
- **REST API**: Clean, documented endpoints
- **CORS Support**: Frontend integration ready
- **File Upload**: Multipart form data support
- **JSON Responses**: Structured API responses

## 🛠️ Tech Stack

- **FastAPI**: Modern, fast web framework
- **Google Gemini AI**: Advanced language model
- **LangChain**: AI framework for building applications
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server

## 📋 Prerequisites

- Python 3.8+
- Google AI API Key (Gemini)
- pip or conda package manager

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Google AI API key
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Start the Server

```bash
# Using the startup script (recommended)
python start.py

# Or directly with uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /
GET /health
```

#### Text Summarization
```http
POST /summarize/text
Content-Type: application/json

{
  "text": "Your text content here...",
  "additional_context": "Optional context",
  "title": "Optional title"
}
```

#### PDF Summarization
```http
POST /summarize/pdf
Content-Type: multipart/form-data

- file: PDF file (max 10MB)
- additional_context: Optional context
- title: Optional title
```

#### List Summaries
```http
GET /summaries
```

### Response Format

```json
{
  "success": true,
  "summary": "Generated summary text...",
  "title": "Document Title",
  "word_count": 1234,
  "processing_time": 2.45,
  "saved_path": "summaries/summary_20231201_123456.txt",
  "original_filename": "document.pdf"
}
```

## 🔧 Configuration

### Environment Variables

```env
# Required
GOOGLE_API_KEY=your_google_ai_api_key

# Optional
HOST=0.0.0.0
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MAX_FILE_SIZE=10485760
SUMMARIES_DIR=summaries
```

### File Limits
- **Max PDF Size**: 10MB
- **Supported Formats**: PDF only
- **Text Length**: Up to 5000 characters (frontend limit)

## 📁 Project Structure

```
Backend/
├── app.py              # Main FastAPI application
├── ai_service.py       # AI summarization service
├── schema.py           # Pydantic models
├── prompts.py          # AI prompts and templates
├── tools.py            # LangChain tools
├── start.py            # Startup script
├── requirements.txt    # Dependencies
├── .env.example        # Environment template
└── summaries/          # Generated summaries (auto-created)
```

## 🔍 API Testing

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Text summarization
curl -X POST "http://localhost:8000/summarize/text" \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here", "title": "Test Summary"}'

# PDF upload
curl -X POST "http://localhost:8000/summarize/pdf" \
  -F "file=@document.pdf" \
  -F "title=My Document"
```

### Using Python requests

```python
import requests

# Text summarization
response = requests.post(
    "http://localhost:8000/summarize/text",
    json={
        "text": "Your text content here...",
        "title": "Test Summary"
    }
)
print(response.json())

# PDF upload
with open("document.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/summarize/pdf",
        files={"file": f},
        data={"title": "My Document"}
    )
print(response.json())
```

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid input, file too large, etc.)
- **422**: Validation Error
- **500**: Internal Server Error

Error response format:
```json
{
  "detail": "Error description"
}
```

## 🧪 Development

### Running in Development Mode

```bash
python start.py  # Automatically enables reload and debug
```

### Testing

```bash
# Install test dependencies
pip install pytest httpx

# Run tests (if you create them)
pytest
```

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **File Validation**: PDF files are validated for type and size
- **CORS**: Configure allowed origins for production
- **Input Sanitization**: All inputs are validated with Pydantic

## 🚀 Production Deployment

### Using Docker (recommended)

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "start.py"]
```

### Environment Variables for Production

```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google AI**: For the powerful Gemini language model
- **FastAPI**: For the excellent web framework
- **LangChain**: For AI application building tools

---

Built with ❤️ using FastAPI and Google AI