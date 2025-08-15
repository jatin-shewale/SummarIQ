import React, { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaFileAlt, FaDownload } from "react-icons/fa";
import { BiUpload, BiX } from "react-icons/bi";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';

export default function FileUpload({ setPdfFile, pdfFile }) {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-invalid-type') {
        toast.error("Please upload a PDF file only!");
      } else if (error.code === 'file-too-large') {
        toast.error("File is too large. Maximum size is 10MB.");
      } else {
        toast.error("File upload failed. Please try again.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPdfFile(file);
      toast.success(`PDF "${file.name}" uploaded successfully!`);
    }
  }, [setPdfFile]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeFile = () => {
    setPdfFile(null);
    toast.info("PDF file removed");
  };

  const getBorderColor = () => {
    if (isDragAccept) return 'border-green-400 bg-green-50/50';
    if (isDragReject) return 'border-red-400 bg-red-50/50';
    if (isDragActive) return 'border-purple-400 bg-purple-50/50';
    return 'border-gray-300 hover:border-purple-400 bg-white/50';
  };

  const getIconColor = () => {
    if (isDragAccept) return 'text-green-500';
    if (isDragReject) return 'text-red-500';
    if (isDragActive) return 'text-purple-500';
    return 'text-gray-400';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full mb-4 md:mb-6">
      <label className="block mb-3 md:mb-4 text-gray-700 font-semibold text-base md:text-lg flex items-center gap-2">
        <FaFilePdf className="text-purple-500" />
        Upload PDF Document
      </label>
      
      {!pdfFile ? (
        <motion.div
          {...getRootProps()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center transition-all duration-300
            ${getBorderColor()}
            hover:shadow-xl backdrop-blur-sm
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-3 md:space-y-4 lg:space-y-6">
            <motion.div
              animate={{
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {isDragActive ? (
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 md:p-4 rounded-full">
                  <FaCloudUploadAlt className="text-3xl md:text-4xl lg:text-5xl text-white" />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 md:p-4 rounded-full">
                  <FaFilePdf className={`text-3xl md:text-4xl lg:text-5xl ${getIconColor()}`} />
                </div>
              )}
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-700">
                {isDragActive
                  ? isDragAccept
                    ? "Drop your PDF here!"
                    : "Only PDF files are allowed"
                  : "Drag & drop your PDF here"
                }
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                or <span className="text-purple-600 font-semibold">click to browse</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-gray-400 mt-2">
                <span>Maximum file size: 10MB</span>
                <span className="hidden sm:inline">•</span>
                <span>PDF format only</span>
              </div>
            </div>

            {/* Upload Button for Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg text-sm"
            >
              <BiUpload className="text-lg" />
              Choose PDF File
            </motion.button>
          </div>

          {/* Visual feedback overlay */}
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-2xl md:rounded-3xl border-2 border-dashed border-purple-400"
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl md:rounded-3xl p-4 md:p-6 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-start sm:items-center space-x-3 md:space-x-4 flex-1 min-w-0">
              <div className="bg-green-100 p-2 md:p-3 rounded-full flex-shrink-0">
                <FaCheckCircle className="text-xl md:text-2xl text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-base md:text-lg truncate">
                  {pdfFile.name}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-600">
                  <span>{formatFileSize(pdfFile.size)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>PDF Document</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Uploaded just now</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors duration-200"
                title="Download file"
              >
                <FaDownload className="text-blue-600 text-base md:text-lg" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={removeFile}
                className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors duration-200"
                title="Remove file"
              >
                <BiX className="text-red-600 text-lg md:text-xl" />
              </motion.button>
            </div>
          </div>
          
          {/* Progress bar simulation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 md:mt-4 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
          />
        </motion.div>
      )}
    </div>
  );
}