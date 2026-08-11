import Link from "next/link";
import { posts } from "@/lib/posts";

export default function Home() {
  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="view home-v2">
      <section className="hero-v2">
        <div className="hero-v2-grid">
          <div>
            <h1>
              <em>Magia</em> virtual para os <em>dramas</em> da vida real
            </h1>
            <p className="lead-v2">
              Simpatias online para aqueles momentos em que uma ajudinha do Universo cairia bem.
            </p>
            <div className="hero-v2-ctas">
              <Link href="#vitrine" className="btn-v2">
                Pedir ajuda ao Universo →
              </Link>
            </div>
          </div>
          <div>
            <div className="eyebrow-v2 hero-illustration-caption">
              ✦ O que você quer jogar pro <em>Universo</em>?
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://kybevdzcpplztwyozsqi.supabase.co/storage/v1/object/public/Site%20Assets/img%20Header.png"
              alt="Pote de vidro com pimenta e post-its representando um pedido enviado ao Universo"
              className="hero-illustration"
            />
          </div>
        </div>
      </section>

      <section className="helper-block">
        <div className="eyebrow-v2">✦ Como funciona</div>
        <h2>Uma ajudinha nunca é demais</h2>
        <p className="lead-v2">Aqui você não vem só ler uma simpatia. Você faz.</p>
        <div className="helper-grid">
          <div className="helper-steps">Escreve. Arrasta. Acende. Sopra.</div>
          <div className="helper-note">
            <b>Cada simpatia é um ritual</b>
            Porque aparentemente agora até o Universo recebe pedido online.
          </div>
        </div>
      </section>

      <section className="showcase-v2" id="vitrine">
        <h2>Escolha sua simpatia</h2>
        <p className="lead-v2">
          Crush não responde? Reunião marcada sexta às 17h? Dinheiro evaporando antes do fim do
          mês?
        </p>
        <div className="eyebrow-v2">✦ Tem uma simpatia pra isso</div>

        <div className="simpatia-cards">
          <Link href="/simpatias/conquistar" className="simpatia-card card-lilas">
            <span className="tag-v2">Conquistar</span>
            <div className="icon-v2">🍯</div>
            <h3>Quero conquistar o crush</h3>
            <p>Simpatia do mel e pimenta, para fazer o crush se apaixonar.</p>
            <span className="go-v2">Quero conquistar →</span>
          </Link>
          <Link href="/simpatias/atrair" className="simpatia-card card-sorte">
            <span className="tag-v2">Atrair</span>
            <div className="icon-v2">✨</div>
            <h3>Quero atrair coisa boa</h3>
            <p>Simpatia da canela para atrair dinheiro, oportunidades e abundância.</p>
            <span className="go-v2">Quero atrair →</span>
          </Link>
          <Link href="/congelador" className="simpatia-card card-azul">
            <span className="tag-v2">Afastar</span>
            <div className="icon-v2">🧊</div>
            <h3>Quero evitar que algo aconteça</h3>
            <p>Simpatia do congelador para impedir ou afastar pessoa, situação ou acontecimento indesejado.</p>
            <span className="go-v2">Quero congelar →</span>
          </Link>
        </div>
      </section>

      <section className="blog-teaser">
        <h2>A gente foi procurar uma simpatia. Voltou com um Blog.</h2>
        <div className="blog-teaser-grid">
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-teaser-card">
              <h4>{post.title}</h4>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
        <div className="blog-teaser-cta">
          <Link href="/blog" className="btn-v2">
            Ir para o Blog →
          </Link>
        </div>
      </section>

      <section className="quote-block">
        <div className="eyebrow-v2">✦ entre nós e o Universo</div>
        <p>
          A gente sabe. Pode ser coincidência. Talvez sua avó estivesse certa. Talvez colocar um
          nome no congelador numa reunião não tenha nenhuma relação com aquela reunião ter sido
          cancelada.
        </p>
        <p className="emphasis">Mas ela foi cancelada. A gente prefere não estragar a história.</p>
      </section>
    </div>
  );
}
