# Jitsi Calendar Linker

A browser extension that adds a Jitsi meeting button to Google Calendar forms (classic v1 and new v2 UI), with quick dialog support and room name auto‑generation.

## Features
- “Add a Jitsi Meeting” / “Join your Jitsi Meeting now” button in event form
- Quick add dialog support (Event/Task tabs)
- Room ID auto‑generation (digits or dictionary)
- Description/location updates and optional dialing info mapping

## Requirements
- Node.js 20+
- npm

## Install & run
```bash
npm ci
npm run typecheck
npm run lint
npm test
```

## Build
```bash
npm run build
```
Artifacts are emitted into `dist/`.

## Load into Chrome (Developer mode)
1. Open `chrome://extensions`
2. Enable “Developer mode”
3. Click “Load unpacked” and select the `dist/` folder

## Scripts
- `npm run typecheck` — type checking (tsc)
- `npm run lint` / `npm run lint:fix` — linting (ESLint)
- `npm test` — tests (Vitest) with coverage
- `npm run build` — build content and assets into `dist/`

## Structure
- `src/` — source code (v1/v2 adapters, utils, templates)
- `scripts/` — build scripts
- `dist/` — build artifacts (git‑ignored)

## Credits
Based on and modernized from `jitsi/jidesha` (Chrome Calendar integration). Reworked with TypeScript, tests, ESLint, and CI.

## License
MIT — see `LICENSE`.
