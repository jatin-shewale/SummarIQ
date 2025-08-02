import React from "react";
import { FaFilePdf } from "react-icons/fa";

export default function FileUpload({ setPdfFile }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
        <FaFilePdf size={40} className="text-red-500 mb-2" />
        <span className="text-gray-600 mb-2">Click or drag to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}