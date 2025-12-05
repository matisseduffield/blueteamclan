# Blue Team Clan Website - Quick Reference Guide

## 🚀 Essential Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality

# Git
git add .
git commit -m "Your message"
git push origin main     # Triggers auto-deploy to Cloudflare
```

## 📝 Common Tasks

### Add a New Page
1. Create `src/app/new-page/page.tsx`
2. Import components and styles
3. Export React component
4. Route auto-created at `/new-page`

**Example:**
```typescript
import Button from "@/components/common/Button";

export default function NewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <Button>Click Me</Button>
    </div>
  );
}
```

### Create a New Component
1. Create `src/components/common/MyComponent.tsx` (or appropriate folder)
2. Export React component
3. Use in pages

**Example:**
```typescript
interface MyComponentProps {
  title: string;
  description?: string;
}

export default function MyComponent({ title, description }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Add a Type Definition
Edit `src/lib/types/index.ts`:
```typescript
export interface NewType {
  id: string;
  name: string;
  // ... properties
}
```

### Add Constants
Edit `src/lib/constants/index.ts`:
```typescript
export const NEW_CONSTANT = "value";
```

### Create an API Route
1. Create `src/app/api/route-name/route.ts`
2. Export GET/POST/PUT/DELETE functions
3. Return JSON responses

**Example:**
```typescript
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";

export async function GET() {
  return NextResponse.json<ApiResponse<any>>({
    success: true,
    data: { /* your data */ },
    timestamp: new Date(),
  });
}
```

## 🎨 Tailwind CSS Classes (Quick Reference)

```
Layout:     w-full, h-full, flex, grid, container
Spacing:    p-4, m-4, px-6, py-8, gap-4
Typography: text-xl, font-bold, text-gray-600
Colors:     bg-blue-600, text-white, border-gray-300
Responsive: sm:, md:, lg:, xl:
Effects:    shadow, rounded-lg, hover:, transition
```

## 📁 File Organization

```
When to use each folder:

src/app/
  └─ Page routes, API endpoints

src/components/common/
  └─ Reusable UI: Button, Card, Input

src/components/layout/
  └─ Header, Footer, Sidebar

src/components/sections/
  └─ Hero, Features, CTA sections

src/lib/types/
  └─ TypeScript interfaces

src/lib/constants/
  └─ Config, hardcoded data

src/lib/services/
  └─ API calls, external services

src/lib/utils/
  └─ Helper functions, formatters

public/
  └─ Static files: images, icons, fonts
```

## 🔗 Import Paths (Using `@/` alias)

```typescript
// Instead of: ../../../components/Button
import Button from "@/components/common/Button";

// Instead of: ../../lib/constants
import { SITE_CONFIG } from "@/lib/constants";

// Instead of: ../../../lib/types
import type { ClanMember } from "@/lib/types";
```

## 🌐 Deployment Checklist

Before pushing to production:
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run lint` - no errors
- [ ] Test locally with `npm run dev`
- [ ] Update `.env` variables in Cloudflare
- [ ] Check `DEPLOYMENT.md` for setup
- [ ] Push to GitHub main branch
- [ ] Verify Cloudflare auto-deployment

## 🐛 Debugging Tips

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

**TypeScript errors?**
- Check type definitions in `src/lib/types/`
- Ensure components export proper types
- Run `npm run lint` to find issues

**Styling not working?**
- Check class names spelling
- Ensure Tailwind is imported in `globals.css`
- Clear browser cache (Ctrl+Shift+Delete)

## 📚 Documentation Files

- `README.md` - Overview and tech stack
- `GETTING_STARTED.md` - Setup and customization
- `DEPLOYMENT.md` - Cloudflare deployment guide
- `SETUP_COMPLETE.md` - What was created
- `.github/copilot-instructions.md` - Development guidelines

## 🔧 Environment Variables

Create `.env.local` from `.env.example`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_COC_API_KEY=your_key_here
```

Access in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

## 💾 Version Control

```bash
# Initial commit
git add .
git commit -m "Initial commit: Blue Team Clan website"

# Regular commits
git add src/
git commit -m "Add members page"
git push origin main

# Check status
git status
git log --oneline
```

## 🎯 Next Features to Build

1. **Members Page** - Display clan members with roles
2. **Events Calendar** - List upcoming wars and events
3. **Statistics** - Show war stats and progress
4. **Recruitment** - Application form
5. **Gallery** - Team photos and achievements
6. **Blog** - News and announcements

## 📞 Quick Links

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com
- **TypeScript**: https://typescriptlang.org/docs
- **Cloudflare**: https://developers.cloudflare.com
- **GitHub**: https://github.com

---

**Start developing:** `npm run dev`
**Deploy:** Push to GitHub (auto-deploys to Cloudflare)
**Need help?** Check GETTING_STARTED.md

⚔️ **Build the best clan website out there!**
