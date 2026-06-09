# 📘 Hướng Dẫn Cài Đặt Chi Tiết - Yaki Restaurant Order System

## Mục Lục
1. [Yêu Cầu Hệ Thống](#1-yêu-cầu-hệ-thống)
2. [Cấu Trúc Dự Án](#2-cấu-trúc-dự-án)
3. [Tạo Repo Ảnh Sản Phẩm (Public)](#3-tạo-repo-ảnh-sản-phẩm-public)
4. [Tạo Firebase Project](#4-tạo-firebase-project)
5. [Kết Nối Firebase](#5-kết-nối-firebase)
6. [Lấy Gemini API Key](#6-lấy-gemini-api-key)
7. [Tạo Cloudflare Worker](#7-tạo-cloudflare-worker)
8. [Deploy Ứng Dụng Lên Cloudflare Pages](#8-deploy-ứng-dụng-lên-cloudflare-pages)
9. [Cấu Hình Domain Tùy Chỉnh](#9-cấu-hình-domain-tùy-chỉnh)
10. [Kiểm Tra & Xử Lý Lỗi](#10-kiểm-tra--xử-lý-lỗi)

---

## 1. Yêu Cầu Hệ Thống

### Tài khoản cần có:
- ✅ Tài khoản Google (Gmail)
- ✅ Tài khoản GitHub
- ✅ Tài khoản Cloudflare (đăng ký miễn phí)

### Phần mềm cần cài đặt:
- ✅ Node.js (phiên bản 18 trở lên) - [Tải tại đây](https://nodejs.org)
- ✅ Git - [Tải tại đây](https://git-scm.com)
- ✅ Trình soạn thảo code (VS Code khuyến nghị)

### Kiểm tra cài đặt:
Mở Terminal/Command Prompt và chạy:
```bash
node --version    # Kết quả: v18.x.x hoặc cao hơn
npm --version     # Kết quả: 9.x.x hoặc cao hơn
git --version     # Kết quả: git version 2.x.x
```

---

## 2. Cấu Trúc Dự Án

```
📁 yaki-restaurant/
├── 📁 src/
│   └── 📄 index.js         # Cloudflare Worker (API Proxy)
├── 📄 customer.html        # Giao diện khách hàng đặt món
├── 📄 manager.html         # Giao diện bếp/quản trị
├── 📄 index.html           # Trang chủ (tùy chọn)
├── 📄 sw.js                # Service Worker cho caching
├── 📄 wrangler.toml        # File cấu hình Cloudflare Worker
└── 📄 readme               # Tài liệu dự án
```

### Mô tả các file:
| File | Chức năng |
|------|-----------|
| `customer.html` | Giao diện menu & đặt món cho khách hàng |
| `manager.html` | Bảng điều khiển quản trị cho nhân viên bếp |
| `src/index.js` | Cloudflare Worker proxy API Gemini |
| `wrangler.toml` | Cấu hình cho Cloudflare Worker |
| `sw.js` | Service Worker để cache offline |

---

## 3. Tạo Repo Ảnh Sản Phẩm (Public)

> ⚠️ **Tại sao cần repo riêng cho ảnh?**
> - Repo chính chứa code nên để **Private** (bảo mật)
> - Ảnh cần để **Public** để hiển thị được trên web
> - Tách riêng giúp quản lý dễ hơn

### Bước 3.1: Tạo GitHub Repository cho ảnh
1. Truy cập **https://github.com** và đăng nhập
2. Click **"+"** → **"New repository"**
3. **Repository name**: `restaurant-images` (hoặc tên nhà hàng + images)
4. **Description**: `Product images for restaurant menu`
5. **Visibility**: Chọn **"Public"** ⚠️ (BẮT BUỘC phải public)
6. Tick **"Add a README file"**
7. Click **"Create repository"**

### Bước 3.2: Tạo cấu trúc thư mục
Trong repo vừa tạo, tạo các thư mục:
```
📁 restaurant-images/
├── 📁 products/          # Ảnh món ăn
│   ├── pho-bo.jpg
│   ├── com-tam.jpg
│   └── ...
├── 📁 categories/        # Ảnh danh mục (nếu cần)
└── 📄 README.md
```

**Cách tạo thư mục trên GitHub:**
1. Click **"Add file"** → **"Create new file"**
2. Nhập tên: `products/.gitkeep`
3. Click **"Commit new file"**

### Bước 3.3: Upload ảnh sản phẩm
1. Vào thư mục `products/`
2. Click **"Add file"** → **"Upload files"**
3. Kéo thả ảnh món ăn vào
4. Click **"Commit changes"**

**Yêu cầu ảnh:**
- Định dạng: JPG hoặc PNG
- Kích thước: 400x400 pixels (tối ưu)
- Dung lượng: Dưới 500KB mỗi ảnh
- Tên file: Không dấu, dùng dấu gạch ngang (ví dụ: `pho-bo.jpg`)

### Bước 3.4: Lấy URL ảnh
Sau khi upload, URL ảnh sẽ có dạng:
```
https://raw.githubusercontent.com/YOUR-USERNAME/restaurant-images/main/products/pho-bo.jpg
```

**Cách lấy URL:**
1. Click vào file ảnh trong GitHub
2. Click nút **"Raw"** (góc phải)
3. Copy URL từ thanh địa chỉ

### Bước 3.5: Cập nhật URL trong Firestore
Khi thêm sản phẩm trong `manager.html`, nhập URL ảnh theo format:
```
https://raw.githubusercontent.com/YOUR-USERNAME/restaurant-images/main/products/ten-mon.jpg
```

> 💡 **Mẹo**: Đặt tên file ảnh trùng với ID hoặc tên món để dễ quản lý.

---

## 4. Tạo Firebase Project

### Bước 3.1: Truy cập Firebase Console
1. Mở trình duyệt, truy cập: **https://console.firebase.google.com**
2. Click **"Sign in"** và đăng nhập bằng tài khoản Google
3. Nếu lần đầu sử dụng, đồng ý các điều khoản

### Bước 3.2: Tạo dự án mới
1. Click nút **"Create a project"** (hoặc "Add project")
2. **Project name**: Nhập tên dự án, ví dụ: `nha-hang-yaki`
   > Lưu ý: Tên sẽ trở thành một phần của URL
3. Click **"Continue"**
4. **Google Analytics**: Chọn **"Disable"** (tắt) → Click **"Create project"**
5. Đợi khoảng 30 giây, khi thấy dấu ✓ → Click **"Continue"**

### Bước 3.3: Tạo Firestore Database
1. Trong menu bên trái, click **"Build"** → **"Firestore Database"**
2. Click nút **"Create database"**
3. **Security rules**: Chọn **"Start in test mode"**
   > ⚠️ Test mode cho phép đọc/ghi tự do trong 30 ngày
4. **Location**: Chọn **"asia-southeast1 (Singapore)"**
   > Đây là vị trí gần Việt Nam nhất, giúp app chạy nhanh hơn
5. Click **"Enable"** và đợi database được tạo

### Bước 3.4: Đăng ký Web App
1. Click biểu tượng ⚙️ (bánh răng) cạnh **"Project Overview"**
2. Chọn **"Project settings"**
3. Kéo xuống phần **"Your apps"**
4. Click biểu tượng **`</>`** (Web)
5. **App nickname**: Nhập `Yaki Web App`
6. **KHÔNG** tick "Firebase Hosting"
7. Click **"Register app"**

### Bước 3.5: Lưu Firebase Config
Sau khi đăng ký, bạn sẽ thấy đoạn code:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdef",
  authDomain: "nha-hang-yaki.firebaseapp.com",
  projectId: "nha-hang-yaki",
  storageBucket: "nha-hang-yaki.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**⚠️ QUAN TRỌNG**: Copy và lưu đoạn config này vào file text để dùng sau!

Click **"Continue to console"**

### Bước 3.6: Cấu hình Authentication (Đăng nhập admin)
1. Vào **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Chọn **"Email/Password"**
4. Bật **"Enable"** → Click **"Save"**
5. Vào tab **"Users"** → Click **"Add user"**
6. Nhập:
   - Email: `admin@nhahang.com` (hoặc email của bạn)
   - Password: `matkhau123` (đặt mật khẩu mạnh)
7. Click **"Add user"**

---

## 4. Kết Nối Firebase

### Bước 4.1: Mở file customer.html
Tìm đoạn code (khoảng dòng 1570-1580):
```javascript
const firebaseConfig = {
  apiKey: "...",
  // ... các dòng khác
};
```

Thay thế bằng config của bạn từ Bước 3.5.

### Bước 4.2: Mở file manager.html
Làm tương tự - tìm `firebaseConfig` và thay thế.

### Bước 4.3: Mở file seed-products.html
Làm tương tự - tìm `firebaseConfig` và thay thế.

### Bước 4.4: Tạo dữ liệu mẫu
1. Mở file `seed-products.html` trong trình duyệt (double-click file)
2. Click nút **"🌱 Seed Products"**
3. Đợi thanh progress chạy đến 100%
4. Kiểm tra trong Firebase Console → Firestore → sẽ thấy collection `products`

---

## 5. Lấy Gemini API Key

### Bước 5.1: Truy cập Google AI Studio
1. Mở trình duyệt, truy cập: **https://aistudio.google.com**
2. Đăng nhập bằng tài khoản Google

### Bước 5.2: Tạo API Key
1. Click **"Get API Key"** ở thanh menu bên trái
2. Click **"Create API Key"**
3. Chọn **"Create API key in new project"** hoặc chọn project có sẵn
4. API Key sẽ được tạo, dạng: `AIzaSyC...xyz`
5. Click **"Copy"** để copy API Key

**⚠️ QUAN TRỌNG**: Lưu API Key này vào file text riêng, KHÔNG chia sẻ công khai!

### Bước 5.3: Nâng cấp lên bản Production (Tùy chọn)

> Bản miễn phí giới hạn 60 requests/phút. Nếu nhà hàng đông khách, cần nâng cấp.

1. Truy cập **https://console.cloud.google.com**
2. Chọn project vừa tạo (hoặc tạo mới)
3. Vào **"APIs & Services"** → **"Library"**
4. Tìm **"Generative Language API"** → Click → **"Enable"**
5. Vào **"Navigation Menu"** → **"Billing"**
6. Click **"Link a billing account"**
7. Thêm thẻ tín dụng/debit để thanh toán

**💰 Chi phí tham khảo**:
- Gemini Flash: ~$0.075 / 1 triệu tokens
- Ước tính: $5-20/tháng cho nhà hàng nhỏ

---

## 6. Tạo Cloudflare Worker

### Bước 6.1: Đăng ký Cloudflare
1. Truy cập: **https://dash.cloudflare.com/sign-up**
2. Nhập email và mật khẩu → Click **"Sign up"**
3. Xác nhận email trong hộp thư

### Bước 6.2: Cài đặt Wrangler CLI
Mở Terminal (Mac/Linux) hoặc Command Prompt (Windows):

```bash
# Cài đặt Wrangler (công cụ quản lý Cloudflare Worker)
npm install -g wrangler

# Kiểm tra cài đặt thành công
wrangler --version
```

### Bước 6.3: Đăng nhập Cloudflare từ Terminal
```bash
wrangler login
```
- Trình duyệt sẽ tự động mở
- Click **"Allow"** để cho phép Wrangler truy cập
- Quay lại Terminal, sẽ thấy thông báo thành công

### Bước 6.4: Di chuyển vào thư mục Worker
```bash
# Trên Windows (thay đường dẫn phù hợp)
cd D:\yaki-restaurant\worker

# Trên Mac/Linux
cd /path/to/yaki-restaurant/worker
```

### Bước 6.5: Cài đặt dependencies
```bash
npm install
```

### Bước 6.6: Cấu hình tên Worker
Mở file `worker/wrangler.toml`, chỉnh sửa:
```toml
name = "gemini-proxy-nhahang"   # Đổi tên theo nhà hàng
main = "src/index.js"
compatibility_date = "2024-01-01"
```

### Bước 6.7: Thêm API Key bí mật
```bash
wrangler secret put GEMINI_API_KEY
```
- Terminal sẽ hỏi: `Enter a secret value:`
- **Paste API Key** từ Bước 5.2 (sẽ không hiển thị khi paste)
- Nhấn **Enter**
- Thấy thông báo: `✓ Success!`

### Bước 6.8: Deploy Worker lên Cloudflare
```bash
wrangler deploy
```

Kết quả thành công sẽ hiển thị:
```
Uploaded gemini-proxy-nhahang
Published gemini-proxy-nhahang
  https://gemini-proxy-nhahang.your-subdomain.workers.dev
```

**⚠️ LƯU LẠI URL NÀY!** Ví dụ: `https://gemini-proxy-nhahang.abc123.workers.dev`

### Bước 6.9: Cập nhật URL trong code
Mở file `customer.html`, tìm dòng:
```javascript
const GEMINI_API_URL = 'https://gemini-proxy.yaki-api.workers.dev';
```
Thay thế bằng URL Worker của bạn.

Làm tương tự với file `manager.html`.

---

## 7. Deploy Ứng Dụng Lên Cloudflare Pages

### Bước 7.1: Tạo GitHub Repository
1. Truy cập **https://github.com** và đăng nhập
2. Click **"+"** → **"New repository"**
3. **Repository name**: `yaki-restaurant-app`
4. **Visibility**: Chọn **"Private"** (quan trọng để bảo mật code)
5. Click **"Create repository"**

### Bước 7.2: Push code lên GitHub
Mở Terminal trong thư mục dự án:

```bash
# Khởi tạo Git (nếu chưa có)
git init

# Thêm tất cả file
git add .

# Tạo commit đầu tiên
git commit -m "Initial commit"

# Kết nối với GitHub repo
git remote add origin https://github.com/YOUR-USERNAME/yaki-restaurant-app.git

# Đổi branch thành main
git branch -M main

# Push code lên GitHub
git push -u origin main
```

> Nếu được hỏi username/password, nhập thông tin GitHub của bạn.
> Với password, cần dùng Personal Access Token thay vì mật khẩu thường.

### Bước 7.3: Kết nối Cloudflare Pages
1. Đăng nhập **https://dash.cloudflare.com**
2. Click **"Workers & Pages"** trong menu bên trái
3. Click **"Create application"**
4. Chọn tab **"Pages"**
5. Click **"Connect to Git"**

### Bước 7.4: Authorize GitHub
1. Click **"Connect GitHub"**
2. Đăng nhập GitHub nếu được hỏi
3. Chọn **"Only select repositories"**
4. Chọn repo `yaki-restaurant-app`
5. Click **"Install & Authorize"**

### Bước 7.5: Cấu hình Build
1. **Project name**: `yaki-restaurant` (hoặc tên bạn muốn)
2. **Production branch**: `main`
3. **Framework preset**: Chọn **"None"**
4. **Build command**: **Để trống** (không cần build)
5. **Build output directory**: Nhập **`/`** (slash)
6. Click **"Save and Deploy"**

### Bước 7.6: Đợi Deploy hoàn tất
- Cloudflare sẽ build và deploy (mất 1-2 phút)
- Khi thấy **"Success"**, click **"Continue to project"**
- URL ứng dụng sẽ có dạng: `https://yaki-restaurant.pages.dev`

### Bước 7.7: Kiểm tra ứng dụng
- **Trang khách hàng**: `https://yaki-restaurant.pages.dev/customer.html?table=1`
- **Trang quản trị**: `https://yaki-restaurant.pages.dev/manager.html`

---

## 8. Cấu Hình Domain Tùy Chỉnh

### Bước 8.1: Mua domain (nếu chưa có)
Có thể mua tại:
- **Tên Miền Việt Nam**: inet.vn, matbao.net, pavietnam.vn
- **Quốc tế**: Namecheap, GoDaddy, Google Domains

### Bước 8.2: Thêm domain vào Cloudflare
1. Trong Cloudflare Dashboard, vào project Pages
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Nhập domain: `order.nhahang.com` (hoặc domain của bạn)
5. Click **"Continue"**

### Bước 8.3: Cấu hình DNS
Cloudflare sẽ hiển thị bản ghi DNS cần thêm:
```
Type: CNAME
Name: order
Target: yaki-restaurant.pages.dev
```

1. Đăng nhập vào nhà cung cấp domain
2. Vào phần quản lý DNS
3. Thêm bản ghi CNAME như trên
4. Quay lại Cloudflare, click **"Verify"**

### Bước 8.4: Chờ kích hoạt
- DNS cần 5-30 phút để cập nhật
- Khi thấy **"Active"** trong Cloudflare → Domain đã hoạt động
- SSL tự động được cấp (https)

---

## 9. Kiểm Tra & Xử Lý Lỗi

### Checklist kiểm tra cuối cùng:
- [ ] `customer.html` load được, hiển thị menu đúng
- [ ] Có thể thêm món vào giỏ hàng
- [ ] Đặt món thành công, bếp nhận được đơn
- [ ] `manager.html` đăng nhập được bằng email/password đã tạo
- [ ] AI Chatbot hoạt động (gợi ý món)
- [ ] Đổi ngôn ngữ hiển thị đúng (VI/EN/ZH/JA/KO)

### Lỗi thường gặp:

#### ❌ Lỗi "Firebase: No Firebase App 'default'"
**Nguyên nhân**: Config Firebase sai hoặc chưa thay thế.
**Giải pháp**: Kiểm tra lại `firebaseConfig` trong 3 file HTML.

#### ❌ Lỗi "Failed to fetch" khi dùng AI
**Nguyên nhân**: Worker URL sai hoặc chưa deploy.
**Giải pháp**: 
1. Kiểm tra `GEMINI_API_URL` trong code
2. Test Worker: mở URL Worker trong trình duyệt, phải thấy `{"error":"Method not allowed"}`

#### ❌ Lỗi 401 Unauthorized từ Gemini
**Nguyên nhân**: API Key sai hoặc hết quota.
**Giải pháp**:
1. Tạo lại API Key mới
2. Cập nhật secret: `wrangler secret put GEMINI_API_KEY`
3. Deploy lại: `wrangler deploy`

#### ❌ Trang trắng / không load
**Nguyên nhân**: File không đúng đường dẫn.
**Giải pháp**: Kiểm tra cấu trúc thư mục, đảm bảo file HTML ở root.

#### ❌ Orders không hiển thị realtime
**Nguyên nhân**: Firestore rules hết hạn (30 ngày test mode).
**Giải pháp**: Vào Firestore → Rules → Gia hạn hoặc cấu hình rules.

---

## 📞 Hỗ Trợ Kỹ Thuật

Nếu gặp vấn đề không giải quyết được, liên hệ:
- 📧 Email: [your-email@gmail.com]
- 💬 Zalo: [0xxx-xxx-xxx]
- 📘 Facebook: [facebook.com/your-page]

**Thời gian hỗ trợ**: 9h-18h (Thứ 2 - Thứ 6)

---

*Phiên bản: 1.0 | Cập nhật: Tháng 12/2024*
*© 2024 Yaki Restaurant System. All rights reserved.*
