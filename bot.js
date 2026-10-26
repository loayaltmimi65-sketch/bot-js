const TelegramBot = require('node-telegram-bot-api');

// ⚠️ التوكن بتاعك
const TOKEN = '8945901025:AAFMunPkkoNRdMrj-OtgSUnUapqV_TKEK90';
const bot = new TelegramBot(TOKEN, { polling: true });

// رابط صورة الهيدر
const BANNER_URL = "https://www.image2url.com/r2/default/images/1792619785603-05724b00-59c1-46c7-a878-821f2cbd8452.png";

// دالة لإنشاء القائمة الرئيسية
function getMainKeyboard() {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "📸 اختراق كاميرا", callback_data: 'cam' }, { text: "☠️ تلغيم صورة", callback_data: 'soon' }],
                [{ text: "🎙️ تسجيل صوت", callback_data: 'voice' }, { text: "📹 تصوير فيديو", callback_data: 'video' }],
                [{ text: "📍 تحديد الموقع", callback_data: 'location' }],
                [{ text: "✅ اختراق واتساب", callback_data: 'whatsapp' }, { text: "📨 اختراق تلجرام", callback_data: 'telegram' }],
                [{ text: "🎬 اختراق تيك توك", callback_data: 'tiktok' }, { text: "🚀 اختراق انستقرام", callback_data: 'instagram' }],
                [{ text: "🔵 اختراق فيسبوك", callback_data: 'facebook' }, { text: "👻 اختراق سناب", callback_data: 'snapchat' }],
                [{ text: "❤️ اختراق لايكي", callback_data: 'likee' }, { text: "🎥 اختراق كواي", callback_data: 'kwai' }],
                [{ text: "▶️ اختراق يوتيوب", callback_data: 'youtube' }],
                [{ text: "🔥 اختراق بوبجي", callback_data: 'pubg' }, { text: "💎 اختراق فري فاير", callback_data: 'freefire' }],
                [{ text: "🔴 اختراق جوجل", callback_data: 'google' }, { text: "📱 فحص الجهاز", callback_data: 'device' }],
                [{ text: "✅ فك حظر واتساب", callback_data: 'unban' }, { text: "🚨 حظر أرقام واتساب", callback_data: 'report' }],
                [{ text: "📞 كاشف رقم الضحية", callback_data: 'phone' }],
                [{ text: "📱 أرقام وهمية", callback_data: 'fake_num' }],
                [{ text: "👨‍💻 التواصل مع المطور", callback_data: 'contact' }, { text: "ℹ️ حول البوت", callback_data: 'about' }]
            ]
        })
    };
}

// دالة الرد على /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
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

// دالة الرد على الأزرار
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'fake_num') {
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
        bot.sendMessage(chatId, "👨‍💻 <b>KING-SAQ BOT v1.0</b>", { parse_mode: 'HTML' });
    } else if (data === 'contact') {
        bot.sendMessage(chatId, "👨‍💻 <b>المطور:</b> @heroil_1", { parse_mode: 'HTML' });
    } else {
        bot.sendMessage(chatId, "🛠️ هذا القسم قيد التطوير أو غير متاح في النسخة التجريبية.", { parse_mode: 'HTML' });
    }

    bot.answerCallbackQuery(query.id);
});

console.log("⚔ البوت شغال بنجاح على Node.js...");
