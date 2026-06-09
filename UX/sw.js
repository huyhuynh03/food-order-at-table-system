/**
 * Service Worker - App Shell + Image Caching
 * Cache app shell (HTML, icons, manifest) để chạy offline-capable
 * Cache ảnh sản phẩm từ link mạng để load nhanh hơn
 */

// ⚙️ Bump CHỈ biến này mỗi lần deploy bản mới để buộc cập nhật cache.
// Cả app-shell cache lẫn image cache đều gắn theo version này, nên đổi 1 dòng
// là toàn bộ cache cũ sẽ tự bị xoá trong sự kiện 'activate'.
const SW_VERSION = 'v4';
const CACHE_NAME = `yaki-image-cache-${SW_VERSION}`;
const APP_SHELL_CACHE = `yaki-app-shell-${SW_VERSION}`;

// App shell files - pre-cache khi install.
// Bao gồm HTML + CSS + JS của từng trang để app chạy được đầy đủ khi offline.
const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/customer.html',
    '/cashier.html',
    '/kitchen.html',
    '/manager.html',
    '/manifest.json',
    '/icons/icon-192.svg',
    '/icons/icon-512.svg',
    // Stylesheets
    '/css/index.css',
    '/css/customer.css',
    '/css/cashier.css',
    '/css/kitchen.css',
    '/css/manager.css',
    // Page scripts
    '/js/customer.js',
    '/js/cashier.js',
    '/js/kitchen.js',
    '/js/manager.js'
];

// Các domain ảnh được phép cache (thêm domain của ảnh sản phẩm vào đây)
const ALLOWED_IMAGE_DOMAINS = [
    'github.com',
    'raw.githubusercontent.com',
    'images.unsplash.com',
    'cdn.pixabay.com',
    'i.imgur.com',
    'res.cloudinary.com',
    'storage.googleapis.com',
    'firebasestorage.googleapis.com',
    'lh3.googleusercontent.com',
    // Thêm domain khác nếu cần
];

// Kiểm tra xem URL có phải là ảnh không
function isImageRequest(request) {
    const url = new URL(request.url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp'];

    // Check destination
    if (request.destination === 'image') {
        return true;
    }

    // Check file extension
    const pathname = url.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.includes(ext));
}

// Kiểm tra domain có được phép cache không
function isAllowedDomain(url) {
    try {
        const urlObj = new URL(url);
        // Luôn cache ảnh local
        if (urlObj.origin === self.location.origin) {
            return true;
        }
        // Kiểm tra domain trong danh sách cho phép
        return ALLOWED_IMAGE_DOMAINS.some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false;
    }
}

// Install event - Pre-cache app shell + kích hoạt Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installed - App shell + Image caching ready');
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then((cache) => {
            console.log('[SW] 📦 Pre-caching app shell');
            return cache.addAll(APP_SHELL_FILES);
        }).catch((err) => {
            console.warn('[SW] App shell pre-cache failed (offline?):', err);
        })
    );
    self.skipWaiting(); // Kích hoạt ngay lập tức
});

// Activate event - Xóa cache cũ nếu có version mới
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
    const validCaches = [CACHE_NAME, APP_SHELL_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter(name => name.startsWith('yaki-') && !validCaches.includes(name))
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Kiểm tra xem request có phải app shell không
function isAppShellRequest(request) {
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return false;
    return APP_SHELL_FILES.some(file => url.pathname === file || url.pathname.endsWith(file));
}

// Fetch event - Intercept requests
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Chỉ xử lý GET requests
    if (request.method !== 'GET') {
        return;
    }

    // App shell: Network-first, fallback to cache (luôn cập nhật mới nhất)
    if (isAppShellRequest(request)) {
        event.respondWith(
            fetch(request).then((networkResponse) => {
                // Cập nhật cache với version mới
                const responseToCache = networkResponse.clone();
                caches.open(APP_SHELL_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // Offline: dùng cache
                return caches.match(request);
            })
        );
        return;
    }

    // Images: Cache-first strategy
    if (!isImageRequest(request)) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Nếu có trong cache, trả về ngay (nhanh!)
            if (cachedResponse) {
                return cachedResponse;
            }

            // Nếu không có trong cache, fetch từ network
            return fetch(request).then((networkResponse) => {
                // Kiểm tra response hợp lệ
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                // Chỉ cache ảnh từ domain được phép
                if (isAllowedDomain(request.url) || request.url.startsWith(self.location.origin)) {
                    // Clone response vì nó chỉ có thể dùng 1 lần
                    const responseToCache = networkResponse.clone();

                    // Lưu vào cache
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }

                return networkResponse;
            }).catch((error) => {
                console.error('[SW] Fetch failed:', error);
                return new Response('', { status: 404 });
            });
        })
    );
});

// Message event - Xử lý lệnh từ main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'clearImageCache') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('[SW] 🗑️ Image cache cleared');
            event.source.postMessage({ action: 'cacheCleared' });
        });
    }

    if (event.data && event.data.action === 'getCacheStats') {
        caches.open(CACHE_NAME).then((cache) => {
            cache.keys().then((keys) => {
                event.source.postMessage({
                    action: 'cacheStats',
                    count: keys.length
                });
            });
        });
    }
});
