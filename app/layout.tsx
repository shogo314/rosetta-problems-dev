import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Rosetta Problems",
  description: "競技プログラミング問題のまとめサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="p-4 border-b border-gray-300 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">Rosetta Problems</Link>
          </h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
