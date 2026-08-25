import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Merriweather } from "next/font/google";
import AotCursor from "@/components/AotCursor";
import ContinuousNav from "@/components/ContinuousNav";
import JsonLd from "@/components/JsonLd";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import SiteIntro from "@/components/SiteIntro";
import { FIRST_ENTER_BOOT_SCRIPT, FIRST_ENTER_CRITICAL_CSS } from "@/lib/first-enter";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/home";
import { siteGraph } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "AllOfTech",
    "tech agency",
    "AI agency",
    "web development agency",
    "mobile app agency",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    locale: SITE_LOCALE,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  icons: {
    icon: [
      { url: "/images/new-Logo_tab.png", type: "image/png" },
      { url: "/images/favicon.ico" },
    ],
    shortcut: "/images/favicon.ico",
    apple: "/images/new-Logo_tab.png",
  },
  manifest: "/manifest.webmanifest",
  other: {
    contact: CONTACT_EMAIL,
    "geo.region": "BD-13",
    "geo.placename": "Dhaka",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050510" },
    { media: "(prefers-color-scheme: light)", color: "#050510" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${merriweather.variable} ${merriweather.className}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/images/new-Logo_tab.png" fetchPriority="high" />
        <style dangerouslySetInnerHTML={{ __html: FIRST_ENTER_CRITICAL_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: FIRST_ENTER_BOOT_SCRIPT }} />
      </head>
      <body id="top" className="aot-float-header">
        <SiteIntro />
        <Script
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          strategy="afterInteractive"
        />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NCS3V55K');`}
        </Script>
        <JsonLd data={siteGraph()} />
        <SiteChrome />
        {children}
        <SiteFooter />
        <ContinuousNav />
        <AotCursor />
      </body>
    </html>
  );
}
