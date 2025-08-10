# Techno‑Political Values Test

An interactive quiz that maps your views across thirteen techno-political spectrums — from transhumanism to state stewardship to UBI. Inspired by JREG’s Tech Spectrum, the test blends political compass–style scoring with technology-specific value questions, mixing categories so your answers stay balanced.

Features
- 52 carefully crafted statements, randomized to avoid category bias
- Dark mode default with smooth, minimal UI
- Color-coded bar and radar charts for clear results visualization
- Contextual question descriptions for better clarity
- All processing is client-side — your answers stay in your browser

Tech stack
- React + Vite
- TailwindCSS + shadcn/ui
- Recharts for data visualization
- Framer Motion for animations


## Quick start

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173/`.

## Build

```bash
npm run build
npm run preview
```

## Notes

- UI components live in `src/components/ui/` and mimic shadcn/ui primitives.
- TailwindCSS is configured; classes are used throughout.
- Data export available from the Results screen.
