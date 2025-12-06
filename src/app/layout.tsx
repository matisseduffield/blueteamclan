import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { SITE_CONFIG } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${SITE_CONFIG.domain}`,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/favicon-256x256.png",
        width: 256,
        height: 256,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
