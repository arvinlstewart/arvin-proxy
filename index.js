const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR-SCRIPT-ID/exec';

// ✅ Correct CORS Setup
app.use(cors({
  origin: '*', // Allow any origin
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Handle preflight OPTIONS manually
app.options('/submit', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send(''); // No Content
});

// ✅ Main POST Handler
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
      res.set('Access-Control-Allow-Origin', '*');
      res.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON from Apps Script:', text);
      res.set('Access-Control-Allow-Origin', '*');
      res.status(502).json({
        status: 'error',
        message: 'Invalid JSON from Google Apps Script',
        raw: text
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
