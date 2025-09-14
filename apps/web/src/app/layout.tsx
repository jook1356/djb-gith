import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { ThemeProvider } from "@/components/Theme";
import Header from "@/components/Header/Header";
import styles from "./layout.module.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "김동주의 개발 블로그 | 프론트엔드 & 백엔드 개발 이야기",
    template: "%s | 김동주의 개발 블로그"
  },
  description: "프론트엔드, 백엔드 개발 경험과 인사이트를 공유하는 개발자 김동주의 기술 블로그입니다. React, Node.js, TypeScript 등 실무 경험을 바탕으로 한 깊이 있는 기술 콘텐츠를 제공합니다.",
  keywords: [
    "개발 블로그", "프론트엔드", "백엔드", "React", "Next.js", "Node.js", 
    "TypeScript", "JavaScript", "웹 개발", "소프트웨어 엔지니어링",
    "김동주", "개발자", "기술 블로그", "프로그래밍", "코딩"
  ],
  authors: [{ name: "김동주", url: "https://jook1356.github.io/djb-gith" }],
  creator: "김동주",
  publisher: "김동주",
  applicationName: "김동주의 개발 블로그",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://jook1356.github.io/djb-gith",
    title: "김동주의 개발 블로그 | 프론트엔드 & 백엔드 개발 이야기",
    description: "프론트엔드, 백엔드 개발 경험과 인사이트를 공유하는 개발자 김동주의 기술 블로그입니다.",
    siteName: "김동주의 개발 블로그",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "김동주의 개발 블로그",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김동주의 개발 블로그",
    description: "프론트엔드, 백엔드 개발 경험과 인사이트를 공유하는 기술 블로그",
    images: ["/og-image.jpg"],
    creator: "@jook1356",
    site: "@jook1356",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "naver-site-verification": "your-naver-verification-code",
    },
  },
  alternates: {
    canonical: "https://jook1356.github.io/djb-gith",
    languages: {
      "ko-KR": "https://jook1356.github.io/djb-gith",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <div className={styles["main"]}>
              <div className={styles["content-wrapper"]}>
                <div className={styles["content"]}>{children}</div>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
