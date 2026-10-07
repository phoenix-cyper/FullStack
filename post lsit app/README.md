# Post List — Redux Toolkit

A simple React + Redux Toolkit app: add posts to a list and see the live total count.

## Features
- `postsSlice` with an `addPost` reducer
- Text input and "Add" button that dispatch `addPost` (pressing Enter also works)
- Full post list rendered with `useSelector`
- Total post count shown at the top

## How to run (any PC with Node.js 18+ installed)

1. Install Node.js from https://nodejs.org (LTS version).
2. Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

3. Open the URL shown (usually http://localhost:5173).

## Build for production (optional)

```bash
npm run build
npm run preview
```
