const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const API = `https://api.telegram.org/bot${TOKEN}`;

export type InlineButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

export type ReplyMarkup = Record<string, any>;

async function call<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T | null> {
  if (!TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return null;
  }
  try {
    const res = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    if (!json.ok) {
      // "message is not modified" и похожие — не критично
      console.warn(`TG ${method} warn:`, json.description);
      return null;
    }
    return json.result as T;
  } catch (e) {
    console.error(`TG ${method} error:`, e);
    return null;
  }
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: ReplyMarkup
) {
  return call("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

export async function editMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: ReplyMarkup
) {
  return call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

export async function answerCallback(callbackQueryId: string, text?: string) {
  return call("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });
}

export async function forwardMessage(
  toChatId: number | string,
  fromChatId: number | string,
  messageId: number
) {
  return call("forwardMessage", {
    chat_id: toChatId,
    from_chat_id: fromChatId,
    message_id: messageId,
  });
}

export type TgUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
};

export type WebhookInfo = {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
};

export async function getMe(): Promise<TgUser | null> {
  return call<TgUser>("getMe", {});
}

export async function getWebhookInfo(): Promise<WebhookInfo | null> {
  return call<WebhookInfo>("getWebhookInfo", {});
}

export async function setWebhook(url: string) {
  return call("setWebhook", {
    url,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  });
}

export async function deleteWebhook() {
  return call("deleteWebhook", { drop_pending_updates: true });
}

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
