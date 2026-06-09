// Firebase config (same as your app)
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

// All 33 products from customer.html
const products = [
    // nuong (8 items)
    { category: "nuong", name: { vi: "Ba chỉ bò Mỹ", en: "US beef belly", zh: "美國牛腹肉", ja: "米国牛バラ", ko: "미국 소고기 배" }, price: 139000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ba-chi-bo-my.jpg" },
    { category: "nuong", name: { vi: "Dẻ sườn bò", en: "Beef bibs", zh: "牛肋排", ja: "牛リブ", ko: "소갈비" }, price: 169000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/de-suon-bo-nuong.jpg" },
    { category: "nuong", name: { vi: "Sườn heo sốt mật ong", en: "Honey pork ribs", zh: "蜜汁豬肋排", ja: "ハニーポークリブ", ko: "허니 돼지갈비" }, price: 129000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/suon-nuong-mat-ong.jpg" },
    { category: "nuong", name: { vi: "Gà nướng", en: "Grilled chicken", zh: "烤雞", ja: "グリルチキン", ko: "구운 닭고기" }, price: 89000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ga-nuong.jpg" },
    { category: "nuong", name: { vi: "Cá hồi nướng", en: "Grilled salmon", zh: "烤鮭魚", ja: "グリルサーモン", ko: "구운 연어" }, price: 99000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/ca_hoi_nuong.png" },
    { category: "nuong", name: { vi: "Mực nướng", en: "Grilled squid", zh: "烤魷魚", ja: "焼きイカ", ko: "구운 오징어" }, price: 119000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/muc_nuong.jpg" },
    { category: "nuong", name: { vi: "Tôm nướng", en: "Grilled shrimp", zh: "烤蝦", ja: "焼きエビ", ko: "구운 새우" }, price: 109000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/tom_nuong.jpg" },
    { category: "nuong", name: { vi: "Bò bít tết", en: "Beef steak", zh: "牛排", ja: "ビーフステーキ", ko: "소고기 스테이크" }, price: 159000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/nuong/bo_beef_steak.jpg" },

    // lau (3 items)
    { category: "lau", name: { vi: "Lẩu kim chi", en: "Kimchi hotpot", zh: "泡菜火锅", ja: "キムチ鍋", ko: "김치전골" }, price: 199000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/Lau-kim-chi.png" },
    { category: "lau", name: { vi: "Lẩu bulgogi", en: "Bulgogi hotpot", zh: "烤肉火锅", ja: "プルコギ鍋", ko: "불고기전골" }, price: 249000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/lau-bulgogi.webp" },
    { category: "lau", name: { vi: "Lẩu hải sản", en: "Seafood hotpot", zh: "海鮮火鍋", ja: "海鮮鍋", ko: "해산물 냄비" }, price: 209000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/lẩu/lau_hai_san.jpg" },

    // mon_phu (7 items)
    { category: "mon_phu", name: { vi: "Tokbokki phô mai", en: "Cheese tokbokki", zh: "芝士炒年糕", ja: "チーズトッポッキ", ko: "치즈 떡볶이" }, price: 35000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/tokbokki-pho-mai.jpg" },
    { category: "mon_phu", name: { vi: "Cơm trộn Hàn Quốc", en: "Bibimbap", zh: "拌饭", ja: "ビビンバ", ko: "비빔밥" }, price: 49000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/com-tron-han-quoc.jpg" },
    { category: "mon_phu", name: { vi: "Khoai tây chiên", en: "French fries", zh: "薯条", ja: "ポテトフライ", ko: "감자튀김" }, price: 39000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/khoai-tay-chien.webp" },
    { category: "mon_phu", name: { vi: "Súp bào ngư", en: "Abalone soup", zh: "鮑魚湯", ja: "アワビのスープ", ko: "전복 수프" }, price: 99000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_bao_ngu.jpg" },
    { category: "mon_phu", name: { vi: "Súp hải sản", en: "Seafood soup", zh: "海鮮湯", ja: "シーフードスープ", ko: "해산물 수프" }, price: 89000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_hai_san.jpg" },
    { category: "mon_phu", name: { vi: "Súp miso", en: "Miso soup", zh: "味噌湯", ja: "味噌汁", ko: "된장국" }, price: 39000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/sup_miso.jpg" },
    { category: "mon_phu", name: { vi: "Tôm chiên xù", en: "Fried shrimp", zh: "炸蝦", ja: "エビフライ", ko: "새우튀김" }, price: 79000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/món phụ/tom_chien_xu.jpg" },

    // nuoc (6 items)
    { category: "nuoc", name: { vi: "Coca Cola", en: "Coca cola", zh: "可口可乐", ja: "コカコーラ", ko: "코카콜라" }, price: 10000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/coca-cola.jpg" },
    { category: "nuoc", name: { vi: "Trà đào", en: "Peach tea", zh: "桃茶", ja: "ピーチティー", ko: "복숭아차" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/tra-dao.jpg" },
    { category: "nuoc", name: { vi: "Bia", en: "Beer", zh: "啤酒", ja: "ビール", ko: "맥주" }, price: 29000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/bia.png" },
    { category: "nuoc", name: { vi: "Rượu vang", en: "Wine", zh: "葡萄酒", ja: "ワイン", ko: "와인" }, price: 59000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/ruou-vang.png" },
    { category: "nuoc", name: { vi: "Nước dưa hấu", en: "Watermelon juice", zh: "西瓜汁", ja: "スイカジュース", ko: "수박 주스" }, price: 20000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/nuoc_dua_hau.jpg" },
    { category: "nuoc", name: { vi: "Nước cam", en: "Orange juice", zh: "柳橙汁", ja: "オレンジジュース", ko: "오렌지 주스" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/drink/nuoc_cam.png" },

    // khai_vi (3 items)
    { category: "khai_vi", name: { vi: "Gỏi ngó sen", en: "Lotus root salad", zh: "蓮藕沙拉", ja: "レンコンサラダ", ko: "연근 샐러드" }, price: 49000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Gỏi ngó sen.jpg" },
    { category: "khai_vi", name: { vi: "Miến trộn", en: "Mixed noodles", zh: "什錦面", ja: "混ぜ麺", ko: "혼합면" }, price: 30000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Miến trộn.jpg" },
    { category: "khai_vi", name: { vi: "Salad trái cây", en: "Fruit salad", zh: "水果沙拉", ja: "フルーツサラダ", ko: "과일 샐러드" }, price: 45000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/khai vị/Salad trái cây.jpg" },

    // trang_mieng (4 items)
    { category: "trang_mieng", name: { vi: "Chè bưởi", en: "Grapefruit sweet soup", zh: "葡萄柚甜湯", ja: "グレープフルーツのスイートスープ", ko: "자몽 달콤한 수프" }, price: 10000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/Chè bưởi.jpg" },
    { category: "trang_mieng", name: { vi: "Mouse chanh dây", en: "Passion fruit mousse", zh: "百香果慕斯", ja: "パッションフルーツムース", ko: "패션프루트 무스" }, price: 25000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/Mousse chanh dây.jpg" },
    { category: "trang_mieng", name: { vi: "Bánh kem", en: "Cake", zh: "蛋糕", ja: "ケーキ", ko: "케이크" }, price: 20000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/bánh_kem.jpg" },
    { category: "trang_mieng", name: { vi: "Kem", en: "Ice cream", zh: "冰淇淋", ja: "アイスクリーム", ko: "아이스크림" }, price: 15000, img: "https://raw.githubusercontent.com/huyhuynh03/imagine-order-system-app/main/food/tráng miệng/kem.jpg" }
];

let doneCount = 0;
const totalCount = products.length;

function log(message, type = 'info') {
    const logDiv = document.getElementById('log');
    const item = document.createElement('div');
    item.className = `log-item ${type}`;
    item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logDiv.appendChild(item);
    logDiv.scrollTop = logDiv.scrollHeight;
}

function updateProgress() {
    doneCount++;
    document.getElementById('doneCount').textContent = doneCount;
    const percent = (doneCount / totalCount) * 100;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

async function seedProducts() {
    const btn = document.getElementById('seedBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Seeding...';

    log('Starting seed process...', 'info');
    log(`Total products to seed: ${totalCount}`, 'info');

    // Also create settings/tables document
    try {
        await db.collection('settings').doc('tables').set({
            count: 10,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        log('✅ Created settings/tables with count: 10', 'success');
    } catch (err) {
        log('❌ Failed to create settings/tables: ' + err.message, 'error');
    }

    // Seed each product
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        try {
            await db.collection('products').add({
                ...product,
                available: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            log(`✅ ${product.name.vi}`, 'success');
            updateProgress();
        } catch (err) {
            log(`❌ Failed: ${product.name.vi} - ${err.message}`, 'error');
        }
    }

    log('🎉 Seeding complete!', 'success');
    btn.textContent = '✅ Done!';
}
