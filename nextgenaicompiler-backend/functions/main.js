// const { MongoClient, ServerApiVersion } = require("mongodb");
// const { GoogleGenAI } = require("@google/genai");
// const axios = require('axios');
// require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI;

// const client = new MongoClient(MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// let db;

// async function connectDB() {
//   await client.connect();
//   await client.db("admin").command({ ping: 1 });
//   console.log("✅ Connected to MongoDB");

//   db = client.db("nextgen");
// }

// connectDB().catch(console.error);


// const analyzeCode = async (req, res) => {
//   const { code } = req.body;
//   console.log("code is: " + code);

//   if (!code) return res.status(400).json({ error: "Code is required" });

//   try {
//     const prompt = `
// Analyze the following code and tell me its:
// 1. Time complexity
// 2. Space complexity

// Respond ONLY in JSON like:
// { "timeComplexity": "...", "spaceComplexity": "..." }

// Code:
// \`\`\`
// ${code}
// \`\`\`
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     const text = response.text;

//     let parsed;
//     const jsonPart = text.substring(
//       text.indexOf("{"),
//       text.lastIndexOf("}") + 1
//     );

//     parsed = JSON.parse(jsonPart);

//     const collection = db.collection("analyses");
//     await collection.insertOne({
//       code,
//       timeComplexity: parsed.timeComplexity,
//       spaceComplexity: parsed.spaceComplexity,
//       createdAt: new Date(),
//     });

//     res.json({
//       timeComplexity: parsed.timeComplexity,
//       spaceComplexity: parsed.spaceComplexity,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

// async function runCode(req, res) {
//   const { language, code, input } = req.body;

//   if (!language || !code) {
//     return res.status(400).json({ error: 'language and code are required' });
//   }

//   const filenameMap = {
//     python: 'main.py',
//     javascript: 'main.js',
//     java: 'Main.java',
//     'c++': 'main.cpp',
//     'c#': 'main.cs',
//   };

//   const versionMap = {
//     python: '3.10.0',
//     javascript: '18.15.0',
//     java: '15.0.2',
//     'c++': '10.2.0',
//     'c#': '6.12.0',
//   };

//   const langKey = language.toLowerCase();

//   const fileName = filenameMap[langKey];
//   const version = versionMap[langKey];

//   if (!fileName || !version) {
//     return res.status(400).json({ error: `Unsupported language: ${language}` });
//   }

//   try {
//     const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
//       language: langKey,
//       version: version,
//       files: [
//         {
//           name: fileName,
//           content: code,
//         },
//       ],
//       stdin: input || '',
//     });

//     return res.json(response.data);
//   } catch (err) {
//     console.error(err?.response?.data || err.message);
//     return res.status(500).json({ error: 'Failed to execute code' });
//   }
// }

// const explainCode = async (req, res) => {
//   const { code, aiInput } = req.body;

//   if (!code) return res.status(400).json({ error: "Code is required" });

//   try {
//     const prompt = `
// Use the following code and explain this question ""${aiInput}"" in 100–150 words.
// Respond ONLY in JSON like:
// { "explanation": "..." }

// Code:
// \`\`\`
// ${code}
// \`\`\`
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const text =
//       response.candidates?.[0]?.content?.parts?.[0]?.text ||
//       response.text ||
//       "";

//     // Try to extract JSON from response text
//     const jsonStart = text.indexOf("{");
//     const jsonEnd = text.lastIndexOf("}") + 1;

//     if (jsonStart === -1 || jsonEnd === -1) {
//       throw new Error("Could not find JSON in response");
//     }

//     const jsonStr = text.substring(jsonStart, jsonEnd);
//     const parsed = JSON.parse(jsonStr);

//     res.json({
//       explanation: parsed.explanation || "No explanation found.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong", details: err.message });
//   }
// };


// module.exports = {
//   analyzeCode, runCode, explainCode
// }