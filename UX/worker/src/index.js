/**
 * Cloudflare Worker - Gemini API Proxy + Casso Webhook Handler
 * 
 * Routes:
 *   POST /                -> Gemini AI Proxy (chatbot)
 *   POST /webhook/casso   -> Casso payment webhook
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const DELETE_FIELD = Symbol('DELETE_FIELD');

let cachedFirestoreAuth = {
    token: null,
    expiresAt: 0
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

// ======================== ROUTER ========================

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // Route: Casso Webhook
        if (path === '/webhook/casso' && request.method === 'POST') {
            return handleCassoWebhook(request, env);
        }

        // Route fallback: if Casso is accidentally pointed to the worker root URL,
        // still treat it as a webhook instead of the Gemini endpoint.
        if (request.method === 'POST' && await isLikelyCassoWebhook(request)) {
            return handleCassoWebhook(request, env);
        }

        // Route: Gemini Proxy (default)
        if (request.method === 'POST') {
            return handleGeminiProxy(request, env);
        }

        // Method not allowed
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }
};

// ======================== GEMINI PROXY ========================

async function handleGeminiProxy(request, env) {
    try {
        const body = await request.json();

        if (!body.prompt) {
            return jsonResponse({ error: 'Missing prompt' }, 400);
        }

        // Call Gemini API with secret API key
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: body.prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096
                }
            })
        });

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error('Gemini API error:', errorText);
            return jsonResponse({
                error: 'Gemini API error',
                status: geminiResponse.status,
                details: errorText
            }, geminiResponse.status);
        }

        const data = await geminiResponse.json();
        console.log('Gemini response:', JSON.stringify(data));

        let responseText = '';

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            responseText = data.candidates[0].content.parts[0].text;
        } else if (data.candidates?.[0]?.content?.parts) {
            responseText = data.candidates[0].content.parts
                .filter(part => part.text)
                .map(part => part.text)
                .join('\n');
        } else if (data.candidates?.[0]) {
            responseText = JSON.stringify(data.candidates[0]);
        }

        return jsonResponse({
            success: true,
            response: responseText,
            debug: !responseText ? data : undefined
        });

    } catch (error) {
        console.error('Gemini proxy error:', error);
        return jsonResponse({ error: 'Internal server error', message: error.message }, 500);
    }
}

// ======================== CASSO WEBHOOK ========================

async function handleCassoWebhook(request, env) {
    try {
        // DEBUG MODE: Capture all headers to find out what Casso sends
        const allHeaders = {};
        for (const [key, value] of request.headers.entries()) {
            allHeaders[key] = value;
        }
        console.log('Casso webhook headers:', JSON.stringify(allHeaders));

        // 1. Verify Secure Token (check multiple possible header names from Casso)
        const token = normalizeWebhookToken(
            request.headers.get('Secure-Token') 
            || request.headers.get('secure-token')
            || request.headers.get('X-Secure-Token')
            || request.headers.get('x-secure-token')
            || request.headers.get('secure_token')
            || request.headers.get('Authorization')
            || request.headers.get('authorization')
        );
        const expectedToken = normalizeWebhookToken(env.CASSO_SECURE_TOKEN);

        console.log('Token check - Received:', JSON.stringify(token), 'Expected:', JSON.stringify(expectedToken));

        // DEBUG: If token doesn't match, return the debug info in the response
        // so we can see what Casso actually sent
        if (!expectedToken || token !== expectedToken) {
            console.error('Casso webhook: Invalid token. Received:', token, '| Expected:', expectedToken);
            return jsonResponse({ 
                success: false,
                debug: {
                    message: 'Token mismatch - showing debug info',
                    receivedHeaders: allHeaders,
                    tokenFromHeaders: token,
                    expectedToken: expectedToken ? '***set***' : '***not set***'
                }
            }, 200); // Return 200 so Casso shows the full response
        }

        // 2. Parse request body
        const body = await request.json();
        console.log('Casso webhook received:', JSON.stringify(body));

        const transactions = extractCassoTransactions(body);

        if (body.error !== undefined && body.error !== 0 && transactions.length === 0) {
            return jsonResponse({ success: true, message: 'No transactions to process' });
        }

        if (transactions.length === 0) {
            return jsonResponse({ success: true, message: 'No transactions to process' });
        }

        const results = [];

        // 3. Process each transaction
        for (const transaction of transactions) {
            const description = String(
                transaction.description
                || transaction.content
                || transaction.memo
                || transaction.remark
                || ''
            ).trim();
            const amount = Number(transaction.amount ?? transaction.creditAmount ?? transaction.value ?? 0);
            const tid = transaction.tid || transaction.id || transaction.reference || null;
            const when = transaction.when || transaction.transactionDate || transaction.paidAt || new Date().toISOString();

            if (!description) continue;
            if (!Number.isFinite(amount) || amount <= 0) {
                console.log(`Casso: Skip non-incoming transaction ${tid || 'unknown'} with amount ${amount}`);
                results.push({ tid, status: 'skipped', reason: 'amount must be positive' });
                continue;
            }

            // 4. Extract table number from description
            // Patterns: "YAKI BAN 5", "YAKI BAN5", "BAN 5", "BAN5"  
            const tableMatch = description.toUpperCase().match(/(?:YAKI\s*)?BAN\s*(\d+)/);

            if (!tableMatch) {
                console.log(`Casso: No table found in description: "${description}"`);
                results.push({ tid, status: 'skipped', reason: 'no table number found' });
                continue;
            }

            const tableNumber = parseInt(tableMatch[1]);
            const tableDocId = `table_${tableNumber}`;
            console.log(`Casso: Processing payment for table ${tableNumber}, amount: ${amount}, tid: ${tid}`);

            try {
                // 5. Clear table orders via Firestore REST API
                await firestoreUpdate(env, `tables/${tableDocId}`, {
                    orders: [],
                    total: 0,
                    lastUpdated: new Date().toISOString(),
                    sessionToken: DELETE_FIELD,
                    sessionCreatedAt: DELETE_FIELD,
                    lastPayment: {
                        method: 'bank_transfer',
                        amount: amount,
                        tid: tid,
                        description: description,
                        paidAt: when || new Date().toISOString()
                    }
                });

                // 6. Save payment record
                await firestoreCreate(env, 'payments', {
                    tableId: tableNumber,
                    tableDocId: tableDocId,
                    amount: amount,
                    tid: String(tid || ''),
                    description: description,
                    method: 'bank_transfer',
                    provider: 'casso',
                    paidAt: when || new Date().toISOString(),
                    processedAt: new Date().toISOString()
                });

                results.push({ tid, tableNumber, status: 'success' });
                console.log(`Casso: Table ${tableNumber} cleared and payment recorded.`);

            } catch (firestoreError) {
                console.error(`Casso: Firestore error for table ${tableNumber}:`, firestoreError);
                results.push({ tid, tableNumber, status: 'error', message: firestoreError.message });
            }
        }

        return jsonResponse({ success: true, processed: results });

    } catch (error) {
        console.error('Casso webhook error:', error);
        return jsonResponse({ error: 'Internal server error', message: error.message }, 500);
    }
}

async function isLikelyCassoWebhook(request) {
    const tokenHeader = normalizeWebhookToken(
        request.headers.get('Secure-Token')
        || request.headers.get('secure-token')
        || request.headers.get('X-Secure-Token')
        || request.headers.get('x-secure-token')
        || request.headers.get('secure_token')
        || request.headers.get('Authorization')
        || request.headers.get('authorization')
    );

    if (tokenHeader) {
        return true;
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return false;
    }

    try {
        const body = await request.clone().json();
        if (Array.isArray(body?.data) || Array.isArray(body?.transactions)) {
            return true;
        }
        if (body?.data && Array.isArray(body.data?.records)) {
            return true;
        }
        if (body?.data && typeof body.data === 'object' && (body.data.description || body.data.content)) {
            return true;
        }
    } catch (error) {
        console.log('Casso detection skipped: request body is not valid JSON');
    }

    return false;
}

function normalizeWebhookToken(value) {
    if (!value) {
        return null;
    }

    return String(value).replace(/^Bearer\s+/i, '').trim();
}

function extractCassoTransactions(body) {
    if (!body || typeof body !== 'object') {
        return [];
    }

    if (Array.isArray(body.data)) {
        return body.data;
    }

    if (Array.isArray(body.transactions)) {
        return body.transactions;
    }

    if (body.data && Array.isArray(body.data.records)) {
        return body.data.records;
    }

    if (body.data && typeof body.data === 'object' && body.data.description) {
        return [body.data];
    }

    return [];
}

// ======================== FIRESTORE REST API ========================

/**
 * Update (PATCH) a Firestore document
 */
async function firestoreUpdate(env, docPath, data) {
    const projectId = env.FIREBASE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}`;
    const idToken = await getFirestoreIdToken(env);

    const firestoreBody = toFirestoreFields(data);
    const updateMask = Object.keys(data).map(k => `updateMask.fieldPaths=${k}`).join('&');

    console.log(`Firestore PATCH: ${docPath}, fields: ${Object.keys(data).join(', ')}`);

    const response = await fetch(`${url}?${updateMask}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ fields: firestoreBody })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error(`Firestore PATCH failed: ${response.status} - ${errText}`);
        throw new Error(`Firestore PATCH ${docPath} failed (${response.status}): ${errText}`);
    }

    console.log(`Firestore PATCH ${docPath}: SUCCESS`);
    return response.json();
}

/**
 * Create a new Firestore document in a collection
 */
async function firestoreCreate(env, collectionPath, data) {
    const projectId = env.FIREBASE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionPath}`;
    const idToken = await getFirestoreIdToken(env);

    console.log(`Firestore POST: ${collectionPath}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ fields: toFirestoreFields(data) })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error(`Firestore POST failed: ${response.status} - ${errText}`);
        throw new Error(`Firestore POST ${collectionPath} failed (${response.status}): ${errText}`);
    }

    console.log(`Firestore POST ${collectionPath}: SUCCESS`);
    return response.json();
}

/**
 * Convert a plain JS object to Firestore field format
 */
function toFirestoreFields(obj) {
    const fields = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value === DELETE_FIELD) {
            continue;
        }
        fields[key] = toFirestoreValue(value);
    }
    return fields;
}

function toFirestoreValue(value) {
    if (value === null || value === undefined) {
        return { nullValue: null };
    }
    if (typeof value === 'string') {
        return { stringValue: value };
    }
    if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return { integerValue: String(value) };
        }
        return { doubleValue: value };
    }
    if (typeof value === 'boolean') {
        return { booleanValue: value };
    }
    if (Array.isArray(value)) {
        return {
            arrayValue: {
                values: value.map(v => toFirestoreValue(v))
            }
        };
    }
    if (typeof value === 'object') {
        return {
            mapValue: {
                fields: toFirestoreFields(value)
            }
        };
    }
    return { stringValue: String(value) };
}

async function getFirestoreIdToken(env) {
    const now = Date.now();

    if (cachedFirestoreAuth.token && now < cachedFirestoreAuth.expiresAt - 60_000) {
        return cachedFirestoreAuth.token;
    }

    if (!env.FIREBASE_API_KEY || !env.FIREBASE_ADMIN_EMAIL || !env.FIREBASE_ADMIN_PASSWORD) {
        throw new Error('Missing Firebase Worker secrets: FIREBASE_API_KEY, FIREBASE_ADMIN_EMAIL, FIREBASE_ADMIN_PASSWORD');
    }

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: env.FIREBASE_ADMIN_EMAIL,
            password: env.FIREBASE_ADMIN_PASSWORD,
            returnSecureToken: true
        })
    });

    const data = await response.json();

    if (!response.ok || !data.idToken) {
        console.error('Firebase auth for Worker failed:', JSON.stringify(data));
        throw new Error(`Worker Firebase auth failed (${response.status})`);
    }

    const expiresInMs = Number(data.expiresIn || 3600) * 1000;
    cachedFirestoreAuth = {
        token: data.idToken,
        expiresAt: now + expiresInMs
    };

    return data.idToken;
}

// ======================== HELPERS ========================

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
