import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";

const isPreview = process.env.INDEX_PREVIEW === "true";
const basePath = isPreview ? "/INDEX_WORLD" : "";

export const metadata: Metadata = {
  metadataBase: new URL("https://indexworld.app"),
  title: "INDEX WORLD™ | 세상을 숫자로 보다",
  description: "세계 각국의 데이터를 검색하고 비교하고 발견하는 글로벌 데이터 플랫폼입니다.",
  alternates: { canonical: "/" },
  manifest: `${basePath}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "16x16 32x32 48x48" },
      { url: `${basePath}/icons/favicon-16x16.png`, type: "image/png", sizes: "16x16" },
      { url: `${basePath}/icons/favicon-32x32.png`, type: "image/png", sizes: "32x32" },
      { url: `${basePath}/icons/favicon-48x48.png`, type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: `${basePath}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
    shortcut: `${basePath}/favicon.ico`,
  },
  openGraph: {
    title: "INDEX WORLD™",
    description: "세상을 숫자로 보다.",
    url: "https://indexworld.app",
    siteName: "INDEX WORLD",
    locale: "ko_KR",
    type: "website",
  },
  robots: isPreview
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f3ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body><LocaleProvider>{children}</LocaleProvider></body>
    </html>
  );
}
