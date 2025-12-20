/**
 * Cloudflare Worker - Gemini API Proxy
 * Securely proxies requests to Google Gemini API
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        try {
            // Get the prompt from request body
            const body = await request.json();

            if (!body.prompt) {
                return new Response(JSON.stringify({ error: 'Missing prompt' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Call Gemini API with secret API key
            const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: body.prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096
                    }
                })
            });

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error('Gemini API error:', errorText);
                return new Response(JSON.stringify({
                    error: 'Gemini API error',
                    status: geminiResponse.status,
                    details: errorText
                }), {
                    status: geminiResponse.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const data = await geminiResponse.json();

            // Debug: log full response structure
            console.log('Gemini response:', JSON.stringify(data));

            // Try multiple paths to extract text (different model versions have different structures)
            let responseText = '';

            // Standard path for most models
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                responseText = data.candidates[0].content.parts[0].text;
            }
            // Alternative: check if there's a modelVersion with thinking or different structure
            else if (data.candidates?.[0]?.content?.parts) {
                // Combine all text parts
                responseText = data.candidates[0].content.parts
                    .filter(part => part.text)
                    .map(part => part.text)
                    .join('\n');
            }
            // Fallback: return raw response for debugging
            else if (data.candidates?.[0]) {
                responseText = JSON.stringify(data.candidates[0]);
            }

            return new Response(JSON.stringify({
                success: true,
                response: responseText,
                debug: !responseText ? data : undefined
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
