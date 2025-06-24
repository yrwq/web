import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { GSAPProvider } from "@/components/GSAPProvider";
import { PageTransition } from "@/components/PageTransition";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutContent } from "@/components/LayoutContent";
import { getBookmarks } from "@/lib/raindrop";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import Script from "next/script";

const azuki = localFont({
  src: "../../public/azuki.ttf",
});

const proto = localFont({
  src: [
    {
      path: "../../public/0xProto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/0xProto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/0xProto-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
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

export const viewport: Viewport = {
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = (await getBookmarks()) || [];

  return (
    <html lang="en" className={azuki.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                // Add transition class immediately
                document.documentElement.classList.add('theme-transitioning');

                // Initial theme logic - runs before React
                const theme = localStorage.getItem('theme');

                // Set theme based on localStorage or system preference
                if (!theme) {
                  // Use system preference
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
                  document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                } else if (theme === 'dark' || theme.includes('dark') || theme.includes('moon')) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (theme === 'light' || theme.includes('light') || theme.includes('dawn')) {
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                  document.documentElement.setAttribute('data-theme', 'light');
                } else if (theme === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
                  document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', 'system');
                }

                // Add custom theme class if applicable
                if (['gruvbox-light', 'gruvbox-dark', 'rose-pine-dawn', 'rose-pine-moon'].includes(theme)) {
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                }

                // Remove transition class after initial load
                requestAnimationFrame(() => {
                  document.documentElement.classList.remove('theme-transitioning');
                });
              } catch(e) {
                // Default to dark mode on error
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              }
            })();
          `,
          }}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="yrwq" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <Script id="scroller" strategy="afterInteractive">
          {`
          window.scrollTo({
            top: 1,
            behavior: 'smooth'
          });
          `}
        </Script>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            // The initial theme has already been applied by the inline script
            // This script ensures the theme stays in sync with system preferences
            (function() {
              try {
                // Add listener for system theme changes when using system preference
                const theme = localStorage.getItem('theme');
                if (theme === 'system') {
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  const handleChange = () => {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(mediaQuery.matches ? 'dark' : 'light');
                    document.documentElement.style.colorScheme = mediaQuery.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', 'system');
                  };

                  mediaQuery.addEventListener('change', handleChange);
                }
              } catch (e) {
                console.error('Theme listener error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body
        className="antialiased bg-background dark:bg-background flex overflow-hidden h-screen m-0 p-0"
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <ThemeProvider>
          <LayoutContent collections={collections}>{children}</LayoutContent>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
