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

From the repository root, install dependencies and produce the offline demo frontend first:

```bash
npm ci
npm run build -- --mode demo
```

Then install the Tauri CLI if it is not already available and build the Windows NSIS package from the Tauri project directory:

```bash
cd desktop-demo/src-tauri
cargo install tauri-cli --version '^2' --locked
tauri build --bundles nsis
```

The Windows installer is produced under:

```text
desktop-demo/src-tauri/target/release/bundle/nsis/
```

For normal distribution, use the GitHub Actions `APTUS Desktop Demo` workflow instead of building installers manually. A successful run uploads an artifact named `APTUS-Demo-Windows` containing the `.exe` installer.

## Demo behavior

The frontend is built in `demo` mode using the repository-level `.env.demo` file. In this mode the frontend does not contact the production API. It opens with an offline Manager demo identity so protected pages and CMS screens can be reviewed. Content edits made inside the demo are stored only on the local computer running the desktop app.

## Distribution note

The installer is not code-signed yet. Windows may therefore display an unknown-publisher or SmartScreen warning. Add a Windows code-signing certificate before broad external distribution if a trusted-publisher installation experience is required.
