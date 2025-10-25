# Jitsi Calendar Linker

[![CI](https://github.com/zimiovid/jitsi-calendar-linker/actions/workflows/ci.yml/badge.svg)](https://github.com/zimiovid/jitsi-calendar-linker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-%E2%89%A5%2020-1f6feb)

Add a Jitsi meeting button to Google Calendar (classic v1 and new v2 UI). Supports quick dialog (Event/Task), auto‑generated room names, and smart updates to description/location.

> A zero‑hassle, self‑hostable way to add a “Jitsi Meeting” button to Google Calendar without publishing marketplace apps — perfect for corporate domains and restricted environments.

## Table of contents
- Features
- Requirements
- Install & run
- Build
- Load into Chrome
- Usage
- Privacy & permissions
- Roadmap
- Structure
- Credits
- License

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

## Usage
- Open Google Calendar and create an event.
- Use the “Add a Jitsi Meeting” button; when a link is present, it switches to “Join your Jitsi Meeting now”.
- In the quick dialog, the button is shown on both Event and Task tabs; Task description gets a plain text invite.

## Privacy & permissions
- Host permissions are limited to `https://calendar.google.com/*`.
- No analytics or tracking. External fetches (numbers/mapper) are off by default and configurable.

## Roadmap
- Firefox/WebExtension compatibility layer.
- Chrome Web Store listing.
- Templating for invite texts via settings UI.

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
