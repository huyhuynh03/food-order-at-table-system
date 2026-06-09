# 📘 Setup Guide - Yaki Restaurant Order System

## Table of Contents
1. [System Requirements](#1-system-requirements)
2. [Project Structure](#2-project-structure)
3. [Create Product Images Repo (Public)](#3-create-product-images-repo-public)
4. [Create Firebase Project](#4-create-firebase-project)
5. [Connect Firebase](#5-connect-firebase)
6. [Get Gemini API Key](#6-get-gemini-api-key)
7. [Create Cloudflare Worker](#7-create-cloudflare-worker)
8. [Deploy Application to Cloudflare Pages](#8-deploy-application-to-cloudflare-pages)
9. [Configure Custom Domain](#9-configure-custom-domain)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. System Requirements

### Required Accounts:
- ✅ Google Account (Gmail)
- ✅ GitHub Account
- ✅ Cloudflare Account (free registration)

### Required Software:
- ✅ Node.js (version 18 or higher) - [Download here](https://nodejs.org)
- ✅ Git - [Download here](https://git-scm.com)
- ✅ Code editor (VS Code recommended)

### Verify Installation:
Open Terminal (Mac/Linux) or Command Prompt (Windows):
```bash
node --version    # Expected: v18.x.x or higher
npm --version     # Expected: 9.x.x or higher
git --version     # Expected: git version 2.x.x
```

---

## 2. Project Structure

```
📁 yaki-restaurant/
├── 📁 src/
│   └── 📄 index.js         # Cloudflare Worker (API Proxy)
├── 📄 customer.html        # Customer ordering interface
├── 📄 manager.html         # Kitchen/Admin dashboard
├── 📄 index.html           # Landing page (optional)
├── 📄 sw.js                # Service Worker for caching
├── 📄 wrangler.toml        # Cloudflare Worker configuration
└── 📄 readme               # Project documentation
```

### File Descriptions:
| File | Purpose |
|------|---------|
| `customer.html` | Customer-facing menu & ordering page |
| `manager.html` | Admin panel for kitchen staff |
| `src/index.js` | Cloudflare Worker that proxies Gemini API |
| `wrangler.toml` | Configuration for Cloudflare Worker |
| `sw.js` | Service Worker for offline caching |

---

## 3. Create Product Images Repo (Public)

> ⚠️ **Why separate repo for images?**
> - Main repo with code should be **Private** (security)
> - Images need to be **Public** to display on web
> - Separation makes management easier

### Step 3.1: Create GitHub Repository for Images
1. Go to **https://github.com** and login
2. Click **"+"** → **"New repository"**
3. **Repository name**: `restaurant-images` (or restaurant-name-images)
4. **Description**: `Product images for restaurant menu`
5. **Visibility**: Select **"Public"** ⚠️ (MUST be public)
6. Check **"Add a README file"**
7. Click **"Create repository"**

### Step 3.2: Create Folder Structure
In the newly created repo, create folders:
```
📁 restaurant-images/
├── 📁 products/          # Food item images
│   ├── pho-bo.jpg
│   ├── grilled-beef.jpg
│   └── ...
├── 📁 categories/        # Category images (optional)
└── 📄 README.md
```

**How to create folder on GitHub:**
1. Click **"Add file"** → **"Create new file"**
2. Enter name: `products/.gitkeep`
3. Click **"Commit new file"**

### Step 3.3: Upload Product Images
1. Navigate to `products/` folder
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop your food images
4. Click **"Commit changes"**

**Image Requirements:**
- Format: JPG or PNG
- Size: 400x400 pixels (recommended)
- File size: Under 500KB each
- File name: No spaces, use hyphens (e.g., `grilled-beef.jpg`)

### Step 3.4: Get Image URL
After upload, image URL will be:
```
https://raw.githubusercontent.com/YOUR-USERNAME/restaurant-images/main/products/grilled-beef.jpg
```

**How to get URL:**
1. Click on the image file in GitHub
2. Click **"Raw"** button (top right)
3. Copy URL from address bar

### Step 3.5: Update URL in Firestore
When adding products in `manager.html`, enter image URL in format:
```
https://raw.githubusercontent.com/YOUR-USERNAME/restaurant-images/main/products/item-name.jpg
```

> 💡 **Tip**: Name image files to match product IDs or names for easy management.

---

## 4. Create Firebase Project

### Step 3.1: Access Firebase Console
1. Open browser, go to: **https://console.firebase.google.com**
2. Click **"Sign in"** with your Google account
3. Accept terms if first time

### Step 3.2: Create New Project
1. Click **"Create a project"** (or "Add project")
2. **Project name**: Enter name, e.g., `yaki-restaurant`
   > Note: Name becomes part of the URL
3. Click **"Continue"**
4. **Google Analytics**: Select **"Disable"** → Click **"Create project"**
5. Wait ~30 seconds, when you see ✓ → Click **"Continue"**

### Step 3.3: Create Firestore Database
1. In left menu, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. **Security rules**: Select **"Start in test mode"**
   > ⚠️ Test mode allows free read/write for 30 days
4. **Location**: Select **"asia-southeast1 (Singapore)"**
   > Closest to Vietnam for best performance
5. Click **"Enable"** and wait for database creation

### Step 3.4: Register Web App
1. Click ⚙️ (gear icon) next to **"Project Overview"**
2. Select **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click **`</>`** (Web icon)
5. **App nickname**: Enter `Yaki Web App`
6. **DO NOT** check "Firebase Hosting"
7. Click **"Register app"**

### Step 3.5: Save Firebase Config
After registration, you'll see:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdef",
  authDomain: "yaki-restaurant.firebaseapp.com",
  projectId: "yaki-restaurant",
  storageBucket: "yaki-restaurant.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**⚠️ IMPORTANT**: Copy and save this config to a text file!

Click **"Continue to console"**

### Step 3.6: Configure Authentication (Admin Login)
1. Go to **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Select **"Email/Password"**
4. Enable it → Click **"Save"**
5. Go to **"Users"** tab → Click **"Add user"**
6. Enter:
   - Email: `admin@restaurant.com` (or your email)
   - Password: `securepassword123` (use strong password)
7. Click **"Add user"**

---

## 4. Connect Firebase

### Step 4.1: Update customer.html
Find this code (around line 1570-1580):
```javascript
const firebaseConfig = {
  apiKey: "...",
  // ... other lines
};
```
Replace with your config from Step 3.5.

### Step 4.2: Update manager.html
Same process - find `firebaseConfig` and replace.

### Step 4.3: Initialize Sample Data
Open `manager.html` in browser, login, and add sample products through the admin interface.

---

## 5. Get Gemini API Key

### Step 5.1: Access Google AI Studio
1. Open browser, go to: **https://aistudio.google.com**
2. Sign in with Google account

### Step 5.2: Create API Key
1. Click **"Get API Key"** in left menu
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** or choose existing project
4. API Key will be generated: `AIzaSyC...xyz`
5. Click **"Copy"**

**⚠️ IMPORTANT**: Save this API Key in a secure location. NEVER share publicly!

### Step 5.3: Upgrade to Production (Optional)

> Free tier limits: 60 requests/minute. For busy restaurants, upgrade is recommended.

1. Go to **https://console.cloud.google.com**
2. Select or create project
3. Go to **"APIs & Services"** → **"Library"**
4. Search **"Generative Language API"** → Click → **"Enable"**
5. Go to **"Navigation Menu"** → **"Billing"**
6. Click **"Link a billing account"**
7. Add credit/debit card for payment

**💰 Cost Reference**:
- Gemini Flash: ~$0.075 / 1 million tokens
- Estimate: $5-20/month for small restaurant

---

## 6. Create Cloudflare Worker

### Step 6.1: Register Cloudflare Account
1. Go to: **https://dash.cloudflare.com/sign-up**
2. Enter email and password → Click **"Sign up"**
3. Verify email in inbox

### Step 6.2: Install Wrangler CLI
Open Terminal/Command Prompt:

```bash
# Install Wrangler (Cloudflare Worker management tool)
npm install -g wrangler

# Verify installation
wrangler --version
```

### Step 6.3: Login to Cloudflare from Terminal
```bash
wrangler login
```
- Browser will open automatically
- Click **"Allow"** to authorize Wrangler
- Return to Terminal, success message will appear

### Step 6.4: Navigate to Project Directory
```bash
# Windows (adjust path accordingly)
cd D:\yaki-restaurant

# Mac/Linux
cd /path/to/yaki-restaurant
```

### Step 6.5: Configure Worker Name
Open `wrangler.toml`, modify:
```toml
name = "gemini-proxy-restaurant"   # Change to your restaurant name
main = "src/index.js"
compatibility_date = "2024-01-01"
```

### Step 6.6: Add Secret API Key
```bash
wrangler secret put GEMINI_API_KEY
```
- Terminal will ask: `Enter a secret value:`
- **Paste API Key** from Step 5.2 (won't display when pasting)
- Press **Enter**
- You'll see: `✓ Success!`

### Step 6.7: Deploy Worker to Cloudflare
```bash
wrangler deploy
```

Successful output:
```
Uploaded gemini-proxy-restaurant
Published gemini-proxy-restaurant
  https://gemini-proxy-restaurant.your-subdomain.workers.dev
```

**⚠️ SAVE THIS URL!** Example: `https://gemini-proxy-restaurant.abc123.workers.dev`

### Step 6.8: Update URL in Code
Open `customer.html`, find:
```javascript
const GEMINI_API_URL = 'https://old-url.workers.dev';
```
Replace with your Worker URL.

Do the same for `manager.html`.

---

## 7. Deploy Application to Cloudflare Pages

### Step 7.1: Create GitHub Repository
1. Go to **https://github.com** and login
2. Click **"+"** → **"New repository"**
3. **Repository name**: `yaki-restaurant-order`
4. **Visibility**: Select **"Private"** (important for code security)
5. Click **"Create repository"**

### Step 7.2: Push Code to GitHub
Open Terminal in project directory:

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Connect to GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/yaki-restaurant-order.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

> If asked for username/password, enter GitHub credentials.
> For password, use Personal Access Token instead of regular password.

### Step 7.3: Connect Cloudflare Pages
1. Login to **https://dash.cloudflare.com**
2. Click **"Workers & Pages"** in left menu
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**

### Step 7.4: Authorize GitHub
1. Click **"Connect GitHub"**
2. Login to GitHub if prompted
3. Select **"Only select repositories"**
4. Choose your `yaki-restaurant-order` repo
5. Click **"Install & Authorize"**

### Step 7.5: Configure Build Settings
1. **Project name**: `yaki-restaurant` (or your preferred name)
2. **Production branch**: `main`
3. **Framework preset**: Select **"None"**
4. **Build command**: **Leave empty** (no build needed)
5. **Build output directory**: Enter **`/`** (slash)
6. Click **"Save and Deploy"**

### Step 7.6: Wait for Deployment
- Cloudflare will build and deploy (takes 1-2 minutes)
- When you see **"Success"**, click **"Continue to project"**
- Your app URL: `https://yaki-restaurant.pages.dev`

### Step 7.7: Test Application
- **Customer page**: `https://yaki-restaurant.pages.dev/customer.html?table=1`
- **Admin page**: `https://yaki-restaurant.pages.dev/manager.html`

---

## 8. Configure Custom Domain

### Step 8.1: Purchase Domain (if needed)
Available at:
- **International**: Namecheap, GoDaddy, Google Domains
- **Local providers**: Various options available

### Step 8.2: Add Domain to Cloudflare
1. In Cloudflare Dashboard, go to Pages project
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter domain: `order.yourrestaurant.com`
5. Click **"Continue"**

### Step 8.3: Configure DNS
Cloudflare will show DNS record to add:
```
Type: CNAME
Name: order
Target: yaki-restaurant.pages.dev
```

1. Login to your domain provider
2. Go to DNS management
3. Add CNAME record as shown above
4. Return to Cloudflare, click **"Verify"**

### Step 8.4: Wait for Activation
- DNS needs 5-30 minutes to propagate
- When you see **"Active"** in Cloudflare → Domain is working
- SSL certificate is automatically provisioned (https)

---

## 9. Troubleshooting

### Final Checklist:
- [ ] `customer.html` loads and displays menu correctly
- [ ] Can add items to cart
- [ ] Orders are placed successfully, kitchen receives them
- [ ] `manager.html` login works with created email/password
- [ ] AI Chatbot works (food suggestions)
- [ ] Language switching works (VI/EN/ZH/JA/KO)

### Common Errors:

#### ❌ Error "Firebase: No Firebase App 'default'"
**Cause**: Firebase config is wrong or not replaced.
**Solution**: Check `firebaseConfig` in both HTML files.

#### ❌ Error "Failed to fetch" when using AI
**Cause**: Worker URL is wrong or not deployed.
**Solution**: 
1. Check `GEMINI_API_URL` in code
2. Test Worker: open Worker URL in browser, should see `{"error":"Method not allowed"}`

#### ❌ Error 401 Unauthorized from Gemini
**Cause**: API Key is wrong or quota exceeded.
**Solution**:
1. Create new API Key
2. Update secret: `wrangler secret put GEMINI_API_KEY`
3. Redeploy: `wrangler deploy`

#### ❌ Blank page / won't load
**Cause**: Files not in correct path.
**Solution**: Check folder structure, ensure HTML files are at root.

#### ❌ Orders not showing in realtime
**Cause**: Firestore rules expired (30 days test mode).
**Solution**: Go to Firestore → Rules → Extend or configure proper rules.

---

## 📞 Technical Support

If you encounter issues you cannot resolve, contact:
- 📧 Email: [your-email@gmail.com]
- 💬 Zalo: [0xxx-xxx-xxx]
- 📘 Facebook: [facebook.com/your-page]

**Support Hours**: 9AM - 6PM (Monday - Friday)

---

*Version: 1.0 | Updated: December 2024*
*© 2024 Yaki Restaurant System. All rights reserved.*
