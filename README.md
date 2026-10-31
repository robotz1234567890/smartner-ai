# Smartner AI

A responsive AI chat website with a Node.js/Express backend and the OpenAI Responses API.

## Run locally

1. Install Node.js 20 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your OpenAI API key in your shell (never commit it):

   ```bash
   export OPENAI_API_KEY="your_api_key_here"
   ```

   Optional model override:

   ```bash
   export OPENAI_MODEL="gpt-4.1-mini"
   ```

4. Start the app:

   ```bash
   npm start
   ```

5. Open http://localhost:3000.

## Deploy to Render

1. In Render, choose **New + → Blueprint**.
2. Connect GitHub and select `robotz1234567890/smartner-ai`.
3. Render reads `render.yaml` and creates the web service.
4. In the service's Environment settings, add `OPENAI_API_KEY` with your API key. Keep it secret; do not put it in frontend files or GitHub.
5. Deploy. The health endpoint is `/api/health`.

The Render blueprint uses the free plan where available; provider availability and limits can change.

## Project structure

- `server.js` — Express server and protected chat API.
- `public/` — browser interface.
- `render.yaml` — Render Blueprint.
