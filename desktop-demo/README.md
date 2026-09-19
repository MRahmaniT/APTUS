# APTUS Desktop Demo

This directory contains the Tauri 2 wrapper used to package the existing APTUS React/Vite website as a self-contained desktop demonstration.

## Purpose

The desktop demo is for company/client review. It is intentionally separate from the production deployment stack.

- No Docker is required on the recipient computer.
- No Node.js installation is required on the recipient computer.
- No PostgreSQL server is required on the recipient computer.
- The demo uses the existing bundled/local APTUS content mode and browser storage.
- Production continues to use the Express API and PostgreSQL through `aptus.sh`.

## Build locally

Install the normal frontend dependencies first:

```bash
npm ci
```

Install the Tauri CLI if it is not already available, then build from the Tauri project directory:

```bash
cd desktop-demo/src-tauri
cargo install tauri-cli --version '^2' --locked
tauri build
```

The Windows NSIS installer is produced under:

```text
desktop-demo/src-tauri/target/release/bundle/nsis/
```

For normal distribution, use the GitHub Actions `APTUS Desktop Demo` workflow instead of building installers manually.

## Demo behavior

The build runs Vite in `demo` mode using the repository-level `.env.demo` file. In this mode the frontend does not contact the production API. Content edits made inside the demo are stored only on the local computer running the desktop app.
