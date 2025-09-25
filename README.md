# AI Coding Practice Platform

A minimal full-stack web app featuring:

- AI-assisted coding recommendations
- In-browser code editor (textarea) with starter code
- Online judge for JavaScript and Python with per-test results
- Practice list and problem pages

## Quick Start

Prerequisites:

- Node.js 18+
- (Optional) Python installed and available as `python` in PATH for Python judging

Setup:

```bash
npm install
npm start
```

Then open http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env` and set values if needed:

- `PORT`: Server port (default 3000)
- `OPENAI_API_KEY`: If set, the LLM suggestions endpoint will call OpenAI (Chat Completions) using the specified key. If not set, it will return mock suggestions/snippets.
- `OPENAI_MODEL`: OpenAI model name (default `gpt-4o-mini`).

## Project Structure

- `server.js` — Express server, API routes, static file serving
- `src/data/problems.js` — Problem statements, starter code, and tests
- `src/judge/runner.js` — Judge implementation for JS/Python with timeouts
- `public/` — Frontend pages and assets
  - `index.html` — Dashboard with navbar
  - `practice.html` — Problem list page
  - `problem.html` — Problem detail/editor/judge/AI page
  - `styles.css` — Styling

## API Overview

- `GET /api/problems` — List problems (id, title, difficulty, tags, slug)
- `GET /api/problems/:idOrSlug` — Get problem details by ID or slug
- `POST /api/judge` — Body: `{ problemId, language: 'javascript'|'python', code }`. Returns per-test results and status.
- `POST /api/llm/suggest` — Body: `{ prompt }`. Uses OpenAI if `OPENAI_API_KEY` set; otherwise returns mocked suggestions.

## Notes on the Judge

- JavaScript runs with Node via `node -e` and expects a `solve` function. You may export via `module.exports = { solve }` or define `function solve(...) {}`.
- Python runs via `python -c` and expects a `solve` function. Make sure `python` command is available in PATH. If your system uses `py`/`python3`, adjust accordingly in `src/judge/runner.js` or your PATH.
- Time limit is per test (default 2s). Long-running or infinite loops will be terminated.
- This is a local prototype. Executing arbitrary code is inherently unsafe; do not expose publicly without sandboxing.

## Extending

- Add more problems by appending to `src/data/problems.js` with `tests` and `starterCode`.
- Replace the textarea editor with Monaco/CodeMirror for richer editing.
- Enhance AI integration by passing richer context (problem statement, user code) and rendering structured responses.

## License

MIT

## Branch: feature/ai-prototype

This branch integrates the AI Coding Practice app with:

- MongoDB persistence for users/problems/progress
- OpenRouter provider for AI suggestions (fallback to mock)
- Code editor with language-aware indentation, autocomplete, and Format button
- Seed script to ensure 50+ mixed-difficulty problems

