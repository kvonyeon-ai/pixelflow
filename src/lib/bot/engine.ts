import { eq } from "drizzle-orm";
import { db } from "@/db";
import { botUsers, orders, type BotUser, type SessionData } from "@/db/schema";
import * as tg from "@/lib/telegram";
import { t, normalizeLang, type Dict, type ServiceKey } from "./i18n";
import { calcPrice, fmtSum, fmtCard } from "./pricing";

const ADMIN_ID = Number(process.env.TELEGRAM_ADMIN_ID ?? "0");
const ADMIN_USERNAME = process.env.TELEGRAM_ADMIN_USERNAME ?? "kvonu";
const CHANNEL_URL = process.env.NEXT_PUBLIC_CHANNEL_URL ?? "https://t.me/pixel_flow_1";
const CARD = fmtCard(process.env.PAYMENT_CARD_NUMBER ?? "9860196600278234");

const LANG_GREETING = "<b>Pixel Flow</b>\n\nВыберите язык · Tilni tanlang · Choose your language:";

const DOC_PAPER: ServiceKey[] = ["coursework", "slides", "thesis", "article"];

type Kb = tg.ReplyMarkup;
const inlineKb = (rows: tg.InlineButton[][]): Kb => ({ inline_keyboard: rows });
const replyKb = (rows: string[][]): Kb => ({
  keyboard: rows.map((r) => r.map((text) => ({ text }))),
  resize_keyboard: true,
});
const removeKb = (): Kb => ({ remove_keyboard: true });

async function show(chatId: number, text: string, markup?: Kb) {
  await tg.sendMessage(chatId, text, markup);
}

async function setState(chatId: number, state: string, data: SessionData, language?: string | null) {
  await db.update(botUsers).set({
    state,
    data,
    ...(language !== undefined ? { language } : {}),
    updatedAt: new Date(),
  }).where(eq(botUsers.chatId, chatId));
}

async function getSession(from: { id: number; username?: string; first_name?: string; last_name?: string }): Promise<BotUser> {
  const chatId = from.id;
  const [existing] = await db.select().from(botUsers).where(eq(botUsers.chatId, chatId));
  if (existing) {
    await db.update(botUsers).set({
      username: from.username ?? null,
      firstName: from.first_name ?? null,
      lastName: from.last_name ?? null,
      updatedAt: new Date(),
    }).where(eq(botUsers.chatId, chatId));
    return existing;
  }
  const [created] = await db.insert(botUsers).values({
    chatId,
    username: from.username ?? null,
    firstName: from.first_name ?? null,
    lastName: from.last_name ?? null,
    state: "start",
  }).returning();
  return created;
}

function serviceName(s: Dict, service: string): string {
  return s.serviceNames[service as ServiceKey] ?? service;
}

// ---------- screens ----------

function langScreen(): { text: string; markup: Kb } {
  return {
    text: LANG_GREETING,
    markup: replyKb([["🇺🇿 Oʻzbek", "🇷🇺 Русский", "🇬🇧 English"]]),
  };
}

function menuScreen(s: Dict, withGreeting = false): { text: string; markup: Kb } {
  return {
    text: withGreeting ? `${s.greeting}\n\n${s.menu}` : s.menu,
    markup: replyKb([
      [s.svcDoc, s.svcPaper],
      [s.svcWeb, s.svcBot],
      [s.svcAdmin, `⚙️ ${s.changeLang}`],
    ]),
  };
}

function docChooseScreen(s: Dict) {
  return {
    text: s.docChoose,
    markup: replyKb([
      [s.serviceNames.coursework, s.serviceNames.slides],
      [s.btnBack],
    ]),
  };
}

function paperChooseScreen(s: Dict) {
  return {
    text: s.paperChoose,
    markup: replyKb([
      [s.serviceNames.thesis, s.serviceNames.article],
      [s.btnBack],
    ]),
  };
}

function askTopicScreen(s: Dict, service: string) {
  const body = service === "web" ? s.askTopicWeb : s.askTopicDoc;
  return { text: `<b>${serviceName(s, service)}</b>\n\n${body}`, markup: replyKb([[s.btnBack]]) };
}

function askPagesScreen(s: Dict) { return { text: s.askPages, markup: replyKb([[s.btnBack]]) }; }
function askDeadlineScreen(s: Dict) { return { text: s.askDeadline, markup: replyKb([[s.btnBack]]) }; }
function askReqScreen(s: Dict) { return { text: s.askRequirements, markup: replyKb([[s.btnBack]]) }; }
function askDesignScreen(s: Dict) { return { text: s.askDesign, markup: replyKb([[s.btnBack]]) }; }
function askBotRoleScreen(s: Dict) { return { text: s.askBotRole, markup: replyKb([[s.btnBack]]) }; }
function askBotFuncScreen(s: Dict) { return { text: s.askBotFunctions, markup: replyKb([[s.btnBack]]) }; }

function summaryRows(s: Dict, d: SessionData): string {
  const rows: Array<[string, string]> = [];
  rows.push([s.fService, serviceName(s, String(d.service))]);
  if (d.topic) rows.push([s.fTopic, tg.escapeHtml(d.topic)]);
  if (DOC_PAPER.includes(d.service as ServiceKey)) {
    if (d.pages) rows.push([s.fPages, String(d.pages)]);
    if (d.deadline) rows.push([s.fDeadline, tg.escapeHtml(d.deadline)]);
  }
  if (d.service === "web") {
    if (d.requirements) rows.push([s.fRequirements, tg.escapeHtml(d.requirements)]);
    if (d.design) rows.push([s.fDesign, tg.escapeHtml(d.design)]);
  }
  if (d.service === "bot") {
    if (d.botRole) rows.push([s.fBotRole, tg.escapeHtml(d.botRole)]);
    if (d.botFunctions) rows.push([s.fBotFunctions, tg.escapeHtml(d.botFunctions)]);
  }
  return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
}

function summaryScreen(s: Dict, d: SessionData, langRaw: string) {
  const lang = normalizeLang(langRaw);
  const price = calcPrice(String(d.service), d.pages);
  const text = `<b>${s.summaryTitle}</b>\n\n<blockquote>${summaryRows(s, d)}\n${s.fPrice}: <b>${fmtSum(price, lang)}</b></blockquote>\n\n${s.confirmQ}`;
  return { text, markup: replyKb([[s.btnConfirm], [s.btnBack]]) };
}

function paymentScreen(s: Dict, langRaw: string, code: string, price: number) {
  const lang = normalizeLang(langRaw);
  const text = `<b>${s.paymentTitle} — ${code}</b>\n\n<blockquote>${s.fCard}: <code>${CARD}</code>\n${s.fAmount}: <b>${fmtSum(price, lang)}</b></blockquote>\n\n${s.paymentSteps}`;
  return { text, markup: replyKb([[s.btnPaid], [s.btnBack]]) };
}

function adminScreen(s: Dict) {
  const text = s.adminContact.replace("{admin}", "@" + ADMIN_USERNAME).replace("{channel}", CHANNEL_URL);
  return {
    text,
    markup: inlineKb([
      [{ text: s.btnWriteAdmin, url: `https://t.me/${ADMIN_USERNAME}` }],
      [{ text: s.btnChannel, url: CHANNEL_URL }],
    ]),
  };
}

// ---------- order flow ----------

async function createOrder(u: BotUser, d: SessionData): Promise<{ id: number; code: string; price: number }> {
  const price = calcPrice(String(d.service), d.pages);
  const [ins] = await db.insert(orders).values({
    chatId: u.chatId,
    username: u.username,
    firstName: u.firstName,
    language: u.language ?? "ru",
    service: String(d.service),
    details: {
      topic: d.topic ?? null, pages: d.pages ?? null, deadline: d.deadline ?? null,
      requirements: d.requirements ?? null, design: d.design ?? null,
      botRole: d.botRole ?? null, botFunctions: d.botFunctions ?? null,
    },
    price, status: "pending",
  }).returning({ id: orders.id });
  const code = `PF-${String(ins.id).padStart(4, "0")}`;
  await db.update(orders).set({ code }).where(eq(orders.id, ins.id));
  return { id: ins.id, code, price };
}

function shareMessage(s: Dict, d: SessionData, code: string): string {
  const lines = [s.shareHead.replace("{code}", code), ""];
  lines.push(`${s.fService}: ${serviceName(s, String(d.service))}`);
  if (d.topic) lines.push(`${s.fTopic}: ${d.topic}`);
  if (DOC_PAPER.includes(d.service as ServiceKey)) {
    if (d.pages) lines.push(`${s.fPages}: ${d.pages}`);
    if (d.deadline) lines.push(`${s.fDeadline}: ${d.deadline}`);
  }
  if (d.service === "web") {
    if (d.requirements) lines.push(`${s.fRequirements}: ${d.requirements}`);
    if (d.design) lines.push(`${s.fDesign}: ${d.design}`);
  }
  if (d.service === "bot") {
    if (d.botRole) lines.push(`${s.fBotRole}: ${d.botRole}`);
    if (d.botFunctions) lines.push(`${s.fBotFunctions}: ${d.botFunctions}`);
  }
  const price = calcPrice(String(d.service), d.pages);
  lines.push(`${s.fPrice}: ${fmtSum(price, normalizeLang(null))}`);
  lines.push(`${s.fAmount}: ${CARD}`);
  return lines.join("\n");
}

async function notifyAdmin(u: BotUser, d: SessionData, code: string, price: number) {
  if (!ADMIN_ID) return;
  const ruName = t("ru");
  const rows = summaryRows(ruName, d);
  const client = [u.firstName, u.username ? `@${u.username}` : null].filter(Boolean).join(" ") || `id ${u.chatId}`;
  const text = `<b>Новый оплаченный заказ — ${code}</b>\n\n<blockquote>${rows}</blockquote>\n\nСумма: <b>${fmtSum(price, "ru")}</b>\nКлиент: ${tg.escapeHtml(client)}\nChat ID: <code>${u.chatId}</code>\nЯзык: ${u.language ?? "ru"}\n\nКлиент нажал «Я оплатил». Ожидайте скриншот оплаты в ЛС @${ADMIN_USERNAME}.`;
  await tg.sendMessage(ADMIN_ID, text);
}

// ---------- update handlers ----------

type TgMessage = {
  message_id: number; text?: string; photo?: unknown[]; chat: { id: number; type?: string };
  from?: { id: number; username?: string; first_name?: string; last_name?: string };
};

type TgCallback = {
  id: string; data?: string;
  from: { id: number; username?: string; first_name?: string; last_name?: string };
};

export async function handleUpdate(update: { message?: TgMessage; callback_query?: TgCallback }) {
  try {
    if (update.callback_query) await onCallback(update.callback_query);
    else if (update.message) await onMessage(update.message);
  } catch (e) {
    console.error("bot engine error:", e);
  }
}

async function startService(chatId: number, s: Dict, d: SessionData, service: ServiceKey) {
  const nd: SessionData = { service };
  if (service === "bot") {
    await setState(chatId, "await_bot_role", nd);
    const sc = askBotRoleScreen(s);
    await show(chatId, sc.text, sc.markup);
  } else {
    await setState(chatId, "await_topic", nd);
    const sc = askTopicScreen(s, service);
    await show(chatId, sc.text, sc.markup);
  }
}

async function goBack(chatId: number, u: BotUser, s: Dict, d: SessionData) {
  if (u.state === "svc_doc" || u.state === "svc_paper" || u.state === "await_bot_role" || (u.state === "await_topic" && d.service === "web")) {
    await setState(chatId, "menu", {});
    const sc = menuScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_topic") {
    if (d.service === "thesis" || d.service === "article") {
      await setState(chatId, "svc_paper", {});
      const sc = paperChooseScreen(s);
      await show(chatId, sc.text, sc.markup);
    } else {
      await setState(chatId, "svc_doc", {});
      const sc = docChooseScreen(s);
      await show(chatId, sc.text, sc.markup);
    }
    return;
  }
  if (u.state === "await_pages") {
    await setState(chatId, "await_topic", d);
    const sc = askTopicScreen(s, d.service ?? "");
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_deadline") {
    await setState(chatId, "await_pages", d);
    const sc = askPagesScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_requirements") {
    await setState(chatId, "await_topic", d);
    const sc = askTopicScreen(s, d.service ?? "");
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_design") {
    await setState(chatId, "await_requirements", d);
    const sc = askReqScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_bot_functions") {
    await setState(chatId, "await_bot_role", d);
    const sc = askBotRoleScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (u.state === "await_confirm") {
    if (d.service === "web") {
      await setState(chatId, "await_design", d);
      const sc = askDesignScreen(s);
      await show(chatId, sc.text, sc.markup);
    } else if (d.service === "bot") {
      await setState(chatId, "await_bot_functions", d);
      const sc = askBotFuncScreen(s);
      await show(chatId, sc.text, sc.markup);
    } else {
      await setState(chatId, "await_deadline", d);
      const sc = askDeadlineScreen(s);
      await show(chatId, sc.text, sc.markup);
    }
    return;
  }
  if (u.state === "await_payment") {
    await setState(chatId, "await_confirm", d);
    const sc = summaryScreen(s, d, u.language ?? "ru");
    await show(chatId, sc.text, sc.markup);
    return;
  }
  await setState(chatId, "menu", {});
  const sc = menuScreen(s);
  await show(chatId, sc.text, sc.markup);
}

async function onMessage(msg: TgMessage) {
  const from = msg.from ?? { id: msg.chat.id };
  const u = await getSession(from);
  const chatId = msg.chat.id;
  const text = (msg.text ?? "").trim();

  // Скриншоты → пересылаем админу
  if (msg.photo && msg.photo.length > 0) {
    if (ADMIN_ID) await tg.forwardMessage(ADMIN_ID, chatId, msg.message_id);
    await tg.sendMessage(chatId, t(u.language).photoAck);
    return;
  }

  if (text === "/start") {
    await setState(chatId, "choose_lang", {}, null);
    const sc = langScreen();
    await show(chatId, sc.text, sc.markup);
    return;
  }

  if (String(chatId) === String(ADMIN_ID) && text === "/stats") {
    await sendAdminStats(chatId);
    return;
  }

  // Language selection from Reply Keyboard
  if (text === "🇺🇿 Oʻzbek") {
    await setState(chatId, "menu", {}, "uz");
    const sc = menuScreen(t("uz"), true);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === "🇷🇺 Русский") {
    await setState(chatId, "menu", {}, "ru");
    const sc = menuScreen(t("ru"), true);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === "🇬🇧 English") {
    await setState(chatId, "menu", {}, "en");
    const sc = menuScreen(t("en"), true);
    await show(chatId, sc.text, sc.markup);
    return;
  }

  const lang = u.language;
  if (!lang || u.state === "choose_lang" || u.state === "start") {
    await setState(chatId, "choose_lang", {}, null);
    const sc = langScreen();
    await show(chatId, sc.text, sc.markup);
    return;
  }

  const s = t(lang);
  const d = (u.data ?? {}) as SessionData;

  // Global menu actions
  if (text === s.svcDoc) {
    await setState(chatId, "svc_doc", d);
    const sc = docChooseScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === s.svcPaper) {
    await setState(chatId, "svc_paper", d);
    const sc = paperChooseScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === s.svcWeb) return startService(chatId, s, d, "web");
  if (text === s.svcBot) return startService(chatId, s, d, "bot");
  if (text === s.svcAdmin) {
    const sc = adminScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === `⚙️ ${s.changeLang}`) {
    await setState(chatId, "choose_lang", {}, null);
    const sc = langScreen();
    await show(chatId, sc.text, sc.markup);
    return;
  }
  if (text === s.btnMenu) {
    await setState(chatId, "menu", {});
    const sc = menuScreen(s);
    await show(chatId, sc.text, sc.markup);
    return;
  }

  // Sub-menu actions
  if (u.state === "svc_doc" && text === s.serviceNames.coursework) return startService(chatId, s, d, "coursework");
  if (u.state === "svc_doc" && text === s.serviceNames.slides) return startService(chatId, s, d, "slides");
  if (u.state === "svc_paper" && text === s.serviceNames.thesis) return startService(chatId, s, d, "thesis");
  if (u.state === "svc_paper" && text === s.serviceNames.article) return startService(chatId, s, d, "article");

  // Navigation and confirmation
  if (text === s.btnBack) return goBack(chatId, u, s, d);

  if (u.state === "await_confirm" && text === s.btnConfirm) {
    const { id, code, price } = await createOrder(u, d);
    const nd = { ...d, orderId: id, orderCode: code };
    await setState(chatId, "await_payment", nd);
    const sc = paymentScreen(s, lang, code, price);
    await show(chatId, sc.text, sc.markup);
    return;
  }

  if (u.state === "await_payment" && text === s.btnPaid) {
    if (d.orderId) {
      await db.update(orders).set({ status: "paid", updatedAt: new Date() }).where(eq(orders.id, d.orderId));
    }
    const code = d.orderCode ?? "PF";
    const price = calcPrice(String(d.service), d.pages);
    await notifyAdmin(u, d, code, price);

    const share = encodeURIComponent(shareMessage(s, d, code));
    const textHtml = `<b>${s.paidTitle}</b>\n\n<blockquote>${code}</blockquote>\n\n${s.paidBody.replaceAll("{admin}", "@" + ADMIN_USERNAME)}`;
    const inlineMarkup = inlineKb([
      [{ text: s.btnSendData, url: `https://t.me/share/url?url=${share}` }],
      [{ text: s.btnWriteAdmin, url: `https://t.me/${ADMIN_USERNAME}` }],
    ]);
    await setState(chatId, "done", {});
    await show(chatId, textHtml, inlineMarkup);
    // Возвращаем главное меню клавиатурой после сообщения
    await show(chatId, s.menuHint, replyKb([[s.btnMenu]]));
    return;
  }

  // Free text inputs
  const service = d.service ?? "";
  switch (u.state) {
    case "await_topic": {
      const topic = text.slice(0, 500);
      const nd = { ...d, topic };
      if (service === "web") {
        await setState(chatId, "await_requirements", nd);
        const sc = askReqScreen(s);
        await show(chatId, sc.text, sc.markup);
      } else {
        await setState(chatId, "await_pages", nd);
        const sc = askPagesScreen(s);
        await show(chatId, sc.text, sc.markup);
      }
      return;
    }
    case "await_pages": {
      const pages = parseInt(text, 10);
      if (!/^\d{1,4}$/.test(text) || pages < 1 || pages > 1000) {
        await tg.sendMessage(chatId, s.invalidPages);
        return;
      }
      await setState(chatId, "await_deadline", { ...d, pages });
      const sc = askDeadlineScreen(s);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_deadline": {
      const nd = { ...d, deadline: text.slice(0, 60) };
      await setState(chatId, "await_confirm", nd);
      const sc = summaryScreen(s, nd, lang);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_requirements": {
      const nd = { ...d, requirements: text.slice(0, 800) };
      await setState(chatId, "await_design", nd);
      const sc = askDesignScreen(s);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_design": {
      const nd = { ...d, design: text.slice(0, 800) };
      await setState(chatId, "await_confirm", nd);
      const sc = summaryScreen(s, nd, lang);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_bot_role": {
      const nd = { ...d, botRole: text.slice(0, 400) };
      await setState(chatId, "await_bot_functions", nd);
      const sc = askBotFuncScreen(s);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_bot_functions": {
      const nd = { ...d, botFunctions: text.slice(0, 800) };
      await setState(chatId, "await_confirm", nd);
      const sc = summaryScreen(s, nd, lang);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_confirm": {
      const sc = summaryScreen(s, d, lang);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    case "await_payment": {
      const price = calcPrice(service, d.pages);
      const sc = paymentScreen(s, lang, d.orderCode ?? "PF", price);
      await show(chatId, sc.text, sc.markup);
      return;
    }
    default: {
      const sc = menuScreen(s);
      await show(chatId, s.menuHint, sc.markup);
      return;
    }
  }
}

async function onCallback(cq: TgCallback) {
  // Игнорируем старые инлайн кнопки, если пользователь кликнет по ним
  await tg.answerCallback(cq.id, "Пожалуйста, используйте кнопки-меню внизу экрана 👇");
}

async function sendAdminStats(chatId: number) {
  const all = await db.select().from(orders);
  const total = all.length;
  const byStatus = (st: string) => all.filter((o) => o.status === st).length;
  const revenue = all
    .filter((o) => o.status === "paid" || o.status === "done")
    .reduce((sum, o) => sum + o.price, 0);
  const text = `<b>Статистика Pixel Flow</b>\n\n<blockquote>Всего заказов: ${total}\nОжидают оплаты: ${byStatus("pending")}\nОплачено: ${byStatus("paid")}\nВыполнено: ${byStatus("done")}\nОтменено: ${byStatus("cancelled")}</blockquote>\n\nВыручка: <b>${fmtSum(revenue, "ru")}</b>`;
  await tg.sendMessage(chatId, text);
}
