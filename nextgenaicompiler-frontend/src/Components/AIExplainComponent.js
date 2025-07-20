import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AIExplain({ code, isSignedIn, onSignIn, onGoogleSignIn }) {
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const handleExplainClick = async () => {
    setIsExplaining(true);
    axios
      .post("http://localhost:8000/explain", { code, aiInput })
      .then((res) => {
        const { explanation } = res.data;
        setAiOutput(explanation);
        toast.success(`✅ Success`);
      })
      .catch(() => toast.error("❌ Failed to analyze code."))
      .finally(() => setIsExplaining(false));
  };

  return (
    <div className="relative">
      {/* Main content */}
      <div
        className={`border rounded p-4 bg-gray-50 relative ${
          !isSignedIn ? "filter blur-sm pointer-events-none" : ""
        }`}
      >
        <h2 className="text-xl font-bold mb-2 text-gray-800">AI Explanation</h2>
        <p className="text-sm text-gray-500 mb-4">
          Ask the AI to explain your code or concept. Enter below and press explain.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📥 Your Code / Question
          </label>
          <textarea
            rows="8"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Type your code or question here..."
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-purple-300 outline-none"
          ></textarea>
        </div>

        <button
          onClick={handleExplainClick}
          disabled={isExplaining}
          className={`px-4 py-2 rounded text-sm ${
            isExplaining
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isExplaining ? "✨ Explaining..." : "✨ Explain"}
        </button>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📤 Explanation
          </label>
          <textarea
            rows="8"
            value={aiOutput}
            readOnly
            placeholder="AI explanation will appear here..."
            className="w-full border rounded p-2 text-sm bg-white text-gray-700 outline-none"
          ></textarea>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Let the AI assist you in understanding the logic or concept behind your code.
        </p>
      </div>

      {/* Overlay when not signed in */}
      {!isSignedIn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black bg-opacity-40 rounded">
          <button
            onClick={onSignIn}
            className="bg-purple-600 text-white px-8 py-2 rounded hover:bg-purple-700"
          >
            Sign in to continue
          </button>
          <button
            onClick={onGoogleSignIn}
            className="flex items-center gap-2 border rounded py-2 px-4 bg-white hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
