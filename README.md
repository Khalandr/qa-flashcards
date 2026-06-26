# qa-flashcards

Interview-prep flashcards for QA / Test Automation / AI Testing roles.

**Live:** https://qa-flashcards.vercel.app

300 cards across three decks, sorted by interview probability:

- **QA Fundamentals** (100) — ISTQB theory: test design, levels, management, quality models
- **Test Automation** (100) — Playwright/Cypress, API testing, CI/CD, patterns, flaky tests, scaling
- **AI Testing** (100) — using AI to generate/evaluate tests, AI tooling & pipelines, and testing AI/LLM systems

## Stack

Vite + React + TypeScript. App lives in [`flashcards/`](./flashcards).

```bash
cd flashcards
npm install
npm run dev      # local dev
npm run build    # production build -> dist/
```

Deployed on Vercel with Root Directory set to `flashcards`; pushes to `main` auto-deploy.
