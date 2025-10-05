export default async function handler(request, response) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return response.status(200).end();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, temperature, max_tokens, stream } = request.body;

    // Forward request to DeepSeek API
    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.sk-6c34ba95f6e64089858faf91711b9228}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 4000,
        stream: stream || false
      })
    });

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text();
      throw new Error(`DeepSeek API error: ${deepSeekResponse.status} - ${errorText}`);
    }

    const data = await deepSeekResponse.json();

    // Set CORS headers for response
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    
    return response.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
}
