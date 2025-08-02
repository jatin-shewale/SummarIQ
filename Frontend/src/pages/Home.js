import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import TextInput from "../components/TextInput";
import SummaryOutput from "../components/SummaryOutput";
import { AiOutlineRobot } from "react-icons/ai";
import { motion } from "framer-motion";

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extraText, setExtraText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSummary("✨ This is a mock summary based on the PDF and provided text.");
      setLoading(false);
    }, 2500);
  };

  return (
    <main className="flex flex-col items-center px-4 py-8 max-w-2xl mx-auto">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-700 flex items-center gap-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <AiOutlineRobot size={36} />
        AI Book Summarizer
      </motion.h1>

      <FileUpload setPdfFile={setPdfFile} />
      <TextInput extraText={extraText} setExtraText={setExtraText} />

      <button
        onClick={handleSummarize}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      <SummaryOutput summary={summary} loading={loading} />
    </main>
  );
}