import type { Metadata } from "next";
import { title, description } from "@/lib/config";
import { Sidebar } from "@/components/Sidebar"
import { ScrollArea } from "@/components/ScrollArea"
import { SidebarContent } from "@/components/SidebarContent"

import { ThemeProvider } from "@/components/ThemeProvider"

import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning style={{scrollBehavior:'smooth'}}>

      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <main className="flex min-h-screen">
            <div className="min-h-[100%]">
              <Sidebar title="home" href="/" isInner >
                <SidebarContent />
              </Sidebar>
            </div>
            <div className="flex flex-1">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://yrwq.xyz"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/"
  },
  title: title,
  description: description,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}
