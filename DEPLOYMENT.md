# Cloudflare Pages Configuration for Blue Team Clan Website

This configuration enables deployment to Cloudflare Pages.

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Blue Team Clan website"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Select "Connect to Git" and authorize GitHub
   - Select your blueteamclan repository
   - Configure build settings:
     - **Framework preset**: Next.js
     - **Build command**: `npm run build`
     - **Build output directory**: `.next/public`
     - **Root directory**: `/` (leave blank)

3. **Environment Variables**
   - Add any environment variables in Cloudflare Pages settings
   - Ensure variables from `.env.example` are configured

4. **Custom Domain**
   - In Cloudflare Pages, add custom domain: `blueteamclan.com`
   - Update Namecheap nameservers:
     - Log into Namecheap
     - Go to Domain Management
     - Update nameservers to Cloudflare's:
       - `rowan.ns.cloudflare.com`
       - `xavier.ns.cloudflare.com`

5. **SSL/TLS Certificate**
   - Cloudflare will automatically provision SSL certificate
   - Always Use HTTPS is enabled by default

## Verification

After deployment:
- [ ] Site is live at blueteamclan.com
- [ ] HTTPS is working (lock icon in browser)
- [ ] All pages are loading correctly
- [ ] Images are displaying properly
- [ ] API routes are functional

## Automatic Deployments

Once connected, Cloudflare Pages will automatically:
- Deploy on every push to main branch
- Generate preview deployments for pull requests
- Roll back failed deployments automatically

---

For more information, see [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
