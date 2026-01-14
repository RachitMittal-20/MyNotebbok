# MyNotebook

This repository contains a small static front-end (originally named `SurgePV`) and references to a separate notebook app and Supabase integration in a sibling folder on the local machine.

This README explains what is in the repo and how to run the projects locally.

## Quick start (one-liner)

If you want a single command to run the notebook app from this repository after cloning, run:

```bash
cd MyNotebook/notebook && npm install && npm run dev
```

This installs dependencies and starts the Vite dev server for the notebook app.

## What is included

- `index.html` — a small static entry page that was present when the project was renamed to `MyNotebook`.
- There are two related projects in this workspace (not all live inside this repository):
  - `~/Desktop/private-notebook-main` — the main React + Vite app (the notebook app).
  - `~/Desktop/private-notebook-main/supabase` — Supabase-related config and a Vite project used for local dev.

> Note: The React/Vite project and the supabase subfolder live outside this repository path. If you cloned this repo elsewhere, adjust the paths accordingly.

## Prerequisites

- Node.js (16+ recommended)
- npm (or Bun if you prefer, but the instructions below use npm)
- Git (already used to push this repo)

## Run the notebook (React + Vite)

The main notebook app is located at `~/Desktop/private-notebook-main`. To run it:

1. Open a terminal and change to the project folder:

```bash
cd ~/Desktop/private-notebook-main
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Vite will start a dev server and print the local URL. If the default port (8080) is in use, Vite will try another free port (e.g. 8081). The server will also attempt to open your default browser.

If you prefer a deterministic port, start with an explicit port option:

```bash
npm run dev -- --port 3000
```

## Run the Supabase helper project

If you need to run the `supabase` project (used for configuration or local helpers), go to:

```bash
cd ~/Desktop/private-notebook-main/supabase
npm install
npm run dev
```

This project has its own Vite config. The config has been adjusted to pick a free port automatically to prevent collisions.

## Serve the static `index.html` in this repository

This repo currently contains a static `index.html`. To serve it locally quickly you can use a small static server:

```bash
# from inside the repo
cd ~/MyNotebook
npx serve .
```

or simply open `index.html` in your browser.

## Changing the project name locally

This repository was renamed locally to `MyNotebook`. If you want to change the name on GitHub, either rename the repo via the GitHub UI or create a new repo and update the `origin` remote.

## Git / Push notes

- To push further changes locally:

```bash
cd ~/MyNotebook
git add -A
git commit -m "your message"
git push
```

- To add a remote (if needed):

```bash
git remote add origin <YOUR_REMOTE_URL>
git push -u origin main
```

## Troubleshooting

- If port 8080 is already in use, Vite will try another port. Change the port explicitly with `--port` if you need a fixed port.
- If the browser shows a 404, ensure you're running the dev server from the correct project folder (the notebook app is in `~/Desktop/private-notebook-main`).

## Contact / next steps

If you'd like, I can:
- Add a LICENSE file and a more detailed README with architecture and contributor notes.
- Add a `.gitignore` and basic CI (GitHub Actions) to run lint/tests.

---
Generated and pushed from the local machine on request.
