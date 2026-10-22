# LACROWN — Premium Dermatology & Aesthetic Clinic

A bespoke, editorial-grade aesthetic clinic website featuring a refined custom typography lockup `[L ICON] + [ACROW TEXT] + [N ICON]`, coordinated center-outward photograph reveal animation, and an industry-standard frontend architecture.

## Repository Structure

```
la_crown/
├── frontend/               # Self-contained React + TypeScript + Vite project
│   ├── public/             # Static public assets (hero photos, font-icons)
│   │   ├── font-icons/     # Custom ornamental L and N PNG assets
│   │   └── images/         # Hero photographs
│   ├── src/
│   │   ├── assets/         # Bundled module assets
│   │   ├── components/
│   │   │   ├── hero/       # HeroSection, LacrownWordmark, HeroImageCollage, ClinicHeadline
│   │   │   └── ui/         # HeroHeader, MenuDrawer, WhatsAppModal, BookingModal
│   │   ├── hooks/          # Custom reusable React hooks
│   │   ├── lib/            # Utilities (cn, class merge helpers)
│   │   ├── styles/         # Global stylesheets and typography tokens (hero.css)
│   │   ├── types/          # Shared TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # React DOM entrypoint
│   ├── font-icons/         # Original custom L.png and N.png source icons
│   ├── scripts/            # Visual inspection and validation utilities
│   ├── index.html          # HTML template with Google Fonts preloading
│   ├── package.json        # Dependencies and build scripts
│   ├── tailwind.config.js  # Tailored design system colors & typography
│   └── vite.config.ts      # Vite configuration
├── .gitignore              # Repository-wide ignore definitions
└── README.md               # Repository documentation
```

## Getting Started

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```
