export type Lang = "uz" | "ru" | "en";

export const LANGS: Lang[] = ["uz", "ru", "en"];

export type ServiceKey =
  | "coursework"
  | "slides"
  | "thesis"
  | "article"
  | "web"
  | "bot";

const ru = {
  greeting:
    "<b>Pixel Flow</b> — помощь студентам с учебными материалами.\n\nКурсовые работы, презентации, тезисы, научные статьи, веб-проекты и Telegram-боты — под ключ и точно в срок.",
  menu: "<b>Главное меню</b>\n\nВыберите нужную услугу:",
  menuHint: "Выберите услугу из меню:",
  svcDoc: "📄 Курсовая / Слайды",
  svcPaper: "📝 Тезис / Статья",
  svcWeb: "🌐 Веб-проект",
  svcBot: "🤖 Telegram-бот",
  svcAdmin: "👨‍💻 Связаться с админом",
  changeLang: "Сменить язык",
  docChoose:
    "<b>Курсовая / Слайды</b>\n\n<blockquote>Курсовая работа — 30 000 сум\n(свыше 30 листов: +1 200 сум за лист)\nСлайды — 20 000 сум</blockquote>\nЧто именно вам нужно?",
  paperChoose:
    "<b>Тезис / Статья</b>\n\n<blockquote>Тезис — 5 000 сум за страницу\nСтатья — 7 000 сум за страницу</blockquote>\nЧто именно вам нужно?",
  askTopicDoc:
    "Шаг 1 из 3 — Тема\n\nНа какую тему нужна работа? Напишите тему сообщением:",
  askPages:
    "Шаг 2 из 3 — Объём\n\nСколько листов (страниц) нужно? Отправьте число:",
  invalidPages:
    "Пожалуйста, отправьте количество листов числом. Например: 20",
  askDeadline:
    "Шаг 3 из 3 — Срок\n\nНа какое число нужен готовый заказ? Например: 25.05.2026",
  askTopicWeb:
    "Шаг 1 из 3 — Тема\n\nНа какую тему веб-проект? Опишите кратко:",
  askRequirements:
    "Шаг 2 из 3 — Требования\n\nОпишите требования к проекту: функции, страницы, админ-панель и т.д.",
  askDesign:
    "Шаг 3 из 3 — Дизайн\n\nКакой дизайн нужен? Цвета, стиль, примеры сайтов:",
  askBotRole:
    "<b>Telegram-бот — 15 000 сум</b>\n\nШаг 1 из 2 — Назначение\n\nДля какой сферы нужен бот? Например: магазин, кафе, школа, онлайн-курсы:",
  askBotFunctions:
    "Шаг 2 из 2 — Функции\n\nКакие функции должен выполнять бот? Перечислите сообщением:",
  summaryTitle: "Проверьте данные заказа",
  fService: "Услуга",
  fTopic: "Тема",
  fPages: "Кол-во листов",
  fDeadline: "Срок",
  fRequirements: "Требования",
  fDesign: "Дизайн",
  fBotRole: "Сфера бота",
  fBotFunctions: "Функции бота",
  fPrice: "Стоимость",
  fCard: "Карта",
  fAmount: "Сумма",
  confirmQ: "Всё верно? Подтвердите заказ:",
  btnConfirm: "✅ Подтвердить",
  btnBack: "⬅️ Назад",
  btnMenu: "🏠 Главное меню",
  btnPaid: "💳 Я оплатил",
  btnSendData: "Отправить данные заказа",
  btnWriteAdmin: "Написать админу",
  btnChannel: "Наш канал",
  paymentTitle: "Оплата заказа",
  paymentSteps:
    "1. Переведите сумму на карту выше\n2. Нажмите «Я оплатил»\n3. Отправьте скриншот оплаты админу",
  paidTitle: "Заказ принят в работу",
  paidBody:
    "Теперь отправьте скриншот оплаты админу: {admin}\n\nНажмите «Отправить данные заказа», выберите чат {admin} и прикрепите скриншот — так мы быстрее подтвердим оплату.",
  adminContact:
    "<b>Связь с админом</b>\n\nПо всем вопросам пишите администратору: {admin}\nНаш канал с проектами: {channel}\n\nОтвечаем быстро в рабочее время.",
  photoAck:
    "Скриншот переслан админу. Мы проверим оплату и свяжемся с вами.",
  shareHead: "Заказ {code} — оплачен",
  currency: "сум",
  serviceNames: {
    coursework: "📚 Курсовая работа",
    slides: "🖥 Слайды / Презентация",
    thesis: "📑 Тезис",
    article: "📰 Статья",
    web: "🌐 Веб-проект",
    bot: "🤖 Telegram-бот",
  } as Record<ServiceKey, string>,
};

export type Dict = typeof ru;

const uz: Dict = {
  greeting:
    "<b>Pixel Flow</b> — talabalarga oʻquv materiallarida yordam.\n\nKurs ishlari, taqdimotlar, tezislar, ilmiy maqolalar, veb-loyihalar va Telegram-botlar — kalitgacha va aniq muddatda.",
  menu: "<b>Asosiy menyu</b>\n\nKerakli xizmatni tanlang:",
  menuHint: "Menyudan xizmatni tanlang:",
  svcDoc: "📄 Kurs ishi / Slaydlar",
  svcPaper: "📝 Tezis / Maqola",
  svcWeb: "🌐 Veb-loyiha",
  svcBot: "🤖 Telegram-bot",
  svcAdmin: "👨‍💻 Admin bilan bogʻlanish",
  changeLang: "Tilni oʻzgartirish",
  docChoose:
    "<b>Kurs ishi / Slaydlar</b>\n\n<blockquote>Kurs ishi — 30 000 soʻm\n(30 varaqdan oshsa: har varaq +1 200 soʻm)\nSlaydlar — 20 000 soʻm</blockquote>\nSizga nima kerak?",
  paperChoose:
    "<b>Tezis / Maqola</b>\n\n<blockquote>Tezis — sahifasiga 5 000 soʻm\nMaqola — sahifasiga 7 000 soʻm</blockquote>\nSizga nima kerak?",
  askTopicDoc:
    "1/3-qadam — Mavzu\n\nQanday mavzuda ish kerak? Mavzuni xabar qilib yozing:",
  askPages:
    "2/3-qadam — Hajm\n\nNechta varaq (sahifa) kerak? Raqam yuboring:",
  invalidPages: "Iltimos, varaq sonini raqamda yuboring. Masalan: 20",
  askDeadline:
    "3/3-qadam — Muddat\n\nBuyurtma qaysi sanaga tayyor boʻlishi kerak? Masalan: 25.05.2026",
  askTopicWeb:
    "1/3-qadam — Mavzu\n\nVeb-loyiha qanday mavzuda? Qisqacha yozing:",
  askRequirements:
    "2/3-qadam — Talablar\n\nLoyihaga talablarni yozing: funksiyalar, sahifalar, admin-panel va h.k.",
  askDesign:
    "3/3-qadam — Dizayn\n\nQanday dizayn kerak? Ranglar, uslub, sayt namunalari:",
  askBotRole:
    "<b>Telegram-bot — 15 000 soʻm</b>\n\n1/2-qadam — Maqsad\n\nBot qaysi soha uchun kerak? Masalan: doʻkon, kafe, maktab, onlayn kurslar:",
  askBotFunctions:
    "2/2-qadam — Funksiyalar\n\nBot qanday funksiyalarni bajarishi kerak? Xabar qilib yozing:",
  summaryTitle: "Buyurtma maʼlumotlarini tekshiring",
  fService: "Xizmat",
  fTopic: "Mavzu",
  fPages: "Varaq soni",
  fDeadline: "Muddat",
  fRequirements: "Talablar",
  fDesign: "Dizayn",
  fBotRole: "Bot sohasi",
  fBotFunctions: "Bot funksiyalari",
  fPrice: "Narxi",
  fCard: "Karta",
  fAmount: "Summa",
  confirmQ: "Hammasi toʻgʻrimi? Buyurtmani tasdiqlang:",
  btnConfirm: "✅ Tasdiqlash",
  btnBack: "⬅️ Orqaga",
  btnMenu: "🏠 Asosiy menyu",
  btnPaid: "💳 Toʻladim",
  btnSendData: "Buyurtma maʼlumotlarini yuborish",
  btnWriteAdmin: "Adminga yozish",
  btnChannel: "Bizning kanal",
  paymentTitle: "Buyurtmani toʻlash",
  paymentSteps:
    "1. Summani yuqoridagi kartaga oʻtkazing\n2. «Toʻladim» tugmasini bosing\n3. Toʻlov skrinshotini adminga yuboring",
  paidTitle: "Buyurtma ishga qabul qilindi",
  paidBody:
    "Endi toʻlov skrinshotini adminga yuboring: {admin}\n\n«Buyurtma maʼlumotlarini yuborish» tugmasini bosing, {admin} chatini tanlang va skrinshotni biriktiring — toʻlovni tezroq tasdiqlaymiz.",
  adminContact:
    "<b>Admin bilan bogʻlanish</b>\n\nBarcha savollar boʻyicha administratorga yozing: {admin}\nLoyihalarimiz kanali: {channel}\n\nIsh vaqtida tez javob beramiz.",
  photoAck: "Skrinshot adminga yuborildi. Toʻlovni tekshirib, siz bilan bogʻlanamiz.",
  shareHead: "Buyurtma {code} — toʻlandi",
  currency: "soʻm",
  serviceNames: {
    coursework: "📚 Kurs ishi",
    slides: "🖥 Slaydlar / Taqdimot",
    thesis: "📑 Tezis",
    article: "📰 Maqola",
    web: "🌐 Veb-loyiha",
    bot: "🤖 Telegram-bot",
  },
};

const en: Dict = {
  greeting:
    "<b>Pixel Flow</b> — academic help for students.\n\nCoursework, presentations, theses, research articles, web projects and Telegram bots — turnkey and always on time.",
  menu: "<b>Main menu</b>\n\nChoose a service:",
  menuHint: "Please choose a service from the menu:",
  svcDoc: "📄 Coursework / Slides",
  svcPaper: "📝 Thesis / Article",
  svcWeb: "🌐 Web project",
  svcBot: "🤖 Telegram bot",
  svcAdmin: "👨‍💻 Contact admin",
  changeLang: "Change language",
  docChoose:
    "<b>Coursework / Slides</b>\n\n<blockquote>Coursework — 30,000 UZS\n(over 30 pages: +1,200 UZS per page)\nSlides — 20,000 UZS</blockquote>\nWhat exactly do you need?",
  paperChoose:
    "<b>Thesis / Article</b>\n\n<blockquote>Thesis — 5,000 UZS per page\nArticle — 7,000 UZS per page</blockquote>\nWhat exactly do you need?",
  askTopicDoc:
    "Step 1 of 3 — Topic\n\nWhat topic is the work about? Send the topic as a message:",
  askPages:
    "Step 2 of 3 — Volume\n\nHow many pages do you need? Send a number:",
  invalidPages: "Please send the number of pages as digits. Example: 20",
  askDeadline:
    "Step 3 of 3 — Deadline\n\nBy which date do you need the order? Example: 25.05.2026",
  askTopicWeb:
    "Step 1 of 3 — Topic\n\nWhat is the web project about? Describe it briefly:",
  askRequirements:
    "Step 2 of 3 — Requirements\n\nDescribe the project requirements: features, pages, admin panel, etc.",
  askDesign:
    "Step 3 of 3 — Design\n\nWhat design do you need? Colors, style, reference websites:",
  askBotRole:
    "<b>Telegram bot — 15,000 UZS</b>\n\nStep 1 of 2 — Purpose\n\nWhat field is the bot for? Example: shop, cafe, school, online courses:",
  askBotFunctions:
    "Step 2 of 2 — Features\n\nWhich features should the bot have? List them in a message:",
  summaryTitle: "Review your order",
  fService: "Service",
  fTopic: "Topic",
  fPages: "Pages",
  fDeadline: "Deadline",
  fRequirements: "Requirements",
  fDesign: "Design",
  fBotRole: "Bot field",
  fBotFunctions: "Bot features",
  fPrice: "Price",
  fCard: "Card",
  fAmount: "Amount",
  confirmQ: "Everything correct? Confirm your order:",
  btnConfirm: "✅ Confirm",
  btnBack: "⬅️ Back",
  btnMenu: "🏠 Main menu",
  btnPaid: "💳 I have paid",
  btnSendData: "Send order details",
  btnWriteAdmin: "Message admin",
  btnChannel: "Our channel",
  paymentTitle: "Order payment",
  paymentSteps:
    "1. Transfer the amount to the card above\n2. Press «I have paid»\n3. Send the payment screenshot to the admin",
  paidTitle: "Order accepted",
  paidBody:
    "Now send the payment screenshot to the admin: {admin}\n\nPress «Send order details», choose the chat {admin} and attach the screenshot — we will confirm your payment faster.",
  adminContact:
    "<b>Contact admin</b>\n\nFor any questions message the admin: {admin}\nOur projects channel: {channel}\n\nWe reply quickly during working hours.",
  photoAck: "Screenshot forwarded to the admin. We will verify the payment and contact you.",
  shareHead: "Order {code} — paid",
  currency: "UZS",
  serviceNames: {
    coursework: "📚 Coursework",
    slides: "🖥 Slides / Presentation",
    thesis: "📑 Thesis",
    article: "📰 Article",
    web: "🌐 Web project",
    bot: "🤖 Telegram bot",
  },
};

export const dicts: Record<Lang, Dict> = { uz, ru, en };

export function t(lang: string | null | undefined): Dict {
  if (lang === "uz" || lang === "ru" || lang === "en") return dicts[lang];
  return ru;
}

export function normalizeLang(l: string | null | undefined): Lang {
  return l === "uz" || l === "en" ? l : "ru";
}
