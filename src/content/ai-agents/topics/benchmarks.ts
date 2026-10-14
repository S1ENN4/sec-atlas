import type { Topic } from "@/content/types";

export const benchmarks: Topic = {
  domain: "ai-agents",
  slug: "benchmarks",
  title: "Benchmarks - referência pública",
  short: "conjuntos públicos para comparar agentes e LLMs",
  tagline:
    "Benchmarks (SWE-bench, GAIA, τ-bench, HumanEval) dão referência compartilhada: você roda o agente no mesmo dataset que outros publicaram e o número fala a mesma língua. Risco clássico: otimizar para o benchmark e perder no mundo real.",
  kind: "tecnica",
  stage: "evaluate",
  tools: ["SWE-bench", "GAIA", "τ-bench", "HumanEval"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Benchmark é um dataset congelado mais um protocolo de execução mais um número publicado. Alguém monta 500 tarefas, fixa a métrica, executa vários modelos no mesmo hardware e divulga uma tabela. Você repete o experimento, pega um número e compara com a tabela. É o mesmo modelo da SDLC clássica: o teste é estável, o sujeito varia, o veredito é comparável.",
        "Para o agente a mecânica muda um pouco. Os benchmarks públicos costumam ser estáticos demais (resposta única, sem interação) ou sintéticos (clientes simulados que parecem humanos sem ter nuances). Por isso benchmark é ponto de partida, nunca ponto de chegada.",
      ],
    },
    {
      heading: "Os quatro que importam",
      body: [
        "SWE-bench (Verified) é o padrão de fato para coding agents. Cerca de 500 issues reais do GitHub, cada uma com a descrição do bug e o teste que valida o fix. O agente recebe o repositório, lê o código, propõe patch e roda os testes. A nota é a porcentagem de issues cujo patch passa nos testes.",
        "GAIA mede agente de propósito geral em tarefas multi-hop (cruzar fontes, ler PDF, somar valores). Mistura ferramenta, raciocínio e recuperação. É o benchmark mais usado para comparar agentes que navegam a web.",
        "τ-bench (tau-bench) foca em diálogo agente vs usuário simulado, com ferramentas e políticas. Mede se o agente cumpre a tarefa do cliente sem estourar orçamento de tool calls. É referência recente (2024) e ganhou tração em atendimento.",
        "HumanEval é o pai de todos: 164 problemas de código em Python, função gera função, asserts validam. Continua útil como sanity check de modelo puro, mas qualquer agente moderno passa sem suar.",
      ],
    },
    {
      heading: "Rodando um benchmark local",
      body: [
        "A maioria dos benchmarks publica um harness em Python que padroniza a execução. O esqueleto abaixo mostra a mecânica de iteração sobre os casos, expondo o agente como função pura para que o harness possa comparar saída com gabarito:",
      ],
      code: [
        {
          language: "python",
          filename: "run_benchmark.py",
          code: "import json\nfrom datasets import load_dataset\nfrom agent import solve  # função do seu agente\n\nCASES = load_dataset(\"princeton-nlp/SWE-bench_Verified\", split=\"test\")\n\ndef run(limit: int | None = None):\n    passed = 0\n    total = 0\n    failures = []\n    for case in CASES:\n        if limit and total >= limit:\n            break\n        total += 1\n        try:\n            patch = solve(case[\"repo\"], case[\"problem_statement\"])\n            ok = apply_and_test(case[\"instance_id\"], patch, case[\"test_patch\"])\n            if ok:\n                passed += 1\n            else:\n                failures.append((case[\"instance_id\"], \"tests_failed\"))\n        except Exception as e:\n            failures.append((case[\"instance_id\"], f\"exception:{type(e).__name__}\"))\n    return {\"passed\": passed, \"total\": total, \"failures\": failures}\n\nif __name__ == \"__main__\":\n    print(json.dumps(run(limit=50), indent=2))",
        },
      ],
    },
    {
      heading: "O risco do overfitting",
      body: [
        "Quando o dataset é público e o resultado vira métrica de marketing, alguém aprende a hackear o benchmark. O caso mais didático é o de contamination: o modelo é treinado em texto que contém os casos do benchmark, e a 'resposta' vira memorização disfarçada de raciocínio. Outro truque é cherry-picking: rodar o agente 10 vezes, escolher a melhor execução e publicar.",
        "Defesa prática. A primeira é rodar o benchmark cegado: nunca deixe o agente ler a solução esperada, e trunque o dataset se ele for vazar pelo contexto. A segunda é cruzar com um dataset privado que você mantém em sigilo, do mesmo formato, e exigir que os dois andem juntos. A terceira é monitorar o gap entre benchmark e produção, e investigar sempre que divergir.",
      ],
    },
    {
      heading: "Benchmark versus produção",
      body: [
        "Benchmark é estático, finito e público. Produção é infinita, ruidosa e cheia de cauda longa (usuário frustrado, prompt injection, consulta ambígua). Um agente pode passar 80% em GAIA e ainda assim ser ruim para o usuário real.",
        "A leitura de bom senso trata o benchmark como triagem e o dataset privado como fonte de verdade. Publicar o número no README é marketing honesto. Confiar nele para fechar release é bobagem.",
      ],
    },
    {
      heading: "Como escolher o benchmark certo",
      body: [
        "Comece pelo workload. Se seu agente lê código, SWE-bench. Se conversa com cliente, τ-bench. Se faz pesquisa web, GAIA. Se o trabalho é geração pura, HumanEval resolve.",
        "Depois olhe a versão. SWE-bench Verified é o subconjunto humano-validado do SWE-bench original. Sempre prefira a versão verificada quando existir, porque reduz o ruído de casos ambíguos.",
        "Por fim, meça o custo. Cada caso tem um orçamento de tokens e tool calls. Compare custo por caso resolvido, não só taxa de acerto. Um agente que resolve 60% com metade dos tokens costuma ser melhor que um que resolve 80% com o dobro.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "comparação direta entre modelos e entre fornecedores, na mesma régua",
        "regressões óbvias (o fornecedor regrediu o modelo entre versões) saltam à vista",
        "custo previsível por caso, útil para orçamento de API",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "contamination: o benchmark pode vazar para o treino do modelo avaliado",
        "cauda longa da produção não aparece: um caso raro que derruba 1% dos usuários não está nos 500",
        "gaming: tempo gasto em hack de benchmark raramente melhora o agente real",
      ],
    },
  ],
};