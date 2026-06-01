# Windows GitHub Release Guide

## First Upload

Create a new GitHub repository, then run these commands from the project root:

```bash
git init
git branch -M main
git add .
git commit -m "Initial LightCrush Desktop release"
git remote add origin https://github.com/YOUR_USERNAME/lightcrush-desktop.git
git push -u origin main
```

On Windows, install Git from <https://git-scm.com/download/win> first if the `git` command is not available.

## Build Checks

GitHub Actions will run on Windows:

- Frontend TypeScript and Vite build on Windows
- Rust backend `cargo check` on Windows
- Tauri Windows desktop build

## Creating a Release

Tag a version and push it:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The release workflow creates a draft GitHub Release and uploads Windows bundles.

## Windows Support

LightCrush Desktop is currently a Windows-only app. Linux and macOS builds are not part of the release workflow.
