import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://thc-efb.vercel.app"),
  title: {
    default: "Shop Tài Khoản eFootball | Uy Tín – Giá Tốt",
    template: "%s | THC eFootball Shop",
  },
  description: "Mua bán tài khoản eFootball Mobile uy tín, giá tốt.",
  keywords: [
    "tài khoản efootball",
    "mua bán acc efootball",
    "efootball mobile",
    "acc efootball android",
    "acc efootball ios",
    "shop efootball uy tín",
  ],
  authors: [{ name: "THC eFootball Shop" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "THC eFootball Shop",
    title: "Shop Tài Khoản eFootball | Uy Tín – Giá Tốt",
    description:
      "Mua bán tài khoản eFootball Mobile uy tín, giá tốt. Đa dạng tài khoản Android & iOS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Tài Khoản eFootball | Uy Tín – Giá Tốt",
    description:
      "Mua bán tài khoản eFootball Mobile uy tín, giá tốt. Đa dạng tài khoản Android & iOS.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
