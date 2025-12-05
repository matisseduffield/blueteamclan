# Cloudflare Pages Configuration for Blue Team Clan Website

This configuration enables deployment to Cloudflare Pages.

## Deployment Steps

### ✅ Completed Steps

1. **Push to GitHub** ✓
   ```bash
   git add .
   git commit -m "Initial commit: Blue Team Clan website"
   git push origin main
   ```

2. **Connect to Cloudflare Pages** ✓
   - Connected blueteamclan repository
   - Configured build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `out`
   - Site now live at: https://blueteamclan.pages.dev

### 📋 Remaining Steps

3. **Setup Custom Domain (FREE - No paid subscription needed!)**
   
   #### Step 3a: Add custom domain to Cloudflare Pages
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Select your blueteamclan project
   - Go to **Settings** → **Custom domains**
   - Click **"Add custom domain"**
   - Enter: `blueteamclan.com`
   - Cloudflare will show you nameserver instructions

   #### Step 3b: Update Namecheap Nameservers
   - Log into [Namecheap](https://www.namecheap.com/)
   - Go to **Domain List** → Select blueteamclan.com
   - Click **Manage**
   - Go to **Nameservers** tab
   - Change from "Namecheap BasicDNS" to **Custom DNS**
   - Replace with Cloudflare nameservers:
     - `rowan.ns.cloudflare.com`
     - `xavier.ns.cloudflare.com`
   - **Save changes** (can take 24-48 hours to fully propagate)

   #### Step 3c: Setup www redirect (No paid plan required!)
   - In Cloudflare dashboard, go to **Rules** → **Page Rules** (Free tier)
   - OR go to **Bulk redirects** (Free tier)
   
   **Option A: Using Page Rules (Free)**
   - Click **Create Page Rule**
   - URL pattern: `www.blueteamclan.com/*`
   - Select action: **Forwarding URL**
   - Status code: `301 - Permanent Redirect`
   - Redirect to: `https://blueteamclan.com$1`
   - Save and deploy

   **Option B: Using Bulk Redirects (Free)**
   - Go to **Rules** → **Bulk redirects**
   - Click **Create** → **Create via list**
   - Add redirect rule:
     ```
     Source URL: www.blueteamclan.com
     Target URL: https://blueteamclan.com
     Status code: 301
     ```
   - Deploy

4. **Environment Variables** (Optional)
   - In Cloudflare Pages settings, add any environment variables from `.env.example`
   - For free tier, most variables aren't needed yet

5. **SSL/TLS Certificate** ✓
   - Cloudflare automatically provisions SSL certificate
   - HTTPS is enabled by default
   - "Always Use HTTPS" is enabled

## Verification

After completing all steps:
- [ ] Site is live at https://blueteamclan.pages.dev
- [ ] Custom domain https://blueteamclan.com works
- [ ] www.blueteamclan.com redirects to https://blueteamclan.com
- [ ] HTTPS is working (lock icon in browser)
- [ ] All pages are loading correctly
- [ ] Images are displaying properly

## Automatic Deployments

Once connected, Cloudflare Pages will automatically:
- Deploy on every push to main branch ✓ (Already enabled!)
- Generate preview deployments for pull requests
- Roll back failed deployments automatically

## Troubleshooting

**Domain not connecting?**
- Nameserver changes can take 24-48 hours to propagate
- Check status at https://www.whatsmydns.net/ (enter blueteamclan.com)
- Keep checking back in a few hours

**www still not redirecting?**
- Ensure you created the redirect rule in Cloudflare
- Check that the rule is deployed (not just saved)
- Clear browser cache and try again

**Site shows Cloudflare error page?**
- Check that your Cloudflare account has the domain
- Verify the nameservers are correct in Namecheap
- Wait for DNS propagation (up to 48 hours)

---

For more information, see [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

