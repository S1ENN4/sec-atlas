import type { Topic } from "@/content/types";

export const containers: Topic = {
  domain: "cloudsec",
  slug: "containers",
  title: "Containers — imagens e cadeia de suprimentos",
  short: "build, signing e runtime imutável",
  tagline:
    "Imagens baseadas em camadas herdam privilégios: varredura de CVE, signing e runtime rootless reduzem a superfície que o container entrega ao host.",
  kind: "pratica",
  stage: "proteger",
  tools: ["Docker", "Falco", "Trivy", "Cosign"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Container é processo Linux isolado por namespaces e cgroups, executando um sistema de arquivos empilhado em camadas (layers). Cada camada é uma decisão: a base que você puxa, o apt install que roda, o usuário que abre o shell, o binário que entra. Cada uma vira parte da superfície que o atacante encontra.",
        "Dois princípios resolvem 80% da defesa: imagens mínimas (menos coisa, menos bug) e runtime endurecido (menos privilégio, menos caminho). O resto é processo: varredura, signing, política.",
      ],
    },
    {
      heading: "Imagem base mínima",
      body: [
        "Imagem base é a fundação de tudo o que vier depois. ubuntu:latest ou python:latest trazem um shell, um gerenciador de pacotes, e um conjunto de CVEs que cresce toda semana. Para produção, escolha uma base que tenha só o que o binário precisa para rodar.",
      ],
      bullets: [
        "distroless (gcr.io/distroless/*): sem shell, sem apt, sem gerenciador de pacote. Para aplicações Go, Java, Node, Python estáticos",
        "alpine: busybox + musl, ~5MB, ainda tem shell mas é muito menor que Debian",
        "scratch: nada, só o binário. Válido para binários Go/C/Rust compilados estaticamente",
        "wolfi/chainguard: distroless com cadeia de supply chain auditada e rebuild diário de CVEs",
      ],
    },
    {
      heading: "Registry confiável e signing",
      body: [
        "Saber de onde veio vale mais do que saber o que tem dentro. Registries privados (ECR, GCR, Harbor) dão controle sobre quem publica, com SSO e audit. Signing prova integridade: a imagem que está rodando é exatamente a que o CI construiu.",
        "Cosign (do projeto Sigstore) assina e verifica imagens OCI. O par de chaves pode vir do próprio time, de um KMS (chave fica em HSM), ou de Fulcio, que emite um certificado efêmero baseado em login OIDC (útil para CI sem segredo).",
      ],
      code: [
        {
          language: "bash",
          filename: "verificar imagem no deploy",
          code: "# assina no push (sem chave: identidade OIDC do CI)\ncosign sign ghcr.io/loja/checkout@sha256:abc123\n\n# verifica antes de subir (admission controller ou job de pré-deploy)\ncosign verify \\\n  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\\n  --certificate-identity-regexp 'https://github.com/loja/checkout/.github/workflows/release.yml@refs/tags/.*' \\\n  ghcr.io/loja/checkout@sha256:abc123",
        },
      ],
    },
    {
      heading: "Image scanning: achar CVE antes de subir",
      body: [
        "Scanners comparam a SBOM da imagem (ou cada layer) com bases de vulnerabilidades (NVD, GHSA, OSV). A saída é a lista de pacotes e CVEs, com severidade e versão corrigida. Roda em três momentos: no build (bloqueia PR com CVE crítico), no registry (acha CVE novo contra imagem já publicada) e no admission (rejeita pod com imagem não escaneada).",
      ],
      bullets: [
        "Trivy: scanner único (sistema de arquivos, imagem, IaC, SBOM), de código aberto; baixa a base de vulnerabilidades e pode rodar offline com ela em cache",
        "Grype (Anchore): foco em imagem e SBOM CycloneDX",
        "Docker Scout: integrado ao Docker Hub, usa a SBOM que o Docker constrói nativamente",
        "Snyk Container: comercial, bom para times que já usam Snyk para SCA",
      ],
    },
    {
      heading: "Rodar como non-root e endurecer o runtime",
      body: [
        "Um container rodando como UID 0 dentro do host é um processo root no host. Se o atacante escapa do container, já está com privilégios administrativos no nó. Mesma coisa com sistemas de arquivo graváveis: anota ali onde o atacante vai tentar persistir. Endurecer o runtime é cortar caminhos antes que eles existam.",
      ],
      code: [
        {
          language: "dockerfile",
          filename: "Dockerfile inseguro",
          code: "FROM python:latest\nRUN apt-get update && apt-get install -y curl netcat\nCOPY . /app\nWORKDIR /app\nEXPOSE 8080\nCMD [\"python\", \"app.py\"]    # roda como root (UID 0)",
        },
        {
          language: "dockerfile",
          filename: "Dockerfile corrigido",
          code: "# base mínima, sem shell, multi-stage para não herdar dev deps\nFROM python:3.12-slim AS builder\nWORKDIR /build\nCOPY requirements.txt .\nRUN pip install --no-cache-dir --target=/deps -r requirements.txt\n\nFROM gcr.io/distroless/python3-debian12\nWORKDIR /app\nCOPY --from=builder /deps /deps\nCOPY . /app\nENV PYTHONPATH=/deps\nUSER 65532                       # UID não-root fixo\nEXPOSE 8080\nENTRYPOINT [\"python\", \"/app/app.py\"]",
        },
      ],
    },
    {
      heading: "Onde entra",
      body: [
        "Containers tocam build, deploy e runtime. No build, o scan fecha o PR. No registry, o signing autentica a origem. No admission, o cluster rejeita imagem não assinada ou com policy violation. No runtime, o CWPP vigia o comportamento (próximo tópico). Pular qualquer um desses elos é abrir uma janela.",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "imutabilidade: a mesma imagem que foi testada é a que sobe, sem 'funciona na minha máquina'",
        "imagens mínimas reduzem CVE em uma ordem de grandeza: uma imagem distroless de Python traz algumas dezenas de pacotes, enquanto uma base Debian completa traz centenas",
        "assinatura e SBOM dão rastreabilidade real, peça por peça, até o pacote instalado",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "scan acha CVE conhecida: zero-day em dependência passa, e o signing não ajuda nisso",
        "distroless e scratch dificultam debug (sem shell). É o trade-off entre segurança e ergonomia, não um bug",
        "políticas de runtime (non-root, read-only fs) precisam ser aceitas pela aplicação: nem todo binário sobe sem root, e reescrever leva tempo",
      ],
    },
  ],
};