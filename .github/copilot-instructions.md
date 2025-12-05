# Blue Team Clan Website - Development Guidelines

## Project Overview
A scalable, modern website for the Blue Team Clan Clash of Clans clan hosted on blueteamclan.com via Cloudflare.

## Technology Stack
- **Framework**: Next.js 16+ with TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm
- **Deployment**: Cloudflare Pages

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (RESTful endpoints)
│   │   ├── clans/         # Clan management endpoints
│   │   ├── members/       # Member management endpoints
│   │   └── events/        # Event management endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── common/            # Reusable components (Button, Card, etc.)
│   ├── layout/            # Layout components (Header, Footer, Navbar)
│   └── sections/          # Page sections (Hero, Features, etc.)
├── lib/                   # Utility functions and shared code
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   └── services/          # API service functions
├── styles/                # Global styles
└── ...

public/
├── assets/
│   ├── images/            # Clan/game images
│   └── icons/             # SVG icons
└── ...
```

## Development Workflow

### Setup
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:3000`

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Key Features to Implement
- [ ] Responsive clan homepage
- [ ] Member roster with profiles
- [ ] Event calendar
- [ ] War statistics tracking
- [ ] Recruitment information
- [ ] Gallery/media showcase

## Cloudflare Deployment
1. Connect GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set publish directory: `.next/public`
4. Add environment variables as needed
5. Enable automatic deployments on git push

## Best Practices
- Use components in `src/components/common` for reusable elements
- Keep API logic in `src/lib/services`
- Store constants in `src/lib/constants`
- Use TypeScript interfaces in `src/lib/types`
- Follow ESLint rules (enforced via pre-commit hooks recommended)
