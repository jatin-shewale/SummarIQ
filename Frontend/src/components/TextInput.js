import React from "react";
import { MdOutlineTextFields } from "react-icons/md";

export default function TextInput({ extraText, setExtraText }) {
  return (
    <div className="w-full mb-4">
      <label className="block mb-2 text-gray-700 font-medium flex items-center gap-2">
        <MdOutlineTextFields />
        Additional Notes (optional)
      </label>
      <textarea
        value={extraText}
        onChange={(e) => setExtraText(e.target.value)}
        className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Add any extra context here..."
      />
    </div>
  );
}