# LACROWN Frontend Application

The self-contained frontend application for **LACROWN — Dermatology Aesthetic Clinic**.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** bundler
- **Tailwind CSS** with bespoke typography and colors
- **Framer Motion** for physics-based center-outward reveal animation
- **Lucide React** for accessible UI iconography

## Custom Typography & Icon Lockup

The oversized brand wordmark features a sequence:
- **`[L ICON]`**: Custom ornamental PNG asset (`frontend/font-icons/L.png`), rendered in `#00552F` with anti-aliased transparency.
- **`[ACROW TEXT]`**: Tall, condensed display typography (`Bebas Neue` / `Oswald`), calibrated cap height and tight kerning.
- **`[N ICON]`**: Matching custom ornamental PNG asset (`frontend/font-icons/N.png`), scaled to match the lockup.

## Commands

- `npm run dev`: Start Vite development server (`http://127.0.0.1:5173/`)
- `npm run build`: Type-check and create production build
- `npm run preview`: Serve local production bundle
