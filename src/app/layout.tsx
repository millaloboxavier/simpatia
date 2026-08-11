import type { Metadata } from "next";
import "./simpatia.css";
import Nav from "@/components/Nav";
import Toaster from "@/components/Toaster";
import { LOGO_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "SimpatIA — congele o que precisa resolver",
  description:
    "SimpatIA é onde suas simpatias ganham forma, acompanhamento e um fechamento de verdade. Comece pela Simpatia do Congelador.",
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
