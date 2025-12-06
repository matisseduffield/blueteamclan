# CoC API Proxy for Blue Team Clan

Simple Express proxy server with static IP for Clash of Clans API requests.

## Deploy to Railway

1. Go to [Railway.app](https://railway.app) and sign up (free)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect this repository and select the `coc-proxy` folder
4. Railway will auto-detect the Node.js app
5. Get Railway's static outbound IP:
   - In your project, go to Settings → Networking
   - Note the "Static Outbound IP" (you may need to enable it)
6. Create a new CoC API key at https://developer.clashofclans.com with Railway's IP
7. Add environment variable in Railway:
   - Key: `COC_API_KEY`
   - Value: your new CoC API token
8. Deploy!

## Get Your Proxy URL

After deployment, Railway gives you a public URL like:
`https://your-app-name.railway.app`

## Update Your Website

In your Cloudflare Pages environment variables, set:
```
NEXT_PUBLIC_COC_PROXY_URL=https://your-app-name.railway.app
```

Then update `src/app/events/page.tsx` to use:
```javascript
const proxyUrl = process.env.NEXT_PUBLIC_COC_PROXY_URL || '/api/coc';
fetch(`${proxyUrl}?endpoint=${endpoint}`)
```

## Local Testing

```bash
cd coc-proxy
npm install
echo "COC_API_KEY=your_key_here" > .env
npm start
```

Visit http://localhost:3001 to verify it's running.
