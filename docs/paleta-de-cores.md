# Simpatia — Paleta de cores

Referência dos códigos hex usados no site, espelhando as variáveis CSS em `src/app/simpatia.css` (`:root`). Se a paleta mudar no Figma, atualizar os dois lugares juntos.

## Marca v2 (paleta oficial, em uso)

### Verdes
| Nome | Hex | Variável CSS |
|---|---|---|
| Verde Feitiço | `#173F35` | `--verde-feitico` |
| Verde Ervas | `#E2E1D4` | `--verde-ervas` |
| Verde Sorte | `#BCC69E` | `--verde-sorte` |
| Preto Universo | `#0B1D19` | `--preto-universo` |

### Cremes / neutros
| Nome | Hex | Variável CSS |
|---|---|---|
| Creme Vela | `#F9EFE7` | `--creme-vela` |
| Branco Estrela | `#FFFDF7` | `--branco-estrela` |
| Creme Desejo | `#F9D5C1` | `--creme-desejo` |
| Cinza Bruma | `#616F6B` | `--cinza-bruma` |

### Roxos
| Nome | Hex | Variável CSS |
|---|---|---|
| Roxo Penumbra | `#311431` | `--roxo-penumbra` |
| Roxo Feitiço | `#6C2B6B` | `--roxo-feitico` |
| Lilás Mistério | `#CDA1CC` | `--lilas-misterio` |
| Lilás Suave | `#EDD9ED` | `--lilas-suave` |

### Azuis
| Nome | Hex | Variável CSS |
|---|---|---|
| Azul Abismo | `#142B31` | `--azul-abismo` |
| Azul Maré | `#307687` | `--azul-mare` |
| Azul Sereno | `#AFD5DE` | `--azul-sereno` |
| Azul Intuição | `#DEE6E8` | `--azul-intuicao` |

## Aliases semânticos (como as cores são usadas no código)

| Alias | Aponta para | Uso |
|---|---|---|
| `--cream` | Creme Vela | Fundo padrão de páginas claras |
| `--cream-2` | Verde Ervas | Fundo secundário/alternado |
| `--green-deep` | Verde Feitiço | H1/H2, cor de destaque principal |
| `--green-deep-2` | Preto Universo | Hover de elementos verdes |
| `--acento` | Roxo Feitiço | Cor de destaque/CTA (era terracota, migrou pra roxo) |
| `--ink-v2` | Preto Universo | Texto padrão sobre fundo claro |
| `--ink-v2-soft` | Cinza Bruma | Texto secundário/legendas |
| `--on-dark-heading` | Creme Desejo | Títulos sobre fundo escuro |
| `--on-dark-text` | rgba(249,239,231,0.9) | Corpo de texto sobre fundo escuro |

## Paleta legada (protótipo original, ainda em uso em componentes mais antigos)

| Nome | Hex | Variável CSS |
|---|---|---|
| Frost BG | `#EAF2F1` | `--frost-bg` |
| Frost BG 2 | `#DDEDEB` | `--frost-bg-2` |
| Deep Teal | `#0F2E36` | `--deep-teal` |
| Deep Teal 2 | `#163E48` | `--deep-teal-2` |
| Ice Blue | `#A9D8D3` | `--ice-blue` |
| Ice Blue Soft | `#CFE9E5` | `--ice-blue-soft` |
| Postit Amber | `#FFD873` | `--postit-amber` |
| Postit Mint | `#C8E8C0` | `--postit-mint` |
| Postit Coral | `#FFC2AD` | `--postit-coral` |
| Ink | `#0B1D19` | `--ink` |
| Ink Soft | `#4A6066` | `--ink-soft` |
| Paper | `#FBF8F2` | `--paper` |

`--ember` e `--ember-dark` (usados nos post-its/pins do congelador) foram unificados com a paleta nova: apontam para `--roxo-feitico` e `--roxo-penumbra`.
