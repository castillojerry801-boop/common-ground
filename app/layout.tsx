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
    default: "Common Ground Workshop — Professional Software Built with Purpose",
    template: "%s | Common Ground Workshop",
  },
  description:
    "Common Ground Workshop builds profession-specific software for small businesses — scheduling, client management, payments, and more. Built with purpose. Built for you.",
  keywords: [
    "business software",
    "small business tools",
    "appointment scheduling",
    "client management software",
    "youth sports management",
    "beauty business software",
    "Utah software company",
    "Common Ground Workshop",
  ],
  authors: [{ name: "Common Ground Workshop" }],
  creator: "Common Ground Workshop",
  openGraph: {
    type: "website",
    url: "https://cg-workshop.com",
    siteName: "Common Ground Workshop",
    title: "Common Ground Workshop — Professional Software Built with Purpose",
    description:
      "Profession-specific software for small businesses. Scheduling, client management, payments, and more — built with purpose, built for you.",
    images: [
      {
        url: "/cg-brand.png",
        width: 1200,
        height: 630,
        alt: "Common Ground Workshop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Common Ground Workshop — Professional Software Built with Purpose",
    description:
      "Profession-specific software for small businesses. Built with purpose, built for you.",
    images: ["/cg-brand.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
