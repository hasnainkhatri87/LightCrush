# Architecture

LightCrush Desktop is a Windows-only Tauri v2 app with a React and TypeScript frontend and a Rust backend.

## Frontend

The frontend lives in `src/`.

- `App.tsx` owns queue state, settings, selected preview image, and command orchestration.
- `components/` contains focused UI pieces for upload, settings, queue cards, preview, and export actions.
- `lib/` contains formatting, presets, file picker helpers, and queue helpers.
- `types/` contains shared TypeScript models.

The UI passes local file paths to Tauri commands. It does not read image bytes into base64 strings.

## Backend

The backend lives in `src-tauri/src/`.

- `commands/metadata.rs` validates and reads dimensions for queued images.
- `commands/optimize.rs` starts local optimization.
- `commands/export.rs` copies optimized files to the selected output folder.
- `image/optimizer.rs` decodes, resizes, encodes, strips metadata, and writes optimized files.
- `image/resize.rs` resizes without enlargement.
- `image/validate.rs` enforces supported formats, file size, and megapixel limits.
- `utils/paths.rs` creates safe temp and export paths.

## Processing Model

The default queue is sequential. This is intentional for low-end PCs. Each image is validated, decoded, optionally resized, re-encoded, and released before the next image starts.

## Privacy Model

There are no external API calls. Images never leave the user computer. Temporary files are stored under the OS temp directory in a `lightcrush-desktop` folder and can be exported to any user-selected folder.

## Future Engine Options

The current backend uses Rust image libraries and WebP encoding. A Sharp/libvips sidecar can be added later as an optional local engine for stronger compression, but it should remain fully offline and opt-in.
