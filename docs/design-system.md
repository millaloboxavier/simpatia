# Simpatia — Design System

Referência viva do sistema visual do site, extraída de `src/app/simpatia.css`. Serve pra manter consistência entre páginas e como base pra recriar os estilos no Figma.

## Cores

Ver `docs/paleta-de-cores.md` para a lista completa de hex codes e variáveis. Resumo de uso:

| Papel | Cor |
|---|---|
| Fundo padrão | Creme Vela `#F9EFE7` |
| Fundo alternado | Verde Ervas `#E2E1D4` |
| Título / destaque principal | Verde Feitiço `#173F35` |
| Texto padrão | Preto Universo `#0B1D19` |
| Texto secundário | Cinza Bruma `#616F6B` |
| Cor de destaque / CTA | Roxo Feitiço `#6C2B6B` |
| Fundo escuro (seções) | Verde Feitiço / Preto Universo |
| Título sobre fundo escuro | Creme Desejo `#F9D5C1` |
| Texto sobre fundo escuro | rgba(249,239,231,0.9) |

## Tipografia

Três famílias, cada uma com um papel fixo — não misturar fora desse uso:

| Fonte | Uso | Peso padrão |
|---|---|---|
| **Fraunces** (serifada) | Títulos (H1, H2, H3), números de destaque | 700 |
| **Sora** (sans-serif) | Corpo de texto, botões, labels, UI | 400–700 |
| **Caveat** (cursiva/manuscrita) | Frases de tom pessoal/manuscrito — usar com moderação, nunca em blocos longos | 500–700 |

### Escala de tamanhos

| Elemento | Tamanho |
|---|---|
| H1 (todas as páginas) | `clamp(36px, 6-9vw, 50px)` — responsivo |
| H2 (seções da home) | ~32px |
| H2 (conteúdo de post do blog) | 32px |
| H3 (cards) | 24px |
| Corpo de texto | 15.5–16.5px |
| Legendas / labels | 12–13.5px |

### Regra de cor dos títulos
H1 e H2 usam sempre `var(--green-deep)` (Verde Feitiço), peso 700 — regra global, não sobrescrever por página.

## Espaçamento e grid

- Container principal: `max-width:1120px; padding:0 18px;`
- Grids de duas colunas (hero, congelador): proporção assimétrica (`0.6fr 1fr` ou `0.9fr 1.1fr`), `gap` entre 16–48px conforme o contexto, sempre colapsando pra 1 coluna abaixo de 860px
- Cards em grid usam `gap` de 14–24px

## Raios de borda (border-radius)

| Contexto | Raio |
|---|---|
| Cards grandes / seções (helper-block, quote-block, simpatia-card) | 24–28px |
| Cards menores (stat-card, post-it de detalhe) | 12–16px |
| Botões / pills / badges | 100px (totalmente arredondado) |

## Sombras

Sombra padrão de elevação: `--shadow: 0 10px 30px rgba(15,46,54,0.12)` — usada em cards e no congelador.
Sombras de botão usam a cor do próprio botão em baixa opacidade (ex: `0 8px 20px rgba(108,43,107,0.35)` no botão roxo).

## Componentes principais

| Componente | Onde vive no CSS | Notas |
|---|---|---|
| `.btn` / `.btn-primary` / `.btn-ghost` / `.btn-dark` | Botões de ação, várias páginas | Sempre com hover de leve elevação/darken |
| `.simpatia-card` | Cards da vitrine (home) | Borda 1.5px Verde Feitiço, hover translateY |
| `.stat-card-compact` | Números/estatísticas | Fundo `--paper`, borda sutil |
| `.freezer-unit` | Widget do congelador | Fundo azul sereno sólido (não gradiente) |
| `.note` | Post-it dentro do congelador | Rotação aleatória leve, cores alternadas (âmbar/menta/coral) |
| `.tag-v2` / badges | Selos de categoria nos cards | Pill totalmente arredondado |
| `.faq-item` (`<details>`) | Acordeões de FAQ | HTML nativo, sem JS |

## Hover states (padrão consistente)

Todos os elementos clicáveis seguem o mesmo padrão: leve `translateY(-2px a -3px)` + mudança de cor/sombra, transição `0.15–0.2s ease`. Não usar scale() nem animações mais chamativas.

## Como usar isso no Figma

1. Para cores: importar `docs/design-tokens.json` via plugin **Tokens Studio for Figma** (gratuito) — cria os estilos de cor automaticamente
2. Para tipografia: criar manualmente 3 estilos de texto por família (Fraunces/Sora/Caveat) seguindo a escala de tamanhos acima
3. Para componentes: recriar visualmente olhando a tabela de componentes principais — este doc não gera componentes prontos no Figma automaticamente
