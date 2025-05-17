import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";

import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

const myFont = localFont({
  src: "../../public/azuki.ttf",
});

export const metadata: Metadata = {
  title: "yrwq",
  description: "description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${myFont.className} dark`} suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const storageTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (storageTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (storageTheme === 'system') {
                  if (!systemPrefersDark) {
                    document.documentElement.classList.remove('dark');
                  }
                }
              } catch (e) {
                console.log('Theme script error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body
        className="antialiased bg-background dark:bg-background flex"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
