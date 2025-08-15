import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import SummaryOutput from "../components/SummaryOutput";
import { AiOutlineRobot, AiOutlineFileText, AiOutlineBulb, AiOutlineThunderbolt, AiOutlineSafetyCertificate } from "react-icons/ai";
import { FaMagic, FaRocket, FaShieldAlt, FaBrain, FaLightbulb, FaChartLine } from "react-icons/fa";
import { BiBrain, BiTargetLock, BiTime } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import apiService from "../services/api";

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extraText, setExtraText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "text"

  const handleSummarize = async () => {
    if (activeTab === "upload" && !pdfFile) {
      toast.error("Please upload a PDF file first!");
      return;
    }
    if (activeTab === "text" && !extraText.trim()) {
      toast.error("Please enter some text to summarize!");
      return;
    }

    setLoading(true);
    toast.info("Processing your content with SummarIQ...");
    
    try {
      let response;
      
      if (activeTab === "upload") {
        // Handle PDF upload
        response = await apiService.summarizePDF(pdfFile, extraText || null);
      } else {
        // Handle text input
        response = await apiService.summarizeText(extraText);
      }

      if (response.success) {
        setSummary(`✨ **${response.title}**

${response.summary}

${response.message}`);
        toast.success("Summary generated successfully!");
      } else {
        throw new Error(response.message || "Failed to generate summary");
      }
    } catch (error) {
      console.error("Summarization error:", error);
      toast.error(error.message || "Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BiBrain className="text-3xl text-purple-500" />,
      title: "AI-Powered Intelligence",
      description: "Advanced AI algorithms analyze and understand your content with human-like comprehension"
    },
    {
      icon: <BiTime className="text-3xl text-blue-500" />,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in seconds, not hours. Save time and boost productivity"
    },
    {
      icon: <AiOutlineSafetyCertificate className="text-3xl text-green-500" />,
      title: "Secure & Private",
      description: "Your documents are processed securely and never stored. Your privacy is our priority"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Accuracy Rate", icon: <BiTargetLock className="text-2xl" /> },
    { number: "< 30s", label: "Processing Time", icon: <AiOutlineThunderbolt className="text-2xl" /> },
    { number: "10MB", label: "Max File Size", icon: <AiOutlineFileText className="text-2xl" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-4 py-8 md:py-16 lg:py-20 text-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                className="relative"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-blue-600 p-4 md:p-6 rounded-full shadow-2xl">
                  <AiOutlineRobot className="text-4xl md:text-5xl lg:text-6xl text-white" />
                </div>
              </motion.div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight px-4">
              SummarIQ
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                AI Summarizer
              </span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Transform lengthy documents and texts into concise, intelligent summaries with the power of AI. 
              Upload PDFs or paste text to get instant insights with SummarIQ.
            </p>
            
            {/* Stats */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 mb-6 md:mb-8 max-w-2xl mx-auto px-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 shadow-lg"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-purple-500">{stat.icon}</div>
                    <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-xs md:text-sm text-gray-600 text-center">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8 px-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-purple-100 shadow-lg"
              >
                <span className="text-purple-600 font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <AiOutlineFileText className="text-sm md:text-base" /> 
                  <span className="hidden sm:inline">PDF Upload</span>
                  <span className="sm:hidden">PDF</span>
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-blue-100 shadow-lg"
              >
                <span className="text-blue-600 font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <FaLightbulb className="text-sm md:text-base" /> 
                  <span className="hidden sm:inline">Text Analysis</span>
                  <span className="sm:hidden">Text</span>
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-green-100 shadow-lg"
              >
                <span className="text-green-600 font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <FaRocket className="text-sm md:text-base" /> 
                  <span className="hidden sm:inline">Instant Results</span>
                  <span className="sm:hidden">Fast</span>
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16 px-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 md:p-4 rounded-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Application Section */}
      <section className="px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl lg:max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 md:p-8 lg:p-12 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                Start Summarizing with SummarIQ
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Choose your preferred method to analyze your content
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="bg-gray-100 p-1 rounded-2xl flex flex-col sm:flex-row w-full max-w-md">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === "upload"
                      ? "bg-white text-purple-600 shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <AiOutlineFileText className="text-lg md:text-xl" />
                  <span className="hidden sm:inline">Upload PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === "text"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <AiOutlineBulb className="text-lg md:text-xl" />
                  <span className="hidden sm:inline">Paste Text</span>
                  <span className="sm:hidden">Text</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4 md:space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === "upload" ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
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
                    exit={{ opacity: 0, x: -20 }}
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
              </AnimatePresence>

              {/* Action Button */}
              <div className="text-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSummarize}
                  disabled={loading}
                  className={`
                    px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 shadow-lg w-full sm:w-auto
                    ${loading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hover:shadow-xl"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaMagic />
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