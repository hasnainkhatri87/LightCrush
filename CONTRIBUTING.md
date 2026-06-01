# Contributing

Thanks for helping improve LightCrush Desktop.

## Principles

- Keep image processing fully offline.
- Do not add analytics, telemetry, login, ads, or cloud upload.
- Keep low RAM mode as the default path.
- Prefer beginner-friendly wording for all user-facing errors.
- Keep WebP as the default output format.

## Local Development

```bash
npm install
npm run dev
```

Run frontend checks:

```bash
npm run build
```

Run backend checks:

```bash
cd src-tauri
cargo check
```

## Pull Requests

Before opening a PR, make sure the app starts, the frontend builds, and the Rust backend checks locally or in GitHub Actions.
