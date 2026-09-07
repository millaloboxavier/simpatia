import type { Metadata } from "next";
import Script from "next/script";
import "./simpatia.css";
import Nav from "@/components/Nav";
import Toaster from "@/components/Toaster";
import { LOGO_URL } from "@/lib/brand";

const SITE_URL = "https://simpatia.me";
const GA_MEASUREMENT_ID = "G-H151JBDKRN";
const FAVICON_URL =
  "https://kybevdzcpplztwyozsqi.supabase.co/storage/v1/object/public/Site%20Assets/favicon.png";
const TITLE = "Simpatias online | Magia virtual para os dramas da vida real";
const DESCRIPTION =
  "Faça simpatias online e rituais virtuais para amor, prosperidade, afastamento e os dramas da vida real. Escolha uma simpatia e faça na hora.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Simpatia",
  },
  description: DESCRIPTION,
  icons: {
    icon: FAVICON_URL,
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Simpatia",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: LOGO_URL }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [LOGO_URL],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Sora:wght@400;500;600;700&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <div className="app">
          <Nav />
          <main className="container" style={{ flex: 1 }}>
            {children}
          </main>
          <footer>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="Simpatia"
              style={{ height: 24, width: "auto", margin: "0 auto 10px", opacity: 0.8 }}
            />
            <div>Magia virtual para os dramas da vida real</div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
