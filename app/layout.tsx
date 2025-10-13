import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youth Life - 인생 운영 시스템",
  description: "오행 리듬 기반 루틴·목표·금전·성찰을 관리하는 개인 운영체제",
  manifest: "/manifest.json",
  themeColor: "#0A0E27",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-dark-navy via-dark-bg to-dark-navy">
          {children}
        </div>
      </body>
    </html>
  );
}
