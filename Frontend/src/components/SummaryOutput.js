import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function SummaryOutput({ summary, loading }) {
  if (loading) {
    return (
      <motion.div
        className="mt-6 text-center text-blue-600 font-medium animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Summarizing your book...
      </motion.div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div
      className="mt-6 w-full bg-white border rounded-xl p-4 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2">
        <FaBookOpen />
        Summary
      </div>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </motion.div>
  );
}
