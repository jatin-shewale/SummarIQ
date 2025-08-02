# AI Document Summarizer - Frontend

A beautiful, modern React application for AI-powered document and text summarization with an intuitive user interface.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Landing Page**: Eye-catching hero section with animated elements
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices  
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Glass Morphism**: Modern glassmorphic design elements
- **Custom Gradients**: Beautiful color schemes throughout the interface

### 📄 PDF Upload
- **Drag & Drop**: Intuitive drag-and-drop file upload
- **Visual Feedback**: Real-time upload status and file validation
- **File Management**: Easy file removal and replacement
- **Size Limits**: 10MB maximum file size with clear error messages
- **Progress Indicators**: Visual upload progress and status

### ✍️ Text Input
- **Rich Text Editor**: Enhanced textarea with auto-resize
- **Character Counter**: Real-time character count with visual warnings
- **Paste Support**: One-click paste from clipboard
- **Focus Indicators**: Clear visual feedback when typing
- **Text Validation**: Input validation with helpful error messages

### 🧠 AI Summarization
- **Dual Mode**: Support for both PDF upload and direct text input
- **Smart Processing**: AI analyzes content context and structure
- **Formatted Output**: Well-structured summaries with bullet points and sections
- **Real-time Status**: Loading indicators and progress updates

### 📱 Interactive Features
- **Copy to Clipboard**: One-click summary copying
- **Download Summary**: Save summaries as text files
- **Share Function**: Native sharing on supported devices
- **Toast Notifications**: Elegant feedback for all user actions
- **Tab Navigation**: Switch between upload and text input modes

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **React 19**: Latest React version with modern features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Beautiful icon library
- **React Dropzone**: Drag & drop file uploads
- **React Toastify**: Elegant notifications
- **Axios**: HTTP client for API requests

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── FileUpload.js  # Drag & drop file upload
│   │   ├── TextInput.js   # Enhanced text input area
│   │   └── SummaryOutput.js # Summary display with actions
│   ├── pages/
│   │   └── Home.js        # Main application page
│   ├── App.jsx           # Root application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and utilities
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple to Blue gradients (#8B5CF6 → #3B82F6)
- **Secondary**: Teal and Green accents
- **Background**: Soft gradient from indigo to cyan
- **Text**: High contrast grays for readability

### Typography
- **Font**: Inter - Clean, modern, and highly readable
- **Weights**: 300-900 for perfect hierarchy
- **Spacing**: Generous line heights for comfortable reading

### Animations
- **Page Load**: Smooth fade-in animations
- **Hover Effects**: Subtle scale and shadow changes
- **Loading States**: Engaging spinners and progress indicators
- **Transitions**: Smooth state changes throughout

## 🔧 Customization

### Styling
The application uses Tailwind CSS with custom utility classes defined in `src/index.css`:

- `.gradient-text` - Purple to blue gradient text
- `.glass-effect` - Glassmorphic background effect
- `.button-primary` - Primary gradient button style
- `.card-hover` - Hover effects for cards

### Configuration
- File size limits can be adjusted in `FileUpload.js`
- Character limits can be modified in `TextInput.js`
- Toast settings can be customized in `App.jsx`

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations
- **Heroicons** and **React Icons** for beautiful icons

---

Built with ❤️ using React, Vite, and modern web technologies.
