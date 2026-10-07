# Post Box — Character Counter 📮

A beautiful post box with a live character counter and 4 switchable color themes
(Midnight, Ocean, Sunset, Forest). Your theme choice is remembered.

## How to run (2 steps)

You need [Node.js](https://nodejs.org) installed (version 18 or newer) — that's the only requirement.

1. **Unzip this folder** and open a terminal inside it.
2. **Run these two commands:**

   ```bash
   npm install
   npm run dev
   ```

3. Open **http://localhost:8080** in your browser. Done!

## What it does

- Type a post and watch the live counter (e.g. `45 / 100`).
- Go past 100 characters and a red **"Limit exceeded"** message appears.
- The **Post** button is disabled when the text is empty or over the limit.
- Click a colored dot in the top-right corner to switch themes.

## Troubleshooting

- **"npm is not recognized"** → Install Node.js from https://nodejs.org, then reopen the terminal.
- **Port already in use** → The app will tell you the alternate port to open, just follow it.
