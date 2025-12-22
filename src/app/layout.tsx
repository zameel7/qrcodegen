import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QRapid - Fast QR Code Generator",
  description: "Generate and manage QR codes instantly with QRapid",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "QRapid - Fast QR Code Generator",
    description: "Generate and manage QR codes instantly with QRapid",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QRapid - Fast QR Code Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRapid - Fast QR Code Generator",
    description: "Generate and manage QR codes instantly with QRapid",
    images: ["/og-image.png"],
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
