const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxg2eToj7DT34g9UeY5Z5jo5ECaeAKBUgzVkdckneBFdEx_VYzP1E7QWoy21NvkfqlJ/exec';

app.use(cors());
app.use(express.json());

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
      res.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON from Apps Script:', text);
      res.status(502).json({
        status: 'error',
        message: 'Invalid JSON from Google Apps Script',
        raw: text
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
