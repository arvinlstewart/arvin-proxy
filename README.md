# Arvin Proxy

This is a simple Node.js proxy server that securely relays form submissions from a frontend site to a Google Apps Script Web App, handling CORS automatically.

## How it works

1. Accepts JSON POST requests at `/submit`
2. Forwards the request to your specified Google Apps Script endpoint
3. Returns the response (or error) back to the frontend

## Setup

```bash
npm install
npm start
```

> Make sure to replace the `GOOGLE_SCRIPT_URL` environment variable with your actual Google Apps Script Web App URL.

## Deployment

You can deploy this to platforms like [Render](https://render.com), [Railway](https://railway.app), or [Vercel](https://vercel.com).

## License

MIT
