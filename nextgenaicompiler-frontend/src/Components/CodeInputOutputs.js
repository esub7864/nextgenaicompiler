import React from "react";

export default function CodeInputOutputs({ inputs, outputs, setInputs, setOutputs }) {
  return (
    <div className="border rounded p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Input & Output</h2>
      <p className="text-sm text-gray-500 mb-4">
        Provide your inputs and review outputs here.
      </p>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">📥 Input</label>
        <textarea
          rows="8"
          value={inputs}
          onChange={(e) => setInputs(e.target.value)}
          placeholder="Enter input here..."
          className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none"
        ></textarea>
      </div>

      {/* Output */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">📤 Output</label>
        <textarea
          rows="8"
          value={outputs}
          onChange={(e) => setOutputs(e.target.value)}
          placeholder="Output will appear here..."
          className="w-full border rounded p-2 text-sm bg-white text-gray-700 outline-none"
          readOnly
        ></textarea>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        You can edit the input and review output below. Styled in line with the Nextgen theme.
      </p>
    </div>
  );
}
