# Coded For You — Website

AI automation agency website built with React + Framer Motion.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
cfy-website/
├── public/
│   └── index.html        # HTML entry point with preconnect hints
├── src/
│   ├── main.jsx          # React root entry
│   └── App.jsx           # Full website component
├── vite.config.js        # Vite build config with chunk splitting
├── package.json
└── .gitignore
```

## ⚡ Performance Optimizations

- **Lazy loading** on all below-fold images with `decoding="async"`
- **fetchpriority="high"** on above-fold logo for faster LCP
- **Shared hooks** (`useIsMobile`, `useScrolled`) — no duplicate resize/scroll listeners
- **RAF-throttled** scroll listener — fires once per animation frame max
- **`content-visibility: auto`** on sections — browser skips off-screen render work
- **Chunk splitting** — React, Framer Motion, and Lucide in separate cached bundles
- **Tree-shaken imports** — unused Lucide icons and Framer Motion hooks removed
- **`drop_console: true`** in production build — strips all console.log calls

## 🌐 Deploy

Works with Vercel, Netlify, or any static host. Just run `npm run build` and upload the `dist/` folder.
