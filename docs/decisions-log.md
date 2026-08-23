# Simpatia — Registro de Decisões e Aprendizados

Log cronológico de decisões de produto/design e o raciocínio por trás delas. Serve tanto de referência interna quanto de evidência de processo (portfólio).

---

## Identidade visual e marca
- Paleta migrou de verde/creme/terracota para verde/creme/**roxo** como cor de destaque — decisão de marca, não só estética.
- Variáveis de CSS foram renomeadas para refletir a paleta real (`--terracotta` → `--acento`) depois de perceber que o nome antigo não fazia mais sentido semântico — código deve descrever o que é, não o que foi.
- Tipografia com papéis definidos: Fraunces (serifada) pra títulos, Sora pro corpo, Caveat (cursiva) só em frases específicas de tom mais pessoal/manuscrito.

## Priorização de CTA: login vs. cadastro
**Decisão:** trocar o destaque do menu de "Entrar" para "Criar conta".
**Motivo:** é um site novo — a maioria de quem chega ainda não tem conta. Dar ênfase a "Entrar" pressupõe uma base de usuárias que ainda não existe. O CTA principal deve refletir o estágio real do produto.

## CMS do blog: autoria sem fricção, mas sem auto-serviço total
**Decisão:** amigas escrevem e publicam posts diretamente (sem aprovação manual), mas a permissão de autoria é concedida manualmente via SQL, não por uma tela de admin.
**Motivo:** o público de autoras é pequeno e conhecido (amigas convidadas) — construir uma UI de convite/gestão de autoras seria esforço de engenharia sem ganho real nesse estágio. Automatizar isso é uma melhoria futura possível, não uma necessidade agora.

## Estratégia de crescimento: orgânico, sem ads
**Decisão:** nenhum investimento em mídia paga durante a fase de validação.
**Motivo:** tráfego pago mascara se a ideia tem apelo genuíno. Medir conversão orgânica é um teste mais honesto da hipótese do produto.

## Instrumentação de analytics
**Decisão:** ao invés de só olhar pageviews, foram criados 3 eventos customizados no GA4 (`cta_fazer_simpatia`, `sign_up`, `pedido_criado`) representando o funil real de validação.
**Motivo:** pageview mede curiosidade; `pedido_criado` mede uso de verdade. Sem esse evento específico, seria impossível saber se o produto está sendo validado ou só visitado.

## Conta e privacidade
**Decisão:** exclusão de conta é self-service (a própria usuária apaga a conta e os dados, sem precisar pedir por e-mail).
**Motivo:** confiança e conformidade — um produto que lida com dados pessoais (pedidos de simpatia, muitas vezes íntimos) precisa dar controle real à usuária sobre seus próprios dados.

## Ferramentas de "agent readiness" (SEO para agentes de IA)
**Decisão:** não implementar a lista de padrões sugeridos por uma ferramenta de auditoria (Link headers para agentes, MCP Server Card, DNS-AID, API catalog, etc.).
**Motivo:** esses padrões servem sites que expõem *APIs* para agentes de IA consumirem. O Simpatia é um produto de conteúdo para pessoas, não uma API pública — implementar isso seria trabalho sem benefício real no estágio atual.
