# Simpatia — Mapa de eventos do Analytics

Referência de onde cada evento do GA4 é disparado no site. Todos passam pela função central `trackEvent()` em `src/lib/analytics.ts`.

| Evento | Onde acontece (visual) | Onde está no código |
|---|---|---|
| `cta_fazer_simpatia` | Home → clique no botão "Fazer uma Simpatia →" (hero, topo da página) | `src/components/HeroCta.tsx` |
| `ritual_view` | Carregou a página do ritual (automático, sem precisar clicar em nada) | `src/app/congelador/page.tsx`, `src/app/simpatias/conquistar/page.tsx` |
| `ritual_start` | Clique no botão de adicionar (abre o modal) | idem |
| `ritual_submit` | Clique em confirmar dentro do modal (dispara antes de salvar) | idem |
| `ritual_complete` | Mesmo botão de confirmar → dispara depois que salvou com sucesso | idem |
| `ritual_open_saved` | Clique num post-it/pote já existente (abre o modal de detalhe) — mede abertura de um pedido salvo, não necessariamente retorno ao site em outra sessão | idem |
| `ritual_unfreeze` | Modal de detalhe de um pedido ativo → clique em finalizar (nome genérico mantido entre rituais pra comparar o funil) | idem |

Todos os eventos acima carregam `{ ritual_type: "congelador" }` ou `{ ritual_type: "mel_pimenta" }` conforme a página. Os dois rituais compartilham a mesma tabela `pedidos` no Supabase, filtrando por `ritual_type`.
| `sign_up` | Página de Criar conta (`/signup`) → clique em "Criar conta" (form) ou em "Continuar com Google/Facebook" | `src/components/AuthForm.tsx` |
| `login` | Página de Entrar (`/login`) → clique em "Entrar" (form) ou em "Continuar com Google/Facebook" | `src/components/AuthForm.tsx` |

## Como conferir ao vivo

1. Abra o site numa aba anônima
2. Vá em analytics.google.com → Relatórios → **Tempo real**
3. Clique nos botões/ações da tabela acima, um de cada vez
4. Cada evento deve aparecer na seção "Contagem de eventos por Nome do evento" em poucos segundos

## Convenção pra novos eventos

Sempre que um novo ritual for criado (ex: Canela), repetir o mesmo padrão de nomes trocando só o `ritual_type`:
- `ritual_view`, `ritual_start`, `ritual_submit`, `ritual_complete`, `ritual_open_saved`, `ritual_unfreeze` com `{ ritual_type: "canela" }`

Nunca mandar o texto do pedido em si como parâmetro — só metadados seguros (tipo do ritual, método de login, etc.).
