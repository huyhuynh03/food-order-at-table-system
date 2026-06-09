# 🍽️ Yaki — Hệ thống gọi món tại bàn qua mã QR

Yaki là hệ thống gọi món nhà hàng theo thời gian thực, được xây dựng dưới dạng Progressive Web App (PWA) gọn nhẹ. Khách hàng quét mã QR đặt tại bàn để xem thực đơn, đặt món, gọi nhân viên và thanh toán — tất cả ngay trên điện thoại của mình, không cần cài đặt ứng dụng. Nhân viên quản lý mọi thứ qua các bảng điều khiển riêng cho thu ngân, bếp và quản lý, tất cả đều cập nhật trực tiếp.

Phần giao diện được viết bằng HTML/CSS/JavaScript thuần (không dùng framework). Dữ liệu và xác thực chạy trên **Firebase Firestore**, các tích hợp phía máy chủ chạy trên **Cloudflare Workers**, và ứng dụng được host dưới dạng trang tĩnh (tương thích Vercel + GitHub Pages).

> 📄 English version: [`README.md`](../README.md)

---

## ✨ Tính năng

- **Gọi món qua QR theo bàn** — mỗi bàn có URL + token phiên riêng, đảm bảo đơn hàng gắn đúng với bàn tương ứng.
- **Đồng bộ thời gian thực** — đơn hàng, trạng thái món và lời gọi nhân viên được cập nhật tức thì trên mọi bảng điều khiển thông qua Firestore listener.
- **Bốn giao diện theo vai trò** — Khách hàng, Thu ngân, Bếp và Quản lý.
- **Giao diện đa ngôn ngữ** — Tiếng Việt, Tiếng Anh, Tiếng Trung (中文), Tiếng Nhật (日本語) và Tiếng Hàn (한국어).
- **Trợ lý AI gợi ý món** — chatbot dùng Google Gemini gợi ý món ăn theo sở thích của khách (tích hợp sẵn trong trang khách hàng).
- **Thanh toán** — hiển thị VietQR + webhook Casso để tự động xác nhận chuyển khoản ngân hàng, kèm phương thức thẻ/tiền mặt.
- **PWA hoạt động offline** — service worker pre-cache phần app shell và cache ảnh sản phẩm để tải nhanh hơn.
- **Quản lý thực đơn & danh mục** — quản lý có thể thêm/sửa/xóa sản phẩm và danh mục, hỗ trợ dịch tên món bằng AI.

---

## 🏗️ Kiến trúc

```
┌──────────────────────────┐        ┌──────────────────────────┐
│  PWA tĩnh (trình duyệt)   │        │   Cloudflare Worker       │
│  HTML + CSS + JS          │        │   (food-order-at-table)   │
│                           │        │                           │
│  • customer.html          │  HTTPS │  POST /            → Gemini│
│  • cashier.html           ├───────►│  POST /webhook/casso → pay │
│  • kitchen.html           │        └────────────┬──────────────┘
│  • manager.html           │                     │
│  • index.html (trang chủ) │                     ▼
└────────────┬──────────────┘        ┌──────────────────────────┐
             │  Firebase SDK         │   Google Gemini API       │
             ▼                       │   + webhook Casso          │
┌──────────────────────────┐        └──────────────────────────┘
│  Firebase Firestore       │
│  • tables                 │
│  • products               │
│  • settings               │
│  • payments               │
└──────────────────────────┘
```

**Vì sao các file HTML nằm ở web root:** ứng dụng được deploy dưới dạng trang tĩnh trên Vercel và GitHub Pages, phục vụ trực tiếp từ thư mục gốc. Service worker ([`UX/sw.js`](sw.js)) cũng pre-cache các đường dẫn tuyệt đối như `/customer.html`. Việc chuyển các file HTML đầu vào vào thư mục con sẽ phá vỡ cả deployment lẫn cache offline, nên chúng được giữ ở web root, còn CSS và JS được tổ chức gọn trong các thư mục con `css/` và `js/`.

---

## 📁 Cấu trúc dự án

```
order_food_at_table/
├── package.json            # Metadata gốc + script dev/deploy
├── index.js                # Entry placeholder (ứng dụng không dùng)
├── README.md               # README tiếng Anh
└── UX/                     # Web root để deploy
    ├── index.html          # Trang chủ (liên kết tới 4 giao diện)
    ├── customer.html        # Trang gọi món của khách + chatbot AI
    ├── cashier.html         # Bảng điều khiển thu ngân
    ├── kitchen.html         # Màn hình bếp
    ├── manager.html         # Bảng điều khiển quản lý (món/danh mục/bàn)
    ├── seed-products.html   # Công cụ nạp dữ liệu mẫu một lần
    ├── sw.js                # Service worker (app shell + cache ảnh)
    ├── manifest.json        # PWA manifest
    │
    ├── css/                 # Stylesheet đã tách (mỗi trang một file)
    │   ├── index.css
    │   ├── customer.css
    │   ├── cashier.css
    │   ├── kitchen.css
    │   ├── manager.css
    │   └── seed-products.css
    │
    ├── js/                  # Logic từng trang đã tách (mỗi trang một file)
    │   ├── customer.js      # Gọi món, giỏ hàng, chatbot AI, đăng ký SW
    │   ├── cashier.js
    │   ├── kitchen.js
    │   ├── manager.js
    │   └── seed-products.js
    │
    ├── icons/               # Icon PWA (SVG)
    ├── docs/                # Hướng dẫn cài đặt (EN + VI)
    ├── archive/             # Code cũ / không dùng (xem archive/README.md)
    │
    ├── worker/              # Cloudflare Worker (tích hợp phía máy chủ)
    │   ├── src/index.js     # Proxy Gemini + webhook thanh toán Casso
    │   ├── wrangler.toml     # Cấu hình Worker (vars + secrets)
    │   └── package.json
    │
    ├── firebase.json        # Cấu hình Firebase (tham chiếu Firestore rules)
    ├── firestore.rules      # Quy tắc bảo mật Firestore
    └── .firebaserc          # Alias dự án Firebase
```

> **Ghi chú về cấu trúc:** Ban đầu toàn bộ khối `<style>` và `<script>` inline bị nhồi chung vào từng file HTML. Chúng đã được tách ra thành các file tương ứng trong `css/` và `js/` để mỗi trang được chia sạch sẽ thành cấu trúc (HTML), trình bày (CSS) và hành vi (JS). Các thẻ `<script src>` của Firebase SDK vẫn nằm trong `<head>` vì script của trang phụ thuộc vào đối tượng toàn cục `firebase` phải được nạp trước.

---

## 🚀 Bắt đầu

### Yêu cầu

- [Node.js](https://nodejs.org/) 18+ (chỉ dùng để chạy local và công cụ cho Worker)
- Một dự án [Firebase](https://firebase.google.com/) đã bật Firestore
- (Tùy chọn) Tài khoản [Cloudflare](https://www.cloudflare.com/) cho Worker
- (Tùy chọn) API key [Google Gemini](https://ai.google.dev/) cho chatbot AI
- (Tùy chọn) Tài khoản [Casso](https://casso.vn/) để tự động xác nhận thanh toán

### 1. Chạy giao diện ở local

Từ thư mục gốc:

```bash
npm start
```

Lệnh này phục vụ thư mục `UX/` dưới dạng trang tĩnh (qua `npx serve`). Mở URL được in ra trong trình duyệt. Trang chủ có liên kết tới cả bốn giao diện.

### 2. Cấu hình Firebase

Cấu hình Firebase web được nhúng trong script của từng trang (vd [`UX/js/customer.js`](js/customer.js)). Thay bằng cấu hình dự án của bạn:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
};
```

Deploy quy tắc bảo mật Firestore:

```bash
npm run deploy:rules
```

> ⚠️ **Lưu ý bảo mật:** file [`UX/firestore.rules`](firestore.rules) hiện đang mở (cho phép ghi tự do) để dễ thử nghiệm. Hãy siết lại trước khi đưa vào sản xuất.

### 3. Nạp dữ liệu mẫu (tùy chọn)

Mở `seed-products.html` trong trình duyệt và bấm **Seed All Products** để nạp vào Firestore 33 món ăn mẫu theo các danh mục (đồ nướng, lẩu, món phụ, đồ uống, khai vị, tráng miệng).

### 4. Deploy Cloudflare Worker (tùy chọn)

Worker đóng vai trò proxy cho lời gọi Gemini API (giữ API key ở phía máy chủ) và xử lý webhook thanh toán Casso.

```bash
npm run worker:install
npm run worker:dev      # phát triển local
npm run worker:deploy   # deploy lên Cloudflare
```

Cấu hình biến và secret trong [`UX/worker/wrangler.toml`](worker/wrangler.toml):

| Loại   | Tên                       | Mục đích                                  |
|--------|---------------------------|-------------------------------------------|
| var    | `FIREBASE_PROJECT_ID`     | Dự án Firestore để webhook ghi dữ liệu    |
| var    | `FIREBASE_API_KEY`        | Firebase Web API key                      |
| secret | `GEMINI_API_KEY`          | API key Google Gemini                     |
| secret | `CASSO_SECURE_TOKEN`      | Token xác thực webhook Casso              |
| secret | `FIREBASE_ADMIN_EMAIL`    | Email tài khoản dịch vụ để xác thực Firestore |
| secret | `FIREBASE_ADMIN_PASSWORD` | Mật khẩu tài khoản dịch vụ                |

Đặt secret bằng `wrangler secret put <TÊN>` (chạy trong `UX/worker/`).

---

## 📜 NPM Scripts

| Script                  | Mô tả                                                |
|-------------------------|------------------------------------------------------|
| `npm start` / `npm run dev` | Phục vụ thư mục `UX/` ở local qua `npx serve`    |
| `npm run deploy:rules`  | Deploy quy tắc bảo mật Firestore                     |
| `npm run worker:install`| Cài dependency cho Worker                            |
| `npm run worker:dev`    | Chạy Worker ở local bằng Wrangler                    |
| `npm run worker:deploy` | Deploy Worker lên Cloudflare                         |

---

## 🧩 Bốn giao diện

| Trang            | Đối tượng | Chức năng                                                                    |
|------------------|-----------|------------------------------------------------------------------------------|
| `customer.html`  | Thực khách| Xem thực đơn, quản lý giỏ hàng, đặt món, gọi nhân viên, thanh toán, chat với trợ lý AI |
| `cashier.html`   | Thu ngân  | Xem các bàn, xử lý thanh toán, mở/đóng phiên bàn                             |
| `kitchen.html`   | Bếp       | Xem đơn mới, chuyển trạng thái món (chờ → đang nấu → xong)                   |
| `manager.html`   | Quản lý   | Mọi việc thu ngân/bếp làm được + quản lý sản phẩm, danh mục, số lượng bàn    |

Các bảng điều khiển (thu ngân/bếp/quản lý) đều được bảo vệ bằng màn hình đăng nhập và cập nhật theo thời gian thực qua Firestore listener.

---

## 🔌 Các endpoint của Cloudflare Worker

Worker ([`UX/worker/src/index.js`](worker/src/index.js)) cung cấp:

- **`POST /`** — proxy Gemini. Giao diện gửi prompt; Worker chuyển tiếp tới `gemini-2.5-flash` bằng API key giữ ở máy chủ rồi trả về kết quả. Cách này giữ API key Gemini không bị lộ ra phía client.
- **`POST /webhook/casso`** — webhook thanh toán Casso. Khi có chuyển khoản tới, Casso gọi endpoint này; Worker xác thực token, khớp giao dịch với bàn tương ứng và cập nhật collection `tables` và `payments` trong Firestore.

---

## 🗄️ Các collection Firestore

| Collection | Mục đích                                                       |
|------------|----------------------------------------------------------------|
| `tables`   | Trạng thái từng bàn: đơn hiện tại, token phiên, lời gọi nhân viên, trạng thái thanh toán |
| `products` | Món trong thực đơn (tên, giá, danh mục, ảnh)                   |
| `settings` | Cấu hình chung như số lượng bàn và danh mục                    |
| `payments` | Bản ghi thanh toán tạo ra khi giao dịch thành công             |

---

## 🔄 Service Worker & Cập nhật cache

PWA cache tài nguyên qua [`UX/sw.js`](sw.js) theo hai chiến lược:

- **App shell (Network-first):** HTML, CSS, JS, manifest và icon được liệt kê trong `APP_SHELL_FILES`. Khi online, service worker luôn lấy phiên bản mới nhất từ network và làm mới cache; chỉ dùng cache khi offline. Nhờ vậy mỗi lần deploy lại đều được nhận tự động — người dùng có bản mới ngay lần truy cập online kế tiếp.
- **Ảnh sản phẩm (Cache-first):** ảnh từ các domain được phép sẽ phục vụ từ cache cho nhanh, có thể xóa lúc chạy qua message `clearImageCache`.

**Phát hành bản mới:** tất cả cache đều gắn theo một hằng số `SW_VERSION` duy nhất ở đầu file [`UX/sw.js`](sw.js). Mỗi khi đổi tài nguyên được cache, chỉ cần tăng giá trị đó (vd `v3` → `v4`). Sự kiện `activate` sau đó tự xóa mọi cache `yaki-*` cũ, nên người dùng không bao giờ bị kẹt ở bản cũ.

```js
// UX/sw.js
const SW_VERSION = 'v3'; // ← tăng giá trị này mỗi lần phát hành
```

> Khi thêm trang mới (HTML/CSS/JS mới), nhớ thêm đường dẫn của nó vào `APP_SHELL_FILES` để chạy được offline, và tăng `SW_VERSION`.

---

## 🔐 Lưu ý bảo mật

- **Quy tắc Firestore hiện đang mở** để thử nghiệm — hãy giới hạn quyền đọc/ghi theo từng collection trước khi đưa vào sản xuất.
- **API key:** key Gemini đã được proxy đúng cách ở phía máy chủ qua Worker. Cấu hình Firebase Web vốn lộ ra phía client theo thiết kế (điều này bình thường với Firebase), nhưng bảo mật phải được thực thi qua Firestore rules chứ không phải bằng cách giấu config.
- **Token phiên:** phiên của khách dùng token riêng theo từng bàn để chống can thiệp chéo bàn, được kiểm tra khi tải trang.

---

## 📚 Tài liệu bổ sung

- [`UX/docs/SETUP_GUIDE_EN.md`](docs/SETUP_GUIDE_EN.md) — hướng dẫn cài đặt chi tiết (Tiếng Anh)
- [`UX/docs/SETUP_GUIDE_VI.md`](docs/SETUP_GUIDE_VI.md) — hướng dẫn cài đặt chi tiết (Tiếng Việt)
- [`README.md`](../README.md) — tổng quan dự án (Tiếng Anh)
- [`UX/technical_report.md`](technical_report.md) — báo cáo kỹ thuật
- [`UX/archive/README.md`](archive/README.md) — ghi chú về code cũ/không dùng
