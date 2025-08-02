import React, { useState, useRef } from "react";
import { MdOutlineTextFields, MdContentPaste } from "react-icons/md";
import { FaKeyboard } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TextInput({ 
  extraText, 
  setExtraText, 
  placeholder = "Add any extra context here...", 
  label = "Additional Notes (optional)",
  rows = 4,
  required = false 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [justPasted, setJustPasted] = useState(false);
  const textareaRef = useRef(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setExtraText(text);
        setJustPasted(true);
        setTimeout(() => setJustPasted(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleChange = (e) => {
    setExtraText(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const clearText = () => {
    setExtraText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const characterCount = extraText.length;
  const maxChars = 5000;
  const isOverLimit = characterCount > maxChars;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
          <MdOutlineTextFields className="text-xl" />
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center gap-2">
          {/* Paste Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePaste}
            className={`
              flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
              ${justPasted 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
              }
            `}
            title="Paste from clipboard"
          >
            <MdContentPaste className="text-sm" />
            {justPasted ? 'Pasted!' : 'Paste'}
          </motion.button>
          
          {/* Clear Button */}
          {extraText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearText}
              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200"
              title="Clear text"
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>
      
      <motion.div
        className={`
          relative rounded-2xl border-2 transition-all duration-300 overflow-hidden
          ${isFocused 
            ? 'border-purple-400 shadow-lg bg-white' 
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
          }
          ${isOverLimit ? 'border-red-400' : ''}
        `}
        whileHover={{ scale: 1.01 }}
      >
        <textarea
          ref={textareaRef}
          value={extraText}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full p-4 bg-transparent resize-none focus:outline-none text-gray-700 leading-relaxed
            min-h-[${rows * 1.5}rem]
          `}
          style={{ minHeight: `${rows * 1.5}rem` }}
          placeholder={placeholder}
          maxLength={maxChars}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <span className={`
            text-xs font-medium px-2 py-1 rounded-full
            ${isOverLimit 
              ? 'text-red-600 bg-red-100' 
              : characterCount > maxChars * 0.8 
                ? 'text-yellow-600 bg-yellow-100'
                : 'text-gray-500 bg-gray-100'
            }
          `}>
            {characterCount.toLocaleString()}/{maxChars.toLocaleString()}
          </span>
        </div>
        
        {/* Focus Indicator */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 left-3 flex items-center gap-1 text-purple-500"
          >
            <FaKeyboard className="text-xs" />
            <span className="text-xs font-medium">Typing...</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Helper Text */}
      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {required 
            ? "Enter the text you want to summarize" 
            : "Provide additional context to improve the summary quality"
          }
        </p>
        
        {isOverLimit && (
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-red-600 font-medium"
          >
            Text is too long
          </motion.p>
        )}
      </div>
    </div>
  );
}