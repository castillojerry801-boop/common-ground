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
  metadataBase: new URL("https://cg-workshop.com"),
  title: {
    default: "Common Ground Workshop — Web Design for Small Businesses in Utah",
    template: "%s | Common Ground Workshop",
  },
  description:
    "Common Ground Workshop builds custom websites for small businesses across Utah — from Logan to St. George. Domain, email, website, and Google Business Profile setup. Built with purpose.",
  keywords: [
    "web design Utah",
    "website design Utah",
    "custom website design Utah",
    "web designer Utah",
    "small business website Utah",
    "website design Layton Utah",
    "website design Salt Lake City",
    "website design Logan Utah",
    "website design St George Utah",
    "web design small business",
    "local business website Utah",
    "Common Ground Workshop",
  ],
  authors: [{ name: "Common Ground Workshop" }],
  creator: "Common Ground Workshop",
  openGraph: {
    type: "website",
    url: "https://cg-workshop.com",
    siteName: "Common Ground Workshop",
    title: "Common Ground Workshop — Web Design for Small Businesses in Utah",
    description:
      "Custom websites for small businesses across Utah — from Logan to St. George. Domain, email, website, and Google Business Profile. Built with purpose.",
    images: [
      {
        url: "/cg-logo-wordmark.png",
        width: 1254,
        height: 1254,
        alt: "Common Ground Workshop",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Common Ground Workshop — Web Design for Small Businesses in Utah",
    description:
      "Custom websites for small businesses across Utah. Domain, email, website, and Google Business Profile setup. Built with purpose.",
    images: ["/cg-logo-wordmark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: "https://cg-workshop.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
