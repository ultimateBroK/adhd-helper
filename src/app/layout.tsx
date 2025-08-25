import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADHD Helper - Trợ lý AI thông minh",
  description: "Trợ lý AI thông minh giúp bạn quản lý công việc, tập trung và tăng năng suất với giao diện đẹp và dễ sử dụng.",
  keywords: "AI, trợ lý, ADHD, productivity, chat, helper",
  authors: [{ name: "ADHD Helper Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
