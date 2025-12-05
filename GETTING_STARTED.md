# Getting Started with Blue Team Clan Website

## 📋 Project Setup Complete ✓

Your Blue Team Clan website project is ready for development!

## 🚀 Quick Commands

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🌐 Local Development

1. Run the dev server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Edit files in `src/` - changes hot-reload automatically

## 📁 Where to Add Content

- **Pages**: `src/app/` - Create new routes here
- **Components**: `src/components/` - Reusable UI elements
- **Styles**: `src/styles/globals.css` - Global styling
- **Types**: `src/lib/types/index.ts` - TypeScript definitions
- **Constants**: `src/lib/constants/index.ts` - App configuration
- **Images**: `public/assets/images/` - Static images

## 🎨 Customization

1. **Logo & Brand**
   - Update `SITE_CONFIG` in `src/lib/constants/index.ts`
   - Add clan logo to `public/assets/images/`

2. **Colors**
   - Modify Tailwind config in `tailwind.config.ts`
   - Update custom colors in `src/styles/globals.css`

3. **Navigation**
   - Update `NAV_LINKS` in `src/lib/constants/index.ts`

## 🌐 Deployment to Cloudflare

See `DEPLOYMENT.md` for detailed deployment instructions.

Quick summary:
1. Push code to GitHub
2. Connect repo to Cloudflare Pages
3. Configure build settings
4. Update domain nameservers
5. Done! Auto-deploys on every push

## 📚 File Structure

```
blueteamclan/
├── src/
│   ├── app/                 # Pages and API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities, types, constants
│   └── styles/              # Global styles
├── public/                  # Static files
├── .github/                 # GitHub config & Copilot instructions
├── README.md                # Project documentation
├── DEPLOYMENT.md            # Deployment guide
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🔧 Next Steps

1. **Customize branding**
   - Update clan name, description, and social links

2. **Add member data**
   - Create API endpoint in `src/app/api/members/`
   - Display members page

3. **Create pages**
   - Members roster page
   - Events calendar page
   - About page
   - Contact page

4. **Connect to APIs**
   - Clash of Clans API (optional)
   - Discord bot integration
   - Analytics

## 💡 Tips

- Use `@/` imports for cleaner code (configured in `tsconfig.json`)
- Follow the component structure in `src/components/`
- Keep API logic in `src/lib/services/`
- Store configuration in `src/lib/constants/`
- Use TypeScript for type safety

## 🆘 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Build fails?**
- Check `npm run lint` for errors
- Ensure all components are properly exported
- Verify TypeScript types in `src/lib/types/`

**Deployment issues?**
- See `DEPLOYMENT.md` for detailed instructions
- Check Cloudflare Pages build logs
- Ensure environment variables are set

---

**Ready to build? Start with `npm run dev`! ⚔️**
