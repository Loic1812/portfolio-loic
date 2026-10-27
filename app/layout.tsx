import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description = `${SITE.slogan} ${SITE.sloganEnd} Portfolio de ${SITE.shortName}, développeur Full-Stack (Django, Next.js, Stripe).`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${SITE.shortName} — Full-Stack Developer · Django · Next.js`,
  description,
  openGraph: {
    title: `${SITE.shortName} — Full-Stack Developer`,
    description,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/loic.jpg", width: 900, height: 900, alt: SITE.shortName }],
  },
  twitter: {
    card: "summary",
    title: `${SITE.shortName} — Full-Stack Developer`,
    description,
    images: ["/loic.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

// Mode sombre par défaut. Ce script (exécuté avant l'affichage) respecte le choix
// "clair" déjà enregistré par le visiteur, sans clignotement.
const themeScript = `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`dark ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg">{children}</body>
    </html>
  );
}
