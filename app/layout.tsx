import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://indexworld.app"),
  title: "INDEX WORLD™ | 세상을 숫자로 보다",
  description: "세계 각국의 데이터를 검색하고 비교하고 발견하는 글로벌 데이터 플랫폼입니다.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "INDEX WORLD™",
    description: "세상을 숫자로 보다.",
    url: "https://indexworld.app",
    siteName: "INDEX WORLD",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f3ee",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
