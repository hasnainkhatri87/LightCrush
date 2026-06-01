<div align="center">
  <img src="public/icon.png" width="200" alt="LightCrush Logo">
  <h1>LightCrush</h1>
  <p><b>The ultimate, ultra-lightweight, and 100% offline image compressor.</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](#-one-click-downloads)
  [![Tech Stack](https://img.shields.io/badge/Tech-React%20%2B%20Neutralinojs-00d8ff)](https://neutralino.js.org/)
  [![Size](https://img.shields.io/badge/Size-<2MB-brightgreen)](#-architecture)
</div>

<br/>

**LightCrush** is a modern, cross-platform desktop application designed to compress, convert, and resize images without ever sending your private files to the cloud. By replacing the traditional Chromium/Electron overhead with the extremely lightweight **Neutralinojs** native C++ wrapper, LightCrush manages to deliver a stunning hardware-accelerated React interface in a single standalone executable that weighs **under 2 Megabytes**.

---

## ⚡ One-Click Downloads (Latest Release)

No installation wizard required. Simply download the single portable file for your operating system and run it instantly.

| Operating System | Standalone Binary | File Size | Architecture |
|------------------|-------------------|-----------|--------------|
| **Windows** | [⬇️ Download `lightcrush-win_x64.exe`](https://github.com/hasnainkhatri87/LightCrush/releases/latest/download/lightcrush-win_x64.exe) | ~ 1.9 MB | 64-bit |
| **macOS** | [⬇️ Download `lightcrush-mac_universal`](https://github.com/hasnainkhatri87/LightCrush/releases/latest/download/lightcrush-mac_universal) | ~ 2.1 MB | Intel & Apple Silicon (M1/M2/M3) |
| **Linux** | [⬇️ Download `lightcrush-linux_x64`](https://github.com/hasnainkhatri87/LightCrush/releases/latest/download/lightcrush-linux_x64) | ~ 2.0 MB | 64-bit |

> **Security Note for macOS & Linux Users:** Since this is a standalone binary downloaded from the web, your OS might require you to grant execution permissions. Open your terminal, navigate to your downloads, and run: `chmod +x lightcrush-mac_universal` (or the respective Linux file) before running it.

---

## ✨ Comprehensive Features

*   🔒 **Absolute Privacy (100% Offline):** Your images are processed directly in your machine's memory using a dedicated Web Worker. No servers, no tracking, no cloud API calls.
*   🪶 **Impossibly Lightweight:** Built on Neutralinojs. It uses your operating system's built-in web viewer (WebView2 on Windows, WebKit on macOS, WebKitGTK on Linux) instead of bundling an entire Chromium browser engine.
*   🎨 **Premium Aesthetic UI:** A beautifully crafted glassmorphic dark-mode interface featuring dynamic micro-animations, sleek typography, and HSL-tailored vibrant gradients.
*   🔄 **Cross-Format Conversion:** Drag in a massive `JPG`, `PNG`, or `WebP` and export it to a highly compressed `WebP` or any other supported format seamlessly.
*   🎚️ **Real-Time Interactive Comparison:** Use the intuitive before-and-after slider to visually compare the original image against the compressed output before saving.
*   🗂️ **Batch Processing Queue:** Drop dozens of images into the dropzone at once. LightCrush handles them sequentially in a clean, scrollable queue.
*   ⚙️ **Advanced Compression Control:** Take full control of the output quality slider (1% to 100%) and watch the predicted file size update instantly.

---

## 🧠 Architecture & Tech Stack

LightCrush achieves its tiny footprint and high performance through a carefully selected stack:

1.  **Frontend Framework:** React 18, utilizing functional components and modern Hooks.
2.  **Build Tool:** Vite, configured for aggressive minification, code splitting, and incredibly fast HMR.
3.  **Desktop Wrapper:** Neutralinojs. A lightweight C++ application execution environment that runs web apps inside native OS windows.
4.  **Processing Engine:** A custom HTML5 Canvas abstraction running inside a dedicated **Web Worker**. This ensures that heavy image processing, pixel manipulation, and compression algorithms never block the main UI thread, resulting in a smooth 60fps interface even during heavy workloads.
5.  **Styling:** Pure, vanilla CSS with modern variables (CSS Custom Properties). No heavy CSS frameworks (like Tailwind or Bootstrap) were used, keeping the DOM structure minimal and the bundle size microscopic.

---

## 🛠️ Development & Compilation Guide

Want to build LightCrush from the source code, tweak the UI, or contribute new features? Here is how to set up your local environment.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   Git

### 1. Local Setup
```bash
# Clone the repository
git clone https://github.com/hasnainkhatri87/LightCrush.git
cd LightCrush

# Install all Node dependencies
npm install
```

### 2. Running in Browser Mode (Web Development)
When tweaking the React components or CSS, it is fastest to use the standard Vite dev server directly in your browser.
```bash
# Starts a local server at http://localhost:5173
npm run dev
```

### 3. Compiling the Standalone Native Executables
Once you are ready to package the app for desktop distribution, we use a single unified command. 

```bash
# Build the project for all operating systems natively
npm run build:desktop
```
**What happens under the hood when you run this command?**
1.  **TypeScript Verification:** Runs `tsc` to ensure strict type safety.
2.  **Vite Bundling:** Runs `vite build` to aggressively minify the React application into the `build/` directory.
3.  **Config Syncing:** Safely copies `neutralino.config.json` into the build directory so the C++ binary knows how to map routes.
4.  **Neutralino Packaging:** Runs `neu build --release --embed-resources`. This takes your `build/` folder, compresses it into a high-performance ASAR archive, and chemically binds that archive directly into the `.exe`, macOS binary, and Linux binary.

Once the process finishes, check the `dist/lightcrush/` directory for your shiny new standalone files!

---

## 🤝 Contributing

Contributions, issues, and feature requests are highly welcome!
If you find a bug or have an idea for a feature, please feel free to check the [issues page](https://github.com/hasnainkhatri87/LightCrush/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. This means you are free to use, modify, distribute, and sell this software as long as you include the original copyright and permission notice.

<p align="center">Made with ❤️ for speed, privacy, and beautifully lightweight software.</p>
