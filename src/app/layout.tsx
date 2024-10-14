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
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
