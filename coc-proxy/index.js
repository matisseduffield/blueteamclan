import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Cloudflare Pages domain
app.use(cors({
  origin: ['https://blueteamclan.com', 'https://*.blueteamclan.pages.dev', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'CoC API Proxy' });
});

// Get outbound IP (for CoC API whitelisting)
// Get outbound IP (for CoC API whitelisting) at /api/coc/myip
app.get('/api/coc/myip', async (req, res) => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    res.json({ 
      outboundIP: ipData.ip,
      message: 'Use this IP for your CoC API key whitelist'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IP' });
  }
});

// Proxy endpoint for CoC API
app.get('/api/coc', async (req, res) => {
  const endpoint = req.query.endpoint;
  
  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint required' });
  }

  const apiKey = process.env.COC_API_KEY;
  
  if (!apiKey) {
    console.error('COC_API_KEY not found in environment');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Re-encode clan tags
  const encodedEndpoint = endpoint.replace(/#/g, '%23');
  const apiUrl = `https://api.clashofclans.com/v1${encodedEndpoint}`;
  
  console.log('Proxying request to:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    console.log('CoC API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoC API Error:', errorText);
      return res.status(response.status).json({ 
        error: errorText || 'CoC API Error', 
        status: response.status 
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ error: error.message || 'Proxy request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`CoC API Proxy running on port ${PORT}`);
});
