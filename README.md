# AI Context Collector

AI Context Collector is a Chrome Extension for software engineers who need to collect webpage context and export it as clean Markdown for ChatGPT, Codex, Copilot, and other AI coding assistants.

The v0.3.0 release runs entirely in the browser. It has no backend, authentication, analytics, AI API calls, parsers, OCR, cloud sync, or workspace management.

## Features

- Collect the current page title, URL, selected text, source type, source-specific metadata, tags, notes, and timestamp.
- Use source adapters to detect Figma, GitHub, and Swagger/OpenAPI URLs without calling external APIs.
- Use a Traditional Chinese popup UI for daily collection and review.
- Keep privacy-first local-only behavior with data stored in `chrome.storage.local`.
- Add page context from the popup.
- Add page context from the right-click context menu.
- Edit source type, tags, and notes after collection.
- Delete one item or clear all items.
- Export all collected sources as structured AI-ready Markdown.
- Copy generated Markdown to the clipboard.
- Store all data locally with `chrome.storage.local`.

## Installation

1. Run `npm install`.
2. Run `npm run build`.
3. Open Chrome and go to `chrome://extensions`.
4. Enable Developer mode.
5. Choose Load unpacked.
6. Select the generated `dist` folder.

## Development

```bash
npm install
npm run dev
```

During active extension testing, run the production build and load `dist` as an unpacked extension:

```bash
npm run build
```

## Build

```bash
npm run build
```

The build output is written to `dist`.

## Folder Structure

```text
src/
  background/  Message routing and context-menu wiring.
  content/     Page information collection only.
  hooks/       React hooks used by the popup.
  popup/       Popup UI.
  services/    Business logic for collecting and exporting context.
  storage/     Encapsulated chrome.storage.local access.
  types/       Shared TypeScript contracts.
  utils/       Pure helper functions.

public/        Extension manifest and static assets.
docs/          Architecture and roadmap documentation.
```

## Future Roadmap

- v0.2: Better organization with tags, notes, source types, Traditional Chinese UI, and improved Markdown export.
- v0.3: Source adapter architecture with Figma, GitHub, Swagger/OpenAPI URL metadata extraction and privacy-first local-only messaging.
- v0.4: Search, import, and export workflows for portable context bundles.
- v1.0: A broader AI Developer Toolkit with richer source integrations.

See [docs/roadmap.md](docs/roadmap.md) for details.
