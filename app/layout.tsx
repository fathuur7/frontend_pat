import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Fredoka } from "next/font/google";
import "./globals.css";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const fredoka = Fredoka({
  variable: "--font-bubbly",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false, // secondary decorative font – load after LCP
});

// ── Viewport (separate from Metadata in Next 14+) ─────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f5" },
    { media: "(prefers-color-scheme: dark)",  color: "#222210" },
  ],
  colorScheme: "light dark",
};

// ── Metadata ──────────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadasaku.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Core
  title: {
    default: "NadaSaku – Watch Anime & Animated Series",
    template: "%s | NadaSaku",
  },
  description:
    "The world's first premium streaming service built entirely for animation fans. "
    + "Stream anime, sci-fi series, action originals and more – ad-free.",
  keywords: [
    "anime streaming",
    "animated series",
    "comic style player",
    "NadaSaku",
    "watch anime online",
    "sci-fi movies",
    "action series",
  ],
  authors: [{ name: "NadaSaku Media Inc.", url: BASE_URL }],
  creator: "NadaSaku Media Inc.",
  publisher: "NadaSaku Media Inc.",

  // ── Indexing
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

  // ── Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "NadaSaku",
    title: "NadaSaku – Watch Anime & Animated Series",
    description:
      "Premium streaming for animation fans. Anime, sci-fi, action originals – ad-free.",
    images: [
      {
        url: "/og-image.png",   // place a 1200×630 image in /public
        width: 1200,
        height: 630,
        alt: "NadaSaku – Premium Animation Streaming",
      },
    ],
  },

  // ── Twitter / X
  twitter: {
    card: "summary_large_image",
    site: "@nadasaku",
    creator: "@nadasaku",
    title: "NadaSaku – Watch Anime & Animated Series",
    description:
      "Premium streaming for animation fans. Anime, sci-fi, action originals – ad-free.",
    images: ["/og-image.png"],
  },

  // ── Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── Manifest
  manifest: "/manifest.json",

  // ── Canonical
  alternates: { canonical: "/" },
};

// ── JSON-LD structured data ────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NadaSaku",
  url: BASE_URL,
  description:
    "The world's first premium streaming service built entirely for animation fans.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

// ── Root layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN for Material Symbols */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router layout loads this for every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${
          spaceGrotesk.variable
        } ${fredoka.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
