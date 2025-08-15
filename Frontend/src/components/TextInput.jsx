import React, { useState, useRef } from "react";
import { MdOutlineTextFields, MdContentPaste, MdClear, MdKeyboard } from "react-icons/md";
import { BiText, BiPaste, BiX } from "react-icons/bi";
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
  const isNearLimit = characterCount > maxChars * 0.8;

  return (
    <div className="w-full mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2 md:gap-3">
        <label className="flex items-center gap-2 text-gray-700 font-semibold text-base md:text-lg">
          <BiText className="text-lg md:text-xl text-purple-500" />
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
              flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200
              ${justPasted 
                ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 shadow-sm'
              }
            `}
            title="Paste from clipboard"
          >
            <BiPaste className="text-xs md:text-sm" />
            <span className="hidden sm:inline">{justPasted ? 'Pasted!' : 'Paste'}</span>
          </motion.button>
          
          {/* Clear Button */}
          {extraText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearText}
              className="px-2 md:px-3 py-1 md:py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 border border-gray-200 shadow-sm flex items-center gap-1"
              title="Clear text"
            >
              <BiX className="text-xs md:text-sm" />
              <span className="hidden sm:inline">Clear</span>
            </motion.button>
          )}
        </div>
      </div>
      
      <motion.div
        className={`
          relative rounded-xl md:rounded-2xl border-2 transition-all duration-300 overflow-hidden backdrop-blur-sm
          ${isFocused 
            ? 'border-purple-400 shadow-xl bg-white' 
            : 'border-gray-200 hover:border-gray-300 bg-white/50'
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
            w-full p-3 md:p-4 lg:p-6 bg-transparent resize-none focus:outline-none text-gray-700 leading-relaxed
            placeholder-gray-400 text-sm md:text-base lg:text-lg
          `}
          style={{ minHeight: `${rows * 1.5}rem` }}
          placeholder={placeholder}
          maxLength={maxChars}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 flex items-center gap-2">
          <span className={`
            text-xs font-medium px-1 md:px-2 py-1 rounded-full backdrop-blur-sm
            ${isOverLimit 
              ? 'text-red-600 bg-red-100/80' 
              : isNearLimit 
                ? 'text-yellow-600 bg-yellow-100/80'
                : 'text-gray-500 bg-gray-100/80'
            }
          `}>
            {characterCount.toLocaleString()}/{maxChars.toLocaleString()}
          </span>
        </div>
        
        {/* Focus Indicator */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-2 md:top-3 left-2 md:left-3 flex items-center gap-1 text-purple-500 bg-purple-100/80 px-2 py-1 rounded-full"
          >
            <MdKeyboard className="text-xs" />
            <span className="text-xs font-medium">Typing...</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Helper Text */}
      <div className="mt-2 md:mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-xs md:text-sm text-gray-500">
          {required 
            ? "Enter the text you want to summarize" 
            : "Provide additional context to improve the summary quality"
          }
        </p>
        
        {isOverLimit && (
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs md:text-sm text-red-600 font-medium flex items-center gap-1"
          >
            <BiX className="text-xs" />
            Text is too long
          </motion.p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(characterCount / maxChars) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-1 rounded-full transition-colors duration-300 ${
              isOverLimit 
                ? 'bg-red-500' 
                : isNearLimit 
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}