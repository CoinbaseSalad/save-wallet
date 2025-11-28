import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { minikitConfig } from "../minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Join the ${minikitConfig.miniapp.name} Waitlist`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // 테마 초기화 스크립트 (깜빡임 방지 + 브라우저 강제 다크모드 방지)
  const themeInitScript = `
    (function() {
      const savedTheme = localStorage.getItem('theme');
      let theme;
      
      if (savedTheme) {
        theme = savedTheme;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'night';
      } else {
        theme = 'light';
      }
      
      document.documentElement.setAttribute('data-theme', theme);
      // 브라우저에게 현재 색상 스키마 알려줌 (강제 다크모드 방지)
      document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    })();
  `;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 브라우저 강제 다크모드 방지 */}
        <meta name="color-scheme" content="light dark" />
        {/* Android WebView 강제 다크모드 추가 방지 */}
        <meta name="supported-color-schemes" content="light dark" />
        {/* 앱 상태바 색상 (테마와 일치시켜 일관성 유지) */}
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1a1a2e"
          media="(prefers-color-scheme: dark)"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${sourceCodePro.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RootProvider>
            <SafeArea>{children}</SafeArea>
            <Toaster position="top-center" richColors />
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
