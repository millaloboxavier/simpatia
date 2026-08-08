import Link from "next/link";

export default function Home() {
  return (
    <div className="view">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Simpatias, do jeito de hoje</div>
            <h1>
              Congela o que <span className="hand">pesa</span>,<br />
              descongela quando <span className="hand">passar</span>.
            </h1>
            <p className="lead">
              SimpatIA é onde suas simpatias ganham forma, acompanhamento e um fechamento de
              verdade. Escreva o que quer resolver, guarde no congelador virtual e veja os dias
              passarem — até o dia de comemorar.
            </p>
            <div className="hero-ctas">
              <Link href="/congelador" className="btn btn-primary">
                Abrir meu congelador 🧊
              </Link>
              <Link href="/painel" className="btn btn-ghost">
                Ver minhas simpatias
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mini-freezer">
              <div className="mini-handle"></div>
              <div className="mini-note">
                aquele desafeto que some da minha vida<span className="mini-days">12 dias</span>
              </div>
              <div className="mini-note">
                ansiedade antes da entrevista<span className="mini-days">3 dias</span>
              </div>
              <div className="mini-note">
                fofoca no trabalho<span className="mini-days">27 dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase">
        <div className="eyebrow">Vitrine</div>
        <h2>Escolha sua simpatia</h2>
        <p className="showcase-sub">
          Cada simpatia tem seu próprio ritual. Por enquanto, a Simpatia do Congelador está
          pronta pra usar — as outras estão sendo preparadas com o mesmo carinho.
        </p>

        <div className="cards">
          <Link href="/congelador" className="card freezer-card clickable">
            <span className="badge live">Disponível</span>
            <div className="icon">🧊</div>
            <h3>Simpatia do Congelador</h3>
            <p>
              Escreva o que quer congelar num post-it, guarde na geladeira virtual e acompanhe
              quantos dias já se passaram. Quando resolver, descongele e comemore.
            </p>
          </Link>
          <div className="card soon">
            <span className="badge soon">Em breve</span>
            <div className="icon">🕯️</div>
            <h3>Vela do Amor</h3>
            <p>Acenda uma vela virtual por alguém especial e acompanhe a chama queimar em tempo real.</p>
          </div>
          <div className="card soon">
            <span className="badge soon">Em breve</span>
            <div className="icon">🫙</div>
            <h3>Jarro da Prosperidade</h3>
            <p>Junte moedinhas simbólicas todos os dias e veja o jarro encher enquanto sua intenção cresce.</p>
          </div>
          <div className="card soon">
            <span className="badge soon">Em breve</span>
            <div className="icon">🎗️</div>
            <h3>Fita do Bonfim</h3>
            <p>Amarre um pedido numa fita virtual com três nós — um por desejo — e acompanhe até ela se soltar.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
