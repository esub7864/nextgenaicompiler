const axios = require('axios');
require("dotenv").config();

async function runCode(req, res) {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'language and code are required' });
  }

  const filenameMap = {
    python: 'main.py',
    javascript: 'main.js',
    java: 'Main.java',
    'c++': 'main.cpp',
    'c#': 'main.cs',
  };

  const versionMap = {
    python: '3.10.0',
    javascript: '18.15.0',
    java: '15.0.2',
    'c++': '10.2.0',
    'c#': '6.12.0',
  };

  const langKey = language.toLowerCase();

  const fileName = filenameMap[langKey];
  const version = versionMap[langKey];

  if (!fileName || !version) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    const response = await axios.post(process.env.PISTON_URL, {
      language: langKey,
      version: version,
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
      stdin: input || '',
    });

    return res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to execute code' });
  }
}

module.exports = {
  runCode
}