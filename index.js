const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your real Apps Script URL
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR-SCRIPT-ID/exec';

// ✅ 1. Enable CORS properly
app.use(cors({
  origin: '*',  // Allow any domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ 2. Express body parser
app.use(express.json());

app.options('/submit', (req, res) => {
  // ✅ 3. Handle preflight manually if needed
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send('');
});

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
