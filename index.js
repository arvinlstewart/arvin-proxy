const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR-SCRIPT-ID/exec';

// 1️⃣ GLOBAL CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
}));

// 2️⃣ BODY PARSER
app.use(express.json());

// 3️⃣ EXPLICIT PRE-FLIGHT OPTIONS HANDLER
app.options('/submit', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send();
});

// 4️⃣ MAIN FORM SUBMISSION HANDLER
app.post('/submit', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON from Apps Script:', text);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(502).json({
        status: 'error',
        message: 'Invalid JSON from Google Apps Script',
        raw: text
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 5️⃣ START SERVER
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
