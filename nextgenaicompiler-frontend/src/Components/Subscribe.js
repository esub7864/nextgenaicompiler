import React, { useState } from "react";
import API_URL from "./apiURL";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setResponseMsg("Please enter an email address.");
      return;
    }

    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResponseMsg(data.message || "Something happened.");
    } catch (err) {
      console.error(err);
      setResponseMsg("Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen bg-gray-50 py-6">
      <footer className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4 px-4">
        <h2 className="text-lg font-bold">Nextgen Compiler</h2>
        <p className="text-gray-600">Stay up-to-date</p>

        <div className="flex w-full gap-2">
          <input
            type="email"
            placeholder="📧 Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {responseMsg && (
          <p className="text-sm mt-2 text-gray-700">{responseMsg}</p>
        )}

        <div className="text-xs text-gray-400 mt-4">
          © 2025 Nextgen Compiler.
        </div>

        <div className="flex gap-3 mt-2 text-gray-400 text-xl">
          <i className="fa-brands fa-twitter hover:text-blue-400 cursor-pointer"></i>
          <i className="fa-brands fa-github hover:text-black cursor-pointer"></i>
          <i className="fa-brands fa-linkedin hover:text-blue-600 cursor-pointer"></i>
        </div>
      </footer>
    </div>
  );
}
