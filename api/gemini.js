/**
 * Vercel Serverless Function - AI Chatbot Proxy
 *
 * Endpoint: POST /api/gemini
 * Body: { "prompt": "..." }
 *
 * Gọi tới gateway bên thứ 3 theo chuẩn OpenAI-compatible
 * (/v1/chat/completions). API key được giấu trong Environment
 * Variables của Vercel. Vì chạy cùng domain với web nên không bị
 * các bộ lọc wifi công cộng chặn theo kiểu domain *.workers.dev.
 *
 * Biến môi trường cần cấu hình trên Vercel:
 *   - AI_API_KEY    : API key của provider (bắt buộc)
 *   - AI_BASE_URL   : Base URL của provider, vd: https://danglamgiau.com/v1
 *                     (mặc định lấy giá trị dưới đây)
 *   - AI_MODEL      : Tên model, vd: grok-code-free
 *                     (mặc định lấy giá trị dưới đây)
 */

const DEFAULT_BASE_URL = 'https://danglamgiau.com/v1';
const DEFAULT_MODEL = 'grok-code-free';

// Cho phép function chạy tới 60s (provider có thể mất ~25s mới trả lời).
// Mặc định gói Hobby chỉ 10s nên sẽ bị timeout -> 500.
export const config = {
    maxDuration: 60
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.AI_API_KEY;
        if (!apiKey) {
            console.error('Missing AI_API_KEY env var');
            return res.status(500).json({ error: 'Server not configured' });
        }

        const baseUrl = (process.env.AI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
        const model = process.env.AI_MODEL || DEFAULT_MODEL;

        // Vercel tự parse JSON body khi Content-Type là application/json,
        // nhưng vẫn phòng trường hợp body là string.
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch {
                body = {};
            }
        }

        const prompt = body?.prompt;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4096
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error('AI provider error:', errorText);
            return res.status(aiResponse.status).json({
                error: 'AI provider error',
                status: aiResponse.status,
                details: errorText
            });
        }

        const data = await aiResponse.json();

        // Chuẩn OpenAI: choices[0].message.content
        let responseText = '';
        const message = data.choices?.[0]?.message;
        if (typeof message?.content === 'string') {
            responseText = message.content;
        } else if (Array.isArray(message?.content)) {
            // Một số provider trả content dạng mảng các phần
            responseText = message.content
                .map((part) => (typeof part === 'string' ? part : part?.text || ''))
                .join('');
        } else if (typeof data.choices?.[0]?.text === 'string') {
            // Fallback cho endpoint kiểu completions cũ
            responseText = data.choices[0].text;
        }

        // Model dạng reasoning (vd grok-code-free) đôi khi trả lời rỗng ở
        // content nhưng đặt nội dung trong reasoning_content. Lấy tạm khi
        // content trống để tránh trả về chuỗi rỗng.
        if (!responseText) {
            const reasoning = message?.reasoning_content || message?.reasoning;
            if (typeof reasoning === 'string') {
                responseText = reasoning;
            }
        }

        return res.status(200).json({
            success: true,
            response: responseText,
            debug: !responseText ? data : undefined
        });
    } catch (error) {
        console.error('AI proxy error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
