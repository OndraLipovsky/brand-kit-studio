# 🎨 BrandKit Studio & Commercial Vehicle Specifier

> Transform any website URL into an editable, print-ready Brand Kit with **header logo extraction**, **typography hierarchy**, **CMYK print values for truck wraps**, **AI emulation tokens**, and **multi-page vector PDF export**—all with **$0 paid API fees**.

---

## 🌟 Key Features

### 1. Zero-Cost Intelligent Scraping Engine
- **Header Logo Detection**: Analyzes `<header>`, `<nav>`, `[role="banner"]` to detect SVG logos, PNG/JPEG images, or stylized text wordmarks with automatic light/dark preview.
- **Favicon & App Icon Extraction**: Scrapes multi-resolution favicons, Apple touch icons, and fallback `/favicon.ico`.
- **Deep CSS Typography Analysis**: Detects Google Fonts (`@import`, `<link>`) and CSS `@font-face` rules. Compiles a full typographic scale (H1 through H4, Body, Button, Caption).
- **Color Palette & Swatches**: Extracts CSS custom properties (`--brand`, `--primary`), hex codes, RGB, HSL, and computes **exact CMYK percentages** for print shops.

### 2. Commercial Fleet & Truck Wrap Specifications 🚛
- **Calculated CMYK Values**: Essential for vinyl plotters, cast wrap films, and signage companies so colors on vehicles match the website identically.
- **Simulated Truck Livery Canvas**: Visual preview of the brand on White, Silver Metallic, or Black vehicle fleets.
- **Vehicle Visibility Rules**: Lettering height guidelines for city driving (3.5" at 35 ft) vs highway speeds (12"+ at 120 ft).
- **Material Directives**: Recommendations for 3M 1080/2080 cast vinyl and UV protective overlaminates.

### 3. In-Browser Live Editor
- Modify brand names, slogans, and mission statements.
- Swap detected logo candidates or upload/replace with your own vector/image asset.
- Live color picker with real-time recalculation of CMYK and WCAG contrast scores.
- Live typography tester that loads detected Google Fonts dynamically.

### 4. AI Emulation & Design Tokens
- **AI Replicator Master Prompt**: Pre-filled system prompt for Claude, ChatGPT, Gemini, or Antigravity to replicate the website design.
- **Matching Logo Prompt**: Vector logo generator prompt for Midjourney / DALL-E / Antigravity.
- **Ready-to-use Code**: Tailwind CSS config (`theme.extend`), CSS Custom Properties (`:root`), and W3C Design Tokens JSON.

### 5. Multi-Page Brand Kit PDF Export 📄
- Clean, executive-grade multi-page PDF generation via `jsPDF` + `html2canvas`.
- Cover page, Color Palette page, and Typography & Fleet Livery guide ready to hand off to clients, contractors, or sign printers.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node.js v22)
- npm 9+

### Installation
```bash
# Install dependencies for both server and client
npm run install:all

# Build the client production assets
npm run build

# Start the full-stack server
npm start
```
Open **`http://localhost:5000`** in your browser.

### Development Mode
For hot-reloading:
```bash
# Terminal 1 (Backend API on :5000)
npm run server

# Terminal 2 (Vite Frontend with hot-reload on :3000)
npm run client
```

---

## 🤖 Connecting Antigravity Agent API ($0 API Cost)

Instead of paying $50–$150/month for third-party scraper APIs (ScrapingBee, Browserless) or OpenAI token bills, you can use Antigravity locally:

### Method A: Pair-Programming Agent Prompt
Directly in Antigravity:
```text
Analyze website https://linear.app and generate a truck wrap specification sheet with CMYK values.
```

### Method B: Headless Local Webhook
You can trigger brand analysis programmatically via a local webhook endpoint:
```javascript
import { analyzeWebsite } from './server/analyzer.js';

// Call locally with zero external API fees
const brandKit = await analyzeWebsite('https://your-client-site.com');
console.log(brandKit.palette); // CMYK, HEX, RGB, Logo, Typography
```

---

## 📁 Project Structure

```
├── client/                     # Vite + React 19 Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UrlInputBar.jsx
│   │   │   ├── AnalysisLoading.jsx
│   │   │   ├── PdfExportModal.jsx
│   │   │   ├── AntigravityGuideModal.jsx
│   │   │   └── tabs/
│   │   │       ├── OverviewTab.jsx
│   │   │       ├── ColorsTab.jsx
│   │   │       ├── TypographyTab.jsx
│   │   │       ├── PrintTruckTab.jsx
│   │   │       └── AiEmulationTab.jsx
│   │   ├── utils/
│   │   │   └── colorUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express + Cheerio Scraping Engine
│   ├── analyzer.js             # Core extraction & CMYK logic
│   ├── index.js                # API server & static asset host
│   └── package.json
├── package.json                # Root automation scripts
└── README.md
```

---

## 📄 License
MIT © Ondra Lipovsky