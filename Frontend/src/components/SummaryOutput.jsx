import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaCopy, FaCheck, FaDownload, FaMagic, FaShareAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { BiCopy, BiDownload, BiShare, BiTime, BiBrain } from "react-icons/bi";
import { MdShare, MdContentCopy, MdDownload } from "react-icons/md";
import { toast } from 'react-toastify';

export default function SummaryOutput({ summary, loading }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    element.download = 'summariq-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Summary downloaded!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SummarIQ Generated Summary',
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
            <h3 key={index} className="font-bold text-base md:text-lg lg:text-xl text-gray-800 mb-2 md:mb-3 mt-4 md:mt-6 first:mt-0">
              {line.slice(2, -2)}
            </h3>
          );
        }
        // Bullet points
        if (line.startsWith('•')) {
          return (
            <li key={index} className="ml-3 md:ml-4 text-gray-700 mb-1 md:mb-2 leading-relaxed text-sm md:text-base">
              {line.slice(1).trim()}
            </li>
          );
        }
        // Regular text
        if (line.trim()) {
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base lg:text-lg">
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
        className="mt-6 md:mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <motion.div 
              className="relative"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 md:p-4 rounded-full">
                <FaMagic className="text-2xl md:text-3xl lg:text-4xl text-white" />
              </div>
            </motion.div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-purple-800">
                SummarIQ is analyzing your content...
              </h3>
              <p className="text-purple-600 text-sm md:text-base lg:text-lg">
                This may take a few moments
              </p>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!summary) return null;

  const wordCount = summary.split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <motion.div
      className="mt-6 md:mt-8 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-r from-white to-blue-50/30 border-2 border-blue-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-4 md:px-6 py-3 md:py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3 text-white">
              <div className="bg-white/20 p-2 md:p-3 rounded-lg md:rounded-xl backdrop-blur-sm">
                <FaBookOpen className="text-lg md:text-xl lg:text-2xl" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold">SummarIQ Summary</h3>
                <p className="text-blue-100 text-xs md:text-sm lg:text-base">Generated just now</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 p-2 md:p-3 rounded-lg md:rounded-xl transition-colors duration-200 backdrop-blur-sm"
                title="Copy summary"
              >
                {copied ? (
                  <FaCheck className="text-green-300 text-base md:text-lg lg:text-xl" />
                ) : (
                  <BiCopy className="text-white text-base md:text-lg lg:text-xl" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 p-2 md:p-3 rounded-lg md:rounded-xl transition-colors duration-200 backdrop-blur-sm"
                title="Download summary"
              >
                <BiDownload className="text-white text-base md:text-lg lg:text-xl" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/30 p-2 md:p-3 rounded-lg md:rounded-xl transition-colors duration-200 backdrop-blur-sm"
                title="Share summary"
              >
                <BiShare className="text-white text-base md:text-lg lg:text-xl" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className={`prose prose-sm md:prose-base lg:prose-lg max-w-none transition-all duration-300 ${!isExpanded && 'max-h-80 md:max-h-96 overflow-hidden'}`}>
            {formatSummary(summary)}
          </div>
          
          {!isExpanded && summary.length > 500 && (
            <div className="mt-3 md:mt-4 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-medium flex items-center gap-2 mx-auto text-sm"
              >
                <FaEye className="text-sm" />
                Show More
              </motion.button>
            </div>
          )}
          
          {isExpanded && (
            <div className="mt-3 md:mt-4 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(false)}
                className="bg-gray-100 text-gray-700 px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-medium flex items-center gap-2 mx-auto hover:bg-gray-200 text-sm"
              >
                <FaEyeSlash className="text-sm" />
                Show Less
              </motion.button>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-1 md:p-2 rounded-full">
                <BiBrain className="text-purple-500 text-sm md:text-base" />
              </div>
              <span>Powered by SummarIQ AI</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BiTime className="text-gray-400 text-sm" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBookOpen className="text-gray-400 text-sm" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
