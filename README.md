# Blue Team Clan - Official Website

Modern, scalable website for the Blue Team Clan (Clash of Clans) hosted on `blueteamclan.com` via Cloudflare.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── common/            # Reusable UI components
│   ├── layout/            # Layout components
│   └── sections/          # Page sections
├── lib/                   # Utilities
│   ├── types/             # TypeScript definitions
│   ├── constants/         # Constants
│   ├── services/          # API services
│   ├── utils/             # Helper functions
│   └── hooks/             # Custom hooks
└── styles/                # Global styles
```

## 🛠 Tech Stack

- **Next.js 16+** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **ESLint** - Code quality
- **Node.js** - Runtime

## 🌐 Deployment to Cloudflare

### Setup
1. Push code to GitHub repository
2. Connect repository to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next/public`

### Environment Variables
Create a `.env.local` file locally (template provided in `.env.example`)

### Connect Custom Domain
1. In Cloudflare Pages, add `blueteamclan.com` as your custom domain
2. Update Namecheap nameservers to point to Cloudflare
3. Enable auto-deploy on git push

## 📋 Features to Implement

- [ ] Member roster with profiles
- [ ] Event calendar
- [ ] War statistics
- [ ] Recruitment portal
- [ ] Media gallery
- [ ] News/blog section
- [ ] Contact form

## 🔧 Development Guidelines

### Component Creation
- Store reusable components in `src/components/common`
- Use TypeScript interfaces for props
- Include proper styling with Tailwind CSS

### API Routes
- Organize API routes in `src/app/api/`
- Use type definitions from `src/lib/types`
- Return consistent API response format

### Styling
- Use Tailwind utility classes
- Define custom classes in `src/styles/globals.css`
- Keep responsive design in mind

## 📝 License

All rights reserved © Blue Team Clan

## 📧 Support

For issues or questions, contact us on Discord or via our website.

---

**Happy coding! ⚔️**
