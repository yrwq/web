import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/Sidebar";

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
    <html lang="en">
      <body className="antialiased bg-background bg-dot-foreground/50 flex">
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
