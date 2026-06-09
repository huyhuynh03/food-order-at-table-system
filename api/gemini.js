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
// gpt-4o là model được tài liệu HOCAI dùng làm ví dụ -> chắc chắn tồn tại
// và phản hồi nhanh. Có thể đổi qua AI_MODEL trên Vercel nếu cần.
const DEFAULT_MODEL = 'gpt-4o';

// Giới hạn thời gian chờ provider (ms). Phải nhỏ hơn maxDuration để ta
// chủ động trả lỗi rõ ràng thay vì để Vercel cắt -> 500 mơ hồ.
const PROVIDER_TIMEOUT_MS = 45000;

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

        const endpoint = `${baseUrl}/chat/completions`;

        // AbortController để chủ động hủy request nếu provider quá chậm.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

        let aiResponse;
        try {
            aiResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2048,
                    // Yêu cầu provider trả JSON 1 lần, KHÔNG stream. Một số
                    // gateway mặc định trả SSE (data: {...}) khiến JSON.parse
                    // thất bại -> 500.
                    stream: false
                }),
                signal: controller.signal
            });
        } catch (fetchError) {
            // Lỗi tầng mạng hoặc timeout: không resolve được DNS, host từ chối
            // kết nối, hoặc provider trả lời quá chậm bị abort. Đây là trường
            // hợp dễ xảy ra nhất nếu AI_BASE_URL/AI_MODEL sai hoặc provider
            // không truy cập được từ Vercel.
            const isTimeout = fetchError.name === 'AbortError';
            console.error('Cannot reach AI provider:', endpoint, fetchError);
            return res.status(isTimeout ? 504 : 502).json({
                error: isTimeout ? 'AI provider timeout' : 'Cannot reach AI provider',
                endpoint: endpoint,
                model: model,
                message: fetchError.message
            });
        } finally {
            clearTimeout(timeoutId);
        }

        // Luôn đọc body dạng text trước rồi mới parse, tránh để
        // aiResponse.json() ném lỗi khi provider trả body rỗng / không phải
        // JSON (lúc đó handler rơi vào catch và trả 500 mơ hồ).
        const rawText = await aiResponse.text();

        if (!aiResponse.ok) {
            console.error('AI provider error:', aiResponse.status, rawText);
            return res.status(aiResponse.status).json({
                error: 'AI provider error',
                status: aiResponse.status,
                details: rawText
            });
        }

        let data = null;
        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch (parseError) {
            // Provider trả SSE (text/event-stream) dù đã xin stream:false.
            // Thử gom các dòng "data: {...}" thành nội dung hoàn chỉnh.
            const sseText = parseSSE(rawText);
            if (sseText) {
                return res.status(200).json({
                    success: true,
                    response: sseText,
                    transport: 'sse'
                });
            }
            console.error('AI response not JSON:', rawText);
            // Không throw nữa: trả nguyên văn để client/dev còn thấy provider
            // thực sự gửi gì về (có thể là HTML lỗi, hoặc rỗng).
            return res.status(200).json({
                success: false,
                response: '',
                error: 'AI response not JSON',
                raw: rawText.slice(0, 2000)
            });
        }

        // Chuẩn OpenAI: choices[0].message.content
        let responseText = '';
        const choice = data?.choices?.[0];
        const message = choice?.message;
        if (typeof message?.content === 'string') {
            responseText = message.content;
        } else if (Array.isArray(message?.content)) {
            // Một số provider trả content dạng mảng các phần
            responseText = message.content
                .map((part) => (typeof part === 'string' ? part : part?.text || ''))
                .join('');
        } else if (typeof choice?.text === 'string') {
            // Fallback cho endpoint kiểu completions cũ
            responseText = choice.text;
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
        
        /**
         * Gom một chuỗi SSE (Server-Sent Events) kiểu OpenAI streaming thành text
         * hoàn chỉnh.
         *
         * Mỗi chunk có dạng:  data: {"choices":[{"delta":{"content":"..."}}]}
         * Dòng kết thúc:      data: [DONE]
         *
         * Hàm sẽ duyệt từng dòng, bỏ qua "[DONE]" và các dòng không parse được,
         * rồi nối nội dung từ delta.content (streaming) hoặc message.content
         * (trường hợp gateway gói cả message trong một chunk).
         *
         * @param {string} rawText  Body thô do provider trả về.
         * @returns {string}        Nội dung đã ghép; chuỗi rỗng nếu không lấy được gì.
         */
        function parseSSE(rawText) {
            if (!rawText || typeof rawText !== 'string') {
                return '';
            }
        
            let out = '';
            const lines = rawText.split(/\r?\n/);
        
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) {
                    continue;
                }
        
                const payload = trimmed.slice(5).trim(); // bỏ tiền tố "data:"
                if (!payload || payload === '[DONE]') {
                    continue;
                }
        
                let chunk;
                try {
                    chunk = JSON.parse(payload);
                } catch {
                    // Chunk lỗi/không đầy đủ -> bỏ qua, tiếp tục các chunk khác.
                    continue;
                }
        
                const choice = chunk?.choices?.[0];
                if (!choice) {
                    continue;
                }
        
                // Streaming: nội dung nằm ở delta.content.
                const delta = choice.delta;
                if (typeof delta?.content === 'string') {
                    out += delta.content;
                } else if (Array.isArray(delta?.content)) {
                    out += delta.content
                        .map((part) => (typeof part === 'string' ? part : part?.text || ''))
                        .join('');
                } else if (typeof choice.message?.content === 'string') {
                    // Một số gateway nhồi cả message hoàn chỉnh vào một chunk SSE.
                    out += choice.message.content;
                } else if (typeof choice.text === 'string') {
                    out += choice.text;
                }
            }
        
            return out;
        }

        return res.status(200).json({
            success: !!responseText,
            response: responseText,
            // Khi rỗng, đính kèm finish_reason + toàn bộ data để chẩn đoán
            // (vd reasoning model bị cắt vì hết token -> finish_reason=length).
            finishReason: choice?.finish_reason,
            debug: !responseText ? data : undefined
        });
    } catch (error) {
        console.error('AI proxy error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
