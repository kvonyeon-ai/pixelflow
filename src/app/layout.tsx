import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixel Flow — учебные проекты под ключ",
  description:
    "Курсовые, презентации, тезисы, статьи, веб-проекты и Telegram-боты для студентов. Заказ за 2 минуты в Telegram-боте.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="min-h-screen bg-[#05070d] font-sans text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
