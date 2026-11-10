import Image from "next/image";
import {
  ArrowUpRight,
  BotMessageSquare,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  LayoutTemplate,
  MousePointerClick,
  Newspaper,
  ReceiptText,
  Send,
  Timer,
  UserRound,
  Wallet,
} from "lucide-react";
import Reveal from "@/components/reveal";
import { getMe } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const CHANNEL = process.env.NEXT_PUBLIC_CHANNEL_URL ?? "https://t.me/pixel_flow_1";
const ADMIN = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "kvonu";

const services = [
  {
    icon: GraduationCap,
    title: "Курсовая работа",
    price: "от 30 000 сум",
    desc: "Полное оформление по методичке: титульник, план, введение, главы, заключение и список литературы.",
    tag: "30+ листов: +1 200 сум / лист",
  },
  {
    icon: LayoutTemplate,
    title: "Слайды и презентации",
    price: "20 000 сум",
    desc: "Структура, современный дизайн слайдов и текст выступления — готовый материал к защите.",
    tag: "PowerPoint / Canva",
  },
  {
    icon: Newspaper,
    title: "Тезис",
    price: "5 000 сум / стр",
    desc: "Научные тезисы для конференций и сборников: тема, актуальность, выводы — по требованиям оргкомитета.",
    tag: "конференции и сборники",
  },
  {
    icon: FileText,
    title: "Научная статья",
    price: "7 000 сум / стр",
    desc: "Статьи под требования журналов: аннотация, ключевые слова, методология, ссылки и оформление.",
    tag: "журналы и публикации",
  },
  {
    icon: Globe,
    title: "Веб-проект",
    price: "20 000 сум",
    desc: "Лендинги, сайты-портфолио, каталоги и учебные веб-приложения — дизайн и код под ваши требования.",
    tag: "дизайн + код",
  },
  {
    icon: BotMessageSquare,
    title: "Telegram-бот",
    price: "15 000 сум",
    desc: "Боты для бизнеса и учёбы: приём заказов, меню, магазины, рассылки и интеграции — под вашу задачу.",
    tag: "любая логика",
  },
];

const steps = [
  {
    icon: Languages,
    num: "01",
    title: "Откройте бота",
    desc: "/start — и выбор языка: узбекский, русский или английский.",
  },
  {
    icon: MousePointerClick,
    num: "02",
    title: "Выберите услугу",
    desc: "Ответьте на вопросы бота: тема, объём, срок. На каждом шаге есть кнопка «Назад».",
  },
  {
    icon: ReceiptText,
    num: "03",
    title: "Подтвердите заказ",
    desc: "Бот покажет красиво оформленную сводку: тема, листы, дата и точная стоимость.",
  },
  {
    icon: Wallet,
    num: "04",
    title: "Оплатите и готово",
    desc: "Перевод на карту, скриншот админу — заказ уходит в работу мгновенно.",
  },
];

const marqueeItems = [
  "Курсовые работы",
  "Презентации",
  "Тезисы",
  "Научные статьи",
  "Веб-проекты",
  "Telegram-боты",
  "UZ · RU · EN",
  "Точно в срок",
];

function PixelGrid() {
  const cells = Array.from({ length: 200 }, (_, i) => i);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70"
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(10,1fr)]">
        {cells.map((i) => {
          const on = (i * 31 + 7) % 13 < 2;
          return (
            <div
              key={i}
              className={on ? "pixel-cell bg-indigo-400/30" : ""}
              style={{ animationDelay: `${((i * 53) % 40) / 10}s` }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default async function Home() {
  const me = await getMe().catch(() => null);
  const botUrl = me?.username ? `https://t.me/${me.username}` : CHANNEL;

  return (
    <main className="grain relative overflow-hidden">
      {/* фон */}
      <div className="pointer-events-none absolute inset-0 hero-grid" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-[38%] -left-40 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-[60%] -right-40 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[120px]" />

      {/* навигация */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl border border-indigo-400/30">
            <Image src="/images/mark.png" alt="Pixel Flow" fill className="object-cover" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.22em] text-white uppercase">
            Pixel Flow
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#services" className="transition hover:text-white">Услуги</a>
          <a href="#how" className="transition hover:text-white">Как это работает</a>
          <a href="#contacts" className="transition hover:text-white">Контакты</a>
          <a href="/admin" className="transition hover:text-white">Админ-панель</a>
        </nav>
        <a
          href={botUrl}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-200 transition hover:border-indigo-300 hover:bg-indigo-500/20 hover:text-white"
        >
          Открыть бота
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pt-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-8">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5 text-xs tracking-wide text-indigo-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Telegram-бот для студентов · UZ / RU / EN
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[clamp(2rem,5.2vw,3.9rem)] leading-[1.06] font-bold text-white">
              Учебные проекты
              <br />
              <span className="text-gradient">под ключ за 2 минуты</span>
              <br />
              прямо в Telegram
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
              Курсовые, презентации, тезисы, статьи, веб-проекты и боты.
              Выбирайте услугу, отвечайте на пару вопросов — бот сам посчитает
              стоимость и оформит заказ с реквизитами для оплаты.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={botUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(99,102,241,0.7)] transition hover:shadow-[0_0_60px_-6px_rgba(99,102,241,0.9)]"
              >
                <Send className="h-4 w-4" />
                Заказать в боте
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={CHANNEL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-7 py-4 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Канал проектов
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {[
                ["6", "услуг"],
                ["3", "языка"],
                ["5 000+", "сум от"],
                ["2 мин", "на заказ"],
              ].map(([v, l]) => (
                <div key={l} className="bg-ink-2/80 px-4 py-5 text-center">
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-xl font-semibold text-white">{v}</dd>
                  <dd className="mt-1 text-[11px] tracking-wider text-slate-500 uppercase">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600/30 via-transparent to-violet-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-indigo-400/20">
              <Image
                src="/images/hero.png"
                alt="Pixel Flow — поток учебных проектов"
                width={1024}
                height={1024}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            </div>
            <div className="glass absolute -left-4 top-8 hidden animate-float rounded-2xl px-4 py-3 sm:block">
              <p className="text-[11px] tracking-wider text-slate-400 uppercase">Курсовая</p>
              <p className="font-display text-sm font-semibold text-white">от 30 000 сум</p>
            </div>
            <div className="glass absolute -right-3 top-1/3 hidden animate-float-slow rounded-2xl px-4 py-3 sm:block">
              <p className="text-[11px] tracking-wider text-slate-400 uppercase">Telegram-бот</p>
              <p className="font-display text-sm font-semibold text-white">15 000 сум</p>
            </div>
            <div className="glass absolute bottom-8 -left-3 hidden animate-float rounded-2xl px-4 py-3 sm:block" style={{ animationDelay: "1.6s" }}>
              <p className="text-[11px] tracking-wider text-slate-400 uppercase">Веб-проект</p>
              <p className="font-display text-sm font-semibold text-white">20 000 сум</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* marquee */}
      <section className="relative z-10 border-y border-line bg-ink-2/60 py-5">
        <div className="marquee-track gap-10 pr-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-10 font-display text-sm tracking-[0.18em] whitespace-nowrap text-slate-500 uppercase"
            >
              {item}
              <span className="text-indigo-400">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* услуги */}
      <section id="services" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] text-indigo-300/80 uppercase">Услуги и цены</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold text-white md:text-4xl">
            Всё, что нужно студенту, — <span className="text-gradient">в одном боте</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <a
                href={botUrl}
                target="_blank"
                rel="noreferrer"
                className="group glass flex h-full flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:border-indigo-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-violet-500/20 text-indigo-300 ring-1 ring-indigo-400/25">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                    {s.price}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-xs text-slate-500">{s.tag}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 transition group-hover:text-white">
                    Заказать
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="mt-8 text-sm text-slate-500">
            Курсовая свыше 30 листов: базовые 30 000 сум + 1 200 сум за каждый дополнительный лист.
            Бот посчитает точную сумму автоматически.
          </p>
        </Reveal>
      </section>

      {/* как это работает */}
      <section id="how" className="relative z-10 border-y border-line bg-ink-2/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.3em] text-indigo-300/80 uppercase">Процесс</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
              Как это работает
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <Reveal key={st.num} delay={i * 100}>
                <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
                  <span className="absolute -top-3 right-4 font-display text-6xl font-bold text-indigo-500/10">
                    {st.num}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25">
                    <st.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">{st.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{st.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + контакты */}
      <section id="contacts" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="glass relative overflow-hidden rounded-[2.5rem] p-8 md:p-14">
          <PixelGrid />
          <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Reveal>
                <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                  Дедлайн горит?
                  <br />
                  <span className="text-gradient">Мы уже готовы начать.</span>
                </h2>
                <p className="mt-5 max-w-lg text-slate-400">
                  Откройте бота, выберите услугу и пройдите три шага — заказ
                  оформляется за пару минут, а команда приступает сразу после
                  подтверждения оплаты.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={botUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(99,102,241,0.7)] transition hover:shadow-[0_0_60px_-6px_rgba(99,102,241,0.95)]"
                  >
                    <BotMessageSquare className="h-4 w-4" />
                    Открыть Pixel Flow Bot
                  </a>
                  <a
                    href={`https://t.me/${ADMIN}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-7 py-4 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    <UserRound className="h-4 w-4" />
                    Админ @{ADMIN}
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="grid gap-4">
                {[
                  {
                    icon: Send,
                    title: "Канал проектов",
                    value: "@pixel_flow_1",
                    href: CHANNEL,
                  },
                  {
                    icon: UserRound,
                    title: "Личные вопросы",
                    value: `@${ADMIN}`,
                    href: `https://t.me/${ADMIN}`,
                  },
                  {
                    icon: Timer,
                    title: "Скорость ответа",
                    value: "в течение часа",
                    href: CHANNEL,
                  },
                ].map((c) => (
                  <a
                    key={c.title}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass group flex items-center justify-between rounded-2xl px-5 py-4 transition hover:border-indigo-400/40"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-slate-500">{c.title}</span>
                        <span className="block text-sm font-medium text-white">{c.value}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-white" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="relative h-5 w-5 overflow-hidden rounded-md border border-indigo-400/30">
              <Image src="/images/mark.png" alt="" fill className="object-cover" />
            </span>
            Pixel Flow © 2026
          </span>
          <a href="/admin" className="transition hover:text-slate-300">
            Панель администратора
          </a>
        </div>
      </footer>
    </main>
  );
}
