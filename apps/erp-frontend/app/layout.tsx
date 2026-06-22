import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenERP",
  description: "Open ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} w-full h-full antialiased bg-zinc-200`}>
      <body className="w-full font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
