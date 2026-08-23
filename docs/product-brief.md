# Simpatia — Product Brief

## Problema / Hipótese
Simpatias são rituais populares brasileiros (pedir algo ao Universo, "fazer uma simpatia" pra atrair, afastar ou conquistar algo). Hoje isso vive espalhado em blogs e redes sociais, sem nenhuma experiência digital própria.

**Hipótese a validar:** existe interesse real em transformar simpatias em rituais *feitos* online — não só lidos —, e as pessoas vão se cadastrar e usar de verdade, não só visitar por curiosidade.

## Público
Pessoas (majoritariamente mulheres, público de cultura pop/místico brasileiro) que já conhecem simpatias populares e buscam esse conteúdo organicamente (Google, redes sociais, boca a boca).

## Escopo do MVP
Primeira simpatia construída como piloto: **Simpatia do Congelador** (congelar um pedido pra afastar algo/alguém indesejado). Duas outras estão planejadas para validar se o modelo se repete: Simpatia do Mel e Pimenta (conquistar) e Simpatia da Canela (atrair).

Construído até aqui:
- Site em Next.js + Supabase (auth, banco de dados, storage de imagens)
- Ritual funcional do Congelador com conta de usuária, histórico ("Minhas simpatias") e efeito visual de congelamento por dias
- Blog com CMS próprio — autoras convidadas escrevem e publicam direto no site, sem aprovação manual
- Gestão de conta self-service (troca de senha, exclusão de conta)
- SEO técnico completo (sitemap, robots, metadata, schema FAQ, Search Console)
- Instrumentação de analytics para medir a hipótese (ver abaixo)

## Estratégia de crescimento
**100% orgânico, sem investimento em anúncios.** A decisão consciente é: se a ideia tiver tração por conteúdo/busca/boca a boca sozinha, isso já é sinal mais forte de validação do que tração comprada.

## Como a hipótese está sendo medida
Três eventos de conversão no Google Analytics 4, formando o funil real do produto:

1. `cta_fazer_simpatia` — visitante demonstrou interesse (clicou pra ver as opções)
2. `sign_up` — visitante virou usuária cadastrada
3. `pedido_criado` — usuária **de fato fez o ritual** (sinal mais importante: uso real, não só cadastro)

Junto com o Search Console (o que traz tráfego orgânico) e o GA4 (o que esse tráfego faz depois de chegar), dá pra ver o funil inteiro sem gastar em mídia.

## Critério de sucesso (provisório)
Ainda em definição — mas a leitura inicial é: se uma fração relevante de quem clica no CTA principal chega até `pedido_criado`, e se esse volume cresce mês a mês só com orgânico, a hipótese está validada o suficiente para justificar construir as próximas simpatias e investir mais tempo no produto.

## Próximos passos
- Acompanhar funil por algumas semanas antes de tirar conclusões (amostra pequena no início)
- Construir a 2ª e 3ª simpatia (Mel e Pimenta, Canela) pra ver se o padrão de engajamento se repete
- Revisitar este documento à medida que a hipótese for confirmada, refutada ou refinada
