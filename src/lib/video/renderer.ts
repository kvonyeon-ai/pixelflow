export const VIDEO_DURATION = 60;
export const VIDEO_FPS = 24;

export const VIDEO_SCENES = [
  { id: "hook", start: 0, end: 4, title: "Дедлайн близко?", short: "Дедлайн" },
  { id: "problem", start: 4, end: 8, title: "Знакомая ситуация", short: "Проблема" },
  { id: "brand", start: 8, end: 12, title: "Знакомьтесь: Pixel Flow", short: "Pixel Flow" },
  { id: "coursework", start: 12, end: 16, title: "Курсовые работы", short: "Курсовые" },
  { id: "slides", start: 16, end: 20, title: "Слайды и презентации", short: "Слайды" },
  { id: "papers", start: 20, end: 24, title: "Тезисы и статьи", short: "Тезисы · статьи" },
  { id: "web", start: 24, end: 28, title: "Веб-проекты", short: "Веб-проекты" },
  { id: "bot", start: 28, end: 32, title: "Telegram-боты", short: "Telegram-боты" },
  { id: "language", start: 32, end: 36, title: "01 · Выберите язык", short: "01 · Язык" },
  { id: "service", start: 36, end: 40, title: "02 · Выберите услугу", short: "02 · Услуга" },
  { id: "details", start: 40, end: 44, title: "03 · Расскажите о задаче", short: "03 · Детали" },
  { id: "confirm", start: 44, end: 48, title: "04 · Подтвердите заказ", short: "04 · Заказ" },
  { id: "benefits", start: 48, end: 52, title: "Всё в одном боте", short: "Преимущества" },
  { id: "cta", start: 52, end: 57, title: "Откройте Pixel Flow", short: "Начать заказ" },
  { id: "outro", start: 57, end: 60, title: "До встречи в Telegram", short: "Финал" },
] as const;

export type PromoAssets = { hero: unknown; mark: unknown; qr: unknown };
type Ctx = CanvasRenderingContext2D;
const W = 720;
const H = 1280;
const BLUE = "#6d9aff";
const VIOLET = "#ac8aff";
const MINT = "#54e3ba";
const WHITE = "#f4f7ff";
const MUTED = "#8996b2";
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const smooth = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function rounded(ctx: Ctx, x: number, y: number, w: number, h: number, r = 20) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
function panel(ctx: Ctx, x: number, y: number, w: number, h: number, accent = BLUE, r = 26) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "#151e35");
  g.addColorStop(1, "#0a1020");
  ctx.fillStyle = g;
  rounded(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = accent + "55";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
function text(
  ctx: Ctx, value: string, x: number, y: number, size = 24,
  color = WHITE, weight = 500, display = false,
  align: CanvasTextAlign = "left"
) {
  ctx.font = `${weight} ${size}px ${display ? "Unbounded" : "Inter"}, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}
function gradientText(ctx: Ctx, value: string, x: number, y: number, size: number, align: CanvasTextAlign = "left") {
  const g = ctx.createLinearGradient(x, y - size, x + 540, y);
  g.addColorStop(0, "#a9c4ff");
  g.addColorStop(0.55, "#c4a5ff");
  g.addColorStop(1, "#6ee7dc");
  text(ctx, value, x, y, size, g as unknown as string, 750, true, align);
}
function wrap(ctx: Ctx, value: string, x: number, y: number, maxWidth: number, size = 24, lineHeight = 36, color = MUTED) {
  ctx.font = `400 ${size}px Inter, sans-serif`;
  const words = value.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      text(ctx, line, x, yy, size, color, 400);
      line = word;
      yy += lineHeight;
    } else line = next;
  }
  if (line) text(ctx, line, x, yy, size, color, 400);
  return yy;
}
function pill(ctx: Ctx, value: string, x: number, y: number, color = BLUE, size = 17) {
  ctx.font = `600 ${size}px Inter, sans-serif`;
  const width = ctx.measureText(value).width + 36;
  ctx.fillStyle = color + "16";
  rounded(ctx, x, y, width, 42, 21);
  ctx.fill();
  ctx.strokeStyle = color + "50";
  ctx.lineWidth = 1;
  ctx.stroke();
  text(ctx, value, x + 18, y + 28, size, color, 600);
  return width;
}
function line(ctx: Ctx, x1: number, y1: number, x2: number, y2: number, color: string, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function imageCover(ctx: Ctx, image: unknown, x: number, y: number, w: number, h: number) {
  const img = image as CanvasImageSource & { width: number; height: number };
  if (!img?.width) return;
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
function icon(ctx: Ctx, kind: string, x: number, y: number, size: number, color = BLUE) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 48, size / 48);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (kind === "bot") {
    rounded(ctx, 7, 14, 34, 27, 8); ctx.stroke();
    line(ctx, 24, 6, 24, 14, color, 2.6);
    ctx.beginPath(); ctx.arc(24, 5, 2.5, 0, Math.PI * 2); ctx.fill();
    for (const ex of [17, 31]) { ctx.beginPath(); ctx.arc(ex, 25, 2.5, 0, Math.PI * 2); ctx.fill(); }
    line(ctx, 18, 33, 30, 33, color, 2.6);
    line(ctx, 2, 23, 2, 32, color, 2.6); line(ctx, 46, 23, 46, 32, color, 2.6);
  } else if (kind === "web") {
    rounded(ctx, 4, 7, 40, 34, 5); ctx.stroke();
    line(ctx, 4, 16, 44, 16, color, 2);
    for (const dx of [10, 16, 22]) { ctx.beginPath(); ctx.arc(dx, 11.5, 1.3, 0, Math.PI * 2); ctx.fill(); }
    line(ctx, 18, 23, 12, 28, color, 2.4); line(ctx, 12, 28, 18, 33, color, 2.4);
    line(ctx, 30, 23, 36, 28, color, 2.4); line(ctx, 36, 28, 30, 33, color, 2.4);
    line(ctx, 26, 22, 22, 34, color, 2);
  } else if (kind === "slides") {
    rounded(ctx, 4, 6, 40, 29, 4); ctx.stroke();
    line(ctx, 24, 35, 24, 43, color, 2.6); line(ctx, 14, 43, 34, 43, color, 2.6);
    line(ctx, 13, 27, 13, 20, color, 3); line(ctx, 23, 27, 23, 14, color, 3); line(ctx, 33, 27, 33, 18, color, 3);
  } else if (kind === "check") {
    ctx.beginPath(); ctx.arc(24, 24, 19, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 24); ctx.lineTo(21, 31); ctx.lineTo(35, 17); ctx.stroke();
  } else if (kind === "clock") {
    ctx.beginPath(); ctx.arc(24, 24, 19, 0, Math.PI * 2); ctx.stroke();
    line(ctx, 24, 12, 24, 24, color, 2.6); line(ctx, 24, 24, 33, 29, color, 2.6);
  } else {
    rounded(ctx, 9, 5, 30, 38, 4); ctx.stroke();
    line(ctx, 16, 16, 32, 16, color, 2.4);
    line(ctx, 16, 24, 32, 24, color, 2.4);
    line(ctx, 16, 32, 27, 32, color, 2.4);
  }
  ctx.restore();
}

function background(ctx: Ctx, t: number, sceneIndex: number) {
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, W, H);
  const hue = sceneIndex === 0 ? "rgba(110,48,76,.25)" : sceneIndex % 3 === 0 ? "rgba(80,53,150,.27)" : "rgba(39,78,155,.27)";
  const glow = ctx.createRadialGradient(360 + Math.sin(t * 0.17) * 130, 470, 20, 360, 500, 710);
  glow.addColorStop(0, hue); glow.addColorStop(1, "rgba(5,7,13,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const offset = (t * 7) % 60;
  for (let x = -60; x < W + 60; x += 60) line(ctx, x + offset, 0, x + offset, H, "rgba(115,148,220,.045)", 1);
  for (let y = -60; y < H + 60; y += 60) line(ctx, 0, y + offset, W, y + offset, "rgba(115,148,220,.045)", 1);
  for (let i = 0; i < 54; i++) {
    const x = hash(i + 1) * W;
    const y = (hash(i + 90) * H - t * (4 + hash(i) * 8) + H * 10) % H;
    const a = 0.12 + (Math.sin(t * 1.3 + i) + 1) * 0.14;
    ctx.fillStyle = `rgba(145,177,255,${a})`;
    const s = 1.5 + hash(i + 33) * 3;
    ctx.fillRect(x, y, s, s);
  }
}
function particles(ctx: Ctx, t: number, cx: number, cy: number, radius: number, count = 70) {
  for (let i = 0; i < count; i++) {
    const angle = hash(i + 500) * Math.PI * 2 + t * (0.08 + hash(i) * 0.12);
    const r = radius * (0.3 + hash(i + 700) * 0.7);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r * 0.8;
    const s = 3 + hash(i + 800) * 9;
    ctx.globalAlpha *= 0.995;
    ctx.fillStyle = [BLUE, VIOLET, MINT][i % 3];
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle * 0.4);
    ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
  }
}
function chrome(ctx: Ctx, assets: PromoAssets, t: number, index: number) {
  ctx.save();
  rounded(ctx, 48, 44, 42, 42, 12); ctx.clip();
  imageCover(ctx, assets.mark, 48, 44, 42, 42); ctx.restore();
  text(ctx, "PIXEL FLOW", 104, 72, 17, WHITE, 700, true);
  text(ctx, `${String(index + 1).padStart(2, "0")} / 15`, 666, 71, 15, MUTED, 500, false, "right");
  line(ctx, 48, 1170, 672, 1170, "#24304a", 1);
  text(ctx, "t.me/p_f_helperbot", 48, 1214, 19, "#b8c9ed", 600);
  text(ctx, "UZ · RU · EN", 672, 1214, 15, MUTED, 500, false, "right");
  ctx.fillStyle = "#172036"; ctx.fillRect(48, 1240, 624, 3);
  const g = ctx.createLinearGradient(48, 0, 672, 0); g.addColorStop(0, BLUE); g.addColorStop(1, VIOLET);
  ctx.fillStyle = g; ctx.fillRect(48, 1240, 624 * clamp(t / VIDEO_DURATION), 3);
}

function hook(ctx: Ctx, local: number) {
  pill(ctx, "ЗНАКОМАЯ СИТУАЦИЯ?", 56, 165, "#ffad91");
  text(ctx, "Дедлайн", 56, 310, 67, WHITE, 750, true);
  gradientText(ctx, "близко?", 56, 402, 76);
  const cx = 360, cy = 690, r = 143;
  ctx.strokeStyle = "#342536"; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = "#ff9c86"; ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * (1.55 + local * 0.09)); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    line(ctx, cx + Math.cos(a) * 116, cy + Math.sin(a) * 116, cx + Math.cos(a) * 124, cy + Math.sin(a) * 124, "#765467", 2);
  }
  const a = -Math.PI / 2 + local * 0.5;
  line(ctx, cx, cy, cx + Math.cos(a) * 88, cy + Math.sin(a) * 88, WHITE, 5);
  line(ctx, cx, cy, cx - 48, cy + 28, "#ffad91", 7);
  text(ctx, "03:00", cx, cy + 76, 24, "#ffad91", 650, false, "center");
  pill(ctx, "Курсовая?", 65, 515 + Math.sin(local) * 8, BLUE, 19);
  pill(ctx, "Слайды?", 478, 770 + Math.cos(local) * 8, VIOLET, 19);
  text(ctx, "А работа ещё не готова?", 360, 956, 28, WHITE, 600, false, "center");
  text(ctx, "Выдохни. Есть другой сценарий.", 360, 1004, 22, MUTED, 400, false, "center");
}
function problem(ctx: Ctx, local: number) {
  pill(ctx, "НОЧЬ. ПУСТОЙ ДОКУМЕНТ.", 56, 165, VIOLET);
  text(ctx, "Хватит начинать", 56, 294, 43, WHITE, 700, true);
  gradientText(ctx, "с чистого листа.", 56, 362, 43);
  panel(ctx, 83, 465, 554, 350, BLUE, 18);
  ctx.fillStyle = "#080d19"; rounded(ctx, 99, 482, 522, 306, 10); ctx.fill();
  panel(ctx, 222, 508, 276, 250, "#465779", 8);
  text(ctx, "Новый документ", 246, 548, 18, "#a6b5d2", 600);
  for (let i = 0; i < 5; i++) line(ctx, 246, 581 + i * 25, 468 - (i % 2) * 45, 581 + i * 25, "#26334c", 4);
  if (Math.sin(local * 5) > 0) line(ctx, 246, 711, 246, 729, BLUE, 2);
  ctx.fillStyle = "#25314a"; rounded(ctx, 52, 815, 616, 18, 8); ctx.fill();
  pill(ctx, "Курсовая?", 70, 880, BLUE, 20);
  pill(ctx, "Презентация?", 254, 880, VIOLET, 20);
  pill(ctx, "Статья?", 493, 880, MINT, 20);
  text(ctx, "Один бот. Все учебные задачи.", 360, 1010, 27, WHITE, 600, false, "center");
  text(ctx, "Переходим в новый поток.", 360, 1056, 21, MUTED, 400, false, "center");
}
function brand(ctx: Ctx, local: number, assets: PromoAssets) {
  const p = ease(local / 1.5);
  ctx.save(); rounded(ctx, 112, 176, 496, 405, 38); ctx.clip();
  imageCover(ctx, assets.hero, 112, 176, 496, 405);
  const g = ctx.createLinearGradient(0, 380, 0, 590); g.addColorStop(0, "rgba(5,7,13,0)"); g.addColorStop(1, "#05070d");
  ctx.fillStyle = g; ctx.fillRect(112, 176, 496, 405); ctx.restore();
  ctx.save(); particles(ctx, local, 360, 382, 420 - p * 155, 85); ctx.restore();
  text(ctx, "PIXEL", 360, 714, 91, WHITE, 800, true, "center");
  gradientText(ctx, "FLOW", 360, 824, 104, "center");
  text(ctx, "Учебные проекты под ключ", 360, 911, 27, WHITE, 500, false, "center");
  text(ctx, "От идеи — до оформления заказа.", 360, 957, 21, MUTED, 400, false, "center");
  pill(ctx, "УЧЁБА", 133, 1010, BLUE); pill(ctx, "ВЕБ", 294, 1010, VIOLET); pill(ctx, "БОТЫ", 421, 1010, MINT);
}
function documentVisual(ctx: Ctx, local: number) {
  panel(ctx, 56, 714, 608, 300);
  ctx.save(); ctx.translate(360, 864); ctx.rotate(-0.055 + Math.sin(local) * 0.012);
  panel(ctx, -119, -119, 238, 244, BLUE, 12);
  text(ctx, "КУРСОВАЯ", -94, -80, 17, WHITE, 700);
  line(ctx, -94, -62, 92, -62, "#354a72", 1);
  for (let i = 0; i < 6; i++) line(ctx, -94, -36 + i * 21, 90 - (i % 3) * 22, -36 + i * 21, "#405477", 4);
  icon(ctx, "check", 48, 63, 37, MINT); ctx.restore();
  pill(ctx, "Структура", 83, 754, BLUE, 16); pill(ctx, "Оформление", 451, 918, VIOLET, 16);
}
function slidesVisual(ctx: Ctx, local: number) {
  panel(ctx, 56, 714, 608, 300, VIOLET);
  for (let i = 0; i < 3; i++) {
    const x = 104 + i * 154;
    const y = 773 + (i === 1 ? -24 : 14) + Math.sin(local + i) * 5;
    panel(ctx, x, y, 196, 144, i === 1 ? VIOLET : BLUE, 13);
    text(ctx, `0${i + 1}`, x + 17, y + 31, 15, MUTED, 600);
    line(ctx, x + 17, y + 52, x + 145, y + 52, "#a4b8e0", 5);
    for (let j = 0; j < 4; j++) {
      ctx.fillStyle = j === i ? VIOLET : BLUE;
      rounded(ctx, x + 20 + j * 36, y + 116 - (18 + ((j + i) % 3) * 16), 22, 18 + ((j + i) % 3) * 16, 4); ctx.fill();
    }
  }
}
function webVisual(ctx: Ctx, local: number) {
  panel(ctx, 56, 704, 608, 320, MINT, 18);
  line(ctx, 56, 748, 664, 748, "#2b4056", 1);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = [BLUE, VIOLET, MINT][i]; ctx.beginPath(); ctx.arc(80 + i * 18, 726, 4, 0, Math.PI * 2); ctx.fill(); }
  text(ctx, "your-project.uz", 151, 732, 14, MUTED);
  const g = ctx.createLinearGradient(80, 770, 420, 900); g.addColorStop(0, "#243e72"); g.addColorStop(1, "#35245e");
  ctx.fillStyle = g; rounded(ctx, 80, 771, 560, 112, 12); ctx.fill();
  text(ctx, "BUILD SOMETHING", 103, 813, 21, WHITE, 700, true);
  text(ctx, "GREAT.", 103, 847, 25, "#b9a4ff", 750, true);
  ctx.fillStyle = MINT; rounded(ctx, 478, 813 + Math.sin(local) * 2, 134, 36, 10); ctx.fill();
  text(ctx, "Открыть", 545, 837 + Math.sin(local) * 2, 15, "#09251e", 700, false, "center");
  for (let i = 0; i < 3; i++) { panel(ctx, 80 + i * 192, 902, 176, 92, "#3a5271", 10); icon(ctx, ["web", "slides", "bot"][i], 96 + i * 192, 921, 32, [BLUE, VIOLET, MINT][i]); line(ctx, 143 + i * 192, 934, 236 + i * 192, 934, "#405477", 4); }
}
function botVisual(ctx: Ctx, local: number) {
  panel(ctx, 56, 704, 608, 320, BLUE, 24);
  icon(ctx, "bot", 83, 727, 42, BLUE); text(ctx, "Ваш будущий бот", 141, 756, 21, WHITE, 650);
  const messages = ["Чем могу помочь?", "Меню · Заказы · Связь"];
  messages.forEach((m, i) => {
    const a = smooth(0.35 + i * 0.6, 0.85 + i * 0.6, local);
    ctx.save(); ctx.globalAlpha *= a;
    panel(ctx, 84, 790 + i * 68, 390 + i * 45, 53, "#3b527a", 14);
    text(ctx, m, 103, 824 + i * 68, 18, "#c7d6f1"); ctx.restore();
  });
  for (let i = 0; i < 3; i++) { panel(ctx, 84 + i * 185, 946, 171, 48, BLUE, 11); text(ctx, ["Меню", "Заказать", "Админ"][i], 169 + i * 185, 977, 16, "#bed0f5", 600, false, "center"); }
}
function serviceScene(ctx: Ctx, kind: string, local: number) {
  const data: Record<string, { n: string; title: string[]; price: string; note: string; desc: string; color: string; icon: string }> = {
    coursework: { n: "01", title: ["Курсовая", "работа"], price: "30 000 сум", note: "до 30 листов · далее +1 200 сум/лист", desc: "Тема, объём и срок — всё учитываем при оформлении.", color: BLUE, icon: "doc" },
    slides: { n: "02", title: ["Слайды и", "презентации"], price: "20 000 сум", note: "материал для вашего выступления", desc: "Расскажите о теме и подготовьтесь к защите.", color: VIOLET, icon: "slides" },
    web: { n: "05", title: ["Веб-", "проекты"], price: "20 000 сум", note: "дизайн и разработка", desc: "Опишите идею, требования и желаемый дизайн.", color: MINT, icon: "web" },
    bot: { n: "06", title: ["Telegram-", "боты"], price: "15 000 сум", note: "бот под вашу задачу", desc: "Назначение и функции — соберём ваш сценарий.", color: BLUE, icon: "bot" },
  };
  const d = data[kind];
  pill(ctx, `УСЛУГА ${d.n} / 06`, 56, 165, d.color);
  panel(ctx, 56, 237, 84, 84, d.color, 22); icon(ctx, d.icon, 74, 255, 48, d.color);
  text(ctx, d.title[0], 56, 402, 57, WHITE, 750, true);
  gradientText(ctx, d.title[1], 56, 478, 57);
  text(ctx, d.price, 56, 590, 49, d.color, 750, true);
  text(ctx, d.note, 56, 639, 20, MUTED);
  if (kind === "coursework") documentVisual(ctx, local);
  if (kind === "slides") slidesVisual(ctx, local);
  if (kind === "web") webVisual(ctx, local);
  if (kind === "bot") botVisual(ctx, local);
  wrap(ctx, d.desc, 56, 1070, 608, 22, 32, "#a5b3cd");
}
function papers(ctx: Ctx, local: number) {
  pill(ctx, "УСЛУГИ 03–04 / 06", 56, 165, VIOLET);
  text(ctx, "Тезисы", 56, 310, 64, WHITE, 750, true);
  gradientText(ctx, "и статьи", 56, 397, 64);
  text(ctx, "Для конференций и публикаций", 56, 462, 23, MUTED);
  const shift = (1 - ease(local / 0.8)) * 35;
  panel(ctx, 56, 535 + shift, 608, 190, BLUE);
  icon(ctx, "doc", 83, 568 + shift, 51, BLUE);
  text(ctx, "Тезис", 157, 603 + shift, 29, WHITE, 650);
  text(ctx, "5 000 сум", 83, 682 + shift, 40, BLUE, 700, true);
  text(ctx, "за страницу", 625, 680 + shift, 20, MUTED, 400, false, "right");
  panel(ctx, 56, 755 - shift, 608, 190, VIOLET);
  icon(ctx, "doc", 83, 788 - shift, 51, VIOLET);
  text(ctx, "Статья", 157, 823 - shift, 29, WHITE, 650);
  text(ctx, "7 000 сум", 83, 902 - shift, 40, VIOLET, 700, true);
  text(ctx, "за страницу", 625, 900 - shift, 20, MUTED, 400, false, "right");
  wrap(ctx, "Укажите тему, количество страниц и срок. Бот рассчитает стоимость заказа.", 56, 1018, 608, 23, 35, "#a5b3cd");
}

function phone(ctx: Ctx, step: number, local: number, assets: PromoAssets) {
  panel(ctx, 113, 345, 494, 674, "#60779e", 43);
  ctx.fillStyle = "#0b1422"; rounded(ctx, 126, 358, 468, 648, 33); ctx.fill();
  ctx.fillStyle = "#05070d"; rounded(ctx, 291, 369, 138, 24, 13); ctx.fill();
  ctx.save(); rounded(ctx, 145, 411, 62, 62, 18); ctx.clip(); imageCover(ctx, assets.mark, 145, 411, 62, 62); ctx.restore();
  text(ctx, "PF Helper", 225, 439, 23, WHITE, 700);
  text(ctx, "бот · демонстрация", 225, 466, 15, MINT);
  line(ctx, 126, 491, 594, 491, "#25324a", 1);
  const bubble = (value: string, y: number, right = false, color = "#1a2940") => {
    ctx.font = "500 18px Inter, sans-serif";
    const w = Math.min(405, ctx.measureText(value).width + 32);
    const x = right ? 570 - w : 149;
    ctx.fillStyle = right ? "#354b83" : color; rounded(ctx, x, y, w, 47, 14); ctx.fill();
    text(ctx, value, x + 16, y + 30, 18, "#e0e9fb");
  };
  const key = (label: string, x: number, y: number, w: number, active = false) => {
    ctx.fillStyle = active ? "#36558e" : "#1c2b43"; rounded(ctx, x, y, w, 49, 10); ctx.fill();
    ctx.strokeStyle = active ? "#7ba5ff" : "#30415f"; ctx.lineWidth = 1; ctx.stroke();
    text(ctx, label, x + w / 2, y + 31, 16, active ? WHITE : "#b9cae7", 600, false, "center");
  };
  if (step === 0) {
    bubble("Добро пожаловать в Pixel Flow!", 520);
    bubble("Выберите язык:", 581);
    text(ctx, "Клавиатура бота", 360, 817, 15, MUTED, 500, false, "center");
    key("Oʻzbek", 145, 844, 137); key("Русский", 291, 844, 137, local > 1.6); key("English", 437, 844, 137);
  } else if (step === 1) {
    bubble("Главное меню", 520); bubble("Выберите услугу:", 581);
    key("Курсовая / Слайды", 145, 785, 209, local > 1.6); key("Тезис / Статья", 365, 785, 209);
    key("Веб-проект", 145, 845, 209); key("Telegram-бот", 365, 845, 209);
    key("Связаться с админом", 145, 905, 429);
  } else if (step === 2) {
    bubble("На какую тему работа?", 512);
    if (local > 0.45) bubble("История Узбекистана", 570, true);
    if (local > 1.05) bubble("Сколько листов?", 628);
    if (local > 1.5) bubble("25", 686, true);
    if (local > 2.05) bubble("На какое число?", 744);
    if (local > 2.5) bubble("25.06.2026", 802, true);
    key("Назад", 145, 905, 429);
  } else {
    panel(ctx, 149, 516, 421, 236, "#476493", 17);
    text(ctx, "Ваш заказ", 170, 553, 22, WHITE, 700);
    text(ctx, "Курсовая работа", 170, 590, 18, "#b9cae7");
    text(ctx, "25 листов · 25.06.2026", 170, 622, 18, "#b9cae7");
    line(ctx, 170, 644, 548, 644, "#344969", 1);
    text(ctx, "30 000 сум", 170, 695, 31, MINT, 700);
    key("Подтвердить", 145, 785, 429, local > 0.9 && local < 2);
    key("Я оплатил", 145, 845, 429, local > 2.2);
    key("Назад", 145, 905, 429);
  }
  if (local > 1.5 && step !== 2) {
    const r = 13 + ((local * 0.8) % 1) * 20;
    ctx.strokeStyle = `rgba(173,204,255,${0.65 * (1 - ((local * 0.8) % 1))})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(step === 0 ? 359 : 252, step === 0 ? 868 : 810, r, 0, Math.PI * 2); ctx.stroke();
  }
  line(ctx, 286, 987, 434, 987, "#53627c", 4);
}
function demo(ctx: Ctx, step: number, local: number, assets: PromoAssets) {
  const titles = ["Выберите язык", "Выберите услугу", "Расскажите о задаче", "Подтвердите заказ"];
  const captions = ["Узбекский, русский или английский.", "Нужная услуга — всегда под рукой.", "Тема, объём и срок. Назад — на каждом шаге.", "Сводка и цена. Далее — оплата и связь с админом."];
  pill(ctx, `ШАГ 0${step + 1} / 04`, 56, 160, step === 3 ? MINT : BLUE);
  text(ctx, titles[step], 360, 280, 32, WHITE, 700, true, "center");
  phone(ctx, step, local, assets);
  wrap(ctx, captions[step], 64, 1070, 592, 21, 31, "#a5b3cd");
}
function benefits(ctx: Ctx, local: number) {
  pill(ctx, "ВСЁ В ОДНОМ БОТЕ", 56, 165, MINT);
  text(ctx, "Меньше переписок.", 56, 293, 37, WHITE, 700, true);
  gradientText(ctx, "Больше порядка.", 56, 354, 39);
  const tiles = [
    { value: "6", label: "услуг", note: "учёба, веб и боты", color: BLUE, icon: "doc" },
    { value: "3", label: "языка", note: "UZ · RU · EN", color: VIOLET, icon: "web" },
    { value: "2 мин", label: "на заказ", note: "простой сценарий в боте", color: MINT, icon: "clock" },
    { value: "5 000", label: "сум / страница*", note: "стоимость тезиса", color: BLUE, icon: "check" },
  ];
  tiles.forEach((d, i) => {
    const x = 56 + (i % 2) * 314;
    const y = 440 + Math.floor(i / 2) * 263 + (1 - ease((local - i * 0.1) / 0.7)) * 25;
    panel(ctx, x, y, 294, 239, d.color);
    icon(ctx, d.icon, x + 23, y + 23, 35, d.color);
    text(ctx, d.value, x + 23, y + 122, d.value.length > 4 ? 42 : 53, WHITE, 750, true);
    text(ctx, d.label, x + 23, y + 163, 21, d.color, 600);
    text(ctx, d.note, x + 23, y + 204, 15, MUTED);
  });
  text(ctx, "*Цена зависит от услуги и объёма заказа.", 56, 1020, 18, MUTED);
  text(ctx, "2 минуты — оформление, не выполнение работы.", 56, 1054, 17, MUTED);
}
function cta(ctx: Ctx, local: number, assets: PromoAssets) {
  ctx.save(); particles(ctx, local, 360, 575, 390, 65); ctx.restore();
  pill(ctx, "ТВОЙ СЛЕДУЮЩИЙ ШАГ", 56, 165, MINT);
  text(ctx, "Твой проект.", 56, 307, 53, WHITE, 750, true);
  gradientText(ctx, "Наш поток.", 56, 387, 55);
  text(ctx, "Оформи заказ в Telegram", 56, 463, 26, "#a5b3cd");
  const g = ctx.createLinearGradient(56, 515, 664, 605); g.addColorStop(0, "#426fe2"); g.addColorStop(1, "#7953d5");
  ctx.fillStyle = g; rounded(ctx, 56, 518, 608, 88, 23); ctx.fill();
  icon(ctx, "bot", 82, 539, 43, WHITE);
  text(ctx, "t.me/p_f_helperbot", 151, 574, 28, WHITE, 700);
  text(ctx, "→", 625, 575, 32, WHITE, 500, false, "right");
  panel(ctx, 226, 665, 268, 268, BLUE, 28);
  ctx.fillStyle = "#ffffff"; rounded(ctx, 244, 683, 232, 232, 16); ctx.fill();
  imageCover(ctx, assets.qr, 250, 689, 220, 220);
  text(ctx, "Наведи камеру — открой бота", 360, 988, 23, WHITE, 500, false, "center");
  text(ctx, "Или нажми ссылку в описании поста", 360, 1032, 19, MUTED, 400, false, "center");
}
function outro(ctx: Ctx, local: number, assets: PromoAssets) {
  ctx.save(); rounded(ctx, 258, 267, 204, 204, 47); ctx.clip(); imageCover(ctx, assets.mark, 258, 267, 204, 204); ctx.restore();
  ctx.save(); particles(ctx, local, 360, 371, 245 + local * 15, 55); ctx.restore();
  text(ctx, "PIXEL FLOW", 360, 584, 51, WHITE, 800, true, "center");
  gradientText(ctx, "Создавай. Учись.", 360, 659, 30, "center");
  text(ctx, "@pixel_flow_1", 360, 773, 33, BLUE, 650, false, "center");
  text(ctx, "Канал наших проектов", 360, 818, 21, MUTED, 400, false, "center");
  line(ctx, 260, 875, 460, 875, "#344568", 1);
  text(ctx, "До встречи в Telegram", 360, 944, 25, WHITE, 500, false, "center");
}

export function drawPromoFrame(ctx: Ctx, width: number, height: number, time: number, assets: PromoAssets) {
  const t = clamp(time, 0, VIDEO_DURATION - 0.001);
  const index = Math.max(0, VIDEO_SCENES.findIndex((s) => t >= s.start && t < s.end));
  const scene = VIDEO_SCENES[index];
  const local = t - scene.start;
  ctx.save();
  ctx.setTransform(width / W, 0, 0, height / H, 0, 0);
  ctx.globalAlpha = 1;
  background(ctx, t, index);
  const fadeIn = smooth(0, 0.38, local);
  const fadeOut = scene.id === "outro" ? 1 - smooth(2.35, 3, local) : 1 - smooth(scene.end - scene.start - 0.3, scene.end - scene.start, local);
  ctx.save();
  ctx.globalAlpha = fadeIn * fadeOut;
  ctx.translate(0, (1 - ease(local / 0.6)) * 22);
  switch (scene.id) {
    case "hook": hook(ctx, local); break;
    case "problem": problem(ctx, local); break;
    case "brand": brand(ctx, local, assets); break;
    case "coursework": case "slides": case "web": case "bot": serviceScene(ctx, scene.id, local); break;
    case "papers": papers(ctx, local); break;
    case "language": demo(ctx, 0, local, assets); break;
    case "service": demo(ctx, 1, local, assets); break;
    case "details": demo(ctx, 2, local, assets); break;
    case "confirm": demo(ctx, 3, local, assets); break;
    case "benefits": benefits(ctx, local); break;
    case "cta": cta(ctx, local, assets); break;
    case "outro": outro(ctx, local, assets); break;
  }
  ctx.restore();
  if (local < 0.5 && index > 0) {
    const p = local / 0.5;
    ctx.save(); ctx.globalAlpha = (1 - p) * 0.65;
    for (let i = 0; i < 48; i++) {
      const a = hash(i + 40) * Math.PI * 2;
      const r = 80 + ease(p) * 700;
      const s = (1 - p) * (5 + hash(i) * 14);
      ctx.fillStyle = [BLUE, VIOLET, MINT][i % 3];
      ctx.fillRect(360 + Math.cos(a) * r, 590 + Math.sin(a) * r, s, s);
    }
    ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = scene.id === "outro" ? fadeOut : 1;
  chrome(ctx, assets, t, index); ctx.restore();
  ctx.restore();
}
