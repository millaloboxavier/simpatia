import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Simpatia de Soprar Canela Virtual: Atraia Dinheiro e Prosperidade | Simpatia",
  description:
    "Sopre a canela digital na tela para abrir caminhos financeiros. Atraia dinheiro, novas oportunidades e abundância com o nosso ritual virtual interativo.",
};

export default function AtrairPage() {
  return (
    <div className="view home-v2">
      <section className="hero-v2" style={{ textAlign: "center" }}>
        <div className="eyebrow-v2" style={{ justifyContent: "center" }}>
          ✦ Atrair
        </div>
        <h1 style={{ margin: "0 auto" }}>
          A Simpatia da <em>Canela</em> está quase pronta
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
