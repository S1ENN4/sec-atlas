import type { Topic } from "@/content/types";

export const cwpp: Topic = {
  domain: "cloudsec",
  slug: "cwpp",
  title: "CWPP — proteção de workload",
  short: "runtime e comportamento de carga",
  tagline:
    "Cloud Workload Protection Platform vigia o que acontece dentro da VM, container e serverless: syscalls, conexões e processos, em tempo de execução.",
  kind: "pratica",
  stage: "detectar",
  tools: ["CrowdStrike", "SentinelOne", "Aqua Security", "Trend Micro Cloud One"],
  sections: [
    {
      heading: "O que é",
      body: [
        "CWPP (Cloud Workload Protection Platform) é o sensor dentro da carga: VM, container, função serverless, host de Kubernetes. CSPM olha a configuração; CWPP olha o comportamento. Ele vê syscalls, conexões de rede, processos, leitura de arquivo, modificação de binário, e correlaciona isso contra regras e modelos.",
        "Quando tudo dá certo, CWPP não aparece: log de detecção da regra, alerta discreto no SIEM, e a carga segue rodando. Quando dá errado, é a diferença entre um crypto miner rodar por seis meses e ser cortado em três minutos.",
      ],
    },
    {
      heading: "Como funciona: agents e eBPF",
      body: [
        "A escolha clássica é agent-based (um processo que sobe dentro da carga e intercepta eventos) versus eBPF-based (programas rodando dentro do kernel, sem processo extra). Cada um tem trade-off.",
      ],
      bullets: [
        "agent user-space (Falco, Aqua): visibilidade ampla, fácil de atualizar, mas é mais um processo atacável",
        "eBPF (Tetragon, Cilium Tetragon, Datadog USM): instrumenta o kernel direto, sem processo extra, mas as regras ficam mais limitadas ao que o kernel expõe via hooks",
        "kernel module: máxima visibilidade, mas compromete compatibilidade com kernels gerenciados (GKE, EKS otimizado)",
        "sidecar por pod: isola o sensor da carga, útil quando a carga não pode ser modificada, mas custa mais recursos",
      ],
    },
    {
      heading: "Detecção comportamental: regras sobre o que acontece",
      body: [
        "A regra não pergunta 'qual processo está rodando?', pergunta 'esse processo está fazendo algo que ele nunca fez antes?'. A forma clássica é uma assinatura sobre syscalls: processo, container, syscall, condição. A forma moderna é modelo de comportamento (baseline por workload) que dispara anomalia, não assinatura.",
        "Falco é o padrão aberto para assinatura. A regra abaixo pega o padrão clássico de shell sendo aberto dentro de um container, algo que nenhuma aplicação legítima faz em produção:",
      ],
      code: [
        {
          language: "yaml",
          filename: "falco-rule.yaml",
          code: "- rule: Terminal shell in container\n  desc: >\n    Detect shell spawned inside a workload container.\n    Legitimate workloads never open an interactive shell at runtime;\n    this is a strong indicator of intrusion or hands-on-keyboard activity.\n  condition: >\n    container and\n    spawned_process and\n    proc.name in (shell_binaries)\n  output: >\n    shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline\n    container=%container.name image=%container.image.repository\n    k8s=%k8s.ns.name/%k8s.pod.name\n  priority: WARNING\n  tags: [container, mitre_execution, mitre_T1059]",
        },
      ],
    },
    {
      heading: "Resposta: do aviso ao corte",
      body: [
        "Detecção sem resposta é só ruído. CWPP tem três alavancas, em ordem crescente de agressividade:",
      ],
      bullets: [
        "alerta: manda evento para SIEM/SOAR, humano decide. Sem mudança no workload",
        "isolamento de rede: NetworkPolicy ou security group passa a bloquear o egress do pod/VM, cortando exfiltração mas mantendo o processo vivo para forense",
        "kill / quarantine: termina o processo, snapshot do filesystem para análise, container removido. É a resposta certa quando a regra é certeza (não anomalia)",
      ],
    },
    {
      heading: "Onde entra",
      body: [
        "CWPP vive depois do deploy. Ele assume que CSPM fez a parte dele (configuração OK), containers foram hardened (runtime OK), e agora a pergunta é: o que está acontecendo aqui dentro? Liga no SIEM junto com CloudTrail, VPC flow logs e EDR de endpoint para correlação (shell no container + STS token AssumeRole na mesma janela de 30s = incidente crítico).",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "detecta o que configuração nenhuma pega: zero-day em processo legítimo, exfiltração por canal permitido, persistência em filesystem limpo",
        "regras baseadas em comportamento pegam famílias de ataque, não CVE específica: um reverse shell em qualquer linguagem dispara a mesma regra",
        "fechando o ciclo: snapshot do filesystem pós-detecção vira evidência para incidente, não vira prescrição para o próximo atacante",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "agent dentro da carga é superfície nova: bug no sensor vira RCE dentro do nó, e o histórico tem exemplos",
        "custo de telemetria em escala: instrumentar mil containers em eBPF parece grátis até o log ir para o SIEM, e a casa é o switch do provedor",
        "falsos positivos de comportamento quebram a confiança: regra boa demais é regra que todo mundo silencia; o tuning é trabalho permanente, não setup de uma vez",
      ],
    },
  ],
};