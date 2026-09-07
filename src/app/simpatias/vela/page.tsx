"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { hoursRemaining } from "@/lib/pedidos";
import { trackEvent } from "@/lib/analytics";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  color: string;
  created_at: string;
  finalized_at: string | null;
};

const BURN_HOURS = 24;

const HERO_PHRASES = [
  "pedir uma forcinha no amor",
  "abrir caminhos",
  "aquela oportunidade dar certo",
  "deixar uma fase para trás",
  "agradecer uma coisa boa",
];

const CATEGORIES = [
  {
    label: "Amor e afetos",
    desc: "Uma forcinha porque o coração também não trabalha sozinho.",
    placeholder: "Ex: que o amor colabore um pouquinho...",
  },
  {
    label: "Caminhos e oportunidades",
    desc: "Para aquela coisa que você queria muito que começasse a andar.",
    placeholder: "Ex: que aquela oportunidade dê certo...",
  },
  {
    label: "Paz e proteção",
    desc: "Para diminuir um pouco o barulho de fora. Ou o de dentro.",
    placeholder: "Ex: um pouco mais de paz esses dias...",
  },
  {
    label: "Mudanças e recomeços",
    desc: "Tem fase que já deu o que tinha que dar.",
    placeholder: "Ex: que eu consiga deixar isso para trás...",
  },
  {
    label: "Agradecer",
    desc: "Porque nem toda vela precisa começar com um problema.",
    placeholder: "Ex: agradecer por essa fase ter dado certo...",
  },
  {
    label: "Outra coisa",
    desc: "Você sabe qual é.",
    placeholder: "Ex: escreve do seu jeito...",
  },
];

const CANDLE_COLORS = [
  { key: "branca", label: "Branca", desc: "Paz, proteção e clareza." },
  { key: "verde", label: "Verde", desc: "Prosperidade e caminhos." },
  { key: "rosa", label: "Rosa", desc: "Amor e afetos." },
  { key: "roxa", label: "Roxa", desc: "Transformação." },
];

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        setText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          deleting = true;
          timeout = setTimeout(tick, 1500);
          return;
        }
        timeout = setTimeout(tick, 45);
      } else {
        charIndex--;
        setText(current.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeout = setTimeout(tick, 300);
          return;
        }
        timeout = setTimeout(tick, 25);
      }
    }

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, [phrases]);
  return text;
}

function statusOf(p: Pedido) {
  if (p.status === "finalizado") return "apagada" as const;
  const remaining = hoursRemaining(p.created_at, BURN_HOURS);
  return remaining > 0 ? ("acesa" as const) : ("apagada" as const);
}

function formatRemaining(hours: number) {
  if (hours <= 0) return "apagou agora";
  if (hours < 1) return `${Math.ceil(hours * 60)} min restantes`;
  return `${Math.ceil(hours)}h restantes`;
}

export default function VelaPage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [pedidoText, setPedidoText] = useState("");
  const [placeholder, setPlaceholder] = useState(CATEGORIES[0].placeholder);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [lit, setLit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);

  const heroTyped = useTypewriter(HERO_PHRASES);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    trackEvent("ritual_view", { ritual_type: "vela" });
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("ritual_type", "vela")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (!error && data) setPedidos(data as Pedido[]);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  // Apaga automaticamente (no banco) velas que já passaram das 24h.
  useEffect(() => {
    const expired = pedidos.filter((p) => p.status === "ativo" && hoursRemaining(p.created_at, BURN_HOURS) <= 0);
    if (expired.length === 0) return;
    const finalizedAt = new Date().toISOString();
    expired.forEach(async (p) => {
      await supabase.from("pedidos").update({ status: "finalizado", finalized_at: finalizedAt }).eq("id", p.id);
    });
    setPedidos((prev) =>
      prev.map((p) => (expired.some((e) => e.id === p.id) ? { ...p, status: "finalizado", finalized_at: finalizedAt } : p))
    );
  }, [pedidos, supabase]);

  const ativas = pedidos.filter((p) => statusOf(p) === "acesa");
  const apagadas = pedidos.filter((p) => statusOf(p) === "apagada");
  const detail = pedidos.find((p) => p.id === detailId) ?? null;

  function openWizard() {
    if (!userId) return;
    setWizardStep(0);
    setPedidoText("");
    setSelectedColor(null);
    setLit(false);
    setWizardOpen(true);
    trackEvent("ritual_start", { ritual_type: "vela" });
  }

  function closeWizard() {
    setWizardOpen(false);
  }

  function pickCategory(cat: (typeof CATEGORIES)[number]) {
    setPlaceholder(cat.placeholder);
    setWizardStep(1);
  }

  function pickColor(colorKey: string) {
    setSelectedColor(colorKey);
    setWizardStep(3);
  }

  async function handleLight() {
    if (!userId || !selectedColor || saving) return;
    const text = pedidoText.trim();
    if (!text) {
      showToast("Escreva seu pedido antes de acender.");
      setWizardStep(1);
      return;
    }
    setSaving(true);
    trackEvent("ritual_submit", { ritual_type: "vela" });
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        text,
        ritual_type: "vela",
        color: `vela-${selectedColor}`,
        rotation: 0,
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast("Não foi possível acender agora. Tenta de novo.");
      return;
    }
    setPedidos((prev) => [data as Pedido, ...prev]);
    setLit(true);
    trackEvent("ritual_complete", { ritual_type: "vela" });
    setTimeout(() => setWizardStep(4), 1400);
  }

  return (
    <div className="view">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Acender uma vela virtual funciona?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A vela virtual é uma experiência simbólica de entretenimento, inspirada em rituais populares. Não existe garantia de resultado — o universo ainda não oferece SLA.",
                },
              },
              {
                "@type": "Question",
                name: "Por quanto tempo a vela fica acesa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simbolicamente, por 24 horas. Depois disso ela aparece apagada no seu histórico, mas o pedido continua guardado na sua conta.",
                },
              },
              {
                "@type": "Question",
                name: "Posso acender mais de uma vela?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pode. Não existe limite de velas — você pode acender quantas quiser, para intenções diferentes.",
                },
              },
            ],
          }),
        }}
      />

      <div className="ritual-top-grid">
        <div>
          <div className="freezer-header">
            <h1 className="vela-hero-title">
              Acenda uma vela para <span className="vela-typed">{heroTyped}</span>
              <span className="vela-cursor">|</span>
            </h1>
            <p>
              Tem coisa que a gente resolve. Tem coisa que a gente conversa. E tem coisa que
              merece uma vela.
            </p>
            <p style={{ marginTop: 6 }}>
              Faça seu pedido, escolha a sua e deixe uma pequena chama acesa por isso. Não precisa
              saber se acredita. Só precisa ter alguma coisa em mente.
            </p>
            <div style={{ marginTop: 18 }}>
              <button className="btn-v2" disabled={!userId} onClick={openWizard}>
                Acender minha vela →
              </button>
            </div>
          </div>
        </div>

        <div className="freezer-layout">
          <div className="freezer-unit theme-vela">
            <div className="freezer-top">
              <div className="label">🕯️ Velas acesas</div>
              <button className="add-note-btn" disabled={!userId} onClick={openWizard}>
                + Acender vela
              </button>
            </div>

            <div className="shelf vela-shelf" style={{ minHeight: 230 }}>
              <span className="shelf-label">Altar</span>
              {loading ? (
                <div className="empty-shelf">Carregando...</div>
              ) : userId === null ? (
                <div className="vela-shelf-empty-example">
                  <div className="vela-item note-example vela-example-item">
                    <span className="note-example-tag">Exemplo</span>
                    <div className="vela-mini-stage vela-example-stage">
                      <div className="vela-candle-big vela-example-big vela-branca">
                        <div className="vela-wick-zone">
                          <div className="vela-flame-big vela-example-flame"></div>
                        </div>
                      </div>
                    </div>
                    <div className="vela-txt">que aquela oportunidade dê certo...</div>
                  </div>
                </div>
              ) : ativas.length === 0 ? (
                <div className="empty-shelf">Nenhuma vela acesa agora. Acenda a primeira pra começar.</div>
              ) : (
                ativas.map((p) => {
                  const remaining = hoursRemaining(p.created_at, BURN_HOURS);
                  return (
                    <div
                      key={p.id}
                      className="vela-item"
                      onClick={() => {
                        setDetailId(p.id);
                        trackEvent("ritual_open_saved", { ritual_type: "vela" });
                      }}
                    >
                      <div className="vela-mini-stage">
                        <div className={`vela-candle-big vela-mini-big ${p.color}`}>
                          <div className="vela-wick-zone">
                            <div className="vela-flame-big vela-mini-flame"></div>
                          </div>
                        </div>
                      </div>
                      <div className="vela-txt">{p.text}</div>
                      <div className="vela-remaining">{formatRemaining(remaining)}</div>
                    </div>
                  );
                })
              )}
            </div>

            {userId === null && (
              <div className="auth-error auth-error-inset">
                <span>Crie sua conta pra guardar suas velas com segurança — seu conteúdo é pessoal.</span>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <Link href="/login?next=/simpatias/vela" className="btn btn-ghost" style={{ whiteSpace: "nowrap" }}>
                    Entrar
                  </Link>
                  <Link href="/signup?next=/simpatias/vela" className="btn btn-dark" style={{ whiteSpace: "nowrap" }}>
                    Criar conta
                  </Link>
                </div>
              </div>
            )}

            <div className="freezer-foot">
              <span className="hint">Toque numa vela para ver os detalhes.</span>
            </div>
          </div>
        </div>
      </div>

      {userId !== null && (
        <div className="freezer-stats-row">
          <div className="stat-card-compact">
            <div className="num">{ativas.length}</div>
            <div className="lbl">velas acesas agora</div>
          </div>
          <div className="stat-card-compact">
            <div className="num">{apagadas.length}</div>
            <div className="lbl">velas já apagadas</div>
          </div>
        </div>
      )}

      <div className="seo-content">
        <p>
          Nem tudo precisa de uma decisão grande, uma conversa difícil ou uma solução imediata.
          Às vezes o que a gente quer é só um pequeno gesto de intenção — acender uma vela é
          exatamente isso. Aqui, essa vela é virtual, mas o gesto simbólico é o mesmo: um pedido,
          uma chama e um pouco de esperança.
        </p>

        <h2>O que é a simpatia da vela?</h2>
        <p>
          Acender velas com uma intenção específica é um dos rituais mais populares e antigos que
          existem, presente em praticamente todas as culturas. A cor da vela costuma carregar um
          significado — branca para paz e clareza, verde para prosperidade, rosa para amor, roxa
          para transformação — e o gesto de acender simboliza colocar aquela intenção em
          movimento.
        </p>
        <p>
          Diferente das outras simpatias do site, essa é mais aberta: serve para amor, trabalho,
          agradecimento, recomeços ou qualquer outra coisa que você tenha em mente.
        </p>

        <h2>Como funciona a vela virtual?</h2>
        <p>Para fazer sua simpatia virtual:</p>
        <ul>
          <li>Escolha uma intenção ou escreva a sua do seu jeito.</li>
          <li>Escreva seu pedido.</li>
          <li>Escolha a cor da vela.</li>
          <li>Leve o fósforo até o pavio para acender.</li>
        </ul>
        <p>
          Sua vela fica simbolicamente acesa por 24 horas, guardada na sua conta. Depois desse
          tempo, ela aparece apagada no seu histórico — mas o pedido continua lá.
        </p>

        <h2>Dúvidas sobre a vela virtual</h2>

        <details className="faq-item">
          <summary>
            <h3>Acender uma vela virtual funciona?</h3>
          </summary>
          <p>
            A vela virtual é uma experiência simbólica de entretenimento, inspirada em rituais
            populares. Não existe garantia de resultado — o universo ainda não oferece SLA.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Por quanto tempo a vela fica acesa?</h3>
          </summary>
          <p>
            Simbolicamente, por 24 horas. Depois disso ela aparece apagada no seu histórico, mas o
            pedido continua guardado na sua conta.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Posso acender mais de uma vela?</h3>
          </summary>
          <p>Pode. Não existe limite de velas — você pode acender quantas quiser, para intenções diferentes.</p>
        </details>

        <p className="seo-disclaimer">
          A Simpatia é uma experiência de entretenimento inspirada em simpatias populares e
          pequenos rituais simbólicos. Não existe garantia de resultado. Infelizmente o universo
          ainda não oferece SLA.
        </p>
      </div>

      {/* Modal: detalhe da vela */}
      <div className={`overlay ${detail ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setDetailId(null)}>
        {detail && (
          <div className="modal">
            <button className="modal-close" onClick={() => setDetailId(null)}>
              ✕
            </button>
            <h3>Sua vela</h3>
            <div className="vela-detail-stage">
              <div className={`vela-candle-big vela-detail-big ${detail.color}`}>
                <div className="vela-wick-zone">
                  {statusOf(detail) === "acesa" && <div className="vela-flame-big vela-detail-flame"></div>}
                </div>
              </div>
            </div>
            <div className={`detail-note-preview vela-detail ${detail.color}`}>{detail.text}</div>
            <div className="detail-days">
              {statusOf(detail) === "apagada" ? (
                <>Essa vela queimou por 24 horas e já se apagou. ✨</>
              ) : (
                <>Acesa — {formatRemaining(hoursRemaining(detail.created_at, BURN_HOURS))}.</>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-dark" onClick={() => setDetailId(null)} style={{ flex: 1 }}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard: acender vela */}
      <div className={`overlay ${wizardOpen ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && closeWizard()}>
        {wizardOpen && (
          <div className="modal modal-wide">
            <button className="modal-close" onClick={closeWizard}>
              ✕
            </button>

            {wizardStep === 0 && (
              <>
                <h3>O que essa vela vai iluminar hoje?</h3>
                <p className="desc">Escolha uma intenção ou escreva do seu jeito.</p>
                <div className="vela-category-grid">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.label} className="vela-category-card" onClick={() => pickCategory(cat)}>
                      <div className="vela-category-label">{cat.label}</div>
                      <div className="vela-category-desc">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {wizardStep === 1 && (
              <>
                <h3>Agora conta pra vela</h3>
                <p className="desc">
                  Pode escrever tudo. Ou só o suficiente para você saber do que está falando.
                </p>
                <textarea
                  value={pedidoText}
                  onChange={(e) => setPedidoText(e.target.value)}
                  placeholder={placeholder}
                  maxLength={140}
                  autoFocus
                />
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setWizardStep(0)}>
                    Voltar
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={!pedidoText.trim()}
                    onClick={() => setWizardStep(2)}
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {wizardStep === 2 && (
              <>
                <h3>Escolha sua vela</h3>
                <p className="desc">A cor carrega um significado — escolha a que combina com seu pedido.</p>
                <div className="vela-color-grid">
                  {CANDLE_COLORS.map((c) => (
                    <button
                      key={c.key}
                      className={`vela-color-card vela-${c.key}`}
                      onClick={() => pickColor(c.key)}
                    >
                      <span className="vela-color-swatch" />
                      <span className="vela-color-label">{c.label}</span>
                      <span className="vela-color-desc">{c.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setWizardStep(1)} style={{ flex: 1 }}>
                    Voltar
                  </button>
                </div>
              </>
            )}

            {wizardStep === 3 && selectedColor && (
              <LightStage
                colorKey={selectedColor}
                lit={lit}
                saving={saving}
                onLight={handleLight}
                onBack={() => setWizardStep(2)}
              />
            )}

            {wizardStep === 4 && (
              <>
                <div className="celebrate-icon">🕯️</div>
                <h3 style={{ textAlign: "center" }}>Pronto. Ela está acesa.</h3>
                <p className="desc" style={{ textAlign: "center" }}>
                  Seu pedido já ganhou uma chama. Agora deixa com ela, com o universo, com o acaso
                  ou com quem estiver de plantão.
                </p>
                <p className="desc" style={{ textAlign: "center", fontWeight: 700 }}>
                  Sua vela ficará acesa por 24 horas.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={closeWizard} style={{ flex: 1 }}>
                    Ver minha vela
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LightStage({
  colorKey,
  lit,
  saving,
  onLight,
  onBack,
}: {
  colorKey: string;
  lit: boolean;
  saving: boolean;
  onLight: () => void;
  onBack: () => void;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const matchRef = useRef<HTMLDivElement>(null);
  const wickRef = useRef<HTMLDivElement>(null);

  function onPointerDown(e: React.PointerEvent) {
    if (lit) return;
    setDragging(true);
    startRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setPos({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    const matchRect = matchRef.current?.getBoundingClientRect();
    const wickRect = wickRef.current?.getBoundingClientRect();
    if (matchRect && wickRect) {
      const cx = matchRect.left + matchRect.width / 2;
      const cy = matchRect.top + matchRect.height / 2;
      const overlaps =
        cx > wickRect.left - 20 && cx < wickRect.right + 20 && cy > wickRect.top - 20 && cy < wickRect.bottom + 20;
      if (overlaps) {
        onLight();
        return;
      }
    }
    setPos({ x: 0, y: 0 });
  }

  return (
    <>
      <h3>Agora é com você</h3>
      <p className="desc">Leve o fósforo até o pavio. Respira. Ou não — a gente não vai transformar isso numa obrigação.</p>
      <div className="vela-light-stage">
        <div className={`vela-candle-big vela-${colorKey} ${lit ? "is-lit" : ""}`}>
          <div ref={wickRef} className="vela-wick-zone">
            {lit && <div className="vela-flame-big"></div>}
          </div>
        </div>
        {!lit && (
          <div
            ref={matchRef}
            className="vela-match"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            🔥
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onBack} disabled={saving || lit} style={{ flex: 1 }}>
          Voltar
        </button>
      </div>
    </>
  );
}
