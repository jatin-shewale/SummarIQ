# SummarIQ - AI Document Summarizer

SummarIQ is a modern, AI-powered document and text summarization application that uses Google Gemini AI to provide intelligent, concise summaries of your content.

## Features

- **📄 PDF Processing**: Upload and summarize PDF documents
- **📝 Text Summarization**: Paste or type text for instant summarization
- **🤖 AI-Powered**: Uses Google Gemini 1.5 Flash for intelligent analysis
- **📱 Responsive Design**: Beautiful, mobile-responsive UI
- **⚡ Real-time Processing**: Fast, efficient summarization
- **🎨 Modern UI**: Glass-morphism design with smooth animations
- **📊 Additional Context**: Add notes to improve summary quality

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for beautiful icons
- **React Dropzone** for file uploads
- **React Toastify** for notifications

### Backend
- **FastAPI** for the REST API
- **LangChain** for AI agent orchestration
- **Google Gemini AI** for text processing
- **PyPDF2** for PDF text extraction
- **Pydantic** for data validation

## Quick Start

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **Google Gemini API Key** (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SummarIQ
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "GOOGLE_API_KEY=your_api_key_here" > .env

# Start the backend server
python start.py
```

The backend will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd Frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## Project Structure

```
SummarIQ/
├── backend/                 # FastAPI backend
│   ├── api.py              # Main API application
│   ├── main.py             # AI agent setup
│   ├── prompts.py          # System prompts
│   ├── schema.py           # Data models
│   ├── tools.py            # LangChain tools
│   ├── start.py            # Server startup
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md              # This file
```

## Usage

### Text Summarization
1. Click on the "Paste Text" tab
2. Enter or paste your text in the text area
3. Click "Generate Summary"
4. View your AI-generated summary

### PDF Summarization
1. Click on the "Upload PDF" tab
2. Drag and drop a PDF file or click to browse
3. Optionally add additional context or questions
4. Click "Generate Summary"
5. View your AI-generated summary

### Features
- **Copy Summary**: Click the copy button to copy to clipboard
- **Download Summary**: Download as a text file
- **Share Summary**: Share via native sharing (mobile) or copy
- **Show More/Less**: Expand or collapse long summaries

## API Endpoints

### Text Summarization
```http
POST /api/summarize/text
Content-Type: application/json

{
  "text": "Your text to summarize",
  "additional_context": "Optional context"
}
```

### PDF Summarization
```http
POST /api/summarize/pdf
Content-Type: multipart/form-data

file: [PDF file]
additional_context: "Optional context"
```

### Health Check
```http
GET /health
```

## Development

### Backend Development
```bash
cd backend
python start.py  # Auto-reload on changes
```

### Frontend Development
```bash
cd Frontend
npm run dev  # Hot reload on changes
```

### Building for Production

**Frontend:**
```bash
cd Frontend
npm run build
```

**Backend:**
```bash
cd backend
# Use production ASGI server like Gunicorn
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Environment Variables

### Backend (.env)
```
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:
- Check the API documentation at http://localhost:8000/docs
- Review the backend README in the `backend/` folder
- Open an issue on GitHub

---

**SummarIQ** - Transform your documents with AI intelligence! 🚀