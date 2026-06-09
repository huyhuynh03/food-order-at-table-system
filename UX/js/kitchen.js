        /* ======================= FIREBASE SETUP ======================= */
        // TODO: Thay thế bằng config thật của bạn từ Firebase Console
        const firebaseConfig = {
           apiKey: "AIzaSyCCTaXqidGM4DIyJnz1-zbg_6PdxmDpV30",
            authDomain: "food-order-at-table-to-kitchen.firebaseapp.com",
            projectId: "food-order-at-table-to-kitchen",
            storageBucket: "food-order-at-table-to-kitchen.firebasestorage.app",
            messagingSenderId: "179233667372",
            appId: "1:179233667372:web:76170af27a89ff778a9489"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();

        /* ======================= TRANSLATIONS ======================= */
        const translations = {
            vi: {
                title: "Bếp Yaki",
                login: {
                    title: "Bếp Yaki",
                    emailPlaceholder: "Email",
                    passwordPlaceholder: "Mật khẩu",
                    btn: "Đăng nhập",
                    error: "Lỗi đăng nhập"
                },
                header: {
                    title: "👨‍🍳 Bếp Yaki",
                    logout: "Đăng xuất"
                },
                dashboard: {
                    serving: "Đang phục vụ",
                    noItems: "Chưa có món",
                    qty: "SL",
                    total: "Tổng",
                    clearBtn: "Xóa món / Thanh toán",
                    confirmDelete: "Xóa món này?",
                    confirmClear: "Bạn có chắc muốn xóa hết món của bàn này?",
                    table: "Bàn"
                },
                notification: {
                    confirm: "Xác nhận",
                    cancel: "Hủy",
                    ok: "OK",
                    warning: "Cảnh báo",
                    error: "Lỗi",
                    success: "Thành công",
                    info: "Thông báo"
                },
                status: {
                    pending: "Chờ",
                    cooking: "Đang nấu",
                    done: "Xong"
                }
            },
            en: {
                title: "Yaki Kitchen",
                login: {
                    title: "Yaki Kitchen",
                    emailPlaceholder: "Email",
                    passwordPlaceholder: "Password",
                    btn: "Login",
                    error: "Login Error"
                },
                header: {
                    title: "👨‍🍳 Yaki Kitchen",
                    logout: "Logout"
                },
                dashboard: {
                    serving: "Serving",
                    noItems: "No items",
                    qty: "Qty",
                    total: "Total",
                    clearBtn: "Clear / Pay",
                    confirmDelete: "Delete this item?",
                    confirmClear: "Are you sure you want to clear this table?",
                    table: "Table"
                },
                notification: {
                    confirm: "Confirm",
                    cancel: "Cancel",
                    ok: "OK",
                    warning: "Warning",
                    error: "Error",
                    success: "Success",
                    info: "Info"
                },
                status: {
                    pending: "Pending",
                    cooking: "Cooking",
                    done: "Done"
                }
            }
        };

        let currentLang = localStorage.getItem('kitchenLang') || 'vi';

        function changeLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('kitchenLang', lang);
            document.getElementById('langSelect').value = lang;
            updateStaticText();
            loadTables(); // Re-render tables with new language
        }

        function updateStaticText() {
            const t = translations[currentLang];
            document.title = t.title;

            // Login Screen
            document.getElementById('loginTitle').innerText = t.login.title;
            document.getElementById('email').placeholder = t.login.emailPlaceholder;
            document.getElementById('password').placeholder = t.login.passwordPlaceholder;
            document.getElementById('loginBtn').innerText = t.login.btn;

            // Sync both language selectors
            const loginLangSelect = document.getElementById('loginLangSelect');
            const dashboardLangSelect = document.getElementById('langSelect');
            if (loginLangSelect) loginLangSelect.value = currentLang;
            if (dashboardLangSelect) dashboardLangSelect.value = currentLang;

            // Header
            document.getElementById('headerLogo').innerText = t.header.title;
            document.getElementById('logoutBtn').innerText = t.header.logout;
        }

        // Initialize text on load
        updateStaticText();

        // Auth Listener
        auth.onAuthStateChanged(user => {
            if (user) {
                document.getElementById("loginPanel").style.display = "none";
                document.getElementById("mainApp").style.display = "block";
                document.getElementById("dashboard").style.display = "grid"; // Fix display
                // Set initial language selector value
                document.getElementById('langSelect').value = currentLang;
                loadTables();
            } else {
                document.getElementById("loginPanel").style.display = "flex";
                document.getElementById("mainApp").style.display = "none";
            }
        });

        function login() {
            const email = document.getElementById("email").value;
            const pass = document.getElementById("password").value;
            auth.signInWithEmailAndPassword(email, pass).catch(e => {
                showAlert(e.message, 'error');
            });
        }

        /* ======================= CUSTOM NOTIFICATION SYSTEM ======================= */
        function showConfirm(message, icon = '⚠️') {
            return new Promise((resolve) => {
                const t = translations[currentLang].notification;

                const overlay = document.createElement('div');
                overlay.className = 'notification-overlay';
                overlay.innerHTML = `
                    <div class="notification-modal">
                        <div class="notification-icon">${icon}</div>
                        <div class="notification-title">${t.warning}</div>
                        <div class="notification-message">${message}</div>
                        <div class="notification-buttons">
                            <button class="notification-btn cancel" id="notifyCancel">${t.cancel}</button>
                            <button class="notification-btn confirm" id="notifyConfirm">${t.confirm}</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                // Focus on confirm button
                setTimeout(() => overlay.querySelector('#notifyConfirm').focus(), 100);

                const closeModal = (result) => {
                    overlay.classList.add('closing');
                    setTimeout(() => {
                        overlay.remove();
                        resolve(result);
                    }, 200);
                };

                overlay.querySelector('#notifyCancel').addEventListener('click', () => closeModal(false));
                overlay.querySelector('#notifyConfirm').addEventListener('click', () => closeModal(true));

                // Close on backdrop click
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) closeModal(false);
                });

                // Keyboard support
                overlay.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeModal(false);
                    if (e.key === 'Enter') closeModal(true);
                });
            });
        }

        function showAlert(message, type = 'info') {
            return new Promise((resolve) => {
                const t = translations[currentLang].notification;

                // Determine icon and title based on type
                let icon, title;
                if (type === 'error') {
                    icon = '❌';
                    title = t.error || 'Error';
                } else if (type === 'success') {
                    icon = '✅';
                    title = t.success || 'Success';
                } else {
                    icon = 'ℹ️';
                    title = t.info || 'Info';
                }

                const overlay = document.createElement('div');
                overlay.className = 'notification-overlay';
                overlay.innerHTML = `
                    <div class="notification-modal ${type === 'error' ? 'error' : ''}">
                        <div class="notification-icon">${icon}</div>
                        <div class="notification-title">${title}</div>
                        <div class="notification-message">${message}</div>
                        <div class="notification-buttons">
                            <button class="notification-btn ok" id="notifyOk">${t.ok}</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                // Focus on OK button
                setTimeout(() => overlay.querySelector('#notifyOk').focus(), 100);

                const closeModal = () => {
                    overlay.classList.add('closing');
                    setTimeout(() => {
                        overlay.remove();
                        resolve();
                    }, 200);
                };

                overlay.querySelector('#notifyOk').addEventListener('click', closeModal);

                // Close on backdrop click
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) closeModal();
                });

                // Keyboard support
                overlay.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' || e.key === 'Enter') closeModal();
                });
            });
        }

        function logout() {
            auth.signOut();
        }

        function loadTables() {
            // Đọc số bàn từ settings trước, sau đó listen tables collection
            db.collection('settings').doc('tables').get().then(settingsDoc => {
                const maxTables = (settingsDoc.exists && settingsDoc.data().count) ? settingsDoc.data().count : 10;

                db.collection("tables").onSnapshot(snapshot => {
                    const dashboard = document.getElementById("dashboard");
                    dashboard.innerHTML = "";

                    // Tạo map từ Firestore docs
                    const tableDataMap = {};
                    snapshot.docs.forEach(doc => {
                        tableDataMap[doc.id] = doc.data();
                    });

                    const t = translations[currentLang].dashboard;

                    // Render TẤT CẢ bàn từ 1 đến maxTables
                    for (let i = 1; i <= maxTables; i++) {
                        const tableId = `table_${i}`;
                        const data = tableDataMap[tableId] || {};
                        const hasOrders = data.orders && data.orders.length > 0;

                        let ordersHtml = "";
                        let tableTotal = 0;

                        if (hasOrders) {
                            data.orders.forEach((item, orderIndex) => {
                                let name = item.name;
                                if (typeof item.name === 'object') {
                                    name = item.name[currentLang] || item.name.vi || item.name;
                                }

                                const itemTotal = item.qty * item.price;
                                tableTotal += itemTotal;

                                const itemStatus = item.status || 'pending';
                                const statusLabel = translations[currentLang].status[itemStatus];
                                const isDone = itemStatus === 'done';

                                ordersHtml += `
                                <div class="order-item ${isDone ? 'item-done' : ''}">
                                    <div class="item-status">
                                        <button class="status-btn ${itemStatus}" 
                                            onclick="cycleItemStatusByIndex('${tableId}', ${orderIndex})"
                                            title="Click to change status">
                                            ${statusLabel}
                                        </button>
                                    </div>
                                    <div style="flex:1">
                                        <div class="order-item-name" style="font-weight:bold;">${name}</div>
                                        <div style="font-size:13px; color:#ccc;">
                                            ${t.qty}: ${item.qty} × ${item.price.toLocaleString()} đ
                                        </div>
                                    </div>
                                </div>
                            `;
                            });
                        } else {
                            ordersHtml = `<div style='color:#777; font-style:italic;'>${t.noItems}</div>`;
                        }

                        const tableName = `${t.table} ${i}`;

                        dashboard.innerHTML += `
                        <div class="table-card ${hasOrders ? 'active' : ''}">
                            <div class="table-header">
                                <div class="table-name">${tableName}</div>
                                <div class="status-badge" style="visibility: ${hasOrders ? 'visible' : 'hidden'}">${t.serving}</div>
                            </div>

                            <div class="order-list">
                                ${ordersHtml}
                            </div>

                             <div style="margin-top: 10px; border-top: 1px solid #333; padding-top: 10px; font-weight: bold; text-align: right; color: #ffa64d;">
                                ${t.total}: ${tableTotal.toLocaleString()} đ
                            </div>
                        </div>
                    `;
                    }
                });
            }).catch(err => {
                console.error('Error loading table count:', err);
            });
        }

        async function updateOrderQty(tableId, itemId, newQty) {
            newQty = parseInt(newQty);
            if (newQty < 0) return;

            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            // Tìm thông tin món (để giữ lại name, price, etc. nếu cần tạo lại)
            const itemInfo = orders.find(o => o.id == itemId);
            if (!itemInfo) return; // Should not happen

            // Xóa tất cả các entry cũ của món này (để tránh duplicate lẻ tẻ)
            orders = orders.filter(o => o.id != itemId);

            // Nếu số lượng > 0, thêm lại 1 entry gộp
            if (newQty > 0) {
                orders.push({
                    ...itemInfo,
                    qty: newQty
                });
            }

            await ref.update({ orders: orders });
        }

        async function deleteOrderItem(tableId, itemId) {
            const confirmed = await showConfirm(translations[currentLang].dashboard.confirmDelete, '🗑️');
            if (!confirmed) return;

            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            // Xóa tất cả entry có id này
            orders = orders.filter(o => o.id != itemId);

            await ref.update({ orders: orders });
        }

        async function clearTable(tableId) {
            const confirmed = await showConfirm(translations[currentLang].dashboard.confirmClear, '🧹');
            if (!confirmed) return;

            // Chỉ xóa orders, không set status free nữa (hoặc giữ status active để client biết)
            await db.collection("tables").doc(tableId).update({
                orders: [],
                total: 0
                // status: "active" // Giữ nguyên active hoặc không đụng đến
            });
        }

        // Cycle item status: pending → cooking → done → pending
        async function cycleItemStatus(tableId, itemId) {
            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            // Define status cycle
            const statusCycle = {
                'pending': 'cooking',
                'cooking': 'done',
                'done': 'pending'
            };

            // Update status for all items with matching id
            orders = orders.map(o => {
                if (o.id === itemId) {
                    const currentStatus = o.status || 'pending';
                    return { ...o, status: statusCycle[currentStatus] };
                }
                return o;
            });

            await ref.update({ orders: orders });
        }

        // NEW: Index-based status cycling (for non-aggregated display)
        async function cycleItemStatusByIndex(tableId, orderIndex) {
            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            if (orderIndex < 0 || orderIndex >= orders.length) return;

            const statusCycle = {
                'pending': 'cooking',
                'cooking': 'done',
                'done': 'pending'
            };

            const currentStatus = orders[orderIndex].status || 'pending';
            orders[orderIndex] = { ...orders[orderIndex], status: statusCycle[currentStatus] };

            await ref.update({ orders: orders });
        }

        // NEW: Index-based quantity update
        async function updateOrderQtyByIndex(tableId, orderIndex, newQty) {
            newQty = parseInt(newQty);
            if (newQty < 0) return;

            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            if (orderIndex < 0 || orderIndex >= orders.length) return;

            if (newQty === 0) {
                // Xóa món nếu số lượng = 0
                orders.splice(orderIndex, 1);
            } else {
                orders[orderIndex] = { ...orders[orderIndex], qty: newQty };
            }

            await ref.update({ orders: orders });
        }

        // NEW: Index-based delete
        async function deleteOrderItemByIndex(tableId, orderIndex) {
            const confirmed = await showConfirm(translations[currentLang].dashboard.confirmDelete, '🗑️');
            if (!confirmed) return;

            const ref = db.collection("tables").doc(tableId);
            const doc = await ref.get();
            let orders = doc.data().orders || [];

            if (orderIndex < 0 || orderIndex >= orders.length) return;

            orders.splice(orderIndex, 1);

            await ref.update({ orders: orders });
        }


        /* ======================= ADMIN PANEL FUNCTIONS ======================= */

        // Gemini API URL (same as customer app)
        const GEMINI_API_URL = 'YOUR_GEMINI_PROXY_URL';

        // Admin translations
        const adminTranslations = {
            vi: {
                tabs: { orders: '📋 Đơn hàng', menu: '🍽️ Quản lý món', tables: '🪑 Quản lý bàn' },
                menu: {
                    title: '📋 Quản lý thực đơn',
                    addBtn: '+ Thêm món',
                    editBtn: 'Sửa',
                    deleteBtn: 'Xóa',
                    confirmDelete: 'Xóa món này?',
                    categories: {
                        nuong: 'Món nướng', lau: 'Lẩu', mon_phu: 'Món phụ',
                        nuoc: 'Đồ uống', khai_vi: 'Khai vị', trang_mieng: 'Tráng miệng'
                    }
                },
                tables: {
                    title: '🪑 Quản lý bàn',
                    countLabel: 'Số bàn hiện tại:',
                    addBtn: '+ Thêm bàn',
                    removeBtn: '- Xóa bàn',
                    confirmRemove: 'Xóa bàn cuối cùng?',
                    cannotRemove: 'Không thể xóa thêm bàn!'
                },
                modal: {
                    addTitle: 'Thêm món mới',
                    editTitle: 'Sửa món',
                    nameLabel: 'Tên món (Tiếng Việt) *',
                    categoryLabel: 'Danh mục *',
                    priceLabel: 'Giá (VND) *',
                    imageLabel: 'URL Ảnh',
                    availableLabel: 'Còn hàng',
                    cancelBtn: 'Hủy',
                    saveBtn: '💾 Lưu & Dịch tự động',
                    translating: '🔄 Đang dịch...'
                }
            },
            en: {
                tabs: { orders: '📋 Orders', menu: '🍽️ Menu', tables: '🪑 Tables' },
                menu: {
                    title: '📋 Menu Management',
                    addBtn: '+ Add Item',
                    editBtn: 'Edit',
                    deleteBtn: 'Delete',
                    confirmDelete: 'Delete this item?',
                    categories: {
                        nuong: 'Grilled', lau: 'Hotpot', mon_phu: 'Side Dishes',
                        nuoc: 'Drinks', khai_vi: 'Appetizer', trang_mieng: 'Dessert'
                    }
                },
                tables: {
                    title: '🪑 Table Management',
                    countLabel: 'Current tables:',
                    addBtn: '+ Add Table',
                    removeBtn: '- Remove Table',
                    confirmRemove: 'Remove last table?',
                    cannotRemove: 'Cannot remove more tables!'
                },
                modal: {
                    addTitle: 'Add New Item',
                    editTitle: 'Edit Item',
                    nameLabel: 'Name (Vietnamese) *',
                    categoryLabel: 'Category *',
                    priceLabel: 'Price (VND) *',
                    imageLabel: 'Image URL',
                    availableLabel: 'Available',
                    cancelBtn: 'Cancel',
                    saveBtn: '💾 Save & Auto-translate',
                    translating: '🔄 Translating...'
                }
            }
        };

        let currentAdminTab = 'orders';
        let productsList = [];
        let tableCount = 10;

        // Switch between tabs
        function switchTab(tab) {
            currentAdminTab = tab;

            // Update tab buttons
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

            // Show/hide panels
            document.getElementById('dashboard').style.display = tab === 'orders' ? 'grid' : 'none';
            document.getElementById('menuPanel').style.display = tab === 'menu' ? 'block' : 'none';
            document.getElementById('tablePanel').style.display = tab === 'tables' ? 'block' : 'none';

            // Load data when switching tabs
            if (tab === 'menu') loadProductsList();
            if (tab === 'tables') loadTableCount();

            updateAdminText();
        }

        // Update admin panel text based on language
        function updateAdminText() {
            const t = adminTranslations[currentLang];

            // Tab buttons
            document.getElementById('tabOrders').innerText = t.tabs.orders;
            document.getElementById('tabMenu').innerText = t.tabs.menu;
            document.getElementById('tabTables').innerText = t.tabs.tables;

            // Menu panel
            document.getElementById('menuPanelTitle').innerText = t.menu.title;
            document.querySelector('.add-btn').innerText = t.menu.addBtn;

            // Table panel
            document.getElementById('tablePanelTitle').innerText = t.tables.title;
            document.getElementById('tableCountLabel').innerText = t.tables.countLabel;

            // Modal
            document.getElementById('labelNameVi').innerText = t.modal.nameLabel;
            document.getElementById('labelCategory').innerText = t.modal.categoryLabel;
            document.getElementById('labelPrice').innerText = t.modal.priceLabel;
            document.getElementById('labelImage').innerText = t.modal.imageLabel;
            document.getElementById('labelAvailable').innerText = t.modal.availableLabel;
            document.querySelector('.btn-cancel').innerText = t.modal.cancelBtn;
            document.getElementById('saveProductBtn').innerText = t.modal.saveBtn;
        }

        // Load products list
        async function loadProductsList() {
            const container = document.getElementById('productList');
            container.innerHTML = '<div style="color:#aaa;text-align:center;padding:40px;">Loading...</div>';

            try {
                const snapshot = await db.collection('products').orderBy('category').get();
                productsList = [];

                snapshot.forEach(doc => {
                    productsList.push({ id: doc.id, ...doc.data() });
                });

                renderProductsList();
            } catch (error) {
                console.error('Error loading products:', error);
                container.innerHTML = '<div style="color:#ff4d4d;text-align:center;padding:40px;">Error loading products</div>';
            }
        }

        // Render products grid
        function renderProductsList() {
            const container = document.getElementById('productList');
            const t = adminTranslations[currentLang];

            if (productsList.length === 0) {
                container.innerHTML = '<div style="color:#aaa;text-align:center;padding:40px;">No products found</div>';
                return;
            }

            container.innerHTML = productsList.map(product => {
                const name = product.name?.[currentLang] || product.name?.vi || 'Unknown';
                const categoryName = t.menu.categories[product.category] || product.category;
                const unavailableClass = product.available === false ? 'unavailable' : '';

                return `
                <div class="product-card ${unavailableClass}">
                    <img src="${product.img || 'https://via.placeholder.com/280x150?text=No+Image'}" 
                         onerror="this.src='https://via.placeholder.com/280x150?text=No+Image'">
                    <div class="name">${name}</div>
                    <div class="price">${(product.price || 0).toLocaleString()} đ</div>
                    <div class="category">${categoryName}</div>
                    <div class="actions">
                        <button class="edit-btn" onclick="openEditProductModal('${product.id}')">${t.menu.editBtn}</button>
                        <button class="delete-btn" onclick="deleteProduct('${product.id}')">${t.menu.deleteBtn}</button>
                    </div>
                </div>`;
            }).join('');
        }

        // Open add product modal
        function openAddProductModal() {
            const t = adminTranslations[currentLang];
            document.getElementById('modalTitle').innerText = t.modal.addTitle;
            document.getElementById('editProductId').value = '';
            document.getElementById('productForm').reset();
            document.getElementById('productAvailable').checked = true;
            document.getElementById('productModal').style.display = 'flex';
        }

        // Open edit product modal
        function openEditProductModal(productId) {
            const product = productsList.find(p => p.id === productId);
            if (!product) return;

            const t = adminTranslations[currentLang];
            document.getElementById('modalTitle').innerText = t.modal.editTitle;
            document.getElementById('editProductId').value = productId;
            document.getElementById('productNameVi').value = product.name?.vi || '';
            document.getElementById('productCategory').value = product.category || 'nuong';
            document.getElementById('productPrice').value = product.price || 0;
            document.getElementById('productImage').value = product.img || '';
            document.getElementById('productAvailable').checked = product.available !== false;
            document.getElementById('productModal').style.display = 'flex';
        }

        // Close modal
        function closeProductModal() {
            document.getElementById('productModal').style.display = 'none';
        }

        // Translate name using Gemini API via Worker
        async function translateProductName(vietnameseName) {
            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: `Translate this Vietnamese food/dish name to 4 languages. Keep translations natural and appropriate for restaurant menus.
Input: "${vietnameseName}"
Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with exactly this format:
{"en": "English name", "zh": "Chinese name", "ja": "Japanese name", "ko": "Korean name"}`
                    })
                });

                const data = await response.json();
                console.log('Product translation API response:', data);

                if (!data.success || !data.response) {
                    console.error('Product translation failed:', data);
                    throw new Error('Translation response missing');
                }

                // Clean up response - remove markdown code blocks if present
                let text = data.response.trim();
                text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                // Try to extract JSON from the response
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error('No JSON found in response:', text);
                    throw new Error('Invalid JSON response');
                }

                const translations = JSON.parse(jsonMatch[0]);
                console.log('Parsed product translations:', translations);

                return {
                    vi: vietnameseName,
                    en: translations.en || vietnameseName,
                    zh: translations.zh || vietnameseName,
                    ja: translations.ja || vietnameseName,
                    ko: translations.ko || vietnameseName
                };
            } catch (error) {
                console.error('Translation error:', error);
                // Fallback: use Vietnamese name for all
                return {
                    vi: vietnameseName,
                    en: vietnameseName,
                    zh: vietnameseName,
                    ja: vietnameseName,
                    ko: vietnameseName
                };
            }
        }

        // Handle form submit
        document.getElementById('productForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const saveBtn = document.getElementById('saveProductBtn');
            const t = adminTranslations[currentLang];
            const originalBtnText = saveBtn.innerText;

            saveBtn.disabled = true;
            saveBtn.innerText = t.modal.translating;

            try {
                const productId = document.getElementById('editProductId').value;
                const nameVi = document.getElementById('productNameVi').value.trim();
                const category = document.getElementById('productCategory').value;
                const price = parseInt(document.getElementById('productPrice').value) || 0;
                const img = document.getElementById('productImage').value.trim();
                const available = document.getElementById('productAvailable').checked;

                // Auto-translate name
                const translatedNames = await translateProductName(nameVi);

                const productData = {
                    name: translatedNames,
                    category: category,
                    price: price,
                    img: img || 'https://via.placeholder.com/280x150?text=No+Image',
                    available: available,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (productId) {
                    // Update existing
                    await db.collection('products').doc(productId).update(productData);
                } else {
                    // Add new
                    productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    await db.collection('products').add(productData);
                }

                closeProductModal();
                await loadProductsList();
                showNotification('✅', productId ? 'Product updated!' : 'Product added!');

            } catch (error) {
                console.error('Error saving product:', error);
                showNotification('❌', 'Error saving product');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerText = originalBtnText;
            }
        });

        // Delete product
        async function deleteProduct(productId) {
            const t = adminTranslations[currentLang];
            const confirmed = await showConfirm(t.menu.confirmDelete, '🗑️');
            if (!confirmed) return;

            try {
                await db.collection('products').doc(productId).delete();
                await loadProductsList();
                showNotification('✅', 'Product deleted!');
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('❌', 'Error deleting product');
            }
        }

        // Load table count
        async function loadTableCount() {
            try {
                const doc = await db.collection('settings').doc('tables').get();
                if (doc.exists) {
                    tableCount = doc.data().count || 10;
                }
                document.getElementById('tableCountInput').value = tableCount;
            } catch (error) {
                console.error('Error loading table count:', error);
            }
        }

        // Handle table count input - only allow positive integers
        function handleTableCountInput(value) {
            const input = document.getElementById('tableCountInput');

            // Remove any non-digit characters (no negative, no decimal, no letters)
            let cleanValue = value.replace(/[^0-9]/g, '');

            // If empty, don't update yet (let user type)
            if (cleanValue === '') {
                input.value = '';
                return;
            }

            // Parse as integer and ensure minimum of 1
            let num = parseInt(cleanValue, 10);
            if (isNaN(num) || num < 1) {
                num = 1;
            }
            if (num > 100) {
                num = 100; // Maximum 100 tables
            }

            input.value = num;
        }

        // Flag to prevent duplicate saves
        let isSavingTableCount = false;

        // Save table count when input loses focus
        async function saveTableCount() {
            // Prevent duplicate calls
            if (isSavingTableCount) return;

            const input = document.getElementById('tableCountInput');
            let newCount = parseInt(input.value, 10);

            // Validate - must be positive integer
            if (isNaN(newCount) || newCount < 1) {
                newCount = 1;
            }
            if (newCount > 100) {
                newCount = 100;
            }

            // Update input immediately
            input.value = newCount;

            // No change needed
            if (newCount === tableCount) {
                return;
            }

            isSavingTableCount = true;
            const oldCount = tableCount;
            tableCount = newCount;

            try {
                await db.collection('settings').doc('tables').set({ count: tableCount }, { merge: true });
                console.log('✅ Table count saved to Firestore:', tableCount);

                // Make sure input shows new value
                input.value = tableCount;

                loadTables(); // Reload orders dashboard
                showAlert(`Updated to ${tableCount} tables!`, 'success');
            } catch (error) {
                console.error('Error saving table count:', error);
                tableCount = oldCount;
                input.value = oldCount;
                showAlert('Failed to save!', 'error');
            } finally {
                isSavingTableCount = false;
            }
        }

        // Increment table count (+1)
        function incrementTableCount() {
            const input = document.getElementById('tableCountInput');
            let current = parseInt(input.value, 10) || tableCount;
            if (current < 100) {
                input.value = current + 1;
                saveTableCount();
            }
        }

        // Decrement table count (-1)
        async function decrementTableCount() {
            const input = document.getElementById('tableCountInput');
            let current = parseInt(input.value, 10) || tableCount;

            if (current <= 1) {
                showAlert(adminTranslations[currentLang].tables.cannotRemove);
                return;
            }

            // Check if last table has orders before decrementing
            try {
                const lastTableDoc = await db.collection('tables').doc(`table_${current}`).get();
                if (lastTableDoc.exists && lastTableDoc.data().orders?.length > 0) {
                    showAlert('Cannot remove table with active orders!');
                    return;
                }

                // Delete the last table document
                await db.collection('tables').doc(`table_${current}`).delete();

                input.value = current - 1;
                await saveTableCount();
            } catch (error) {
                console.error('Error decrementing table count:', error);
            }
        }

        // Override original changeLanguage to also update admin text
        const originalChangeLanguage = changeLanguage;
        changeLanguage = function (lang) {
            originalChangeLanguage(lang);
            updateAdminText();
            if (currentAdminTab === 'menu') renderProductsList();
            if (currentAdminTab === 'categories') renderCategoriesList();
        };

        // Initialize admin panel when page loads
        document.addEventListener('DOMContentLoaded', function () {
            updateAdminText();
        });

        /* ======================= CATEGORY MANAGEMENT ======================= */

        let categoriesList = [];

        // Default categories (will be loaded from/saved to Firestore)
        const defaultCategories = [
            { key: 'nuong', name: { vi: 'Món nướng', en: 'Grilled', zh: '烧烤', ja: '焼き物', ko: '구이' } },
            { key: 'lau', name: { vi: 'Lẩu', en: 'Hotpot', zh: '火锅', ja: '鍋', ko: '전골' } },
            { key: 'mon_phu', name: { vi: 'Món phụ', en: 'Side Dishes', zh: '配菜', ja: 'サイドメニュー', ko: '반찬' } },
            { key: 'nuoc', name: { vi: 'Đồ uống', en: 'Drinks', zh: '饮料', ja: 'ドリンク', ko: '음료' } },
            { key: 'khai_vi', name: { vi: 'Khai vị', en: 'Appetizer', zh: '开胃菜', ja: '前菜', ko: '에피타이저' } },
            { key: 'trang_mieng', name: { vi: 'Tráng miệng', en: 'Dessert', zh: '甜点', ja: 'デザート', ko: '디저트' } }
        ];

        // Load categories from Firestore
        async function loadCategoriesList() {
            const container = document.getElementById('categoryList');
            container.innerHTML = '<div style="color:#aaa;text-align:center;padding:40px;">Loading...</div>';

            try {
                const doc = await db.collection('settings').doc('categories').get();
                if (doc.exists && doc.data().list) {
                    categoriesList = doc.data().list;
                } else {
                    // Initialize with default categories
                    categoriesList = defaultCategories;
                    await db.collection('settings').doc('categories').set({ list: categoriesList });
                }

                renderCategoriesList();
                updateProductCategoryDropdown();
            } catch (error) {
                console.error('Error loading categories:', error);
                categoriesList = defaultCategories;
                renderCategoriesList();
            }
        }

        // Render categories grid
        function renderCategoriesList() {
            const container = document.getElementById('categoryList');
            const t = adminTranslations[currentLang];

            if (categoriesList.length === 0) {
                container.innerHTML = '<div style="color:#aaa;text-align:center;padding:40px;">No categories</div>';
                return;
            }

            container.innerHTML = categoriesList.map(cat => {
                const catName = cat.name?.[currentLang] || cat.name?.vi || cat.key;
                return `
                <div class="category-card">
                    <div>
                        <div class="cat-name">${catName}</div>
                        <div class="cat-key">${cat.key}</div>
                    </div>
                    <button class="delete-cat-btn" onclick="deleteCategory('${cat.key}')">🗑️</button>
                </div>`;
            }).join('');
        }

        // Update product category dropdown with current categories
        function updateProductCategoryDropdown() {
            const select = document.getElementById('productCategory');
            select.innerHTML = categoriesList.map(cat => {
                const catName = cat.name?.[currentLang] || cat.name?.vi || cat.key;
                return `<option value="${cat.key}">${catName}</option>`;
            }).join('');
        }

        // Open add category modal
        function openAddCategoryModal() {
            document.getElementById('categoryModalTitle').innerText = adminTranslations[currentLang].categories?.addTitle || 'Thêm danh mục';
            document.getElementById('editCategoryId').value = '';
            document.getElementById('categoryForm').reset();
            document.getElementById('categoryModal').style.display = 'flex';
        }

        // Close category modal
        function closeCategoryModal() {
            document.getElementById('categoryModal').style.display = 'none';
        }

        // Translate category name using Gemini API via Worker
        async function translateCategoryName(vietnameseName) {
            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: `Translate this Vietnamese food category name to 4 languages. Keep translations short and appropriate for restaurant menu navigation.
Input: "${vietnameseName}"
Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with exactly this format:
{"en": "English name", "zh": "Chinese name", "ja": "Japanese name", "ko": "Korean name"}`
                    })
                });

                const data = await response.json();
                console.log('Translation API response:', data);

                if (!data.success || !data.response) {
                    console.error('Translation failed:', data);
                    throw new Error('Translation response missing');
                }

                // Clean up response - remove markdown code blocks if any
                let text = data.response.trim();
                text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                // Try to extract JSON from the response
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error('No JSON found in response:', text);
                    throw new Error('Invalid JSON response');
                }

                const translations = JSON.parse(jsonMatch[0]);
                console.log('Parsed translations:', translations);

                return {
                    vi: vietnameseName,
                    en: translations.en || vietnameseName,
                    zh: translations.zh || vietnameseName,
                    ja: translations.ja || vietnameseName,
                    ko: translations.ko || vietnameseName
                };
            } catch (error) {
                console.error('Category translation error:', error);
                // Fallback: just use Vietnamese name for all
                return {
                    vi: vietnameseName,
                    en: vietnameseName,
                    zh: vietnameseName,
                    ja: vietnameseName,
                    ko: vietnameseName
                };
            }
        }

        // Handle category form submit
        document.getElementById('categoryForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const saveBtn = document.getElementById('saveCategoryBtn');
            const originalBtnText = saveBtn.innerText;
            saveBtn.disabled = true;
            saveBtn.innerText = '🔄 Đang dịch...';

            try {
                const catKey = document.getElementById('categoryKey').value.trim().toLowerCase().replace(/\s+/g, '_');
                const nameVi = document.getElementById('categoryNameVi').value.trim();

                // Check if key already exists
                if (categoriesList.some(c => c.key === catKey)) {
                    showNotification('⚠️', 'Category key already exists!');
                    saveBtn.disabled = false;
                    saveBtn.innerText = originalBtnText;
                    return;
                }

                // Auto-translate using Gemini API
                const translatedNames = await translateCategoryName(nameVi);

                const newCategory = {
                    key: catKey,
                    name: translatedNames
                };

                categoriesList.push(newCategory);
                await db.collection('settings').doc('categories').set({ list: categoriesList });

                closeCategoryModal();
                renderCategoriesList();
                updateProductCategoryDropdown();
                showNotification('✅', 'Category added!');

            } catch (error) {
                console.error('Error saving category:', error);
                showNotification('❌', 'Error saving category');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerText = originalBtnText;
            }
        });

        // Delete category
        async function deleteCategory(catKey) {
            // Count products in this category
            const snapshot = await db.collection('products').where('category', '==', catKey).get();

            if (!snapshot.empty) {
                showNotification('⚠️', `Cannot delete! ${snapshot.size} products in this category.`);
                return;
            }

            const confirmed = await showConfirm('Delete this category?', '🗑️');
            if (!confirmed) return;

            try {
                categoriesList = categoriesList.filter(c => c.key !== catKey);
                await db.collection('settings').doc('categories').set({ list: categoriesList });

                renderCategoriesList();
                updateProductCategoryDropdown();
                showNotification('✅', 'Category deleted!');
            } catch (error) {
                console.error('Error deleting category:', error);
                showNotification('❌', 'Error deleting category');
            }
        }

        // Update switchTab to include categories
        const originalSwitchTab = switchTab;
        switchTab = function (tab) {
            currentAdminTab = tab;

            // Update tab buttons
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            const tabId = `tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
            document.getElementById(tabId)?.classList.add('active');

            // Show/hide panels
            document.getElementById('dashboard').style.display = tab === 'orders' ? 'grid' : 'none';
            document.getElementById('menuPanel').style.display = tab === 'menu' ? 'block' : 'none';
            document.getElementById('categoryPanel').style.display = tab === 'categories' ? 'block' : 'none';
            document.getElementById('tablePanel').style.display = tab === 'tables' ? 'block' : 'none';

            // Load data when switching tabs
            if (tab === 'menu') loadProductsList();
            if (tab === 'categories') loadCategoriesList();
            if (tab === 'tables') loadTableCount();

            updateAdminText();
        };

        // Add categories to adminTranslations
        adminTranslations.vi.categories = {
            title: '📂 Quản lý danh mục',
            addBtn: '+ Thêm danh mục',
            addTitle: 'Thêm danh mục mới',
            deleteBtn: 'Xóa'
        };
        adminTranslations.en.categories = {
            title: '📂 Category Management',
            addBtn: '+ Add Category',
            addTitle: 'Add New Category',
            deleteBtn: 'Delete'
        };

        // Update admin text for categories tab
        const originalUpdateAdminText = updateAdminText;
        updateAdminText = function () {
            originalUpdateAdminText();
            const t = adminTranslations[currentLang];

            // Categories tab
            document.getElementById('tabCategories').innerText = t.categories?.title?.substring(0, 15) || '📂 Danh mục';
            document.getElementById('categoryPanelTitle').innerText = t.categories?.title || '📂 Quản lý danh mục';

            const catAddBtn = document.querySelector('#categoryPanel .add-btn');
            if (catAddBtn) catAddBtn.innerText = t.categories?.addBtn || '+ Thêm';
        };
