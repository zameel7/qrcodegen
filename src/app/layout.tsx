import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? process.env.NEXT_PUBLIC_BASE_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "QRapid - Fast QR Code Generator for Business & Personal Use",
  description: "QRapid is a powerful and free QR code generator. Create, customize, and manage QR codes for all your personal and business needs. Generate static or dynamic QR codes instantly.",
  icons: {
    icon: new URL("/favicon.ico", baseUrl).toString(),
    apple: new URL("/logo.png", baseUrl).toString(),
  },
  openGraph: {
    title: "QRapid - Fast QR Code Generator for Business & Personal Use",
    description: "QRapid is a powerful and free QR code generator. Create, customize, and manage QR codes for all your personal and business needs. Generate static or dynamic QR codes instantly.",
    images: [
      {
        url: new URL("/og-image.png?v=2", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "QRapid - Fast QR Code Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRapid - Fast QR Code Generator for Business & Personal Use",
    description: "QRapid is a powerful and free QR code generator. Create, customize, and manage QR codes for all your personal and business needs. Generate static or dynamic QR codes instantly.",
    images: [new URL("/og-image.png?v=2", baseUrl).toString()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
