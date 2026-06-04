# Abhinav Kumar — Business Analytics Portfolio

Personal portfolio website for Abhinav Kumar, MBA graduate in Business Intelligence & Data Analytics.

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool and dev server
- **Pure CSS-in-JS** — All styles via inline `style` props (no CSS framework required)
- **Google Fonts** — Playfair Display + DM Sans (loaded via `index.html`)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Build optimised production bundle
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
abhinav-portfolio/
├── index.html          # Entry HTML — fonts loaded here
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
├── .gitignore
└── src/
    ├── main.jsx        # React entry point
    ├── index.css       # Global reset + keyframe animations
    └── App.jsx         # Full portfolio (all components)
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drop the /dist folder into Netlify
```

### GitHub Pages
```bash
# In vite.config.js, add: base: '/your-repo-name/'
npm run build
# Push /dist to gh-pages branch
```

## Contact

**Abhinav Kumar**  
📧 mailmesrivastava.avi@gmail.com  
📱 +91 8709334578  
📍 Delhi NCR
