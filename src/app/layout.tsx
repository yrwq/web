import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";

const myFont = localFont({
  src: "../../public/azuki.ttf",
});

export const metadata: Metadata = {
  title: "yrwq",
  description: "description",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${myFont.className}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const storageTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (!storageTheme || storageTheme === 'system') {
                  // Use system preference
                  if (systemPrefersDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } else if (storageTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (storageTheme === 'light') {
                  document.documentElement.classList.add('light');
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
