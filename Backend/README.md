# SummarIQ Backend

This is the backend API for SummarIQ, an AI-powered document and text summarization service.

## Features

- **Text Summarization**: Summarize any text input using AI
- **PDF Processing**: Upload and summarize PDF documents
- **AI Agent Integration**: Uses LangChain with Google Gemini AI
- **RESTful API**: FastAPI-based API with automatic documentation
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling and validation

## Setup

### Prerequisites

- Python 3.8+
- Google Gemini API key

### Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

3. **Run the server**:
   ```bash
   python start.py
   ```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Text Summarization
- `POST /api/summarize/text` - Summarize text input
  ```json
  {
    "text": "Your text to summarize",
    "additional_context": "Optional additional context"
  }
  ```

### PDF Summarization
- `POST /api/summarize/pdf` - Summarize PDF file
  - Form data with `file` (PDF) and optional `additional_context`

### Chat History
- `GET /api/history` - Get current chat history
- `POST /api/clear-history` - Clear chat history

## File Structure

```
backend/
├── api.py              # Main FastAPI application
├── main.py             # AI agent setup (original)
├── prompts.py          # System prompts
├── schema.py           # Pydantic models
├── tools.py            # LangChain tools
├── start.py            # Server startup script
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## AI Agent Components

The backend uses a LangChain-based AI agent with:

- **Model**: Google Gemini 1.5 Flash
- **Tools**: File saving functionality
- **Output Parser**: Structured JSON output
- **Chat History**: Maintains conversation context

## Error Handling

The API includes comprehensive error handling for:
- Invalid file types
- PDF processing errors
- AI model errors
- Network issues
- Validation errors

## CORS Configuration

Configured to allow requests from:
- http://localhost:5173 (Vite dev server)
- http://127.0.0.1:5173

## Development

For development with auto-reload:
```bash
python start.py
```

The server will automatically reload when files change.

## Production

For production deployment, consider:
- Using a production ASGI server like Gunicorn
- Setting up proper environment variables
- Configuring CORS for your domain
- Adding authentication if needed
- Setting up logging and monitoring 