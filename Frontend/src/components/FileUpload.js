import React, { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { FaFilePdf, FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
    if (isDragAccept) return 'border-green-400 bg-green-50';
    if (isDragReject) return 'border-red-400 bg-red-50';
    if (isDragActive) return 'border-purple-400 bg-purple-50';
    return 'border-gray-300 hover:border-purple-400';
  };

  const getIconColor = () => {
    if (isDragAccept) return 'text-green-500';
    if (isDragReject) return 'text-red-500';
    if (isDragActive) return 'text-purple-500';
    return 'text-gray-400';
  };

  return (
    <div className="w-full mb-6">
      <label className="block mb-3 text-gray-700 font-semibold text-lg">
        📄 Upload PDF Document
      </label>
      
      {!pdfFile ? (
        <motion.div
          {...getRootProps()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
            ${getBorderColor()}
            hover:shadow-lg
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {isDragActive ? (
                <FaCloudUploadAlt className={`text-6xl ${getIconColor()}`} />
              ) : (
                <FaFilePdf className={`text-6xl ${getIconColor()}`} />
              )}
            </motion.div>
            
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {isDragActive
                  ? isDragAccept
                    ? "Drop your PDF here!"
                    : "Only PDF files are allowed"
                  : "Drag & drop your PDF here"
                }
              </p>
              <p className="text-gray-500">
                or <span className="text-purple-600 font-semibold">click to browse</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Maximum file size: 10MB
              </p>
            </div>
          </div>

          {/* Visual feedback overlay */}
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-2xl border-2 border-dashed border-purple-400"
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  {pdfFile.name}
                </p>
                <p className="text-gray-600">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={removeFile}
              className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors duration-200"
              title="Remove file"
            >
              <FaTimesCircle className="text-red-600 text-xl" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}