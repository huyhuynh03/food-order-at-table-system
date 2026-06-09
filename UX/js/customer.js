
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

        /* ======================= FIREBASE LISTENER ======================= */
        function listenToTableOrders() {
            const tableId = `table_${currentTableId}`;
            console.log('🔊 Starting Firebase listener for:', tableId);

            db.collection("tables").doc(tableId).onSnapshot((doc) => {
                console.log('📥 Firebase update received:', doc.exists ? doc.data() : 'no data');

                if (doc.exists) {
                    const data = doc.data();
                    const firebaseOrders = data.orders || [];
                    updateServiceCallButton(data.serviceCallActive === true);

                    // Convert Firebase orders array to orderedItems object
                    // Aggregate items with same ID
                    orderedItems = {};
                    firebaseOrders.forEach(item => {
                        if (!orderedItems[item.id]) {
                            orderedItems[item.id] = { ...item };
                        } else {
                            orderedItems[item.id].qty += item.qty;
                        }
                    });

                    console.log('📋 Updated orderedItems:', orderedItems);

                    renderOrderedItems();
                    renderMenu(); // Update red border on ordered items
                } else {
                    // Table doesn't exist in Firebase yet - clear ordered items
                    updateServiceCallButton(false);
                    orderedItems = {};
                    renderOrderedItems();
                    renderMenu();
                }
            });
        }

        function updateServiceCallButton(isActive) {
            isServiceCallActive = !!isActive;

            const button = document.getElementById("callStaffBtn");
            const text = document.getElementById("callStaffBtnText");
            if (!button || !text) return;

            text.innerText = translations[currentLang].buttons.call;
            button.classList.toggle("active", isServiceCallActive);

            const label = isServiceCallActive
                ? translations[currentLang].messages.staffCallPending
                : translations[currentLang].buttons.call;
            button.title = label;
            button.setAttribute("aria-label", label);
        }

        async function requestStaffCall() {
            if (isServiceCallActive) {
                showAlert(translations[currentLang].messages.staffCallPending);
                return;
            }

            const tableId = `table_${currentTableId}`;

            try {
                await db.collection("tables").doc(tableId).set({
                    name: `Bàn ${currentTableId}`,
                    serviceCallActive: true,
                    serviceCallRequestedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                updateServiceCallButton(true);
                showAlert(translations[currentLang].messages.staffCallSent);
            } catch (error) {
                console.error('❌ Failed to request staff call:', error);
                showAlert(translations[currentLang].messages.staffCallError);
            }
        }

        function renderOrderedItems() {
            const box = document.getElementById("orderedItems");
            box.innerHTML = "";

            let total = 0;

            for (let id in orderedItems) {
                const item = orderedItems[id];
                total += item.qty * item.price;

                box.innerHTML += `
            <div class="cart-item">
                <b>${item.name[currentLang]}</b><br>
                ${translations[currentLang].ordered.qty}: ${item.qty} × ${item.price.toLocaleString()} đ
            </div>
        `;
            }

            document.getElementById("orderedTotal").innerText = total.toLocaleString();
            document.getElementById("orderedCount").innerText =
                Object.values(orderedItems).reduce((a, b) => a + b.qty, 0);

            // Update total in header button
            document.getElementById("orderedBtnTotal").innerText = total.toLocaleString() + " đ";
        }


        /*=======================custom alert=========================*/
        function showAlert(msg) {
            const overlay = document.getElementById("customAlertOverlay");
            const box = document.getElementById("customAlertBox");

            document.getElementById("alertMessage").innerText = msg;

            overlay.style.display = "flex";

            // Reset animation để chạy lại mượt
            box.style.animation = "none";
            void box.offsetWidth; // trick restart animation
            box.style.animation = "alertPop 0.35s ease forwards";
        }

        function closeAlert() {
            const overlay = document.getElementById("customAlertOverlay");
            overlay.style.display = "none";
        }

        /* ======================= CUSTOM CONFIRM ======================= */
        let confirmCallback = null;

        function showConfirm(msg, callback) {
            confirmCallback = callback;

            // Hiển thị nội dung confirm
            document.getElementById("confirmMessage").innerText = msg;

            // Cập nhật nút theo ngôn ngữ hiện tại
            document.getElementById("confirmCancelBtn").innerText = translations[currentLang].confirm.cancel;
            document.getElementById("confirmOkBtn").innerText = translations[currentLang].confirm.ok;

            const overlay = document.getElementById("customConfirmOverlay");
            const box = document.getElementById("customConfirmBox");

            overlay.style.display = "flex";

            // Reset animation để chạy lại mượt
            box.style.animation = "none";
            void box.offsetWidth; // trick restart animation
            box.style.animation = "alertPop 0.35s ease forwards";
        }

        function closeConfirm(result) {
            // Ẩn overlay
            document.getElementById("customConfirmOverlay").style.display = "none";

            // Chỉ gọi callback nếu có
            if (confirmCallback) confirmCallback(result);
        }

        /* ======================= CLEAR CART ======================= */
        function clearCart() {
            // Hiển thị confirm trước khi xóa toàn bộ giỏ hàng
            showConfirm(translations[currentLang].confirm.clearAll, function (ok) {

                if (!ok) return; // Nhấn Cancel → giữ nguyên trạng thái

                // Nếu nhấn OK → xóa toàn bộ
                for (let id in cart) {
                    cart[id].qty = 0;
                    cart[id].tempQty = 0;
                }

                updateCart();
                renderMenu();
            });
        }


        /*=======================xóa từng món=========================*/

        function deleteItem(id) {
            cart[id].qty = 0;
            cart[id].tempQty = 0;

            updateCart();
            renderMenu();
        }


        /*=================xóa toàn bộ giỏ hàng=======================*/

        function clearCart() {
            showConfirm(translations[currentLang].confirm.clearAll, function (ok) {

                if (!ok) return; // Nhấn Cancel → không làm gì

                // Nhấn OK → xóa toàn bộ giỏ hàng
                for (let id in cart) {
                    cart[id].qty = 0;
                    cart[id].tempQty = 0;
                }

                updateCart();
                renderMenu();
            });
        }





        /*==================Chức năng cho ô số lượng giỏ hàng========*/

        let cartQtyTimeout = null; // Debounce timer

        function changeCartQty(input) {
            const id = input.dataset.id;
            let newQty = input.value;

            // Rỗng → không cập nhật gì (để user nhập tiếp)
            if (newQty === "") return;

            newQty = Number(newQty);
            if (newQty < 0) newQty = 0;

            // Cập nhật data ngay nhưng KHÔNG render lại cart
            cart[id].qty = newQty;
            cart[id].tempQty = newQty;

            // Clear timeout cũ
            if (cartQtyTimeout) clearTimeout(cartQtyTimeout);

            // Debounce: Chờ 400ms sau khi ngừng gõ mới render
            cartQtyTimeout = setTimeout(() => {
                if (newQty === 0) {
                    // Xóa khỏi giỏ
                    updateCart();
                    renderMenu();
                } else {
                    // Cập nhật tổng tiền và số lượng hiển thị
                    updateCartTotals();
                    renderMenu();
                }
            }, 400);
        }

        // Hàm chỉ cập nhật tổng tiền mà KHÔNG render lại cart items
        function updateCartTotals() {
            let total = 0, count = 0;

            for (let id in cart) {
                if (cart[id].qty > 0) {
                    total += cart[id].qty * cart[id].price;
                    count += cart[id].qty;
                }
            }

            document.getElementById("totalPrice").innerText = total.toLocaleString();
            document.getElementById("cartCount").innerText = count;
        }

        // Hàm xử lý khi nhấn nút +/- trong giỏ hàng
        function changeCartQtyBtn(id, delta) {
            let newQty = Math.max(0, (cart[id].qty || 0) + delta);

            cart[id].qty = newQty;
            cart[id].tempQty = newQty;

            if (newQty === 0) {
                // Xóa khỏi giỏ
                updateCart();
                renderMenu();
            } else {
                // Cập nhật giỏ hàng và menu
                updateCart();
                renderMenu();
            }
        }


        /* ======================= NGÔN NGỮ ======================= */
        const translations = {
            vi: {
                tabs: { nuong: "Món nướng", lau: "Lẩu", mon_phu: "Món phụ", nuoc: "Đồ uống", khai_vi: "Khai vị", trang_mieng: "Tráng miệng" },
                buttons: { add: "Thêm", order: "Xác nhận đặt món", cart: "Giỏ", ordered: "Đã gọi", call: "Gọi" },
                messages: {
                    orderSent: "Đơn đã gửi tới bếp!",
                    emptyCart: "Giỏ hàng trống!",
                    staffCallSent: "Nhân viên đã nhận được tín hiệu gọi của bạn.",
                    staffCallPending: "Nhân viên đang được gọi đến bàn của bạn.",
                    staffCallError: "Không thể gửi yêu cầu gọi nhân viên. Vui lòng thử lại."
                },
                cart: { title: "Giỏ hàng", total: "Tổng", qty: "SL" },
                ordered: { title: "Món đã gọi", total: "Tổng", qty: "SL" },
                table: "Bàn",
                confirm: {
                    clearAll: "Xóa toàn bộ giỏ hàng?",
                    cancel: "Hủy",
                    ok: "Xóa"
                },
                chatbot: {
                    btnText: "Trợ lý AI",
                    title: "Trợ lý gợi ý món",
                    greeting: "Xin chào! Tôi là trợ lý AI của Yaki. Tôi sẽ giúp bạn chọn món ăn phù hợp.",
                    askGuests: "Bạn có bao nhiêu người ăn?",
                    askBudget: "Ngân sách của bạn là bao nhiêu? (VND)",
                    askAlcohol: "Bạn có muốn dùng đồ uống có cồn không?\n👉 Nhấn Có = Đồng ý, nhấn Không = Không đồng ý",
                    askDietary: "Bạn có yêu cầu đặc biệt nào không? (VD: ăn chay, Halal, không ăn bò, dị ứng hải sản...)\n\n👉 Nếu không có, hãy nhập \"không\" hoặc bấm Gửi để bỏ qua.",
                    askPreferences: "Bạn có yêu cầu gì đặc biệt không? Hãy cho tôi biết về:\n• Đồ uống có cồn (bia, rượu) hay không?\n• Kiêng kỵ gì? (VD: Halal, ăn chay, không bò, dị ứng hải sản...)\n• Sở thích khác?\n\n👉 Nếu không có yêu cầu đặc biệt, nhập \"không\" để bỏ qua.",
                    thinking: "Đang suy nghĩ",
                    recommendTitle: "Đây là gợi ý của tôi cho bạn:",
                    confirmAdd: "Bạn có muốn thêm các món này vào giỏ hàng?\n👉 Nhấn Có = Đồng ý, nhấn Không = Không đồng ý",
                    addedToCart: "Đã thêm tất cả món gợi ý vào giỏ hàng! 🎉",
                    notAdded: "Không sao! Bạn có thể tự chọn món từ menu hoặc nhờ tôi gợi ý lại.",
                    yes: "Có",
                    no: "Không",
                    total: "Tổng cộng",
                    guestLimitExceeded: "Vượt quá giới hạn phục vụ của nhà hàng. Vui lòng liên hệ nhân viên",
                    budgetTooLow: "Ngân sách của bạn quá thấp. Món rẻ nhất trên menu là {minPrice}đ ({minItem}). Vui lòng nhập ngân sách ít nhất {minPrice}đ.",
                    inputPlaceholder: "Nhập tin nhắn...",
                    inputPlaceholderDietary: "VD: Halal, ăn chay, không bò...",
                    send: "Gửi",
                    error: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại."
                },
                session: {
                    blockedTitle: "Bàn chưa được mở",
                    blockedMessage: "Vui lòng yêu cầu nhân viên mở bàn và quét mã QR để đặt món."
                }
            },
            en: {
                tabs: { nuong: "Grilled", lau: "Hotpot", mon_phu: "Side Dishes", nuoc: "Drinks", khai_vi: "Appetizer", trang_mieng: "Dessert" },
                buttons: { add: "Add", order: "Confirm Order", cart: "Cart", ordered: "Ordered", call: "Call" },
                messages: {
                    orderSent: "Order sent to kitchen!",
                    emptyCart: "Your cart is empty!",
                    staffCallSent: "A staff call has been sent.",
                    staffCallPending: "Staff is already being called to your table.",
                    staffCallError: "Unable to send the staff call. Please try again."
                },
                cart: { title: "Cart", total: "Total", qty: "Qty" },
                ordered: { title: "Ordered Items", total: "Total", qty: "Qty" },
                table: "Table",
                confirm: {
                    clearAll: "Delete entire cart?",
                    cancel: "Cancel",
                    ok: "Delete"
                },
                chatbot: {
                    btnText: "AI Assistant",
                    title: "Food Suggestion Assistant",
                    greeting: "Hello! I'm Yaki's AI assistant. I'll help you choose the perfect dishes.",
                    askGuests: "How many people will be dining?",
                    askBudget: "What's your budget? (VND)",
                    askAlcohol: "Would you like alcoholic beverages?\n👉 Press Yes = Agree, press No = Disagree",
                    askDietary: "Do you have any dietary preferences or restrictions? (e.g., vegetarian, Halal, no beef, seafood allergy...)\n\n👉 If none, type \"no\" or press Send to skip.",
                    askPreferences: "Do you have any special requests? Please tell me about:\n• Alcoholic drinks (beer, wine) or not?\n• Any dietary restrictions? (e.g., Halal, vegetarian, no beef, seafood allergy...)\n• Other preferences?\n\n👉 If no special requests, type \"no\" to skip.",
                    thinking: "Thinking",
                    recommendTitle: "Here are my suggestions for you:",
                    confirmAdd: "Would you like to add these items to your cart?\n👉 Press Yes = Agree, press No = Disagree",
                    addedToCart: "All suggested items have been added to your cart! 🎉",
                    notAdded: "No problem! You can browse the menu yourself or ask me for new suggestions.",
                    yes: "Yes",
                    no: "No",
                    total: "Total",
                    guestLimitExceeded: "This exceeds the restaurant's service limit. Please contact staff.",
                    budgetTooLow: "Your budget is too low. The cheapest item on the menu is {minPrice}đ ({minItem}). Please enter a budget of at least {minPrice}đ.",
                    inputPlaceholder: "Type a message...",
                    inputPlaceholderDietary: "e.g., Halal, vegetarian, no beef...",
                    send: "Send",
                    error: "Sorry, an error occurred. Please try again."
                },
                session: {
                    blockedTitle: "Table is not open",
                    blockedMessage: "Please ask staff to open the table and scan the QR code to order."
                }
            },
            zh: {
                tabs: { nuong: "烤肉", lau: "火锅", mon_phu: "小菜", nuoc: "饮料", khai_vi: "開胃菜", trang_mieng: "甜點" },
                buttons: { add: "添加", order: "確認訂單", cart: "购物车", ordered: "已点菜", call: "呼叫" },
                messages: {
                    orderSent: "订单已发送到厨房！",
                    emptyCart: "購物車是空的！",
                    staffCallSent: "已发送呼叫服务员通知。",
                    staffCallPending: "已为您的桌位发送呼叫服务员通知。",
                    staffCallError: "无法发送呼叫服务员请求，请重试。"
                },
                cart: { title: "购物车", total: "总计", qty: "数量" },
                ordered: { title: "已点菜品", total: "总计", qty: "数量" },
                table: "桌",
                confirm: {
                    clearAll: "刪除整個購物車？",
                    cancel: "取消",
                    ok: "擦除"
                },
                chatbot: {
                    btnText: "AI助手",
                    title: "点餐推荐助手",
                    greeting: "您好！我是Yaki的AI助手。我将帮助您选择合适的菜品。",
                    askGuests: "请问有多少位用餐？",
                    askBudget: "您的预算是多少？(越南盾)",
                    askAlcohol: "您需要含酒精的饮品吗？\n👉 按'是'表示同意，按'否'表示不同意",
                    askDietary: "您有什么特殊饮食要求吗？（例如：素食、清真、不吃牛肉、海鲜过敏...）\n\n👉 如果没有，请输入'没有'或按发送跳过。",
                    askPreferences: "您有什么特殊要求吗？请告诉我：\n• 是否需要含酒精饮品（啤酒、葡萄酒）？\n• 有什么饮食禁忌？（例如：清真、素食、不吃牛肉、海鲜过敏...）\n• 其他偏好？\n\n👉 如果没有特殊要求，请输入'没有'跳过。",
                    thinking: "思考中",
                    recommendTitle: "这是我为您推荐的菜品：",
                    confirmAdd: "您要将这些菜品加入购物车吗？\n👉 按'是'表示同意，按'否'表示不同意",
                    addedToCart: "已将所有推荐菜品加入购物车！🎉",
                    notAdded: "没关系！您可以自己浏览菜单或让我重新推荐。",
                    yes: "是",
                    no: "否",
                    total: "总计",
                    guestLimitExceeded: "已超出餐厅接待上限。请联系服务员。",
                    budgetTooLow: "您的预算太低了。菜单上最便宜的是{minPrice}盾（{minItem}）。请输入至少{minPrice}盾的预算。",
                    inputPlaceholder: "输入消息...",
                    inputPlaceholderDietary: "例如：清真、素食、不吃牛肉...",
                    send: "发送",
                    error: "抱歉，发生错误。请重试。"
                },
                session: {
                    blockedTitle: "桌位尚未开放",
                    blockedMessage: "请让服务员开桌并扫描二维码点餐。"
                }
            },
            ja: {
                tabs: { nuong: "焼肉", lau: "鍋", mon_phu: "サイド", nuoc: "ドリンク", khai_vi: "前菜", trang_mieng: "デザート" },
                buttons: { add: "追加", order: "注文を確認する", cart: "カート", ordered: "注文済み", call: "呼ぶ" },
                messages: {
                    orderSent: "注文が送信されました！",
                    emptyCart: "カートは空です!",
                    staffCallSent: "スタッフ呼び出しを送信しました。",
                    staffCallPending: "すでにスタッフを呼び出しています。",
                    staffCallError: "スタッフ呼び出しを送信できませんでした。もう一度お試しください。"
                },
                cart: { title: "カート", total: "合計", qty: "数量" },
                ordered: { title: "注文済み料理", total: "合計", qty: "数量" },
                table: "テーブル",
                confirm: {
                    clearAll: "カート全体を削除しますか?",
                    cancel: "キャンセル",
                    ok: "消去"
                },
                chatbot: {
                    btnText: "AIアシスタント",
                    title: "お料理おすすめアシスタント",
                    greeting: "こんにちは！私はYakiのAIアシスタントです。最適な料理選びをお手伝いします。",
                    askGuests: "何名様でお食事されますか？",
                    askBudget: "ご予算はおいくらですか？(VND)",
                    askAlcohol: "アルコール飲料はいかがですか？\n👉 はいを押す=同意、いいえを押す=同意しない",
                    askDietary: "食事に関する特別なご要望はありますか？（例：ベジタリアン、ハラール、牛肉不可、海鮮アレルギーなど）\n\n👉 特にない場合は「なし」と入力するか、送信ボタンを押してスキップしてください。",
                    askPreferences: "特別なご要望はありますか？以下についてお聞かせください：\n• アルコール飲料（ビール、ワイン）は必要ですか？\n• 食事制限はありますか？（例：ハラール、ベジタリアン、牛肉不可、海鮮アレルギーなど）\n• その他のご希望は？\n\n👉 特にない場合は「なし」と入力してスキップしてください。",
                    thinking: "考え中",
                    recommendTitle: "おすすめ料理はこちらです：",
                    confirmAdd: "これらの料理をカートに追加しますか？\n👉 はいを押す=同意、いいえを押す=同意しない",
                    addedToCart: "おすすめ料理をすべてカートに追加しました！🎉",
                    notAdded: "大丈夫です！メニューから直接お選びいただくか、また私にお声がけください。",
                    yes: "はい",
                    no: "いいえ",
                    total: "合計",
                    guestLimitExceeded: "レストランの対応可能人数を超えています。スタッフにお声がけください。",
                    budgetTooLow: "ご予算が低すぎます。メニューで最も安い商品は{minPrice}ドン（{minItem}）です。少なくとも{minPrice}ドンのご予算を入力してください。",
                    inputPlaceholder: "メッセージを入力...",
                    inputPlaceholderDietary: "例：ハラール、ベジタリアン、牛肉不可...",
                    send: "送信",
                    error: "申し訳ありません。エラーが発生しました。もう一度お試しください。"
                },
                session: {
                    blockedTitle: "テーブルはまだ開いていません",
                    blockedMessage: "スタッフにテーブルを開いてもらい、QRコードをスキャンしてご注文ください。"
                }
            },
            ko: {
                tabs: { nuong: "구이", lau: "전골", mon_phu: "사이드", nuoc: "음료", khai_vi: "간식", trang_mieng: "디저트" },
                buttons: { add: "추가", order: "주문확인", cart: "장바구니", ordered: "주문완료", call: "호출" },
                messages: {
                    orderSent: "주문이 전송되었습니다!",
                    emptyCart: "장바구니가 비어있습니다!",
                    staffCallSent: "직원 호출을 전송했습니다.",
                    staffCallPending: "이미 직원을 호출한 상태입니다.",
                    staffCallError: "직원 호출을 전송할 수 없습니다. 다시 시도해 주세요."
                },
                cart: { title: "장바구니", total: "총", qty: "수량" },
                ordered: { title: "주문완료 메뉴", total: "총", qty: "수량" },
                table: "테이블",
                confirm: {
                    clearAll: "장바구니 전체를 삭제하시겠습니까?",
                    cancel: "취소",
                    ok: "삭제"
                },
                chatbot: {
                    btnText: "AI 도우미",
                    title: "음식 추천 도우미",
                    greeting: "안녕하세요! 저는 Yaki의 AI 도우미입니다. 완벽한 요리를 선택하는 데 도움을 드리겠습니다.",
                    askGuests: "몇 분이 드실 예정인가요?",
                    askBudget: "예산이 어떻게 되시나요? (VND)",
                    askAlcohol: "주류를 원하시나요?\n👉 예를 누르면 동의하고, 아니요를 누르면 동의하지 않습니다.",
                    askDietary: "특별한 식이 요구사항이 있으신가요? (예: 채식, 할랄, 소고기 불가, 해산물 알레르기 등)\n\n👉 없으시면 \"없음\"을 입력하거나 보내기를 눌러 건너뛰세요.",
                    askPreferences: "특별한 요청사항이 있으신가요? 다음에 대해 알려주세요:\n• 주류(맥주, 와인)를 원하시나요?\n• 식이 제한이 있으신가요? (예: 할랄, 채식, 소고기 불가, 해산물 알레르기 등)\n• 기타 선호사항?\n\n👉 특별한 요청이 없으시면 \"없음\"을 입력하여 건너뛰세요.",
                    thinking: "생각 중",
                    recommendTitle: "추천 요리는 다음과 같습니다:",
                    confirmAdd: "이 요리들을 장바구니에 추가하시겠어요?\n👉 예를 누르면 동의하고, 아니요를 누르면 동의하지 않습니다.",
                    addedToCart: "모든 추천 요리가 장바구니에 추가되었습니다! 🎉",
                    notAdded: "괜찮습니다! 메뉴에서 직접 선택하시거나 다시 추천해 드릴게요.",
                    yes: "예",
                    no: "아니오",
                    total: "합계",
                    guestLimitExceeded: "레스토랑의 응대 가능 인원을 초과했습니다. 직원에게 문의해 주세요.",
                    budgetTooLow: "예산이 너무 낮습니다. 메뉴에서 가장 저렴한 항목은 {minPrice}동({minItem})입니다. 최소 {minPrice}동 이상의 예산을 입력해 주세요.",
                    inputPlaceholder: "메시지 입력...",
                    inputPlaceholderDietary: "예: 할랄, 채식, 소고기 불가...",
                    send: "보내기",
                    error: "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요."
                },
                session: {
                    blockedTitle: "테이블이 아직 열리지 않았습니다",
                    blockedMessage: "직원에게 테이블을 열어달라고 요청하고 QR 코드를 스캔하여 주문하세요."
                }
            }
        };

        /* ======================= PRODUCT DATA ======================= */
        // Products will be loaded from Firestore, with fallback to hardcoded data
        let products = {
            nuong: [], lau: [], mon_phu: [], nuoc: [], khai_vi: [], trang_mieng: []
        };

        // Fallback data (in case Firestore fails)
        const fallbackProducts = {
            nuong: [
                { id: 1, name: { vi: "Ba chỉ bò Mỹ", en: "US beef belly", zh: "美國牛腹肉", ja: "米国牛バラ", ko: "미국 소고기 배" }, price: 139000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ba-chi-bo-my.jpg" },
                { id: 2, name: { vi: "Dẻ sườn bò", en: "Beef bibs", zh: "牛肋排", ja: "牛リブ", ko: "소갈비" }, price: 169000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/de-suon-bo-nuong.jpg" },
                { id: 3, name: { vi: "Sườn heo sốt mật ong", en: "Honey pork ribs", zh: "蜜汁豬肋排", ja: "ハニーポークリブ", ko: "허니 돼지갈비" }, price: 129000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/suon-nuong-mat-ong.jpg" },
                { id: 4, name: { vi: "Gà nướng", en: "Grilled chicken", zh: "烤雞", ja: "グリルチキン", ko: "구운 닭고기" }, price: 89000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ga-nuong.jpg" },
                { id: 13, name: { vi: "Cá hồi nướng", en: "Grilled salmon", zh: "烤鮭魚", ja: "グリルサーモン", ko: "구운 연어" }, price: 99000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ca_hoi_nuong.png" },
                { id: 14, name: { vi: "Mực nướng", en: "Grilled squid", zh: "烤魷魚", ja: "焼きイカ", ko: "구운 오징어" }, price: 119000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/muc_nuong.jpg" },
                { id: 15, name: { vi: "Tôm nướng", en: "Grilled shrimp", zh: "烤蝦", ja: "焼きエビ", ko: "구운 새우" }, price: 109000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/tom_nuong.jpg" },
                { id: 16, name: { vi: "Bò bít tết", en: "Beef steak", zh: "牛排", ja: "ビーフステーキ", ko: "소고기 스테이크" }, price: 159000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/bo_beef_steak.jpg" }
            ],
            lau: [
                { id: 5, name: { vi: "Lẩu kim chi", en: "Kimchi hotpot", zh: "泡菜火锅", ja: "キムチ鍋", ko: "김치전골" }, price: 199000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/Lau-kim-chi.png" },
                { id: 6, name: { vi: "Lẩu bulgogi", en: "Bulgogi hotpot", zh: "烤肉火锅", ja: "プルコギ鍋", ko: "불고기전골" }, price: 249000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/lau-bulgogi.webp" },
                { id: 17, name: { vi: "Lẩu hải sản", en: "Seafood hotpot", zh: "海鮮火鍋", ja: "海鮮鍋", ko: "해산물 냄비" }, price: 209000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/lau_hai_san.jpg" }
            ],
            mon_phu: [
                { id: 7, name: { vi: "Tokbokki phô mai", en: "Cheese tokbokki", zh: "芝士炒年糕", ja: "チーズトッポッキ", ko: "치즈 떡볶이" }, price: 35000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/tokbokki-pho-mai.jpg" },
                { id: 8, name: { vi: "Cơm trộn Hàn Quốc", en: "Bibimbap", zh: "拌饭", ja: "ビビンバ", ko: "비빔밥" }, price: 49000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/com-tron-han-quoc.jpg" },
                { id: 9, name: { vi: "Khoai tây chiên", en: "French fries", zh: "薯条", ja: "ポテトフライ", ko: "감자튀김" }, price: 39000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/khoai-tay-chien.webp" },
                { id: 18, name: { vi: "Súp bào ngư", en: "Abalone soup", zh: "鮑魚湯", ja: "アワビのスープ", ko: "전복 수프" }, price: 99000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_bao_ngu.jpg" },
                { id: 19, name: { vi: "Súp hải sản", en: "Seafood soup", zh: "海鮮湯", ja: "シーフードスープ", ko: "해산물 수프" }, price: 89000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_hai_san.jpg" },
                { id: 20, name: { vi: "Súp miso", en: "Miso soup", zh: "味噌湯", ja: "味噌汁", ko: "된장국" }, price: 39000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_miso.jpg" },
                { id: 21, name: { vi: "Tôm chiên xù", en: "Fried shrimp", zh: "炸蝦", ja: "エビフライ", ko: "새우튀김" }, price: 79000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/tom_chien_xu.jpg" }
            ],
            nuoc: [
                { id: 10, name: { vi: "Coca Cola", en: "Coca cola", zh: "可口可乐", ja: "コカコーラ", ko: "코카콜라" }, price: 10000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/coca-cola.jpg" },
                { id: 11, name: { vi: "Trà đào", en: "Peach tea", zh: "桃茶", ja: "ピーチティー", ko: "복숭아차" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/tra-dao.jpg" },
                { id: 12, name: { vi: "Bia", en: "Beer", zh: "啤酒", ja: "ビール", ko: "맥주" }, price: 29000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/bia.png" },
                { id: 30, name: { vi: "Rượu vang", en: "Wine", zh: "葡萄酒", ja: "ワイン", ko: "와인" }, price: 59000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/ruou-vang.png" },
                { id: 31, name: { vi: "Nước dưa hấu", en: "Watermelon juice", zh: "西瓜汁", ja: "スイカジュース", ko: "수박 주스" }, price: 20000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/nuoc_dua_hau.jpg" },
                { id: 32, name: { vi: "Nước cam", en: "Orange juice", zh: "柳橙汁", ja: "オレンジジュース", ko: "오렌지 주스" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/nuoc_cam.png" }
            ],
            khai_vi: [
                { id: 22, name: { vi: "Gỏi ngó sen", en: "Lotus root salad", zh: "蓮藕沙拉", ja: "レンコンサラダ", ko: "연근 샐러드" }, price: 49000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Gỏi ngó sen.jpg" },
                { id: 23, name: { vi: "Miến trộn", en: "Mixed noodles", zh: "什錦面", ja: "混ぜ麺", ko: "혼합면" }, price: 30000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Miến trộn.jpg" },
                { id: 24, name: { vi: "Salad trái cây", en: "Fruit salad", zh: "水果沙拉", ja: "フルーツサラダ", ko: "과일 샐러드" }, price: 45000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Salad trái cây.jpg" }
            ],
            trang_mieng: [
                { id: 26, name: { vi: "Chè bưởi", en: "Grapefruit sweet soup", zh: "葡萄柚甜湯", ja: "グレープフルーツのスイートスープ", ko: "자몽 달콤한 수프" }, price: 10000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/Chè bưởi.jpg" },
                { id: 27, name: { vi: "Mouse chanh dây", en: "Passion fruit mousse", zh: "百香果慕斯", ja: "パッションフルーツムース", ko: "패션프루트 무스" }, price: 25000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/Mousse chanh dây.jpg" },
                { id: 28, name: { vi: "Bánh kem", en: "Cake", zh: "蛋糕", ja: "ケーキ", ko: "케이크" }, price: 20000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/bánh_kem.jpg" },
                { id: 29, name: { vi: "Kem", en: "Ice cream", zh: "冰淇淋", ja: "アイスクリーム", ko: "아이스크림" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/kem.jpg" }
            ]
        };

        /* ======================= DYNAMIC CATEGORIES ======================= */
        // Categories list (loaded from Firestore)
        let categoriesList = [];

        // Default categories fallback
        const defaultCategories = [
            { key: 'nuong', name: { vi: 'Món nướng', en: 'Grilled', zh: '烧烤', ja: '焼き物', ko: '구이' } },
            { key: 'lau', name: { vi: 'Lẩu', en: 'Hotpot', zh: '火锅', ja: '鍋', ko: '전골' } },
            { key: 'mon_phu', name: { vi: 'Món phụ', en: 'Side Dishes', zh: '配菜', ja: 'サイドメニュー', ko: '반찬' } },
            { key: 'nuoc', name: { vi: 'Đồ uống', en: 'Drinks', zh: '饮料', ja: 'ドリンク', ko: '음료' } },
            { key: 'khai_vi', name: { vi: 'Khai vị', en: 'Appetizer', zh: '开胃菜', ja: '前菜', ko: '에피타이저' } },
            { key: 'trang_mieng', name: { vi: 'Tráng miệng', en: 'Dessert', zh: '甜点', ja: 'デザート', ko: '디저트' } }
        ];

        // Load categories from Firestore
        async function loadCategories() {
            try {
                const doc = await db.collection('settings').doc('categories').get();
                if (doc.exists && doc.data().list) {
                    categoriesList = doc.data().list;
                } else {
                    categoriesList = defaultCategories;
                }
            } catch (error) {
                console.log('Using default categories');
                categoriesList = defaultCategories;
            }
        }

        // Render category tabs dynamically
        function renderTabs() {
            const container = document.getElementById('tabsContainer');
            container.innerHTML = categoriesList.map((cat, index) => {
                const catName = cat.name?.[currentLang] || cat.name?.vi || cat.key;
                const activeClass = index === 0 ? 'active' : '';
                return `<div class="tab ${activeClass}" onclick="changeTab('${cat.key}', event)">${catName}</div>`;
            }).join('');

            // Set first category as default tab
            if (categoriesList.length > 0) {
                currentTab = categoriesList[0].key;
            }
        }

        // Load products from Firestore
        async function loadProductsFromFirestore() {
            try {
                console.log('📦 Loading products from Firestore...');
                const snapshot = await db.collection('products')
                    .where('available', '==', true)
                    .get();

                if (snapshot.empty) {
                    console.log('⚠️ No products in Firestore, using fallback data');
                    products = fallbackProducts;
                    return;
                }

                // Reset products object dynamically based on categories
                products = {};
                categoriesList.forEach(cat => {
                    products[cat.key] = [];
                });

                snapshot.forEach(doc => {
                    const data = doc.data();
                    // Create category array if it doesn't exist (for new categories)
                    if (!products[data.category]) {
                        products[data.category] = [];
                    }
                    products[data.category].push({
                        id: doc.id,
                        name: data.name,
                        price: data.price,
                        img: data.img
                    });
                });

                console.log(`✅ Loaded ${snapshot.size} products from Firestore`);
            } catch (error) {
                console.error('❌ Failed to load products from Firestore:', error);
                console.log('⚠️ Using fallback data');
                products = fallbackProducts;
            }
        }

        /* ======================= STATE ======================= */
        let cart = {};
        let currentTab = "nuong";
        // Load saved language from localStorage, default to 'vi'
        let currentLang = localStorage.getItem('yaki_language') || "vi";
        let orderedItems = {}; // lưu các món đã đặt (icon chuông)
        let isServiceCallActive = false;
        let currentTableId = 1; // lưu table ID từ URL

        // Set language dropdown to match saved language on page load
        function initLanguageDropdown() {
            const langSelect = document.getElementById('langSelect');
            const langDisplayMap = {
                'vi': 'Tiếng Việt',
                'en': 'English',
                'zh': '中文',
                'ja': '日本語',
                'ko': '한국어'
            };
            // Set dropdown value
            langSelect.value = langDisplayMap[currentLang] || 'Tiếng Việt';

            // Update UI text to match saved language
            document.getElementById("tableDisplay").innerText = `${translations[currentLang].table} ${currentTableId}`;
            document.getElementById("cartBtnText").innerText = translations[currentLang].buttons.cart;
            document.getElementById("callStaffBtnText").innerText = translations[currentLang].buttons.call;
            document.getElementById("cartTitle").innerText = translations[currentLang].cart.title;
            document.getElementById("totalLabel").innerText = translations[currentLang].cart.total;
            document.getElementById("orderBtn").innerText = translations[currentLang].buttons.order;
            document.getElementById("orderedText").innerText = translations[currentLang].buttons.ordered;
            document.getElementById("orderedTitle").innerText = translations[currentLang].ordered.title;
            document.getElementById("orderedTotalLabel").innerText = translations[currentLang].ordered.total;
            updateServiceCallButton(isServiceCallActive);
        }


        /* ======================= RENDER MENU ======================= */
        function renderMenu() {
            const list = document.getElementById("menuList");
            list.innerHTML = "";

            products[currentTab].forEach(item => {
                if (!cart[item.id]) cart[item.id] = { ...item, qty: 0 };

                list.innerHTML += `
            <div class="card
            ${cart[item.id].qty > 0 ? "selected" : ""}
            ${orderedItems[item.id] ? "ordered-flag" : ""}
            ">

             ${cart[item.id].qty > 0 ? '<div class="tick-mark">✓</div>' : ""}

            <img src="${item.img}">
            <div class="card-body">
                <div style="font-size:18px;font-weight:bold;">${item.name[currentLang]}</div>
                <div class="price">${item.price.toLocaleString()} đ</div>

                <div class="qty-row">
                    <div class="qty-btn" onclick="changeQty('${item.id}', -1)">−</div>
                    <input type="number"
                     id="qtyInput_${item.id}"
                     class="qty-input"
                     value="${cart[item.id].tempQty ?? cart[item.id].qty}"
                     min="0"
                     oninput="updateTempQty('${item.id}', this.value)">

                    <div class="qty-btn" onclick="changeQty('${item.id}', 1)">+</div>
                    <div class="add-cart-btn" onclick="addToCart('${item.id}')">
                        ${translations[currentLang].buttons.add}
                    </div>
                </div>
            </div>
        </div>`;
            });
        }
        /* ======================= TAB ======================= */
        function changeTab(tab, event) {
            currentTab = tab;
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            event.target.classList.add("active");
            renderMenu();
        }

        /* ======================= QTY ======================= */
        function changeQty(id, val) {
            if (!cart[id].tempQty) cart[id].tempQty = 0;

            cart[id].tempQty = Math.max(0, Number(cart[id].tempQty) + val);

            const num = cart[id].tempQty;
            document.getElementById(`qtyInput_${id}`).value = num;

            // 🔥 Nếu món đã trong giỏ → cập nhật giỏ ngay
            if (cart[id].qty > 0) {

                if (num === 0) {
                    cart[id].qty = 0;
                    updateCart();
                    renderMenu();
                    return;
                }

                cart[id].qty = num;
                updateCart();
                renderCartItems();
            }

            renderMenu();
        }


        function updateTempQty(id, value) {
            // Cho phép xoá hết để gõ lại mà không bị reset
            if (value === "") {
                cart[id].tempQty = 0;
                return;
            }

            let num = Number(value);
            if (isNaN(num)) return;

            num = Math.max(0, num);
            cart[id].tempQty = num;

            // Nếu món này đã nằm trong giỏ thì cập nhật luôn SL thật + tổng tiền
            if (cart[id].qty > 0) {
                if (num === 0) {
                    cart[id].qty = 0;
                    updateCart();   // chỉ cập nhật giỏ, KHÔNG render lại menu
                    renderMenu();   // 🔥 thêm dòng này để gỡ tick ngay lập tức
                    return;
                }

                cart[id].qty = num;
                updateCart();       // cập nhật tổng + danh sách trong giỏ
            }
        }




        /* ======================= ADD TO CART ======================= */
        function addToCart(id) {
            const temp = Number(cart[id].tempQty || 0);

            if (temp > 0) {
                cart[id].qty = temp;  // CẬP NHẬT GIỎ
                updateCart();
                renderMenu();

            }

            // Animation rung
            const el = document.getElementById("cartCount");
            el.style.animation = "shake 0.4s";
            setTimeout(() => el.style.animation = "", 400);
        }

        /* ======================= UPDATE CART ======================= */
        function updateCart() {
            let total = 0, count = 0;

            for (let id in cart) {
                if (cart[id].qty > 0) {
                    total += cart[id].qty * cart[id].price;
                    count += cart[id].qty;
                }
            }

            // total ordered
            let orderedTotal = 0;
            for (let id in orderedItems) {
                orderedTotal += orderedItems[id].qty * orderedItems[id].price;
            }

            // total final
            document.getElementById("totalPrice").innerText =
                (total + orderedTotal).toLocaleString();


            document.getElementById("totalPrice").innerText = total.toLocaleString();
            document.getElementById("cartCount").innerText = count;
            renderCartItems();

            // Save cart to localStorage
            saveCartToStorage();
        }

        /* ======================= CART PERSISTENCE ======================= */
        // Save cart to localStorage (per table)
        function saveCartToStorage() {
            const cartData = {};
            for (let id in cart) {
                if (cart[id].qty > 0) {
                    cartData[id] = {
                        id: cart[id].id,
                        name: cart[id].name,
                        price: cart[id].price,
                        img: cart[id].img,
                        qty: cart[id].qty,
                        tempQty: cart[id].tempQty
                    };
                }
            }
            localStorage.setItem(`yaki_cart_table_${currentTableId}`, JSON.stringify(cartData));
        }

        // Load cart from localStorage
        function loadCartFromStorage() {
            const savedCart = localStorage.getItem(`yaki_cart_table_${currentTableId}`);
            if (savedCart) {
                try {
                    const cartData = JSON.parse(savedCart);
                    for (let id in cartData) {
                        cart[id] = cartData[id];
                    }
                    console.log('✅ Cart restored from localStorage');
                } catch (e) {
                    console.log('⚠️ Could not parse saved cart');
                }
            }
        }

        // Clear cart from localStorage (called after successful order)
        function clearCartStorage() {
            localStorage.removeItem(`yaki_cart_table_${currentTableId}`);
        }

        /* ======================= CART ITEMS ======================= */
        function renderCartItems() {
            const box = document.getElementById("cartItems");
            box.innerHTML = "";

            for (let id in cart) {
                if (cart[id].qty > 0) {
                    box.innerHTML += `
<div class="cart-item">
    <b>${cart[id].name[currentLang]}</b><br>

    <div class="cart-qty-row">
        ${translations[currentLang].cart.qty}:
        <span class="cart-qty-btn" onclick="changeCartQtyBtn('${id}', -1)">−</span>
        <input class="cartQtyInput"
            type="number"
            value="${cart[id].qty}"
            min="0"
            data-id="${id}"
            oninput="changeCartQty(this)">
        <span class="cart-qty-btn" onclick="changeCartQtyBtn('${id}', 1)">+</span>
        × ${cart[id].price.toLocaleString()} đ
        <span class="cart-item-delete" onclick="deleteItem('${id}')">🗑️</span>
    </div>
</div>`;


                }
            }
        }

        /* ======================= CART PANEL ======================= */



        function toggleCart() {
            document.getElementById("cartPanel").classList.toggle("show");
        }

        function toggleOrdered() {
            document.getElementById("orderedPanel").classList.toggle("show");
        }


        /* ======================= ORDER ======================= */
        function placeOrder() {
            let hasItems = false;
            let itemsToOrder = [];

            for (let id in cart) {
                if (cart[id].qty > 0) {
                    hasItems = true;
                    itemsToOrder.push({
                        id: id,
                        name: cart[id].name, // Lưu cả object tên đa ngôn ngữ
                        price: cart[id].price,
                        qty: cart[id].qty
                    });
                }
            }

            if (!hasItems) {
                showAlert(translations[currentLang].messages.emptyCart);
                return;
            }

            // Lấy bàn từ URL parameter
            const tableIndex = currentTableId;
            const tableId = `table_${tableIndex}`;

            // Gửi lên Firebase
            const tableRef = db.collection("tables").doc(tableId);

            // Gửi lên Firebase và chờ kết quả
            tableRef.get().then((doc) => {
                let currentOrders = [];
                if (doc.exists) {
                    currentOrders = doc.data().orders || [];
                }

                // Nối thêm món mới
                const newOrders = currentOrders.concat(itemsToOrder);

                // Update lại
                return tableRef.set({
                    name: `Bàn ${tableIndex}`,
                    orders: newOrders,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }).then(() => {
                // Sau khi gửi thành công, clear giỏ hàng
                // orderedItems sẽ tự động cập nhật qua Firebase listener
                for (let id in cart) {
                    if (cart[id].qty > 0) {
                        cart[id].qty = 0;
                        cart[id].tempQty = 0;
                    }
                }

                // Clear cart from localStorage after successful order
                clearCartStorage();

                updateCart();
                renderMenu();
                showAlert(translations[currentLang].messages.orderSent);
            }).catch((error) => {
                console.error("Error writing document: ", error);
                showAlert("Lỗi kết nối Firebase!");
            });
        }



        /* ======================= LANGUAGE SWITCH ======================= */
        document.getElementById("langSelect").addEventListener("change", function () {

            document.getElementById("confirmCancelBtn").innerText = translations[currentLang].confirm.cancel;
            document.getElementById("confirmOkBtn").innerText = translations[currentLang].confirm.ok;


            currentLang = {
                "Tiếng Việt": "vi", "English": "en", "中文": "zh", "日本語": "ja", "한국어": "ko"
            }[this.value];

            // Update tab text
            document.querySelectorAll(".tab").forEach(tab => {
                const key = tab.getAttribute("onclick").match(/'(\w+)'/)[1];
                tab.innerText = translations[currentLang].tabs[key];
            });

            // Buttons
            document.getElementById("orderBtn").innerText = translations[currentLang].buttons.order;
            document.getElementById("cartBtnText").innerText = translations[currentLang].buttons.cart;
            document.getElementById("callStaffBtnText").innerText = translations[currentLang].buttons.call;
            document.getElementById("orderedText").innerText = translations[currentLang].buttons.ordered;

            // Cart text
            document.getElementById("cartTitle").innerText = translations[currentLang].cart.title;
            document.getElementById("totalLabel").innerText = translations[currentLang].cart.total;

            // Ordered panel text
            document.getElementById("orderedTitle").innerText = translations[currentLang].ordered.title;
            document.getElementById("orderedTotalLabel").innerText = translations[currentLang].ordered.total;

            // Update table display text with current language
            const tableDisplay = document.getElementById("tableDisplay");
            tableDisplay.innerText = `${translations[currentLang].table} ${currentTableId}`;

            // ⬅️ FIX: Re-render menu + cart + ordered items theo ngôn ngữ mới
            renderMenu();
            updateCart();
            renderOrderedItems();

            // Update chatbot UI language
            updateChatbotLanguage();
            updateServiceCallButton(isServiceCallActive);
        });

        /* ======================= URL PARAMETER HANDLING ======================= */
        // Max table count (will be loaded from Firestore)
        let maxTableCount = 10; // Default fallback

        // Load max table count from Firestore
        async function loadMaxTableCount() {
            try {
                const doc = await db.collection('settings').doc('tables').get();
                if (doc.exists && doc.data().count) {
                    maxTableCount = doc.data().count;
                }
            } catch (error) {
                console.log('Using default table count:', maxTableCount);
            }
        }

        // Lấy table ID từ URL parameter (ví dụ: ?table=3)
        function getTableIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const tableParam = urlParams.get('table');

            if (tableParam) {
                const tableNum = parseInt(tableParam);
                // Validate table number (1 to maxTableCount)
                if (tableNum >= 1 && tableNum <= maxTableCount) {
                    return tableNum;
                }
            }

            // Default to table 1 if no valid parameter
            return 1;
        }

        // Lấy session token từ URL hoặc sessionStorage
        function getSessionToken() {
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');
            console.log('🔑 [Session] URL token:', tokenFromUrl);
            console.log('🔑 [Session] Full URL:', window.location.href);
            console.log('🔑 [Session] Search params:', window.location.search);

            if (tokenFromUrl) {
                // Lưu vào sessionStorage để refresh không mất
                sessionStorage.setItem('yaki_session_token', tokenFromUrl);
                sessionStorage.setItem('yaki_session_table', getTableIdFromUrl().toString());
                return tokenFromUrl;
            }

            // Fallback: lấy từ sessionStorage (chỉ nếu cùng bàn)
            const savedTable = sessionStorage.getItem('yaki_session_table');
            const currentTable = getTableIdFromUrl().toString();
            console.log('🔑 [Session] Saved table:', savedTable, '| Current table:', currentTable);
            if (savedTable === currentTable) {
                const savedToken = sessionStorage.getItem('yaki_session_token');
                console.log('🔑 [Session] Using saved token:', savedToken);
                return savedToken;
            }
            console.log('🔑 [Session] No token found');
            return null;
        }

        // Validate session token với Firestore (dùng onSnapshot thay vì .get() để chờ kết nối)
        function validateSession(tableId, token) {
            console.log('🔐 [Validate] tableId:', tableId, '| token:', token);
            if (!token) {
                console.log('🔐 [Validate] No token provided, returning false');
                return Promise.resolve(false);
            }

            return new Promise((resolve) => {
                const docRef = db.collection('tables').doc(`table_${tableId}`);
                console.log('🔐 [Validate] Listening for Firestore doc:', `table_${tableId}`);

                // Timeout 8 giây nếu Firestore không phản hồi
                const timeout = setTimeout(() => {
                    console.log('🔐 [Validate] Timeout! Firestore not responding after 8s');
                    unsubscribe();
                    resolve(false);
                }, 8000);

                const unsubscribe = docRef.onSnapshot(
                    (doc) => {
                        clearTimeout(timeout);
                        unsubscribe();
                        console.log('🔐 [Validate] Doc exists:', doc.exists);
                        if (doc.exists) {
                            const data = doc.data();
                            console.log('🔐 [Validate] Firestore sessionToken:', data.sessionToken);
                            console.log('🔐 [Validate] URL token:', token);
                            console.log('🔐 [Validate] Match:', data.sessionToken === token);
                            resolve(data.sessionToken === token);
                        } else {
                            console.log('🔐 [Validate] Document does not exist!');
                            resolve(false);
                        }
                    },
                    (error) => {
                        clearTimeout(timeout);
                        unsubscribe();
                        console.error('❌ Session validation error:', error);
                        resolve(false);
                    }
                );
            });
        }

        // Hiển thị màn hình chặn truy cập
        function showSessionBlocked() {
            const t = translations[currentLang].session;
            document.getElementById('blockedTitle').innerText = t.blockedTitle;
            document.getElementById('blockedMessage').innerText = t.blockedMessage;
            document.getElementById('sessionBlockedScreen').classList.add('show');
        }

        /* INIT */
        // Initialize app with async data loading
        (async function initApp() {
            // Load table count first to validate URL parameter
            await loadMaxTableCount();

            // Lấy table ID từ URL và cập nhật hiển thị
            currentTableId = getTableIdFromUrl();
            document.getElementById("tableDisplay").innerText = `${translations[currentLang].table} ${currentTableId}`;

            // 🔐 Validate session token
            const token = getSessionToken();
            console.log('🚀 [Init] Table:', currentTableId, '| Token:', token);
            const isValidSession = await validateSession(currentTableId, token);
            console.log('🚀 [Init] Session valid:', isValidSession);

            if (!isValidSession) {
                showSessionBlocked();
                return; // Không load menu nếu session không hợp lệ
            }

            // Load categories from Firestore
            await loadCategories();

            // Render category tabs
            renderTabs();

            // Load products from Firestore (with fallback to hardcoded)
            await loadProductsFromFirestore();

            // Start listening to Firebase for real-time updates
            listenToTableOrders();

            // Load saved cart from localStorage
            loadCartFromStorage();

            // Render menu after products are loaded
            renderMenu();

            // Update cart display with restored items
            updateCart();
        })();

        // Gọi qua serverless function cùng domain (Vercel) để giấu API key
        // và tránh wifi công cộng chặn domain phụ như *.workers.dev.
        const GEMINI_API_URL = '/api/gemini';
        const MAX_CHATBOT_GUESTS = 8;

        // Chatbot state
        let aiChatState = {
            step: 0, // 0: greeting, 1: ask guests, 2: ask budget, 3: ask preferences, 4: show recommendations, 5: confirm add
            guests: 0,
            budget: 0,
            preferences: "",
            recommendations: [],
            isOpen: false
        };

        // Toggle chatbot panel
        function toggleAiChat() {
            const panel = document.getElementById("aiChatPanel");
            aiChatState.isOpen = !aiChatState.isOpen;
            panel.classList.toggle("show");

            // If opening for first time or reset, start conversation
            if (aiChatState.isOpen && aiChatState.step === 0) {
                startAiConversation();
            }
        }

        // Start/restart conversation
        function startAiConversation() {
            const messagesDiv = document.getElementById("aiChatMessages");
            messagesDiv.innerHTML = "";
            aiChatState = {
                step: 1,
                guests: 0,
                budget: 0,
                preferences: "",
                recommendations: [],
                isOpen: true
            };

            // Show greeting then ask guests
            addBotMessage(translations[currentLang].chatbot.greeting);
            setTimeout(() => {
                addBotMessage(translations[currentLang].chatbot.askGuests);
            }, 500);

            showInputArea();
            hideQuickResponses();
            setInputMode("numeric");
        }

        // Add bot message to chat
        function addBotMessage(text) {
            const messagesDiv = document.getElementById("aiChatMessages");
            const msgDiv = document.createElement("div");
            msgDiv.className = "ai-message bot";
            msgDiv.innerHTML = text.replace(/\n/g, "<br>");
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Add user message to chat
        function addUserMessage(text) {
            const messagesDiv = document.getElementById("aiChatMessages");
            const msgDiv = document.createElement("div");
            msgDiv.className = "ai-message user";
            msgDiv.textContent = text;
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Add thinking indicator
        function addThinkingMessage() {
            const messagesDiv = document.getElementById("aiChatMessages");
            const msgDiv = document.createElement("div");
            msgDiv.className = "ai-message bot thinking";
            msgDiv.id = "thinkingMsg";
            msgDiv.textContent = translations[currentLang].chatbot.thinking;
            messagesDiv.appendChild(msgDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Remove thinking indicator
        function removeThinkingMessage() {
            const thinkingMsg = document.getElementById("thinkingMsg");
            if (thinkingMsg) thinkingMsg.remove();
        }

        // Show/hide UI elements
        function showInputArea() {
            document.getElementById("aiChatInputArea").style.display = "flex";
        }

        function hideInputArea() {
            document.getElementById("aiChatInputArea").style.display = "none";
        }

        // Set input mode for mobile keyboard optimization
        function setInputMode(mode) {
            const input = document.getElementById("aiChatInput");
            if (mode === "numeric") {
                input.inputMode = "numeric";
                input.placeholder = translations[currentLang].chatbot.inputPlaceholder;
            } else {
                input.inputMode = "text";
                input.placeholder = translations[currentLang].chatbot.inputPlaceholderDietary || translations[currentLang].chatbot.inputPlaceholder;
            }
        }

        function showQuickResponses() {
            document.getElementById("aiQuickResponses").style.display = "flex";
        }

        function hideQuickResponses() {
            document.getElementById("aiQuickResponses").style.display = "none";
        }

        // Send user message from input
        function sendAiMessage() {
            const input = document.getElementById("aiChatInput");
            const text = input.value.trim();
            if (!text) return;

            addUserMessage(text);
            input.value = "";

            processUserInput(text);
        }

        // Handle quick response buttons (0 or 1)
        function handleQuickResponse(value) {
            addUserMessage(value === 1 ? translations[currentLang].chatbot.yes : translations[currentLang].chatbot.no);
            hideQuickResponses();

            if (aiChatState.step === 5) {
                // Confirm add to cart
                if (value === 1) {
                    addRecommendationsToCart();
                    addBotMessage(translations[currentLang].chatbot.addedToCart);
                } else {
                    addBotMessage(translations[currentLang].chatbot.notAdded);
                }
                // Reset for new conversation
                setTimeout(() => {
                    aiChatState.step = 0;
                }, 1000);
            }
        }

        // Process user text input based on current step
        function processUserInput(text) {
            switch (aiChatState.step) {
                case 1: // Waiting for number of guests
                    const guests = parseInt(text);
                    if (isNaN(guests) || guests < 1) {
                        addBotMessage(translations[currentLang].chatbot.askGuests);
                        return;
                    }
                    if (guests > MAX_CHATBOT_GUESTS) {
                        addBotMessage(translations[currentLang].chatbot.guestLimitExceeded);
                        addBotMessage(translations[currentLang].chatbot.askGuests);
                        return;
                    }
                    aiChatState.guests = guests;
                    aiChatState.step = 2;
                    addBotMessage(translations[currentLang].chatbot.askBudget);
                    break;

                case 2: // Waiting for budget
                    const budget = parseInt(text.replace(/[,.\s]/g, ""));
                    if (isNaN(budget) || budget < 1000) {
                        addBotMessage(translations[currentLang].chatbot.askBudget);
                        return;
                    }
                    // Check if budget is lower than the cheapest item on the menu
                    const minItem = getMinPriceItem();
                    if (minItem && budget < minItem.price) {
                        const itemName = minItem.name[currentLang] || minItem.name['vi'];
                        const msg = translations[currentLang].chatbot.budgetTooLow
                            .replace(/\{minPrice\}/g, minItem.price.toLocaleString())
                            .replace('{minItem}', itemName);
                        addBotMessage(msg);
                        return;
                    }
                    aiChatState.budget = budget;
                    aiChatState.step = 3;
                    addBotMessage(translations[currentLang].chatbot.askPreferences);
                    setInputMode("text");
                    break;

                case 3: // Waiting for preferences (alcohol + dietary combined)
                    const preferencesText = text.trim();
                    const skipWords = ["không", "no", "none", "没有", "なし", "없음", "skip", ""];
                    if (skipWords.includes(preferencesText.toLowerCase())) {
                        aiChatState.preferences = "";
                    } else {
                        aiChatState.preferences = preferencesText;
                    }
                    aiChatState.step = 4;
                    hideInputArea();
                    getRecommendations();
                    break;
            }
        }

        // Get the cheapest item from the menu
        function getMinPriceItem() {
            let minItem = null;
            for (const category in products) {
                for (const item of products[category]) {
                    if (!minItem || item.price < minItem.price) {
                        minItem = item;
                    }
                }
            }
            return minItem;
        }

        // Build menu context for AI
        function buildMenuContext() {
            let menuText = "MENU (prices in VND):\n\n";

            for (const category in products) {
                const categoryName = translations[currentLang].tabs[category] || category;
                menuText += `=== ${categoryName} ===\n`;

                products[category].forEach(item => {
                    const name = item.name[currentLang] || item.name.vi;
                    const isAlcohol = item.id === 12 || item.id === 30; // Beer and Wine
                    menuText += `- ID:${item.id}, ${name}, ${item.price.toLocaleString()}đ${isAlcohol ? " (alcohol)" : ""}\n`;
                });
                menuText += "\n";
            }

            return menuText;
        }

        // Get recommendations from Gemini API
        async function getRecommendations() {
            addThinkingMessage();
            hideInputArea();

            const menuContext = buildMenuContext();
            const langName = {
                vi: "Vietnamese",
                en: "English",
                zh: "Chinese",
                ja: "Japanese",
                ko: "Korean"
            }[currentLang];

            const preferencesInfo = aiChatState.preferences
                ? `- Customer's preferences/requests: "${aiChatState.preferences}"`
                : "- No special preferences";

            const prompt = `You are a restaurant assistant at Yaki, a Korean BBQ restaurant.

${menuContext}

Customer information:
- Number of guests: ${aiChatState.guests}
- Budget: ${aiChatState.budget.toLocaleString()} VND
${preferencesInfo}

Recommend dishes for this customer. Stay within budget. Include variety: main dishes, sides, drinks.
${aiChatState.preferences ? "IMPORTANT: Strictly respect the customer's preferences and restrictions. Carefully read their request and do NOT recommend any dish that violates their dietary, religious, or personal preferences." : ""}

IMPORTANT: Respond in ${langName} language. DO NOT explain or add any extra text.

Format EXACTLY like this:
- [Item Name] x[quantity] - [price]đ [ID:X]
${translations[currentLang].chatbot.total}: [total price]đ`;

            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: prompt
                    })
                });

                const data = await response.json();
                removeThinkingMessage();

                if (data.success && data.response) {
                    const aiResponse = data.response;
                    parseAndShowRecommendations(aiResponse);
                } else {
                    console.error("Worker error:", data.error);
                    addBotMessage(translations[currentLang].chatbot.error);
                    showInputArea();
                    setInputMode("numeric");
                    aiChatState.step = 1;
                }
            } catch (error) {
                console.error("Gemini API error:", error);
                removeThinkingMessage();
                addBotMessage(translations[currentLang].chatbot.error);
                showInputArea();
                setInputMode("numeric");
                aiChatState.step = 1;
            }
        }

        // Parse AI response and show recommendations
        function parseAndShowRecommendations(response) {
            // Remove [ID:xxx] from display (handles both numeric and alphanumeric IDs)
            const displayResponse = response.replace(/\s*\[ID:[^\]]+\]/gi, '');
            // Show the AI's response without IDs
            addBotMessage(displayResponse.replace(/\n/g, "<br>"));

            // Try to extract item IDs from the response (handles alphanumeric Firestore IDs)
            aiChatState.recommendations = [];
            const idPattern = /x(\d+)[^\[]*\[ID:([^\]]+)\]/gi;
            let match;

            while ((match = idPattern.exec(response)) !== null) {
                const qty = parseInt(match[1]);
                const itemId = match[2]; // Keep as string for Firestore IDs

                // Find the product
                for (const category in products) {
                    const product = products[category].find(p => String(p.id) === String(itemId));
                    if (product) {
                        aiChatState.recommendations.push({
                            ...product,
                            qty: qty
                        });
                        break;
                    }
                }
            }

            // If no IDs found, try to match by name
            if (aiChatState.recommendations.length === 0) {
                for (const category in products) {
                    products[category].forEach(product => {
                        const nameVi = product.name.vi.toLowerCase();
                        const nameEn = product.name.en.toLowerCase();
                        const nameCurrent = product.name[currentLang]?.toLowerCase() || "";

                        if (response.toLowerCase().includes(nameVi) ||
                            response.toLowerCase().includes(nameEn) ||
                            response.toLowerCase().includes(nameCurrent)) {

                            // Try to find quantity
                            const qtyMatch = response.match(new RegExp(`${product.name[currentLang]}[^x]*x\\s*(\\d+)`, "i")) ||
                                response.match(new RegExp(`${product.name.vi}[^x]*x\\s*(\\d+)`, "i"));
                            const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;

                            if (!aiChatState.recommendations.find(r => r.id === product.id)) {
                                aiChatState.recommendations.push({
                                    ...product,
                                    qty: qty
                                });
                            }
                        }
                    });
                }
            }

            // Ask for confirmation
            aiChatState.step = 5;
            setTimeout(() => {
                addBotMessage(translations[currentLang].chatbot.confirmAdd);
                showQuickResponses();
            }, 500);
        }

        // Add recommendations to cart
        function addRecommendationsToCart() {
            aiChatState.recommendations.forEach(item => {
                if (!cart[item.id]) {
                    cart[item.id] = { ...item, qty: 0, tempQty: 0 };
                }
                cart[item.id].qty += item.qty;
                cart[item.id].tempQty = cart[item.id].qty;
            });

            updateCart();
            renderMenu();

            // Animation on cart button
            const el = document.getElementById("cartCount");
            el.style.animation = "shake 0.4s";
            setTimeout(() => el.style.animation = "", 400);
        }

        // Update chatbot UI when language changes
        function updateChatbotLanguage() {
            document.getElementById("aiChatBtnText").innerText = translations[currentLang].chatbot.btnText;
            document.getElementById("aiChatTitle").innerText = translations[currentLang].chatbot.title;
            document.getElementById("aiYesText").innerText = translations[currentLang].chatbot.yes;
            document.getElementById("aiNoText").innerText = translations[currentLang].chatbot.no;
            document.getElementById("aiChatInput").placeholder = translations[currentLang].chatbot.inputPlaceholder;
            document.getElementById("aiSendBtn").innerText = translations[currentLang].chatbot.send;
        }

        // Language change handler - update tabs and UI when language changes
        document.getElementById('langSelect').addEventListener('change', function () {
            const langMap = {
                "Tiếng Việt": "vi", "English": "en", "中文": "zh", "日本語": "ja", "한국어": "ko"
            };
            currentLang = langMap[this.value] || 'vi';

            // Save language preference to localStorage
            localStorage.setItem('yaki_language', currentLang);

            // Re-render category tabs with new language
            renderTabs();

            // Re-render menu to update item names
            renderMenu();

            // Update chatbot language
            updateChatbotLanguage();

            // Update other UI text
            document.getElementById("tableDisplay").innerText = `${translations[currentLang].table} ${currentTableId}`;
            document.getElementById("cartBtnText").innerText = translations[currentLang].buttons.cart;
            document.getElementById("callStaffBtnText").innerText = translations[currentLang].buttons.call;
            document.getElementById("cartTitle").innerText = translations[currentLang].cart.title;
            document.getElementById("totalLabel").innerText = translations[currentLang].cart.total;
            document.getElementById("orderBtn").innerText = translations[currentLang].buttons.order;
            document.getElementById("orderedText").innerText = translations[currentLang].buttons.ordered;
            document.getElementById("orderedTitle").innerText = translations[currentLang].ordered.title;
            document.getElementById("orderedTotalLabel").innerText = translations[currentLang].ordered.total;
            updateServiceCallButton(isServiceCallActive);

            // Re-render cart and ordered items with new language
            renderCartItems();
            renderOrderedItems();
        });

        // Initialize chatbot language and restore saved language
        updateChatbotLanguage();
        initLanguageDropdown();

    /* ======================= SERVICE WORKER REGISTRATION ======================= */
        // Đăng ký Service Worker để cache ảnh
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('✅ Service Worker registered - Images will be cached!');

                        // Kiểm tra số lượng ảnh đã cache (optional)
                        if (registration.active) {
                            registration.active.postMessage({ action: 'getCacheStats' });
                        }

                        // Preload tất cả ảnh ngay khi SW sẵn sàng
                        preloadAllImages();
                    })
                    .catch((error) => {
                        console.log('⚠️ Service Worker registration failed:', error);
                        // Vẫn preload ảnh dù SW fail
                        preloadAllImages();
                    });

                // Lắng nghe message từ Service Worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data.action === 'cacheStats') {
                        console.log(`📦 Cached images: ${event.data.count}`);
                    }
                    if (event.data.action === 'preloadComplete') {
                        console.log(`🎉 All images preloaded and cached!`);
                    }
                });
            });
        } else {
            // Nếu không hỗ trợ SW, vẫn preload ảnh để browser tự cache
            window.addEventListener('load', preloadAllImages);
        }

        /**
         * Preload TẤT CẢ ảnh sản phẩm ngay khi trang mở
         * Ảnh sẽ được tải và cache ngay lập tức
         */
        function preloadAllImages() {
            // Thu thập tất cả URL ảnh từ products object
            const allImageUrls = [];

            for (const category in products) {
                products[category].forEach(item => {
                    if (item.img) {
                        allImageUrls.push(item.img);
                    }
                });
            }

            console.log(`🚀 Preloading ${allImageUrls.length} images...`);

            let loadedCount = 0;
            let errorCount = 0;

            // Tạo Image objects để preload
            allImageUrls.forEach((url, index) => {
                const img = new Image();

                img.onload = () => {
                    loadedCount++;
                    // Log tiến trình mỗi 5 ảnh
                    if (loadedCount % 5 === 0 || loadedCount === allImageUrls.length) {
                        console.log(`📷 Preloaded: ${loadedCount}/${allImageUrls.length} images`);
                    }

                    // Khi tất cả ảnh đã load xong
                    if (loadedCount + errorCount === allImageUrls.length) {
                        console.log(`✅ Preload complete! ${loadedCount} loaded, ${errorCount} failed`);
                    }
                };

                img.onerror = () => {
                    errorCount++;
                    console.warn(`⚠️ Failed to preload: ${url.substring(0, 50)}...`);

                    if (loadedCount + errorCount === allImageUrls.length) {
                        console.log(`✅ Preload complete! ${loadedCount} loaded, ${errorCount} failed`);
                    }
                };

                // Bắt đầu tải ảnh
                img.src = url;
            });
        }

        // Hàm xóa cache ảnh (gọi khi cần)
        function clearImageCache() {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ action: 'clearImageCache' });
            }
        }

        /* ======================= DOUBLE-CLICK/TAP TO CLOSE PANELS ======================= */
        // Biến theo dõi double-tap cho mobile
        let lastTapTime = 0;
        const DOUBLE_TAP_DELAY = 300; // ms

        // Hàm kiểm tra click có nằm ngoài panel không
        function isOutsidePanel(target) {
            const cartPanel = document.getElementById('cartPanel');
            const orderedPanel = document.getElementById('orderedPanel');
            const aiChatPanel = document.getElementById('aiChatPanel');

            // Không đóng nếu click vào các panel hoặc các nút điều khiển
            if (cartPanel.contains(target) ||
                orderedPanel.contains(target) ||
                (aiChatPanel && aiChatPanel.contains(target)) ||
                target.closest('#cartBtn') ||
                target.closest('#orderedBtn') ||
                target.closest('#aiChatBtn') ||
                target.closest('.header-controls')) {
                return false;
            }
            return true;
        }

        // Hàm đóng các panel đang mở
        function closePanelsIfOpen() {
            const cartPanel = document.getElementById('cartPanel');
            const orderedPanel = document.getElementById('orderedPanel');
            let closed = false;

            if (cartPanel.classList.contains('show')) {
                cartPanel.classList.remove('show');
                closed = true;
            }
            if (orderedPanel.classList.contains('show')) {
                orderedPanel.classList.remove('show');
                closed = true;
            }
            return closed;
        }

        // Double-click để đóng (Desktop)
        document.addEventListener('dblclick', function (e) {
            if (isOutsidePanel(e.target)) {
                closePanelsIfOpen();
            }
        });

        // Double-tap để đóng (Mobile/Touch)
        document.addEventListener('touchend', function (e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;

            if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
                // Double-tap detected
                if (isOutsidePanel(e.target)) {
                    e.preventDefault(); // Ngăn zoom trên mobile
                    closePanelsIfOpen();
                }
            }
            lastTapTime = currentTime;
        });
