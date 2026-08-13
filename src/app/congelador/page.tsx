"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { daysFrozen as computeDaysFrozen } from "@/lib/pedidos";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  color: string;
  rotation: number;
  created_at: string;
  finalized_at: string | null;
};

const COLORS = ["color-amber", "color-mint", "color-coral"];

function daysFrozen(p: Pedido) {
  return computeDaysFrozen(p.created_at, p.finalized_at, p.status);
}

function frostOpacity(days: number) {
  if (days <= 0) return 0;
  return Math.min(0.95, 0.55 + days * 0.03);
}

export default function CongeladorPage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<{ text: string; days: number } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

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

  const ativos = pedidos.filter((p) => p.status === "ativo");
  const finalizados = pedidos.filter((p) => p.status === "finalizado");
  const detail = pedidos.find((p) => p.id === detailId) ?? null;

  async function handleAdd() {
    const text = noteInput.trim();
    if (!text) {
      showToast("Escreva algo antes de congelar.");
      return;
    }
    if (!userId) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        text,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Number((Math.random() * 6 - 3).toFixed(1)),
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      showToast("Não foi possível congelar. Tenta de novo.");
      return;
    }
    setPedidos((prev) => [data as Pedido, ...prev]);
    setShowAdd(false);
    setNoteInput("");
    showToast("Pedido congelado ❄️");
  }

  async function handleFinalize() {
    if (!detail) return;
    const finalizedAt = new Date().toISOString();
    const { error } = await supabase
      .from("pedidos")
      .update({ status: "finalizado", finalized_at: finalizedAt })
      .eq("id", detail.id);
    if (error) {
      showToast("Não foi possível finalizar agora.");
      return;
    }
    const updated: Pedido = { ...detail, status: "finalizado", finalized_at: finalizedAt };
    setPedidos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDetailId(null);
    setCelebrate({ text: updated.text, days: daysFrozen(updated) });
  }

  function shareMessage(text: string, days: number) {
    return `Descongelei uma simpatia no Simpatia.me: "${text}" — resolvido depois de ${days} dia${days === 1 ? "" : "s"}! 🎉`;
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
                name: "A simpatia do congelador funciona?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode funcionar como um gesto simbólico para organizar sentimentos, reforçar uma decisão ou marcar que você não quer mais alimentar determinada situação.",
                },
              },
              {
                "@type": "Question",
                name: "Preciso escrever o nome completo da pessoa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. Você pode escrever um primeiro nome, apelido, iniciais ou até descrever uma situação, como 'fofoca no trabalho', 'reunião que poderia ser um e-mail' ou 'pensamentos sobre o ex'. Use o que representar melhor aquilo que você deseja esfriar.",
                },
              },
              {
                "@type": "Question",
                name: "Posso desfazer a simpatia depois?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pode. Se a situação mudar, você se arrepender ou simplesmente sentir que o drama já descongelou sozinho, é possível retirar o pedido do seu congelador virtual.",
                },
              },
            ],
          }),
        }}
      />
      <div className="freezer-header">
        <h1>Simpatia do congelador: para dar um gelo no que está incomodando</h1>
        <p>
          Uma simpatia para &ldquo;congelar&rdquo; pensamentos, situações ou pessoas que estão te
          tirando a paz e dar um tempo emocional enquanto tudo se acalma.
        </p>
      </div>

      {userId === null && (
        <div
          className="auth-error"
          style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <span>Faça login para criar e guardar seus pedidos com segurança — seu conteúdo é pessoal.</span>
          <Link href="/login?next=/congelador" className="btn btn-dark" style={{ whiteSpace: "nowrap" }}>
            Entrar
          </Link>
        </div>
      )}

      <div className="freezer-layout">
        <div className="freezer-unit">
          <div className="freezer-handle"></div>
          <div className="freezer-top">
            <div className="label">🧊 Congelador — ativos</div>
            <button
              className="add-note-btn"
              disabled={!userId}
              onClick={() => {
                setNoteInput("");
                setShowAdd(true);
              }}
            >
              + Adicionar pedido
            </button>
          </div>

          <div className="shelf" style={{ minHeight: 230 }}>
            <span className="shelf-label">Prateleira de cima</span>
            {loading ? (
              <div className="empty-shelf">Carregando...</div>
            ) : ativos.length === 0 ? (
              <div className="empty-shelf">
                {userId
                  ? "Vazio por enquanto. Adicione o primeiro pedido pra começar a congelar."
                  : "Faça login para ver seus pedidos congelados."}
              </div>
            ) : (
              ativos.map((p) => {
                const days = daysFrozen(p);
                return (
                  <div
                    key={p.id}
                    className={`note ${p.color}`}
                    style={{ "--r": `${p.rotation}deg` } as React.CSSProperties}
                    onClick={() => setDetailId(p.id)}
                  >
                    <div className="pin"></div>
                    <div className="frost-overlay" style={{ opacity: frostOpacity(days) }}></div>
                    <div className="txt">{p.text}</div>
                    <div className="days-tag">
                      {days} dia{days === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="freezer-foot">
            <span className="hint">Toque num post-it para ver os detalhes ou descongelar.</span>
          </div>
        </div>
      </div>

      <div className="freezer-stats-row">
        <div className="stat-card-compact">
          <div className="num">{ativos.length}</div>
          <div className="lbl">pedidos congelados agora</div>
        </div>
        <div className="stat-card-compact">
          <div className="num">{finalizados.length}</div>
          <div className="lbl">simpatias já descongeladas</div>
        </div>
      </div>

      <div className="seo-content">
        <p>
          Tem pessoa, situação ou pensamento que já passou da validade, mas continua ocupando
          espaço na sua vida? A simpatia do congelador é um ritual popular usado por quem deseja
          afastar uma presença inconveniente, interromper conflitos ou simplesmente esfriar um
          drama que anda quente demais. No Simpatia.me, você pode fazer esse gesto simbólico de um
          jeito virtual, privado e sem precisar explicar por que existe um nome misterioso ao
          lado do feijão congelado.
        </p>

        <h2>O que é a simpatia do congelador?</h2>
        <p>
          A simpatia do congelador parte de uma associação bem direta: congelar algo significa
          paralisar, esfriar ou impedir que continue agindo. Tradicionalmente, a pessoa escreve
          em um papel o nome de alguém ou a situação que deseja afastar e coloca esse pedido no
          congelador.
        </p>
        <p>
          Existem diferentes versões dessa simpatia popular, com ingredientes e modos de fazer
          variados. Mas a intenção costuma ser a mesma: criar um marco simbólico para colocar
          limites, diminuir uma influência indesejada ou deixar um problema em pausa enquanto a
          vida segue.
        </p>

        <h2>Como funciona a simpatia do congelador virtual?</h2>
        <p>
          Aqui, o ritual acontece na tela — sem potes suspeitos, vazamentos ou perguntas de quem
          abriu o freezer. Para fazer sua simpatia virtual:
        </p>
        <ul>
          <li>Escreva o nome da pessoa, situação ou problema que você quer esfriar.</li>
          <li>Coloque sua intenção no post-it virtual.</li>
          <li>Arraste o papel até o congelador.</li>
          <li>Feche a porta e deixe o universo processar a solicitação.</li>
        </ul>
        <p>
          Seu ritual fica guardado na sua conta para que você possa voltar quando quiser. A
          experiência é simbólica e feita para trazer um pequeno momento de intenção, humor e
          alívio em meio aos dramas da vida real.
        </p>

        <h2>Dúvidas sobre a simpatia do congelador</h2>

        <details className="faq-item">
          <summary>
            <h3>A simpatia do congelador funciona?</h3>
          </summary>
          <p>
            Simpatias fazem parte da cultura popular e não têm resultado garantido. O ritual pode
            funcionar como um gesto simbólico para organizar sentimentos, reforçar uma decisão ou
            marcar que você não quer mais alimentar determinada situação. O universo,
            infelizmente, ainda não fornece protocolo de atendimento.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Preciso escrever o nome completo da pessoa?</h3>
          </summary>
          <p>
            Não. Você pode escrever um primeiro nome, apelido, iniciais ou até descrever uma
            situação, como &ldquo;fofoca no trabalho&rdquo;, &ldquo;reunião que poderia ser um
            e-mail&rdquo; ou &ldquo;pensamentos sobre o ex&rdquo;. Use o que representar melhor
            aquilo que você deseja esfriar.
          </p>
        </details>

        <details className="faq-item">
          <summary>
            <h3>Posso desfazer a simpatia depois?</h3>
          </summary>
          <p>
            Pode. Se a situação mudar, você se arrepender ou simplesmente sentir que o drama já
            descongelou sozinho, é possível retirar o pedido do seu congelador virtual. Aqui,
            nenhuma decisão precisa ficar congelada para sempre.
          </p>
        </details>

        <p className="seo-disclaimer">
          O Simpatia.me oferece experiências simbólicas para entretenimento e reflexão. Não fazemos
          promessas de resultado — nem o universo assinou esse SLA.
        </p>
      </div>

      {/* Modal: adicionar pedido */}
      <div className={`overlay ${showAdd ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
        <div className="modal">
          <button className="modal-close" onClick={() => setShowAdd(false)}>
            ✕
          </button>
          <h3>Novo pedido pro congelador</h3>
          <p className="desc">
            Escreva com suas palavras o que você quer congelar. Pode ser uma pessoa, uma situação
            ou um sentimento.
          </p>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Ex: a ansiedade que não me deixa dormir..."
            maxLength={140}
          />
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" disabled={saving} onClick={handleAdd}>
              Congelar 🧊
            </button>
          </div>
        </div>
      </div>

      {/* Modal: detalhe */}
      <div className={`overlay ${detail ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setDetailId(null)}>
        {detail && (
          <div className="modal">
            <button className="modal-close" onClick={() => setDetailId(null)}>
              ✕
            </button>
            <h3>Seu pedido</h3>
            <div className={`detail-note-preview ${detail.color}`}>{detail.text}</div>
            <div className="detail-days">
              {detail.status === "finalizado" ? (
                <>
                  Ficou congelado por <b>{daysFrozen(detail)} dia{daysFrozen(detail) === 1 ? "" : "s"}</b> antes de ser
                  resolvido. ✅
                </>
              ) : (
                <>
                  Congelado há <b>{daysFrozen(detail)} dia{daysFrozen(detail) === 1 ? "" : "s"}</b>.
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>
                Deixar congelado
              </button>
              {detail.status !== "finalizado" && (
                <button className="btn btn-dark" onClick={handleFinalize}>
                  Descongelar e finalizar ✨
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: celebração */}
      <div className={`overlay ${celebrate ? "active" : ""}`} onClick={(e) => e.target === e.currentTarget && setCelebrate(null)}>
        {celebrate && (
          <div className="modal">
            <button className="modal-close" onClick={() => setCelebrate(null)}>
              ✕
            </button>
            <div className="celebrate-icon">🎉</div>
            <h3 style={{ textAlign: "center" }}>Descongelou!</h3>
            <p className="desc" style={{ textAlign: "center" }}>
              Sua simpatia foi finalizada. Que bom que resolveu.
            </p>
            <div className="share-card">
              <div className="sc-eyebrow">Simpatia do Congelador</div>
              <div className="sc-txt">&quot;{celebrate.text}&quot;</div>
              <div className="sc-days">
                Resolvido depois de {celebrate.days} dia{celebrate.days === 1 ? "" : "s"} no congelador.
              </div>
            </div>
            <div className="share-row">
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/?text=" + encodeURIComponent(shareMessage(celebrate.text, celebrate.days)),
                    "_blank"
                  )
                }
              >
                Compartilhar no WhatsApp
              </button>
              <button
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(shareMessage(celebrate.text, celebrate.days))
                    .then(() => showToast("Resultado copiado!"))
                    .catch(() => showToast("Não foi possível copiar."))
                }
              >
                Copiar resultado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
