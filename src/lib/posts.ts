export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  eyebrow: string;
  date: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "o-que-e-uma-simpatia",
    title: "O que é uma simpatia (e por que ela funciona pra tanta gente)",
    excerpt:
      "Simpatias fazem parte da cultura popular brasileira há gerações. Entenda a origem desse costume e por que ele ainda faz tanto sentido hoje.",
    eyebrow: "Universo místico",
    date: "2026-07-20",
    content: [
      "Simpatias são pequenos rituais populares, passados de geração em geração, que misturam fé, intenção e gestos simbólicos para lidar com o que está fora do nosso controle.",
      "Elas não substituem terapia, medicina ou ação prática — mas oferecem algo que a ciência também reconhece como valioso: um ritual de fechamento. Escrever, nomear e simbolicamente 'guardar' aquilo que nos incomoda ajuda a organizar a cabeça.",
      "A Simpatia do Congelador é uma das mais populares: escreva o que você quer que esfrie — uma situação, uma pessoa, uma ansiedade — e coloque no congelador. Enquanto ela está lá, você dá um passo atrás emocionalmente.",
    ],
  },
  {
    slug: "simpatia-do-congelador-como-fazer",
    title: "Simpatia do Congelador: como fazer (e por que ela é tão popular)",
    excerpt:
      "O passo a passo tradicional da simpatia mais compartilhada entre amigas — e como a versão digital do Simpatia.me recria essa experiência.",
    eyebrow: "Passo a passo",
    date: "2026-07-27",
    content: [
      "A versão tradicional é simples: escreva num papel o nome da pessoa ou da situação que você quer 'esfriar', dobre o papel e coloque no congelador, entre os cubos de gelo ou embaixo de algum pote.",
      "A crença é que, enquanto o papel estiver congelado, aquela energia fica 'parada' — sem avançar, sem te afetar. Muita gente relata alívio só pelo gesto de colocar no papel o que estava só na cabeça.",
      "No Simpatia.me, a lógica é a mesma, mas com acompanhamento: você vê os dias passando, o gelo se formando visualmente, e tem um momento de fechamento — descongelar — quando sentir que já resolveu.",
    ],
  },
  {
    slug: "rituais-que-ajudam-a-soltar",
    title: "Rituais que ajudam a soltar o que não está em nossas mãos",
    excerpt:
      "De velas a fitas do Bonfim, conheça outras simpatias queridas pelo Brasil afora — e o que todas têm em comum.",
    eyebrow: "Cultura popular",
    date: "2026-08-02",
    content: [
      "Vela do Amor, Jarro da Prosperidade, Fita do Bonfim — cada região do Brasil tem seus próprios rituais, mas todos compartilham uma estrutura parecida: uma intenção clara, um gesto simbólico e um tempo de espera.",
      "Esse padrão não é coincidência. Rituais com começo, meio e fim ajudam a mente a processar incertezas. É por isso que essas práticas atravessam gerações, mesmo em um mundo cada vez mais digital.",
      "Em breve, essas simpatias também vão ganhar vida no Simpatia.me — cada uma com sua própria forma de acompanhar o tempo e comemorar o resultado.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
