import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Simpatia do Pote de Mel com Pimenta Virtual: Conquiste o Crush | SimpatIA",
  description:
    "Coloque o nome do crush no pote de mel virtual, adicione pimenta e amarre com a fita vermelha digital. Faça o ritual online de amarração e atração amorosa.",
};

export default function ConquistarPage() {
  return (
    <div className="view home-v2">
      <section className="hero-v2" style={{ textAlign: "center" }}>
        <div className="eyebrow-v2" style={{ justifyContent: "center" }}>
          ✦ Conquistar
        </div>
        <h1 style={{ margin: "0 auto" }}>
          A Simpatia do <em>Mel e Pimenta</em> está quase pronta
        </h1>
        <p className="lead-v2" style={{ margin: "18px auto 0" }}>
          Estamos preparando esse ritual com carinho. Enquanto isso, que tal experimentar a
          Simpatia do Congelador?
        </p>
        <div className="hero-v2-ctas" style={{ justifyContent: "center", display: "flex" }}>
          <Link href="/congelador" className="btn-v2">
            Ir para o Congelador →
          </Link>
        </div>
      </section>
    </div>
  );
}
