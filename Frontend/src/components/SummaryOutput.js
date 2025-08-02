import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaCopy, FaCheck, FaDownload, FaSparkles } from "react-icons/fa";
import { MdShare } from "react-icons/md";
import { toast } from 'react-toastify';

export default function SummaryOutput({ summary, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy summary");
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ai-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Summary downloaded!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Summary',
          text: summary,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  // Format summary text (basic markdown-like formatting)
  const formatSummary = (text) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h3 key={index} className="font-bold text-lg text-gray-800 mb-2 mt-4">
              {line.slice(2, -2)}
            </h3>
          );
        }
        // Bullet points
        if (line.startsWith('•')) {
          return (
            <li key={index} className="ml-4 text-gray-700 mb-1">
              {line.slice(1).trim()}
            </li>
          );
        }
        // Regular text
        if (line.trim()) {
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-3">
              {line}
            </p>
          );
        }
        return <br key={index} />;
      });
  };

  if (loading) {
    return (
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
              <FaSparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                AI is analyzing your content...
              </h3>
              <p className="text-purple-600">
                This may take a few moments
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div
      className="mt-8 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-r from-white to-blue-50/30 border-2 border-blue-100 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-white/20 p-2 rounded-lg">
                <FaBookOpen className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Summary</h3>
                <p className="text-blue-100 text-sm">Generated just now</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                title="Copy summary"
              >
                {copied ? (
                  <FaCheck className="text-green-300" />
                ) : (
                  <FaCopy className="text-white" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                title="Download summary"
              >
                <FaDownload className="text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                title="Share summary"
              >
                <MdShare className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            {formatSummary(summary)}
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaSparkles className="text-purple-500" />
              <span>Powered by Advanced AI</span>
            </div>
            <div className="text-sm text-gray-500">
              {summary.split(' ').length} words • {Math.ceil(summary.split(' ').length / 200)} min read
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
