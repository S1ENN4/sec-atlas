import type { Topic } from "@/content/types";

export const goParaSeguranca: Topic = {
  domain: "seceng",
  slug: "go-para-seguranca",
  title: "Go para serviços de segurança",
  short: "binários pequenos, concorrência simples e latência previsível",
  tagline:
    "Go virou a língua franca de ferramentas de segurança e de infraestrutura: um binário estático, goroutines baratas e um runtime que se comporta bem quando o volume sobe.",
  kind: "tecnica",
  stage: "escalar",
  tools: ["Go", "gRPC", "govulncheck", "Prometheus client_golang"],
  sections: [
    {
      heading: "Por que Go aqui",
      body: [
        "Serviços de segurança costumam ser processos de longa duração que consomem muito evento, falam com várias APIs e precisam ser baratos de rodar e simples de implantar. Go cobre isso bem: compila para um binário estático (imagem de container mínima, menos superfície de ataque), tem concorrência embutida na linguagem e um coletor de lixo com pausas curtas.",
        "Não é a única escolha (Python é ótimo para o protótipo e para o playbook), mas quando o serviço vira um componente de plataforma que precisa aguentar carga, Go costuma ser o ponto de equilíbrio entre simplicidade e desempenho.",
      ],
    },
    {
      heading: "Concorrência com goroutines e canais",
      body: [
        "Uma goroutine custa poucos kilobytes, então é natural ter milhares. O padrão mais útil em segurança é o worker pool: um canal de entrada, N workers que processam em paralelo e um limite explícito de concorrência, o que dá backpressure de graça (quando os workers estão ocupados, o produtor espera).",
      ],
      code: [
        {
          language: "go",
          filename: "worker_pool.go",
          code: "package main\n\nimport (\n\t\"context\"\n\t\"log\"\n\t\"sync\"\n)\n\ntype Event struct{ ID, IP, Path string }\n\nfunc process(ctx context.Context, e Event) error {\n\t// regra de detecção, chamada a API, enriquecimento...\n\treturn nil\n}\n\n// Run consome eventos com concorrência limitada e para limpo ao cancelar ctx.\nfunc Run(ctx context.Context, in <-chan Event, workers int) {\n\tvar wg sync.WaitGroup\n\tfor i := 0; i < workers; i++ {\n\t\twg.Add(1)\n\t\tgo func() {\n\t\t\tdefer wg.Done()\n\t\t\tfor {\n\t\t\t\tselect {\n\t\t\t\tcase <-ctx.Done():\n\t\t\t\t\treturn\n\t\t\t\tcase e, ok := <-in:\n\t\t\t\t\tif !ok {\n\t\t\t\t\t\treturn\n\t\t\t\t\t}\n\t\t\t\t\tif err := process(ctx, e); err != nil {\n\t\t\t\t\t\tlog.Printf(\"event %s: %v\", e.ID, err)\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}()\n\t}\n\twg.Wait()\n}",
        },
      ],
    },
    {
      heading: "context: cancelamento e prazo em tudo",
      body: [
        "Toda chamada que sai do serviço (HTTP, banco, fila) deve receber um context com prazo. Sem timeout, uma dependência lenta acumula goroutines presas até o serviço cair. Do ponto de vista de segurança, isso também protege contra respostas que nunca terminam: um cliente HTTP sem timeout é um vetor de negação de serviço contra você mesmo.",
      ],
    },
    {
      heading: "Segurança do próprio serviço",
      bullets: [
        "govulncheck no CI: reporta só as vulnerabilidades em código que o seu binário realmente alcança.",
        "Aleatoriedade criptográfica com crypto/rand (nunca math/rand para tokens ou segredos).",
        "Cliente HTTP com timeout, limite de tamanho de resposta e cuidado com redirecionamentos e alvos internos (SSRF) quando a URL vem de dado externo.",
        "Imagem final mínima (distroless ou scratch), rodando sem root, com sistema de arquivos somente leitura.",
        "Métricas e perfil (pprof) fora da porta pública, nunca expostos à internet.",
      ],
    },
    {
      heading: "Quando não usar",
      body: [
        "Para um playbook que roda uma vez por alerta e chama três APIs, Python entrega mais rápido e o ganho de desempenho de Go não aparece. Go vale quando há volume, latência importa ou o serviço precisa ser implantado como um componente confiável da plataforma.",
      ],
    },
  ],
};
