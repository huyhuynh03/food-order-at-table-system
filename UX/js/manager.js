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
                  title: "Quản Lý Yaki",
                  login: {
                    title: "Quản Lý Yaki",
                    emailPlaceholder: "Email",
                    passwordPlaceholder: "Mật khẩu",
                    btn: "Đăng nhập",
                    error: "Lỗi đăng nhập",
                  },
                  header: {
                    title: "👔 Quản Lý Yaki",
                    logout: "Đăng xuất",
                  },
                  dashboard: {
                    serving: "Đang phục vụ",
                    noItems: "Chưa có món",
                    qty: "SL",
                    total: "Tổng",
                    clearBtn: "Xóa bàn",
                    payBtn: "Thanh toán",
                    chooseMethod: "Chọn phương thức thanh toán",
                    methodCash: "Tiền mặt",
                    methodQR: "Quét mã QR",
                    methodCard: "Thẻ ngân hàng",
                    confirmDelete: "Xóa món này?",
                    confirmClear: "Bạn có chắc muốn xóa hết món của bàn này?",
                    confirmPay: "Bạn có chắc muốn thanh toán bàn này?",
                    confirmPaid: "Đã thanh toán",
                    paySuccess: "Thanh toán thành công!",
                    qrTitle: "Chuyển khoản QR",
                    qrBank: "Ngân hàng",
                    qrAccount: "Số tài khoản",
                    qrName: "Chủ tài khoản",
                    qrAmount: "Số tiền",
                    qrContent: "Nội dung CK",
                    cardTitle: "Thanh toán thẻ",
                    cardWaiting: "Đang chờ kết nối máy POS...",
                    cardHint: "Vui lòng quẹt thẻ trên máy POS",
                    table: "Bàn",
                    qrSessionBtn: "📱 QR",
                    qrSessionTitle: "Mã QR phìiên bàn",
                    qrSessionInfo: "Khách quét mã này để truy cập bàn",
                    qrSessionCopy: "Sao chép link",
                    qrSessionCopied: "Đã sao chép!",
                    callLabel: "Gọi",
                    callActiveHint: "Đang có gọi nhân viên. Nhấn đèn để tắt thông báo.",
                    callInactiveHint: "Chưa có gọi nhân viên.",
                    callResolveError: "Không thể tắt thông báo gọi nhân viên."
                  },
                  notification: {
                    confirm: "Xác nhận",
                    cancel: "Hủy",
                    ok: "OK",
                    warning: "Cảnh báo",
                    error: "Lỗi",
                    success: "Thành công",
                    info: "Thông báo",
                  },
                  status: {
                    pending: "Chờ",
                    cooking: "Đang nấu",
                    done: "Xong",
                  },
                  history: {
                    tab: "📝 Lịch sử giao dịch",
                    title: "📝 Lịch sử giao dịch",
                    reload: "🔄 Tải lại",
                    time: "Thời gian",
                    table: "Bàn",
                    amount: "Số tiền",
                    method: "Phương thức",
                    transId: "Mã GD",
                    empty: "Chưa có giao dịch nào.",
                    methodNames: { casso: "Casso", cash: "Tiền mặt", card: "Thẻ", qr: "Phí/QR khác" }
                  }
                },
                en: {
                  title: "Yaki Manager",
                  login: {
                    title: "Yaki Manager",
                    emailPlaceholder: "Email",
                    passwordPlaceholder: "Password",
                    btn: "Login",
                    error: "Login Error",
                  },
                  header: {
                    title: "👔 Yaki Manager",
                    logout: "Logout",
                  },
                  dashboard: {
                    serving: "Serving",
                    noItems: "No items",
                    qty: "Qty",
                    total: "Total",
                    clearBtn: "Clear Table",
                    payBtn: "Payment",
                    chooseMethod: "Choose payment method",
                    methodCash: "Cash",
                    methodQR: "QR Code",
                    methodCard: "Bank Card",
                    confirmDelete: "Delete this item?",
                    confirmClear: "Are you sure you want to clear this table?",
                    confirmPay: "Are you sure you want to pay for this table?",
                    confirmPaid: "Paid",
                    paySuccess: "Payment successful!",
                    qrTitle: "QR Bank Transfer",
                    qrBank: "Bank",
                    qrAccount: "Account No.",
                    qrName: "Account Name",
                    qrAmount: "Amount",
                    qrContent: "Transfer Note",
                    cardTitle: "Card Payment",
                    cardWaiting: "Waiting for POS terminal...",
                    cardHint: "Please swipe/tap card on POS terminal",
                    table: "Table",
                    qrSessionBtn: "📱 QR",
                    qrSessionTitle: "Table Session QR",
                    qrSessionInfo: "Customer scans this to access table",
                    qrSessionCopy: "Copy link",
                    qrSessionCopied: "Copied!",
                    callLabel: "Call",
                    callActiveHint: "A staff call is active. Press the lamp to clear it.",
                    callInactiveHint: "No active staff call.",
                    callResolveError: "Unable to clear the staff call notification."
                  },
                  notification: {
                    confirm: "Confirm",
                    cancel: "Cancel",
                    ok: "OK",
                    warning: "Warning",
                    error: "Error",
                    success: "Success",
                    info: "Info",
                  },
                  status: {
                    pending: "Pending",
                    cooking: "Cooking",
                    done: "Done",
                  },
                  history: {
                    tab: "📝 Payment History",
                    title: "📝 Payment History",
                    reload: "🔄 Reload",
                    time: "Time",
                    table: "Table",
                    amount: "Amount",
                    method: "Method",
                    transId: "Trans ID",
                    empty: "No transactions yet.",
                    methodNames: { casso: "Casso", cash: "Cash", card: "Card", qr: "QR/Other" }
                  }
                },
                ko: {
                  title: "Yaki 매니저",
                  login: {
                    title: "Yaki 매니저",
                    emailPlaceholder: "이메일",
                    passwordPlaceholder: "비밀번호",
                    btn: "로그인",
                    error: "로그인 오류",
                  },
                  header: {
                    title: "👔 Yaki 매니저",
                    logout: "로그아웃",
                  },
                  dashboard: {
                    serving: "서빙 중",
                    noItems: "주문 없음",
                    qty: "수량",
                    total: "합계",
                    clearBtn: "테이블 삭제",
                    payBtn: "결제",
                    chooseMethod: "결제 방법 선택",
                    methodCash: "현금",
                    methodQR: "QR 코드",
                    methodCard: "은행 카드",
                    confirmDelete: "이 메뉴를 삭제하시겠습니까?",
                    confirmClear: "이 테이블의 모든 메뉴를 삭제하시겠습니까?",
                    confirmPay: "이 테이블을 결제하시겠습니까?",
                    confirmPaid: "결제 완료",
                    paySuccess: "결제 성공!",
                    qrTitle: "QR 송금",
                    qrBank: "은행",
                    qrAccount: "계좌번호",
                    qrName: "예금주",
                    qrAmount: "금액",
                    qrContent: "송금 내용",
                    cardTitle: "카드 결제",
                    cardWaiting: "POS 단말기 연결 대기 중...",
                    cardHint: "POS 단말기에서 카드를 괁어주세요",
                    table: "테이블",
                    qrSessionBtn: "📱 QR",
                    qrSessionTitle: "테이블 세션 QR",
                    qrSessionInfo: "고객이 이 QR을 스캔하여 테이블에 접속합니다",
                    qrSessionCopy: "링크 복사",
                    qrSessionCopied: "복사됨!",
                    callLabel: "호출",
                    callActiveHint: "직원 호출이 활성화되어 있습니다. 전등 아이콘을 눌러 해제하세요.",
                    callInactiveHint: "활성화된 직원 호출이 없습니다.",
                    callResolveError: "직원 호출 알림을 끌 수 없습니다."
                  },
                  notification: {
                    confirm: "확인",
                    cancel: "취소",
                    ok: "확인",
                    warning: "경고",
                    error: "오류",
                    success: "성공",
                    info: "알림",
                  },
                  status: {
                    pending: "대기",
                    cooking: "조리 중",
                    done: "완료",
                  },
                  history: {
                    tab: "📝 결제 내역",
                    title: "📝 결제 내역",
                    reload: "🔄 새로 고침",
                    time: "시간",
                    table: "테이블",
                    amount: "금액",
                    method: "결제 수단",
                    transId: "거래 ID",
                    empty: "아직 거래가 없습니다.",
                    methodNames: { casso: "Casso", cash: "현금", card: "카드", qr: "기타 QR" }
                  }
                },
                ja: {
                  title: "Yaki マネージャー",
                  login: {
                    title: "Yaki マネージャー",
                    emailPlaceholder: "メール",
                    passwordPlaceholder: "パスワード",
                    btn: "ログイン",
                    error: "ログインエラー",
                  },
                  header: {
                    title: "👔 Yaki マネージャー",
                    logout: "ログアウト",
                  },
                  dashboard: {
                    serving: "提供中",
                    noItems: "注文なし",
                    qty: "数量",
                    total: "合計",
                    clearBtn: "テーブルを削除",
                    payBtn: "お会計",
                    chooseMethod: "お支払い方法を選択",
                    methodCash: "現金",
                    methodQR: "QRコード",
                    methodCard: "銀行カード",
                    confirmDelete: "この料理を削除しますか？",
                    confirmClear: "このテーブルの全ての料理を削除しますか？",
                    confirmPay: "このテーブルのお会計をしますか？",
                    confirmPaid: "支払い済み",
                    paySuccess: "お会計完了！",
                    qrTitle: "QR振込",
                    qrBank: "銀行",
                    qrAccount: "口座番号",
                    qrName: "口座名義",
                    qrAmount: "金額",
                    qrContent: "振込内容",
                    cardTitle: "カード決済",
                    cardWaiting: "POS端末接続中...",
                    cardHint: "POS端末でカードをかざしてください",
                    table: "テーブル",
                    qrSessionBtn: "📱 QR",
                    qrSessionTitle: "テーブルセッションQR",
                    qrSessionInfo: "お客様がこのQRをスキャンしてテーブルにアクセスします",
                    qrSessionCopy: "リンクをコピー",
                    qrSessionCopied: "コピーしました!",
                    callLabel: "呼ぶ",
                    callActiveHint: "スタッフ呼び出し中です。ランプを押すと解除できます。",
                    callInactiveHint: "スタッフ呼び出しはありません。",
                    callResolveError: "スタッフ呼び出し通知を解除できません。"
                  },
                  notification: {
                    confirm: "確認",
                    cancel: "キャンセル",
                    ok: "OK",
                    warning: "警告",
                    error: "エラー",
                    success: "成功",
                    info: "お知らせ",
                  },
                  status: {
                    pending: "待機中",
                    cooking: "調理中",
                    done: "完了",
                  },
                  history: {
                    tab: "📝 支払い履歴",
                    title: "📝 支払い履歴",
                    reload: "🔄 再読み込み",
                    time: "時間",
                    table: "テーブル",
                    amount: "金額",
                    method: "支払い方法",
                    transId: "取引 ID",
                    empty: "まだ取引はありません。",
                    methodNames: { casso: "Casso", cash: "現金", card: "カード", qr: "その他のQR" }
                  }
                },
                zh: {
                  title: "Yaki 管理员",
                  login: {
                    title: "Yaki 管理员",
                    emailPlaceholder: "邮箱",
                    passwordPlaceholder: "密码",
                    btn: "登录",
                    error: "登录错误",
                  },
                  header: {
                    title: "👔 Yaki 管理员",
                    logout: "退出",
                  },
                  dashboard: {
                    serving: "服务中",
                    noItems: "暂无菜品",
                    qty: "数量",
                    total: "总计",
                    clearBtn: "删除桌台",
                    payBtn: "结账",
                    chooseMethod: "选择付款方式",
                    methodCash: "现金",
                    methodQR: "二维码",
                    methodCard: "银行卡",
                    confirmDelete: "删除此菜品？",
                    confirmClear: "确定要清空此桌的所有菜品吗？",
                    confirmPay: "确定要为此桌结账吗？",
                    confirmPaid: "已付款",
                    paySuccess: "结账成功！",
                    qrTitle: "QR转账",
                    qrBank: "银行",
                    qrAccount: "账号",
                    qrName: "户名",
                    qrAmount: "金额",
                    qrContent: "转账内容",
                    cardTitle: "卡片支付",
                    cardWaiting: "等待POS机连接...",
                    cardHint: "请在POS机上刷卡/拍卡",
                    table: "桌",
                    qrSessionBtn: "📱 QR",
                    qrSessionTitle: "桌位会话QR",
                    qrSessionInfo: "客人扫码访问桌位",
                    qrSessionCopy: "复制链接",
                    qrSessionCopied: "已复制!",
                    callLabel: "呼叫",
                    callActiveHint: "当前有呼叫服务员请求。点击灯即可关闭通知。",
                    callInactiveHint: "当前没有呼叫服务员请求。",
                    callResolveError: "无法关闭呼叫服务员通知。"
                  },
                  notification: {
                    confirm: "确认",
                    cancel: "取消",
                    ok: "确定",
                    warning: "警告",
                    error: "错误",
                    success: "成功",
                    info: "通知",
                  },
                  status: {
                    pending: "等待中",
                    cooking: "烹饪中",
                    done: "完成",
                  },
                  history: {
                    tab: "📝 交易记录",
                    title: "📝 交易记录",
                    reload: "🔄 刷新",
                    time: "时间",
                    table: "桌号",
                    amount: "金额",
                    method: "支付方式",
                    transId: "交易号",
                    empty: "暂无交易。",
                    methodNames: { casso: "Casso", cash: "现金", card: "刷卡", qr: "其他二维码" }
                  }
                },
              };

              let currentLang = localStorage.getItem("kitchenLang") || "vi";

              function changeLanguage(lang) {
                currentLang = lang;
                localStorage.setItem("kitchenLang", lang);
                document.getElementById("langSelect").value = lang;
                updateStaticText();
                loadTables(); // Re-render tables with new language
              }

              function updateStaticText() {
                const t = translations[currentLang];
                document.title = t.title;

                // Login Screen
                document.getElementById("loginTitle").innerText = t.login.title;
                document.getElementById("email").placeholder = t.login.emailPlaceholder;
                document.getElementById("password").placeholder =
                  t.login.passwordPlaceholder;
                document.getElementById("loginBtn").innerText = t.login.btn;

                // Sync both language selectors
                const loginLangSelect = document.getElementById("loginLangSelect");
                const dashboardLangSelect = document.getElementById("langSelect");
                if (loginLangSelect) loginLangSelect.value = currentLang;
                if (dashboardLangSelect) dashboardLangSelect.value = currentLang;

                // Header
                document.getElementById("headerLogo").innerText = t.header.title;
                document.getElementById("logoutBtn").innerText = t.header.logout;
              }

              function getServiceCallResetData() {
                return {
                  serviceCallActive: false,
                  serviceCallRequestedAt: firebase.firestore.FieldValue.delete(),
                  serviceCallResolvedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
              }

              async function clearServiceCall(tableId) {
                try {
                  await db.collection("tables").doc(tableId).update({
                    ...getServiceCallResetData()
                  });
                } catch (error) {
                  console.error("Error clearing service call:", error);
                  await showAlert(translations[currentLang].dashboard.callResolveError, "error");
                }
              }

              // Initialize text on load
              updateStaticText();

              // Auth Listener
              auth.onAuthStateChanged((user) => {
                if (user) {
                  document.getElementById("loginPanel").style.display = "none";
                  document.getElementById("mainApp").style.display = "block";
                  document.getElementById("dashboard").style.display = "grid"; // Fix display
                  // Set initial language selector value
                  document.getElementById("langSelect").value = currentLang;
                  loadTables();
                } else {
                  document.getElementById("loginPanel").style.display = "flex";
                  document.getElementById("mainApp").style.display = "none";
                }
              });

              function login() {
                const email = document.getElementById("email").value;
                const pass = document.getElementById("password").value;
                auth.signInWithEmailAndPassword(email, pass).catch((e) => {
                  showAlert(e.message, "error");
                });
              }

              /* ======================= CUSTOM NOTIFICATION SYSTEM ======================= */
              function showConfirm(message, icon = "⚠️") {
                return new Promise((resolve) => {
                  const t = translations[currentLang].notification;

                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
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
                  setTimeout(
                    () => overlay.querySelector("#notifyConfirm").focus(),
                    100,
                  );

                  const closeModal = (result) => {
                    overlay.classList.add("closing");
                    setTimeout(() => {
                      overlay.remove();
                      resolve(result);
                    }, 200);
                  };

                  overlay
                    .querySelector("#notifyCancel")
                    .addEventListener("click", () => closeModal(false));
                  overlay
                    .querySelector("#notifyConfirm")
                    .addEventListener("click", () => closeModal(true));

                  // Close on backdrop click
                  overlay.addEventListener("click", (e) => {
                    if (e.target === overlay) closeModal(false);
                  });

                  // Keyboard support
                  overlay.addEventListener("keydown", (e) => {
                    if (e.key === "Escape") closeModal(false);
                    if (e.key === "Enter") closeModal(true);
                  });
                });
              }

              function showAlert(message, type = "info") {
                return new Promise((resolve) => {
                  const t = translations[currentLang].notification;

                  // Determine icon and title based on type
                  let icon, title;
                  if (type === "error") {
                    icon = "❌";
                    title = t.error || "Error";
                  } else if (type === "success") {
                    icon = "✅";
                    title = t.success || "Success";
                  } else {
                    icon = "ℹ️";
                    title = t.info || "Info";
                  }

                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
                  overlay.innerHTML = `
                            <div class="notification-modal ${type === "error" ? "error" : ""}">
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
                  setTimeout(() => overlay.querySelector("#notifyOk").focus(), 100);

                  const closeModal = () => {
                    overlay.classList.add("closing");
                    setTimeout(() => {
                      overlay.remove();
                      resolve();
                    }, 200);
                  };

                  overlay
                    .querySelector("#notifyOk")
                    .addEventListener("click", closeModal);

                  // Close on backdrop click
                  overlay.addEventListener("click", (e) => {
                    if (e.target === overlay) closeModal();
                  });

                  // Keyboard support
                  overlay.addEventListener("keydown", (e) => {
                    if (e.key === "Escape" || e.key === "Enter") closeModal();
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

                  db.collection("tables").onSnapshot((snapshot) => {
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
                      const hasServiceCall = data.serviceCallActive === true;

                      // (Webhook auto-close is now handled inside showQRPayment via its own onSnapshot listener)

                      let ordersHtml = "";
                      let tableTotal = 0;

                      if (hasOrders) {
                        data.orders.forEach((item, orderIndex) => {
                          let name = item.name;
                          if (typeof item.name === "object") {
                            name = item.name[currentLang] || item.name.vi || item.name;
                          }

                          const itemTotal = item.qty * item.price;
                          tableTotal += itemTotal;

                          const itemStatus = item.status || "pending";
                          const statusLabel = translations[currentLang].status[itemStatus];
                          const isDone = itemStatus === "done";

                          ordersHtml += `
                                        <div class="order-item ${isDone ? "item-done" : ""}">
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
                                            
                                            <div style="display:flex; align-items:center;">
                                                <input type="number" class="item-qty-input" value="${item.qty}"
                                                    onchange="updateOrderQtyByIndex('${tableId}', ${orderIndex}, this.value)"
                                                    style="margin-right: 5px;">
                                                <button class="action-btn delete-btn" onclick="deleteOrderItemByIndex('${tableId}', ${orderIndex})">X</button>
                                            </div>
                                        </div>
                                    `;
                        });
                      } else {
                        ordersHtml = `<div style='color:#777; font-style:italic;'>${t.noItems}</div>`;
                      }

                      const tableName = `${t.table} ${i}`;

                      dashboard.innerHTML += `
                                <div class="table-card ${hasOrders ? "active" : ""} ${hasServiceCall ? "calling" : ""}">
                                    <div class="table-header">
                                        <div class="table-header-main">
                                            <div class="table-name">${tableName}</div>
                                            <button class="call-lamp-btn ${hasServiceCall ? "active" : ""}"
                                                onclick="clearServiceCall('${tableId}')"
                                                title="${t.callLabel}: ${hasServiceCall ? t.callActiveHint : t.callInactiveHint}"
                                                aria-label="${t.callLabel}: ${hasServiceCall ? t.callActiveHint : t.callInactiveHint}"
                                                ${hasServiceCall ? "" : "disabled"}>
                                                💡
                                            </button>
                                        </div>
                                        <div class="status-badge" style="visibility: ${hasOrders ? "visible" : "hidden"}">${t.serving}</div>
                                    </div>

                                    <div class="order-list">
                                        ${ordersHtml}
                                    </div>

                                    <div style="margin-top: 10px; border-top: 1px solid #333; padding-top: 10px; font-weight: bold; text-align: right; color: #ffa64d;">
                                        ${t.total}: ${tableTotal.toLocaleString()} đ
                                    </div>

                                    <div class="footer-actions">
                                        <button class="clear-btn" onclick="clearTable('${tableId}')">
                                            ${t.clearBtn}
                                        </button>
                                        <button class="pay-btn" style="background: linear-gradient(135deg, #3b82f6, #2563eb); flex: 0 0 auto; padding: 8px 12px; min-width: unset;" onclick="openTableSession('${tableId}')">
                                            ${t.qrSessionBtn}
                                        </button>
                                        <button class="pay-btn" onclick="payTable('${tableId}')">
                                            💳 ${t.payBtn}
                                        </button>
                                    </div>
                                </div>
                            `;
                    }
                  });
                }).catch(err => {
                  console.error('Error loading table count:', err);
                  // Fallback: load chỉ từ collection nếu lỗi
                });
              }

              async function updateOrderQty(tableId, itemId, newQty) {
                newQty = parseInt(newQty);
                if (newQty < 0) return;

                const ref = db.collection("tables").doc(tableId);
                const doc = await ref.get();
                let orders = doc.data().orders || [];

                // Tìm thông tin món (để giữ lại name, price, etc. nếu cần tạo lại)
                const itemInfo = orders.find((o) => o.id == itemId);
                if (!itemInfo) return; // Should not happen

                // Xóa tất cả các entry cũ của món này (để tránh duplicate lẻ tẻ)
                orders = orders.filter((o) => o.id != itemId);

                // Nếu số lượng > 0, thêm lại 1 entry gộp
                if (newQty > 0) {
                  orders.push({
                    ...itemInfo,
                    qty: newQty,
                  });
                }

                await ref.update({ orders: orders });
              }

              async function deleteOrderItem(tableId, itemId) {
                const confirmed = await showConfirm(
                  translations[currentLang].dashboard.confirmDelete,
                  "🗑️",
                );
                if (!confirmed) return;

                const ref = db.collection("tables").doc(tableId);
                const doc = await ref.get();
                let orders = doc.data().orders || [];

                // Xóa tất cả entry có id này
                orders = orders.filter((o) => o.id != itemId);

                await ref.update({ orders: orders });
              }

              async function clearTable(tableId) {
                const confirmed = await showConfirm(
                  translations[currentLang].dashboard.confirmClear,
                  "🧹",
                );
                if (!confirmed) return;

                // Chỉ xóa orders, không set status free nữa (hoặc giữ status active để client biết)
                await db.collection("tables").doc(tableId).update({
                  orders: [],
                  total: 0,
                  sessionToken: firebase.firestore.FieldValue.delete(),
                  sessionCreatedAt: firebase.firestore.FieldValue.delete(),
                  ...getServiceCallResetData()
                });
              }

              // Thanh toán bàn - hiện bảng chọn phương thức
              async function payTable(tableId) {
                const t = translations[currentLang].dashboard;

                // Lấy thông tin bàn để tính tổng tiền
                const ref = db.collection("tables").doc(tableId);
                const doc = await ref.get();
                const data = doc.data();
                const orders = data.orders || [];

                if (orders.length === 0) {
                  await showAlert(t.noItems);
                  return;
                }

                let totalAmount = 0;
                orders.forEach((item) => {
                  totalAmount += item.qty * item.price;
                });

                // Hiện bảng chọn phương thức thanh toán
                const selectedMethod = await showPaymentMethods(tableId, totalAmount);
                if (!selectedMethod) return;

                // Xử lý theo phương thức đã chọn
                console.log(`[Payment] Provider: ${selectedMethod}, Table: ${tableId}, Total: ${totalAmount} VND`);

                const methodName = selectedMethod === 'cash' ? t.methodCash : selectedMethod === 'qr' ? t.methodQR : t.methodCard;
                let confirmed = false;

                if (selectedMethod === 'qr') {
                  // Hiện popup QR chuyển khoản (có listener webhook tự đóng)
                  confirmed = await showQRPayment(tableId, totalAmount, {
                    initialOrderCount: orders.length,
                    initialSessionToken: data.sessionToken || null,
                    initialLastPaymentTid: data.lastPayment?.tid || null,
                    initialLastPaymentPaidAt: data.lastPayment?.paidAt || null
                  });
                } else if (selectedMethod === 'card') {
                  // Hiện popup chờ máy POS
                  confirmed = await showCardPayment(tableId, totalAmount);
                } else {
                  // Tiền mặt - Hiện xác nhận "Đã thanh toán" / "Hủy"
                  confirmed = await showPayConfirm(
                    methodName + " - " + t.total + ": " + totalAmount.toLocaleString() + " đ",
                    t.confirmPaid,
                    translations[currentLang].notification.cancel
                  );
                }
                if (!confirmed) return;

                // Nếu webhook Casso đã xử lý (confirmed === 'webhook'), bàn đã được xóa rồi
                if (confirmed === 'webhook') {
                    console.log(`[Payment] Webhook đã xử lý thanh toán cho ${tableId}`);
                    await showAlert("✅ " + t.paySuccess + "\n" + t.methodQR + " (Casso) - " + t.total + ": " + totalAmount.toLocaleString() + " đ", 'success');
                    return;
                }

                // Lưu hóa đơn vào Firestore (chỉ khi thanh toán thủ công)
                const now = new Date();
                const invoiceId = `INV-${tableId.replace(/\D/g, '') || tableId}-${now.getTime()}`;
                const paymentData = {
                  invoiceId: invoiceId,
                  tableId: tableId,
                  items: orders.map(item => ({
                    name: item.name || item.id,
                    qty: item.qty,
                    price: item.price,
                    subtotal: item.qty * item.price
                  })),
                  totalAmount: totalAmount,
                  method: selectedMethod,
                  methodName: methodName,
                  paidAt: firebase.firestore.FieldValue.serverTimestamp(),
                  paidAtLocal: now.toISOString(),
                  paidBy: firebase.auth().currentUser?.email || "unknown"
                };

                try {
                  await db.collection("payments").add(paymentData);
                  console.log(`[Invoice] ${invoiceId} saved - ${methodName} - ${totalAmount} VND`);
                } catch (err) {
                  console.error("[Invoice] Failed to save payment:", err);
                }

                // Xóa bàn sau khi lưu hóa đơn
                await db.collection("tables").doc(tableId).update({
                  orders: [],
                  total: 0,
                  sessionToken: firebase.firestore.FieldValue.delete(),
                  sessionCreatedAt: firebase.firestore.FieldValue.delete(),
                  ...getServiceCallResetData()
                });
                await showAlert("✅ " + t.paySuccess + "\n" + methodName + " - " + t.total + ": " + totalAmount.toLocaleString() + " đ");
              }

              /* ======================= SESSION QR CODE ======================= */
              // Tạo token ngẫu nhiên 12 ký tự
              function generateSessionToken() {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let token = '';
                for (let i = 0; i < 12; i++) {
                  token += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return token;
              }

              function generatePaymentRequestId() {
                return `P${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
              }

              // Mở bàn và tạo QR session (dùng lại token cũ nếu có)
              async function openTableSession(tableId) {
                const t = translations[currentLang].dashboard;
                const nt = translations[currentLang].notification;
                const tableNum = tableId.split('_')[1];

                let token;

                // Kiểm tra xem đã có session token chưa
                try {
                  const existingDoc = await db.collection('tables').doc(tableId).get();
                  if (existingDoc.exists && existingDoc.data().sessionToken) {
                    // Dùng lại token cũ → khách không bị ngắt
                    token = existingDoc.data().sessionToken;
                    console.log('♻️ Reusing existing token for', tableId);
                  } else {
                    // Tạo token mới
                    token = generateSessionToken();
                    await db.collection('tables').doc(tableId).set({
                      sessionToken: token,
                      sessionCreatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    console.log('🆕 Created new token for', tableId);
                  }
                } catch (error) {
                  console.error('Error creating session:', error);
                  await showAlert('Lỗi tạo phiên!', 'error');
                  return;
                }

                // Tạo URL cho khách
                const baseUrl = window.location.origin + window.location.pathname.replace('manager.html', 'customer.html');
                const customerUrl = `${baseUrl}?table=${tableNum}&token=${token}`;

                // Tạo QR code URL (dùng QR Server API miễn phí)
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(customerUrl)}`;

                // Hiển popup QR
                const overlay = document.createElement('div');
                overlay.className = 'notification-overlay';
                overlay.innerHTML = `
                  <div class="notification-modal" style="border-color: #3b82f6; max-width: 380px;">
                    <div class="notification-icon">📱</div>
                    <div class="notification-title" style="color: #3b82f6;">${t.qrSessionTitle} - ${t.table} ${tableNum}</div>

                    <div class="qr-payment-container">
                      <img src="${qrUrl}" alt="Session QR" style="border-radius: 12px;" />
                      <div class="qr-bank-info" style="margin-top: 12px; font-size: 13px;">
                        ${t.qrSessionInfo}
                      </div>
                    </div>

                    <div class="notification-buttons" style="margin-top: 15px; gap: 8px;">
                      <button class="notification-btn cancel" id="qrSessionClose">${nt.ok}</button>
                      <button class="notification-btn confirm" id="qrSessionCopy" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff;">${t.qrSessionCopy}</button>
                    </div>
                  </div>
                `;

                document.body.appendChild(overlay);

                const closeModal = () => {
                  overlay.classList.add('closing');
                  setTimeout(() => overlay.remove(), 200);
                };

                overlay.querySelector('#qrSessionClose').addEventListener('click', closeModal);
                overlay.addEventListener('click', (e) => {
                  if (e.target === overlay) closeModal();
                });

                // Copy link button
                overlay.querySelector('#qrSessionCopy').addEventListener('click', async () => {
                  try {
                    await navigator.clipboard.writeText(customerUrl);
                    const btn = overlay.querySelector('#qrSessionCopy');
                    btn.innerText = t.qrSessionCopied;
                    setTimeout(() => btn.innerText = t.qrSessionCopy, 2000);
                  } catch (err) {
                    console.error('Copy failed:', err);
                  }
                });
              }

              // Xác nhận đã thanh toán
              function showPayConfirm(message, confirmText, cancelText) {
                return new Promise((resolve) => {
                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
                  overlay.innerHTML = `
                    <div class="notification-modal" style="border-color: #4ade80;">
                      <div class="notification-icon">💰</div>
                      <div class="notification-title" style="color: #4ade80;">${translations[currentLang].notification.confirm}</div>
                      <div class="notification-message">${message}</div>
                      <div class="notification-buttons">
                        <button class="notification-btn cancel" id="payConfirmCancel">${cancelText}</button>
                        <button class="notification-btn confirm" id="payConfirmOk" style="background: linear-gradient(135deg, #4ade80, #22c55e); color: #000;">${confirmText}</button>
                      </div>
                    </div>
                  `;

                  document.body.appendChild(overlay);
                  setTimeout(() => overlay.querySelector("#payConfirmOk").focus(), 100);

                  const closeModal = (result) => {
                    overlay.classList.add("closing");
                    setTimeout(() => {
                      overlay.remove();
                      resolve(result);
                    }, 200);
                  };

                  overlay.querySelector("#payConfirmCancel").addEventListener("click", () => closeModal(false));
                  overlay.querySelector("#payConfirmOk").addEventListener("click", () => closeModal(true));
                });
              }

              // Hiện popup QR chuyển khoản VietQR (có listener webhook tự đóng)
              function showQRPayment(tableId, totalAmount, initialState = {}) {
                return new Promise((resolve) => {
                  const t = translations[currentLang].dashboard;
                  const nt = translations[currentLang].notification;
                  const baselineOrderCount = Number.isFinite(initialState.initialOrderCount) ? initialState.initialOrderCount : 0;
                  const baselineSessionToken = initialState.initialSessionToken || null;
                  const baselineLastPaymentTid = initialState.initialLastPaymentTid ? String(initialState.initialLastPaymentTid) : null;
                  const baselineLastPaymentPaidAt = initialState.initialLastPaymentPaidAt || null;
                  const paymentRequestId = generatePaymentRequestId();

                  // Tạo nội dung chuyển khoản riêng cho từng lần thanh toán
                  const now = new Date();
                  const dd = String(now.getDate()).padStart(2, '0');
                  const mm = String(now.getMonth() + 1).padStart(2, '0');
                  const yyyy = now.getFullYear();
                  const hh = String(now.getHours()).padStart(2, '0');
                  const min = String(now.getMinutes()).padStart(2, '0');
                  const ss = String(now.getSeconds()).padStart(2, '0');
                  const tableNum = tableId.replace(/\D/g, '') || tableId;
                  const transferContent = `YAKI BAN${tableNum} ${dd}${mm}${yyyy} ${hh}${min}${ss} ${paymentRequestId}`;

                  // VietQR URL
                  const bankCode = "BIDV";
                  const accountNo = "V3CASS862003";
                  const accountName = "HUYNH VU QUOC HUY";
                  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact.png?amount=${totalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
                  overlay.innerHTML = `
                    <div class="notification-modal" data-table-id="${tableId}" style="border-color: #3b82f6; max-width: 360px;">
                      <div class="notification-icon">🏦</div>
                      <div class="notification-title" style="color: #3b82f6;">${t.qrTitle}</div>

                      <div class="qr-payment-container">
                        <img src="${qrUrl}" alt="VietQR" />
                        <div class="qr-bank-info">
                          ${t.qrBank}: <strong>BIDV</strong><br>
                          ${t.qrAccount}: <strong>${accountNo}</strong><br>
                          ${t.qrName}: <strong>${accountName}</strong><br>
                          ${t.qrAmount}: <strong>${totalAmount.toLocaleString()} đ</strong><br>
                          ${t.qrContent}: <strong>${transferContent}</strong>
                        </div>
                      </div>

                      <div id="qrStatusMsg" style="margin-top: 10px; font-size: 13px; color: #aaa; text-align: center;">⏳ Đang chờ xác nhận thanh toán...</div>

                      <div class="notification-buttons" style="margin-top: 15px;">
                        <button class="notification-btn cancel" id="qrCancel">${nt.cancel}</button>
                        <button class="notification-btn confirm" id="qrConfirm" style="background: linear-gradient(135deg, #4ade80, #22c55e); color: #000;">${t.confirmPaid}</button>
                      </div>
                    </div>
                  `;

                  document.body.appendChild(overlay);

                  let resolved = false;
                  let unsubscribe = null;
                  let isFinalizingPayment = false;
                  const statusMsg = overlay.querySelector("#qrStatusMsg");

                  const closeModal = (result) => {
                      if (resolved) return;
                      resolved = true;
                      // Hủy listener Firestore
                      if (unsubscribe) unsubscribe();
                      overlay.classList.add("closing");
                      setTimeout(() => {
                          overlay.remove();
                          resolve(result);
                      }, 200);
                  };

                  const finalizeWebhookPayment = async (reason) => {
                      if (resolved || isFinalizingPayment) return;
                      isFinalizingPayment = true;

                      if (statusMsg) {
                          statusMsg.innerText = "✅ " + t.paySuccess;
                          statusMsg.style.color = "#4ade80";
                      }

                      try {
                          await db.collection("tables").doc(tableId).set({
                              orders: [],
                              total: 0,
                              sessionToken: firebase.firestore.FieldValue.delete(),
                              sessionCreatedAt: firebase.firestore.FieldValue.delete(),
                              ...getServiceCallResetData()
                          }, { merge: true });
                          console.log(`[QR Payment] Finalized from manager for ${tableId} via ${reason}`);
                      } catch (error) {
                          console.error(`[QR Payment] Failed to finalize ${tableId} via ${reason}:`, error);
                      } finally {
                          closeModal('webhook');
                      }
                  };

                  // Lắng nghe Firestore realtime: khi webhook Casso xóa orders → tự đóng popup
                  unsubscribe = db.collection('tables').doc(tableId).onSnapshot((docSnap) => {
                      if (resolved) return;

                      const data = docSnap.data();
                      const orders = data?.orders || [];
                      const currentSessionToken = data?.sessionToken || null;
                      const lastPayment = data?.lastPayment || null;
                      const lastPaymentTid = lastPayment?.tid ? String(lastPayment.tid) : null;
                      const lastPaymentPaidAt = lastPayment?.paidAt || null;
                      const lastPaymentAmount = Number(lastPayment?.amount || 0);
                      const lastPaymentDescription = String(lastPayment?.description || '').toUpperCase();
                      const requestIdMatched = lastPaymentDescription.includes(paymentRequestId);
                      console.log(`[QR Listener] ${tableId} snapshot: ${orders.length} orders, resolved=${resolved}, baselineOrders=${baselineOrderCount}`);

                      const ordersWereCleared = baselineOrderCount > 0 && orders.length === 0;
                      const sessionWasReset = !!baselineSessionToken && currentSessionToken !== baselineSessionToken;
                      const bankTransferDetected =
                          lastPayment?.method === 'bank_transfer' &&
                          lastPaymentAmount >= totalAmount &&
                          (
                              requestIdMatched ||
                              (lastPaymentTid && lastPaymentTid !== baselineLastPaymentTid) ||
                              (lastPaymentPaidAt && lastPaymentPaidAt !== baselineLastPaymentPaidAt)
                          );

                      if (ordersWereCleared || sessionWasReset) {
                          console.log(`[QR Payment] ✅ Webhook detected for ${tableId}: ordersCleared=${ordersWereCleared}, sessionWasReset=${sessionWasReset}`);
                          closeModal('webhook');
                          return;
                      }

                      if (bankTransferDetected) {
                          console.log(`[QR Payment] Detected lastPayment for ${tableId}, finishing table reset on manager.`);
                          finalizeWebhookPayment('lastPayment');
                      }
                  });

                  overlay.querySelector("#qrCancel").addEventListener("click", () => closeModal(false));
                  overlay.querySelector("#qrConfirm").addEventListener("click", () => closeModal(true));
                });
              }

              // Hiện popup thanh toán thẻ / máy POS
              function showCardPayment(tableId, totalAmount) {
                return new Promise((resolve) => {
                  const t = translations[currentLang].dashboard;
                  const nt = translations[currentLang].notification;

                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
                  overlay.innerHTML = `
                    <div class="notification-modal" style="border-color: #8b5cf6; max-width: 360px;">
                      <div class="notification-icon">💳</div>
                      <div class="notification-title" style="color: #8b5cf6;">${t.cardTitle}</div>
                      <div class="notification-message">${t.total}: <strong style="color: #ffa64d; font-size: 20px;">${totalAmount.toLocaleString()} đ</strong></div>

                      <div style="margin-top: 18px; text-align: center;">
                        <div style="font-size: 48px; animation: pulse 1.5s infinite;">📟</div>
                        <div style="color: #a78bfa; font-size: 14px; margin-top: 8px; font-weight: 600;">${t.cardWaiting}</div>
                        <div style="color: #888; font-size: 12px; margin-top: 6px;">${t.cardHint}</div>
                      </div>

                      <div class="notification-buttons" style="margin-top: 20px;">
                        <button class="notification-btn cancel" id="cardCancel">${nt.cancel}</button>
                        <button class="notification-btn confirm" id="cardConfirm" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #fff;">${t.confirmPaid}</button>
                      </div>
                    </div>
                  `;

                  document.body.appendChild(overlay);

                  // TODO: Kết nối máy POS API ở đây
                  // Khi POS trả về thành công → closeModal(true)
                  // Ví dụ: posTerminal.charge(totalAmount).then(() => closeModal(true));

                  const closeModal = (result) => {
                    overlay.classList.add("closing");
                    setTimeout(() => {
                      overlay.remove();
                      resolve(result);
                    }, 200);
                  };

                  overlay.querySelector("#cardCancel").addEventListener("click", () => closeModal(false));
                  overlay.querySelector("#cardConfirm").addEventListener("click", () => closeModal(true));
                });
              }

              // Bảng chọn phương thức thanh toán
              function showPaymentMethods(tableId, totalAmount) {
                return new Promise((resolve) => {
                  const t = translations[currentLang].dashboard;
                  const nt = translations[currentLang].notification;
                  const overlay = document.createElement("div");
                  overlay.className = "notification-overlay";
                  overlay.innerHTML = `
                    <div class="notification-modal" style="border-color: #4ade80;">
                      <div class="notification-icon">💳</div>
                      <div class="notification-title" style="color: #4ade80;">${t.chooseMethod}</div>
                      <div class="notification-message">${t.total}: <strong style="color: #ffa64d; font-size: 18px;">${totalAmount.toLocaleString()} đ</strong></div>

                      <div class="payment-methods-grid">
                        <button class="payment-method-btn cash" data-method="cash">
                          <span class="pay-icon">💵</span> ${t.methodCash}
                        </button>
                        <button class="payment-method-btn qr" data-method="qr">
                          <span class="pay-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/></svg></span> ${t.methodQR}
                        </button>
                        <button class="payment-method-btn card" data-method="card">
                          <span class="pay-icon">💳</span> ${t.methodCard}
                        </button>
                      </div>

                      <div class="notification-buttons" style="margin-top: 15px;">
                        <button class="notification-btn cancel" id="payCancel" style="width: 100%; border-radius: 10px;">
                          ${nt.cancel}
                        </button>
                      </div>
                    </div>
                  `;

                  document.body.appendChild(overlay);

                  const closeModal = (result) => {
                    overlay.classList.add("closing");
                    setTimeout(() => {
                      overlay.remove();
                      resolve(result);
                    }, 200);
                  };

                  overlay.querySelectorAll(".payment-method-btn").forEach(btn => {
                    btn.addEventListener("click", () => closeModal(btn.dataset.method));
                  });

                  overlay.querySelector("#payCancel").addEventListener("click", () => closeModal(null));
                });
              }


              // Cycle item status: pending → cooking → done → pending
              async function cycleItemStatus(tableId, itemId) {
                const ref = db.collection("tables").doc(tableId);
                const doc = await ref.get();
                let orders = doc.data().orders || [];

                // Define status cycle
                const statusCycle = {
                  pending: "cooking",
                  cooking: "done",
                  done: "pending",
                };

                // Update status for all items with matching id
                orders = orders.map((o) => {
                  if (o.id === itemId) {
                    const currentStatus = o.status || "pending";
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
                  pending: "cooking",
                  cooking: "done",
                  done: "pending",
                };

                const currentStatus = orders[orderIndex].status || "pending";
                orders[orderIndex] = {
                  ...orders[orderIndex],
                  status: statusCycle[currentStatus],
                };

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
                const confirmed = await showConfirm(
                  translations[currentLang].dashboard.confirmDelete,
                  "🗑️",
                );
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
              const GEMINI_API_URL = "YOUR_GEMINI_PROXY_URL";

              // Admin translations
              const adminTranslations = {
                vi: {
                  tabs: { orders: "📋 Đơn hàng", menu: "🍽️ Quản lý món", categories: "📂 Danh mục", tables: "🪑 Quản lý bàn" },
                  menu: {
                    title: "📋 Quản lý thực đơn",
                    addBtn: "+ Thêm món", editBtn: "Sửa", deleteBtn: "Xóa", confirmDelete: "Xóa món này?",
                    categories: { nuong: "Món nướng", lau: "Lẩu", mon_phu: "Món phụ", nuoc: "Đồ uống", khai_vi: "Khai vị", trang_mieng: "Tráng miệng" }
                  },
                  categories: { title: "📂 Quản lý danh mục", addBtn: "+ Thêm danh mục" },
                  tables: {
                    title: "🪑 Quản lý bàn", countLabel: "Số bàn hiện tại:",
                    addBtn: "+ Thêm bàn", removeBtn: "- Xóa bàn", confirmRemove: "Xóa bàn cuối cùng?", cannotRemove: "Không thể xóa thêm bàn!"
                  },
                  modal: {
                    addTitle: "Thêm món mới", editTitle: "Sửa món", nameLabel: "Tên món (Tiếng Việt) *", categoryLabel: "Danh mục *",
                    priceLabel: "Giá (VND) *", imageLabel: "URL Ảnh", availableLabel: "Còn hàng", cancelBtn: "Hủy", saveBtn: "💾 Lưu & Dịch tự động", translating: "🔄 Đang dịch..."
                  },
                  categoryModal: {
                    addTitle: "Thêm danh mục mới", editTitle: "Sửa danh mục", keyLabel: "Mã danh mục (không dấu) *", nameLabel: "Tên danh mục (Tiếng Việt) *", cancelBtn: "Hủy", saveBtn: "💾 Lưu & Dịch tự động"
                  }
                },
                en: {
                  tabs: { orders: "📋 Orders", menu: "🍽️ Menu", categories: "📂 Categories", tables: "🪑 Tables" },
                  menu: {
                    title: "📋 Menu Management",
                    addBtn: "+ Add Item", editBtn: "Edit", deleteBtn: "Delete", confirmDelete: "Delete this item?",
                    categories: { nuong: "Grilled", lau: "Hotpot", mon_phu: "Side Dishes", nuoc: "Drinks", khai_vi: "Appetizer", trang_mieng: "Dessert" }
                  },
                  categories: { title: "📂 Category Management", addBtn: "+ Add Category" },
                  tables: {
                    title: "🪑 Table Management", countLabel: "Current tables:",
                    addBtn: "+ Add Table", removeBtn: "- Remove Table", confirmRemove: "Remove last table?", cannotRemove: "Cannot remove more tables!"
                  },
                  modal: {
                    addTitle: "Add New Item", editTitle: "Edit Item", nameLabel: "Name (Vietnamese) *", categoryLabel: "Category *",
                    priceLabel: "Price (VND) *", imageLabel: "Image URL", availableLabel: "Available", cancelBtn: "Cancel", saveBtn: "💾 Save & Auto-translate", translating: "🔄 Translating..."
                  },
                  categoryModal: {
                    addTitle: "Add New Category", editTitle: "Edit Category", keyLabel: "Category Key (no accents) *", nameLabel: "Category Name (Vietnamese) *", cancelBtn: "Cancel", saveBtn: "💾 Save & Auto-translate"
                  }
                },
                ko: {
                  tabs: { orders: "📋 주문", menu: "🍽️ 메뉴 관리", categories: "📂 카테고리", tables: "🪑 테이블 관리" },
                  menu: {
                    title: "📋 메뉴 관리",
                    addBtn: "+ 메뉴 추가", editBtn: "편집", deleteBtn: "삭제", confirmDelete: "이 메뉴를 삭제하시겠습니까?",
                    categories: { nuong: "구이", lau: "전골", mon_phu: "사이드 메뉴", nuoc: "음료", khai_vi: "에피타이저", trang_mieng: "디저트" }
                  },
                  categories: { title: "📂 카테고리 관리", addBtn: "+ 카테고리 추가" },
                  tables: {
                    title: "🪑 테이블 관리", countLabel: "현재 테이블:",
                    addBtn: "+ 테이블 추가", removeBtn: "- 테이블 삭제", confirmRemove: "마지막 테이블을 삭제하시겠습니까?", cannotRemove: "더 이상 삭제할 수 없습니다!"
                  },
                  modal: {
                    addTitle: "새 메뉴 추가", editTitle: "메뉴 편집", nameLabel: "메뉴명 (베트남어) *", categoryLabel: "카테고리 *",
                    priceLabel: "가격 (VND) *", imageLabel: "이미지 URL", availableLabel: "품절 여부", cancelBtn: "취소", saveBtn: "💾 저장 및 자동 번역", translating: "🔄 번역 중..."
                  },
                  categoryModal: {
                    addTitle: "새 카테고리 추가", editTitle: "카테고리 편집", keyLabel: "카테고리 코드 *", nameLabel: "카테고리명 (베트남어) *", cancelBtn: "취소", saveBtn: "💾 저장 및 자동 번역"
                  }
                },
                ja: {
                  tabs: { orders: "📋 注文", menu: "🍽️ メニュー管理", categories: "📂 カテゴリ", tables: "🪑 テーブル管理" },
                  menu: {
                    title: "📋 メニュー管理",
                    addBtn: "+ メニュー追加", editBtn: "編集", deleteBtn: "削除", confirmDelete: "このメニューを削除しますか？",
                    categories: { nuong: "焼き物", lau: "鍋", mon_phu: "サイドメニュー", nuoc: "飲み物", khai_vi: "前菜", trang_mieng: "デザート" }
                  },
                  categories: { title: "📂 カテゴリ管理", addBtn: "+ カテゴリ追加" },
                  tables: {
                    title: "🪑 テーブル管理", countLabel: "現在のテーブル数:",
                    addBtn: "+ テーブル追加", removeBtn: "- テーブル削除", confirmRemove: "最後のテーブルを削除しますか？", cannotRemove: "これ以上削除できません！"
                  },
                  modal: {
                    addTitle: "新メニュー追加", editTitle: "メニュー編集", nameLabel: "メニュー名 (ベトナム語) *", categoryLabel: "カテゴリ *",
                    priceLabel: "価格 (VND) *", imageLabel: "画像URL", availableLabel: "在庫あり", cancelBtn: "キャンセル", saveBtn: "💾 保存して自動翻訳", translating: "🔄 翻訳中..."
                  },
                  categoryModal: {
                    addTitle: "新カテゴリ追加", editTitle: "カテゴリ編集", keyLabel: "カテゴリコード *", nameLabel: "カテゴリ名 (ベトナム語) *", cancelBtn: "キャンセル", saveBtn: "💾 保存して自動翻訳"
                  }
                },
                zh: {
                  tabs: { orders: "📋 订单", menu: "🍽️ 菜单管理", categories: "📂 分类", tables: "🪑 桌台管理" },
                  menu: {
                    title: "📋 菜单管理",
                    addBtn: "+ 添加菜品", editBtn: "编辑", deleteBtn: "删除", confirmDelete: "删除此菜品？",
                    categories: { nuong: "烧烤", lau: "火锅", mon_phu: "小菜", nuoc: "饮料", khai_vi: "开胃菜", trang_mieng: "甜点" }
                  },
                  categories: { title: "📂 分类管理", addBtn: "+ 添加分类" },
                  tables: {
                    title: "🪑 桌台管理", countLabel: "当前桌台数:",
                    addBtn: "+ 添加桌台", removeBtn: "- 删除桌台", confirmRemove: "删除最后一张桌台？", cannotRemove: "无法删除更多桌台！"
                  },
                  modal: {
                    addTitle: "添加新菜品", editTitle: "编辑菜品", nameLabel: "菜品名称 (越南语) *", categoryLabel: "分类 *",
                    priceLabel: "价格 (VND) *", imageLabel: "图片URL", availableLabel: "有货", cancelBtn: "取消", saveBtn: "💾 保存并自动翻译", translating: "🔄 翻译中..."
                  },
                  categoryModal: {
                    addTitle: "添加新分类", editTitle: "编辑分类", keyLabel: "分类代码 *", nameLabel: "分类名称 (越南语) *", cancelBtn: "取消", saveBtn: "💾 保存并自动翻译"
                  }
                }
              };

              let currentAdminTab = "orders";
              let productsList = [];
              let tableCount = 10;

              // Switch between tabs
              function switchTab(tab) {
                currentAdminTab = tab;

                // Update tab buttons
                document
                  .querySelectorAll(".admin-tab")
                  .forEach((t) => t.classList.remove("active"));
                document
                  .getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`)
                  .classList.add("active");

                // Show/hide panels
                document.getElementById("dashboard").style.display =
                  tab === "orders" ? "grid" : "none";

                if (document.getElementById("menuPanel")) document.getElementById("menuPanel").style.display =
                  tab === "menu" ? "block" : "none";
                if (document.getElementById("categoryPanel")) document.getElementById("categoryPanel").style.display =
                  tab === "categories" ? "block" : "none";
                if (document.getElementById("tablePanel")) document.getElementById("tablePanel").style.display =
                  tab === "tables" ? "block" : "none";

                // Load data when switching tabs

                if (tab === "menu") loadProductsList();
                if (tab === "categories") loadCategoriesList();
                if (tab === "tables") loadTableCount();

                updateAdminText();
              }

              // Update admin panel text based on language
              function updateAdminText() {
                const t = adminTranslations[currentLang];

                // Tab buttons
                document.getElementById("tabOrders").innerText = t.tabs.orders;
                if (document.getElementById("tabMenu")) document.getElementById("tabMenu").innerText = t.tabs.menu;
                if (document.getElementById("tabCategories")) document.getElementById("tabCategories").innerText = t.tabs.categories;
                if (document.getElementById("tabTables")) document.getElementById("tabTables").innerText = t.tabs.tables;


                // Menu panel
                if (document.getElementById("menuPanelTitle")) document.getElementById("menuPanelTitle").innerText = t.menu.title;
                if (document.querySelector("#menuPanel .add-btn")) document.querySelector("#menuPanel .add-btn").innerText = t.menu.addBtn;

                // Table panel
                if (document.getElementById("tablePanelTitle")) document.getElementById("tablePanelTitle").innerText = t.tables.title;
                if (document.getElementById("tableCountLabel")) document.getElementById("tableCountLabel").innerText =
                  t.tables.countLabel;

                // Category panel
                if (document.getElementById("categoryPanelTitle")) document.getElementById("categoryPanelTitle").innerText = t.categories.title;
                if (document.querySelector("#categoryPanel .add-btn")) document.querySelector("#categoryPanel .add-btn").innerText = t.categories.addBtn;

                // Product Modal
                if (document.getElementById("labelNameVi")) document.getElementById("labelNameVi").innerText = t.modal.nameLabel;
                if (document.getElementById("labelCategory")) document.getElementById("labelCategory").innerText =
                  t.modal.categoryLabel;
                if (document.getElementById("labelPrice")) document.getElementById("labelPrice").innerText = t.modal.priceLabel;
                if (document.getElementById("labelImage")) document.getElementById("labelImage").innerText = t.modal.imageLabel;
                if (document.getElementById("labelAvailable")) document.getElementById("labelAvailable").innerText =
                  t.modal.availableLabel;
                if (document.querySelector("#productModal .btn-cancel")) document.querySelector("#productModal .btn-cancel").innerText = t.modal.cancelBtn;
                if (document.getElementById("saveProductBtn")) document.getElementById("saveProductBtn").innerText = t.modal.saveBtn;
                
                // Category Modal
                if (document.getElementById("labelCategoryKey")) document.getElementById("labelCategoryKey").innerText = t.categoryModal.keyLabel;
                if (document.getElementById("labelCategoryNameVi")) document.getElementById("labelCategoryNameVi").innerText = t.categoryModal.nameLabel;
                if (document.querySelector("#categoryModal .btn-cancel")) document.querySelector("#categoryModal .btn-cancel").innerText = t.categoryModal.cancelBtn;
                if (document.getElementById("saveCategoryBtn")) document.getElementById("saveCategoryBtn").innerText = t.categoryModal.saveBtn;
              }


              // Load products list
              async function loadProductsList() {
                const container = document.getElementById("productList");
                container.innerHTML =
                  '<div style="color:#aaa;text-align:center;padding:40px;">Loading...</div>';

                try {
                  const snapshot = await db
                    .collection("products")
                    .orderBy("category")
                    .get();
                  productsList = [];

                  snapshot.forEach((doc) => {
                    productsList.push({ id: doc.id, ...doc.data() });
                  });

                  renderProductsList();
                } catch (error) {
                  console.error("Error loading products:", error);
                  container.innerHTML =
                    '<div style="color:#ff4d4d;text-align:center;padding:40px;">Error loading products</div>';
                }
              }

              // Render products grid
              function renderProductsList() {
                const container = document.getElementById("productList");
                const t = adminTranslations[currentLang];

                if (productsList.length === 0) {
                  container.innerHTML =
                    '<div style="color:#aaa;text-align:center;padding:40px;">No products found</div>';
                  return;
                }

                container.innerHTML = productsList
                  .map((product) => {
                    const name =
                      product.name?.[currentLang] || product.name?.vi || "Unknown";
                    const categoryName =
                      t.menu.categories[product.category] || product.category;
                    const unavailableClass =
                      product.available === false ? "unavailable" : "";

                    return `
                        <div class="product-card ${unavailableClass}">
                            <img src="${product.img || "https://via.placeholder.com/280x150?text=No+Image"}" 
                                onerror="this.src='https://via.placeholder.com/280x150?text=No+Image'">
                            <div class="name">${name}</div>
                            <div class="price">${(product.price || 0).toLocaleString()} đ</div>
                            <div class="category">${categoryName}</div>
                            <div class="actions">
                                <button class="edit-btn" onclick="openEditProductModal('${product.id}')">${t.menu.editBtn}</button>
                                <button class="delete-btn" onclick="deleteProduct('${product.id}')">${t.menu.deleteBtn}</button>
                            </div>
                        </div>`;
                  })
                  .join("");
              }

              // Open add product modal
              function openAddProductModal() {
                const t = adminTranslations[currentLang];
                document.getElementById("modalTitle").innerText = t.modal.addTitle;
                document.getElementById("editProductId").value = "";
                document.getElementById("productForm").reset();
                document.getElementById("productAvailable").checked = true;
                document.getElementById("productModal").style.display = "flex";
              }

              // Open edit product modal
              function openEditProductModal(productId) {
                const product = productsList.find((p) => p.id === productId);
                if (!product) return;

                const t = adminTranslations[currentLang];
                document.getElementById("modalTitle").innerText = t.modal.editTitle;
                document.getElementById("editProductId").value = productId;
                document.getElementById("productNameVi").value = product.name?.vi || "";
                document.getElementById("productCategory").value =
                  product.category || "nuong";
                document.getElementById("productPrice").value = product.price || 0;
                document.getElementById("productImage").value = product.img || "";
                document.getElementById("productAvailable").checked =
                  product.available !== false;
                document.getElementById("productModal").style.display = "flex";
              }

              // Close modal
              function closeProductModal() {
                document.getElementById("productModal").style.display = "none";
              }

              // Translate name using Gemini API via Worker
              async function translateProductName(vietnameseName) {
                try {
                  const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prompt: `Translate this Vietnamese food/dish name to 4 languages. Keep translations natural and appropriate for restaurant menus.
        Input: "${vietnameseName}"
        Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with exactly this format:
        {"en": "English name", "zh": "Chinese name", "ja": "Japanese name", "ko": "Korean name"}`,
                    }),
                  });

                  const data = await response.json();
                  console.log("Product translation API response:", data);

                  if (!data.success || !data.response) {
                    console.error("Product translation failed:", data);
                    throw new Error("Translation response missing");
                  }

                  // Clean up response - remove markdown code blocks if present
                  let text = data.response.trim();
                  text = text
                    .replace(/```json\n?/g, "")
                    .replace(/```\n?/g, "")
                    .trim();

                  // Try to extract JSON from the response
                  const jsonMatch = text.match(/\{[\s\S]*\}/);
                  if (!jsonMatch) {
                    console.error("No JSON found in response:", text);
                    throw new Error("Invalid JSON response");
                  }

                  const translations = JSON.parse(jsonMatch[0]);
                  console.log("Parsed product translations:", translations);

                  return {
                    vi: vietnameseName,
                    en: translations.en || vietnameseName,
                    zh: translations.zh || vietnameseName,
                    ja: translations.ja || vietnameseName,
                    ko: translations.ko || vietnameseName,
                  };
                } catch (error) {
                  console.error("Translation error:", error);
                  // Fallback: use Vietnamese name for all
                  return {
                    vi: vietnameseName,
                    en: vietnameseName,
                    zh: vietnameseName,
                    ja: vietnameseName,
                    ko: vietnameseName,
                  };
                }
              }

              // Handle form submit
              document
                .getElementById("productForm")
                .addEventListener("submit", async function (e) {
                  e.preventDefault();

                  const saveBtn = document.getElementById("saveProductBtn");
                  const t = adminTranslations[currentLang];
                  const originalBtnText = saveBtn.innerText;

                  saveBtn.disabled = true;
                  saveBtn.innerText = t.modal.translating;

                  try {
                    const productId = document.getElementById("editProductId").value;
                    const nameVi = document
                      .getElementById("productNameVi")
                      .value.trim();
                    const category = document.getElementById("productCategory").value;
                    const price =
                      parseInt(document.getElementById("productPrice").value) || 0;
                    const img = document.getElementById("productImage").value.trim();
                    const available =
                      document.getElementById("productAvailable").checked;

                    // Auto-translate name
                    const translatedNames = await translateProductName(nameVi);

                    const productData = {
                      name: translatedNames,
                      category: category,
                      price: price,
                      img: img || "https://via.placeholder.com/280x150?text=No+Image",
                      available: available,
                      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    };

                    if (productId) {
                      // Update existing
                      await db
                        .collection("products")
                        .doc(productId)
                        .update(productData);
                    } else {
                      // Add new
                      productData.createdAt =
                        firebase.firestore.FieldValue.serverTimestamp();
                      await db.collection("products").add(productData);
                    }

                    closeProductModal();
                    await loadProductsList();
                    showNotification(
                      "✅",
                      productId ? "Product updated!" : "Product added!",
                    );
                  } catch (error) {
                    console.error("Error saving product:", error);
                    showNotification("❌", "Error saving product");
                  } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerText = originalBtnText;
                  }
                });

              // Delete product
              async function deleteProduct(productId) {
                const t = adminTranslations[currentLang];
                const confirmed = await showConfirm(t.menu.confirmDelete, "🗑️");
                if (!confirmed) return;

                try {
                  await db.collection("products").doc(productId).delete();
                  await loadProductsList();
                  showNotification("✅", "Product deleted!");
                } catch (error) {
                  console.error("Error deleting product:", error);
                  showNotification("❌", "Error deleting product");
                }
              }

              // Load table count
              async function loadTableCount() {
                try {
                  const doc = await db.collection("settings").doc("tables").get();
                  if (doc.exists) {
                    tableCount = doc.data().count || 10;
                  }
                  document.getElementById("tableCountInput").value = tableCount;
                } catch (error) {
                  console.error("Error loading table count:", error);
                }
              }

              // Handle table count input - only allow positive integers
              function handleTableCountInput(value) {
                const input = document.getElementById("tableCountInput");

                // Remove any non-digit characters (no negative, no decimal, no letters)
                let cleanValue = value.replace(/[^0-9]/g, "");

                // If empty, don't update yet (let user type)
                if (cleanValue === "") {
                  input.value = "";
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

                const input = document.getElementById("tableCountInput");
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
                  await db
                    .collection("settings")
                    .doc("tables")
                    .set({ count: tableCount }, { merge: true });
                  console.log("✅ Table count saved to Firestore:", tableCount);

                  // Make sure input shows new value
                  input.value = tableCount;

                  loadTables(); // Reload orders dashboard
                  showAlert(`Updated to ${tableCount} tables!`, "success");
                } catch (error) {
                  console.error("Error saving table count:", error);
                  tableCount = oldCount;
                  input.value = oldCount;
                  showAlert("Failed to save!", "error");
                } finally {
                  isSavingTableCount = false;
                }
              }

              // Increment table count (+1)
              function incrementTableCount() {
                const input = document.getElementById("tableCountInput");
                let current = parseInt(input.value, 10) || tableCount;
                if (current < 100) {
                  input.value = current + 1;
                  saveTableCount();
                }
              }

              // Decrement table count (-1)
              async function decrementTableCount() {
                const input = document.getElementById("tableCountInput");
                let current = parseInt(input.value, 10) || tableCount;

                if (current <= 1) {
                  showAlert(adminTranslations[currentLang].tables.cannotRemove);
                  return;
                }

                // Check if last table has orders before decrementing
                try {
                  const lastTableDoc = await db
                    .collection("tables")
                    .doc(`table_${current}`)
                    .get();
                  if (lastTableDoc.exists && lastTableDoc.data().orders?.length > 0) {
                    showAlert("Cannot remove table with active orders!");
                    return;
                  }

                  // Delete the last table document
                  await db.collection("tables").doc(`table_${current}`).delete();

                  input.value = current - 1;
                  await saveTableCount();
                } catch (error) {
                  console.error("Error decrementing table count:", error);
                }
              }

              // Override original changeLanguage to also update admin text
              const originalChangeLanguage = changeLanguage;
              changeLanguage = function (lang) {
                originalChangeLanguage(lang);
                updateAdminText();
                if (currentAdminTab === "menu") renderProductsList();
                if (currentAdminTab === "categories") renderCategoriesList();
              };

              // Initialize admin panel when page loads
              document.addEventListener("DOMContentLoaded", function () {
                updateAdminText();
              });

              /* ======================= CATEGORY MANAGEMENT ======================= */

              let categoriesList = [];

              // Default categories (will be loaded from/saved to Firestore)
              const defaultCategories = [
                {
                  key: "nuong",
                  name: {
                    vi: "Món nướng",
                    en: "Grilled",
                    zh: "烧烤",
                    ja: "焼き物",
                    ko: "구이",
                  },
                },
                {
                  key: "lau",
                  name: { vi: "Lẩu", en: "Hotpot", zh: "火锅", ja: "鍋", ko: "전골" },
                },
                {
                  key: "mon_phu",
                  name: {
                    vi: "Món phụ",
                    en: "Side Dishes",
                    zh: "配菜",
                    ja: "サイドメニュー",
                    ko: "반찬",
                  },
                },
                {
                  key: "nuoc",
                  name: {
                    vi: "Đồ uống",
                    en: "Drinks",
                    zh: "饮料",
                    ja: "ドリンク",
                    ko: "음료",
                  },
                },
                {
                  key: "khai_vi",
                  name: {
                    vi: "Khai vị",
                    en: "Appetizer",
                    zh: "开胃菜",
                    ja: "前菜",
                    ko: "에피타이저",
                  },
                },
                {
                  key: "trang_mieng",
                  name: {
                    vi: "Tráng miệng",
                    en: "Dessert",
                    zh: "甜点",
                    ja: "デザート",
                    ko: "디저트",
                  },
                },
              ];

              // Load categories from Firestore
              async function loadCategoriesList() {
                const container = document.getElementById("categoryList");
                container.innerHTML =
                  '<div style="color:#aaa;text-align:center;padding:40px;">Loading...</div>';

                try {
                  const doc = await db.collection("settings").doc("categories").get();
                  if (doc.exists && doc.data().list) {
                    categoriesList = doc.data().list;
                  } else {
                    // Initialize with default categories
                    categoriesList = defaultCategories;
                    await db
                      .collection("settings")
                      .doc("categories")
                      .set({ list: categoriesList });
                  }

                  renderCategoriesList();
                  updateProductCategoryDropdown();
                } catch (error) {
                  console.error("Error loading categories:", error);
                  categoriesList = defaultCategories;
                  renderCategoriesList();
                }
              }

              // Render categories grid
              function renderCategoriesList() {
                const container = document.getElementById("categoryList");
                const t = adminTranslations[currentLang];

                if (categoriesList.length === 0) {
                  container.innerHTML =
                    '<div style="color:#aaa;text-align:center;padding:40px;">No categories</div>';
                  return;
                }

                container.innerHTML = categoriesList
                  .map((cat) => {
                    const catName = cat.name?.[currentLang] || cat.name?.vi || cat.key;
                    return `
                        <div class="category-card">
                            <div>
                                <div class="cat-name">${catName}</div>
                                <div class="cat-key">${cat.key}</div>
                            </div>
                            <button class="delete-cat-btn" onclick="deleteCategory('${cat.key}')">🗑️</button>
                        </div>`;
                  })
                  .join("");
              }

              // Update product category dropdown with current categories
              function updateProductCategoryDropdown() {
                const select = document.getElementById("productCategory");
                select.innerHTML = categoriesList
                  .map((cat) => {
                    const catName = cat.name?.[currentLang] || cat.name?.vi || cat.key;
                    return `<option value="${cat.key}">${catName}</option>`;
                  })
                  .join("");
              }

              // Open add category modal
              function openAddCategoryModal() {
                document.getElementById("categoryModalTitle").innerText =
                  adminTranslations[currentLang].categories?.addTitle ||
                  "Thêm danh mục";
                document.getElementById("editCategoryId").value = "";
                document.getElementById("categoryForm").reset();
                document.getElementById("categoryModal").style.display = "flex";
              }

              // Close category modal
              function closeCategoryModal() {
                document.getElementById("categoryModal").style.display = "none";
              }

              // Translate category name using Gemini API via Worker
              async function translateCategoryName(vietnameseName) {
                try {
                  const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prompt: `Translate this Vietnamese food category name to 4 languages. Keep translations short and appropriate for restaurant menu navigation.
        Input: "${vietnameseName}"
        Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with exactly this format:
        {"en": "English name", "zh": "Chinese name", "ja": "Japanese name", "ko": "Korean name"}`,
                    }),
                  });

                  const data = await response.json();
                  console.log("Translation API response:", data);

                  if (!data.success || !data.response) {
                    console.error("Translation failed:", data);
                    throw new Error("Translation response missing");
                  }

                  // Clean up response - remove markdown code blocks if any
                  let text = data.response.trim();
                  text = text
                    .replace(/```json\n?/g, "")
                    .replace(/```\n?/g, "")
                    .trim();

                  // Try to extract JSON from the response
                  const jsonMatch = text.match(/\{[\s\S]*\}/);
                  if (!jsonMatch) {
                    console.error("No JSON found in response:", text);
                    throw new Error("Invalid JSON response");
                  }

                  const translations = JSON.parse(jsonMatch[0]);
                  console.log("Parsed translations:", translations);

                  return {
                    vi: vietnameseName,
                    en: translations.en || vietnameseName,
                    zh: translations.zh || vietnameseName,
                    ja: translations.ja || vietnameseName,
                    ko: translations.ko || vietnameseName,
                  };
                } catch (error) {
                  console.error("Category translation error:", error);
                  // Fallback: just use Vietnamese name for all
                  return {
                    vi: vietnameseName,
                    en: vietnameseName,
                    zh: vietnameseName,
                    ja: vietnameseName,
                    ko: vietnameseName,
                  };
                }
              }

              // Handle category form submit
              document
                .getElementById("categoryForm")
                .addEventListener("submit", async function (e) {
                  e.preventDefault();

                  const saveBtn = document.getElementById("saveCategoryBtn");
                  const originalBtnText = saveBtn.innerText;
                  saveBtn.disabled = true;
                  saveBtn.innerText = "🔄 Đang dịch...";

                  try {
                    const catKey = document
                      .getElementById("categoryKey")
                      .value.trim()
                      .toLowerCase()
                      .replace(/\s+/g, "_");
                    const nameVi = document
                      .getElementById("categoryNameVi")
                      .value.trim();

                    // Check if key already exists
                    if (categoriesList.some((c) => c.key === catKey)) {
                      showNotification("⚠️", "Category key already exists!");
                      saveBtn.disabled = false;
                      saveBtn.innerText = originalBtnText;
                      return;
                    }

                    // Auto-translate using Gemini API
                    const translatedNames = await translateCategoryName(nameVi);

                    const newCategory = {
                      key: catKey,
                      name: translatedNames,
                    };

                    categoriesList.push(newCategory);
                    await db
                      .collection("settings")
                      .doc("categories")
                      .set({ list: categoriesList });

                    closeCategoryModal();
                    renderCategoriesList();
                    updateProductCategoryDropdown();
                    showNotification("✅", "Category added!");
                  } catch (error) {
                    console.error("Error saving category:", error);
                    showNotification("❌", "Error saving category");
                  } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerText = originalBtnText;
                  }
                });

              // Delete category
              async function deleteCategory(catKey) {
                // Count products in this category
                const snapshot = await db
                  .collection("products")
                  .where("category", "==", catKey)
                  .get();

                if (!snapshot.empty) {
                  showNotification(
                    "⚠️",
                    `Cannot delete! ${snapshot.size} products in this category.`,
                  );
                  return;
                }

                const confirmed = await showConfirm("Delete this category?", "🗑️");
                if (!confirmed) return;

                try {
                  categoriesList = categoriesList.filter((c) => c.key !== catKey);
                  await db
                    .collection("settings")
                    .doc("categories")
                    .set({ list: categoriesList });

                  renderCategoriesList();
                  updateProductCategoryDropdown();
                  showNotification("✅", "Category deleted!");
                } catch (error) {
                  console.error("Error deleting category:", error);
                  showNotification("❌", "Error deleting category");
                }
              }

              // Update switchTab to include categories
              const originalSwitchTab = switchTab;
              switchTab = function (tab) {
                currentAdminTab = tab;

                // Update tab buttons
                document
                  .querySelectorAll(".admin-tab")
                  .forEach((t) => t.classList.remove("active"));
                const tabId = `tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
                document.getElementById(tabId)?.classList.add("active");

                // Show/hide panels
                document.getElementById("dashboard").style.display =
                  tab === "orders" ? "grid" : "none";
                document.getElementById("menuPanel").style.display =
                  tab === "menu" ? "block" : "none";
                document.getElementById("categoryPanel").style.display =
                  tab === "categories" ? "block" : "none";
                document.getElementById("tablePanel").style.display =
                  tab === "tables" ? "block" : "none";

                // Load data when switching tabs
                if (tab === "menu") loadProductsList();
                if (tab === "categories") loadCategoriesList();
                if (tab === "tables") loadTableCount();

                updateAdminText();
              };

              // Add categories to adminTranslations
              adminTranslations.vi.categories = {
                title: "📂 Quản lý danh mục",
                addBtn: "+ Thêm danh mục",
                addTitle: "Thêm danh mục mới",
                deleteBtn: "Xóa",
              };
              adminTranslations.en.categories = {
                title: "📂 Category Management",
                addBtn: "+ Add Category",
                addTitle: "Add New Category",
                deleteBtn: "Delete",
              };

              // Update admin text for categories tab
              const originalUpdateAdminText = updateAdminText;
              updateAdminText = function () {
                originalUpdateAdminText();
                const t = adminTranslations[currentLang];

                // Categories tab
                document.getElementById("tabCategories").innerText =
                  t.categories?.title?.substring(0, 15) || "📂 Danh mục";
                document.getElementById("categoryPanelTitle").innerText =
                  t.categories?.title || "📂 Quản lý danh mục";

                const catAddBtn = document.querySelector("#categoryPanel .add-btn");
                if (catAddBtn) catAddBtn.innerText = t.categories?.addBtn || "+ Thêm";
              };
