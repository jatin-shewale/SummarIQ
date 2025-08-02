# AI Document Summarizer - Full Stack Application

A beautiful, modern full-stack application for AI-powered document and text summarization using React + Vite frontend and FastAPI backend with Google's Gemini AI.

## 🚀 **Project Overview**

This application allows users to:
- **Upload PDF documents** for AI-powered summarization
- **Paste text directly** for instant analysis  
- **Get intelligent summaries** with key points and insights
- **Download and share** generated summaries
- **Track processing** with real-time status updates

## 🏗️ **Architecture**

```
📦 AI-Document-Summarizer/
├── 📁 Frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API communication
│   │   └── ...
│   └── package.json
├── 📁 Backend/           # FastAPI server
│   ├── app.py           # Main application
│   ├── ai_service.py    # AI integration
│   ├── schema.py        # Data models
│   └── requirements.txt
└── README.md
```

## 🛠️ **Tech Stack**

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **React Toastify** - Notifications

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced language model
- **LangChain** - AI framework
- **PyPDF2** - PDF text extraction
- **Uvicorn** - ASGI server

## 📋 **Prerequisites**

- **Node.js 16+**
- **Python 3.8+**
- **Google AI API Key** (Gemini)

## ⚡ **Quick Start**

### 1. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for use in step 4

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install Python dependencies
pip install -r requirements.txt --break-system-packages

# Create environment file
cp .env.example .env

# Edit .env and add your Google AI API key
# GOOGLE_API_KEY=your_actual_api_key_here

# Start the backend server
python start.py
```

The backend will start at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd Frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### 4. Open the Application

Visit `http://localhost:5173` in your browser and start summarizing!

## 🔧 **Configuration**

### Backend Environment Variables (Backend/.env)

```env
# Required
GOOGLE_API_KEY=your_google_ai_api_key

# Optional  
HOST=0.0.0.0
PORT=8000
DEBUG=True
MAX_FILE_SIZE=10485760  # 10MB
```

### Frontend Environment Variables (Frontend/.env)

```env
# Optional
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

## 🌟 **Features**

### 📄 **PDF Processing**
- Drag & drop file upload
- 10MB file size limit
- Real-time validation
- Text extraction from PDFs

### ✍️ **Text Analysis**
- Direct text input
- Character counter (5000 limit)
- Clipboard paste support
- Auto-resizing text area

### 🧠 **AI Summarization**
- Google Gemini AI integration
- Context-aware summaries
- Structured output with bullet points
- Processing time tracking

### 🎨 **Modern UI/UX**
- Beautiful gradient designs
- Smooth animations
- Responsive layout
- Dark/light theme elements
- Toast notifications

### 📱 **Interactive Features**
- Copy to clipboard
- Download summaries
- Share functionality
- Backend status monitoring

## 📚 **API Endpoints**

### Health Check
```http
GET http://localhost:8000/health
```

### Text Summarization
```http
POST http://localhost:8000/summarize/text
Content-Type: application/json

{
  "text": "Your text content...",
  "additional_context": "Optional context",
  "title": "Optional title"
}
```

### PDF Summarization
```http
POST http://localhost:8000/summarize/pdf
Content-Type: multipart/form-data

- file: PDF file (max 10MB)
- additional_context: Optional context  
- title: Optional title
```

## 🚨 **Troubleshooting**

### Backend Issues

**"GOOGLE_API_KEY not set"**
```bash
# Edit Backend/.env and add your API key
GOOGLE_API_KEY=your_actual_api_key_here
```

**"Module not found"**
```bash
# Reinstall dependencies
cd Backend
pip install -r requirements.txt --break-system-packages
```

**"Permission denied"**
```bash
# Make start script executable
chmod +x start.py
```

### Frontend Issues

**"Backend not connected"**
- Ensure backend is running on port 8000
- Check if `http://localhost:8000/health` responds

**"Module not found"**
```bash
# Reinstall dependencies
cd Frontend
npm install
```

**"Build fails"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🧪 **Testing**

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Text summarization
curl -X POST "http://localhost:8000/summarize/text" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test text for summarization."}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Check backend connection status
3. Try both PDF upload and text input
4. Verify toast notifications work

## 🚀 **Production Deployment**

### Backend Deployment

```bash
# Set production environment
echo "DEBUG=False" >> Backend/.env

# Use production ASGI server
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

```bash
# Build for production
cd Frontend
npm run build

# Deploy dist/ folder to your hosting service
```

## 📁 **Project Structure**

```
Frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.js      # PDF upload component
│   │   ├── TextInput.js       # Text input component
│   │   └── SummaryOutput.js   # Summary display
│   ├── pages/
│   │   └── Home.js           # Main application page
│   ├── services/
│   │   └── api.js            # Backend API client
│   └── App.jsx               # Root component
└── package.json

Backend/
├── app.py                    # FastAPI application
├── ai_service.py            # AI summarization service
├── schema.py                # Pydantic models  
├── prompts.py               # AI prompts
├── tools.py                 # LangChain tools
├── start.py                 # Startup script
└── requirements.txt         # Dependencies
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **Google AI** - For the powerful Gemini language model
- **FastAPI** - For the excellent web framework  
- **React** - For the amazing UI library
- **Vite** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework

---

Built with ❤️ using modern web technologies and AI

## 🔗 **Useful Links**

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get your API key
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Backend framework docs
- [React Documentation](https://react.dev/) - Frontend framework docs
- [Vite Documentation](https://vitejs.dev/) - Build tool docs