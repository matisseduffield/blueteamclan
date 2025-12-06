import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });
  }

  const apiKey = process.env.COC_API_KEY;
  
  if (!apiKey) {
    console.error('COC_API_KEY not found in environment');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  // Re-encode the endpoint since searchParams.get() auto-decodes it
  // Replace # with %23 to properly encode clan tags
  endpoint = endpoint.replace(/#/g, '%23');
  
  const apiUrl = `https://api.clashofclans.com/v1${endpoint}`;
  console.log('Fetching:', apiUrl);

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
      console.error('CoC API Error Response:', errorText);
      
      // Return the actual status from CoC API (like 404 for not in war)
      return NextResponse.json(
        { error: errorText || 'CoC API Error', status: response.status }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    
  } catch (error: any) {
    console.error('CoC API Fetch Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch from CoC API' }, { status: 500 });
  }
}
