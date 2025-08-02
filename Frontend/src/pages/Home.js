import React, { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import SummaryOutput from "../components/SummaryOutput";
import { AiOutlineRobot, AiOutlineFileText, AiOutlineBulb } from "react-icons/ai";
import { FaSparkles, FaRocket, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { apiService } from '../services/api';

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extraText, setExtraText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "text"
  const [backendStatus, setBackendStatus] = useState({ connected: null, checking: true });

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setBackendStatus({ connected: null, checking: true });
    try {
      const result = await apiService.testConnection();
      setBackendStatus({ connected: result.success, checking: false });
      
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      setBackendStatus({ connected: false, checking: false });
      toast.error("Could not connect to backend server");
    }
  };

  const handleSummarize = async () => {
    // Validation
    if (activeTab === "upload" && !pdfFile) {
      toast.error("Please upload a PDF file first!");
      return;
    }
    if (activeTab === "text" && !extraText.trim()) {
      toast.error("Please enter some text to summarize!");
      return;
    }

    // Check backend connection first
    if (!backendStatus.connected) {
      toast.error("Backend server is not available. Please check if it's running.");
      return;
    }

    setLoading(true);
    setSummary(""); // Clear previous summary
    toast.info("Processing your content with AI...");
    
    try {
      let result;
      
      if (activeTab === "upload") {
        // PDF summarization
        result = await apiService.summarizePDF(pdfFile, extraText);
        toast.success(`PDF "${pdfFile.name}" summarized successfully!`);
      } else {
        // Text summarization
        result = await apiService.summarizeText(extraText);
        toast.success("Text summarized successfully!");
      }
      
      // Format the summary for better display
      const formattedSummary = formatApiSummary(result);
      setSummary(formattedSummary);
      
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error(error.message || "Failed to generate summary. Please try again.");
      setSummary(""); // Clear any partial summary
    } finally {
      setLoading(false);
    }
  };

  const formatApiSummary = (result) => {
    // Format the API response into a nice display format
    let formattedText = `**${result.title}**\n\n`;
    formattedText += result.summary;
    
    // Add metadata at the end
    formattedText += `\n\n---\n\n`;
    formattedText += `**Summary Details:**\n`;
    formattedText += `• Word Count: ${result.word_count.toLocaleString()} words\n`;
    formattedText += `• Processing Time: ${result.processing_time.toFixed(2)} seconds\n`;
    if (result.original_filename) {
      formattedText += `• Source File: ${result.original_filename}\n`;
    }
    formattedText += `• Saved: ${result.saved_path}`;
    
    return formattedText;
  };

  const features = [
    {
      icon: <FaSparkles className="text-2xl text-purple-500" />,
      title: "AI-Powered",
      description: "Advanced AI algorithms analyze and understand your content"
    },
    {
      icon: <FaRocket className="text-2xl text-blue-500" />,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in seconds, not hours"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-green-500" />,
      title: "Secure & Private",
      description: "Your documents are processed securely and never stored"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Backend Status Banner */}
      {!backendStatus.checking && !backendStatus.connected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-400 p-4 mb-4"
        >
          <div className="flex items-center max-w-6xl mx-auto">
            <FaExclamationTriangle className="text-red-400 mr-3" />
            <div>
              <p className="text-red-700 font-medium">Backend Server Not Connected</p>
              <p className="text-red-600 text-sm">
                Please start the backend server on port 8000. 
                <button 
                  onClick={checkBackendConnection}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry Connection
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <AiOutlineRobot className="relative text-6xl md:text-7xl text-gradient bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              AI Document
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Summarizer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform lengthy documents and texts into concise, intelligent summaries with the power of AI. 
              Upload PDFs or paste text to get instant insights.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-purple-100 shadow-lg"
              >
                <span className="text-purple-600 font-semibold">📄 PDF Upload</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-blue-100 shadow-lg"
              >
                <span className="text-blue-600 font-semibold">✨ Text Analysis</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-green-100 shadow-lg"
              >
                <span className="text-green-600 font-semibold">🚀 Instant Results</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Application Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Start Summarizing
              </h2>
              <p className="text-gray-600 text-lg">
                Choose your preferred method to analyze your content
              </p>
              
              {/* Backend Status Indicator */}
              <div className="mt-4 flex justify-center">
                <div className={`
                  flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${backendStatus.checking 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : backendStatus.connected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }
                `}>
                  <div className={`
                    w-2 h-2 rounded-full
                    ${backendStatus.checking 
                      ? 'bg-yellow-500 animate-pulse' 
                      : backendStatus.connected 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }
                  `}></div>
                  {backendStatus.checking ? 'Checking...' : 
                   backendStatus.connected ? 'Backend Connected' : 'Backend Offline'}
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-2xl flex">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "upload"
                      ? "bg-white text-purple-600 shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <AiOutlineFileText />
                  Upload PDF
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "text"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <AiOutlineBulb />
                  Paste Text
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              {activeTab === "upload" ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileUpload setPdfFile={setPdfFile} pdfFile={pdfFile} />
                  <TextInput 
                    extraText={extraText} 
                    setExtraText={setExtraText}
                    placeholder="Add any additional context or specific questions about the PDF..."
                    label="Additional Notes (optional)"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextInput 
                    extraText={extraText} 
                    setExtraText={setExtraText}
                    placeholder="Paste your text here or type directly..."
                    label="Text to Summarize"
                    rows={8}
                    required={true}
                  />
                </motion.div>
              )}

              {/* Action Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSummarize}
                  disabled={loading || !backendStatus.connected}
                  className={`
                    px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg
                    ${loading || !backendStatus.connected
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hover:shadow-xl"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing with AI...
                    </div>
                  ) : !backendStatus.connected ? (
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle />
                      Backend Offline
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaSparkles />
                      Generate Summary
                    </div>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Summary Output */}
            <SummaryOutput summary={summary} loading={loading} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}