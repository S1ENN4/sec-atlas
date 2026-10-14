import type { Topic } from "@/content/types";

export const iacSeguro: Topic = {
  domain: "seceng",
  slug: "iac-seguro",
  title: "Infraestrutura segura como código",
  short: "Terraform e Ansible revisados, escaneados e sem drift",
  tagline:
    "Quando a infraestrutura é código, a segurança dela também pode ser: revisada em PR, escaneada antes do apply e comparada com a realidade para pegar o que mudou por fora.",
  kind: "tecnica",
  stage: "definir",
  tools: ["Terraform", "Checkov", "Trivy", "Ansible"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Infraestrutura como código (IaC) descreve redes, identidades, bancos e permissões em arquivos versionados, em vez de cliques em um console. Para segurança isso muda o jogo: a configuração passa a ter histórico, revisão por pares, testes e a mesma esteira do software.",
        "O outro lado é que um erro no código se replica em escala: um módulo com um bucket público cria cem buckets públicos. Por isso o IaC precisa ser tratado como código sensível, com controles próprios.",
      ],
    },
    {
      heading: "Escanear antes do apply",
      body: [
        "Ferramentas de análise estática de IaC leem os arquivos (ou o plano do Terraform) e apontam configurações inseguras antes de qualquer recurso existir: grupos de segurança abertos para o mundo, armazenamento sem cifragem, políticas com curinga. É o SAST da infraestrutura, e o mesmo princípio de shift-left se aplica.",
      ],
      code: [
        {
          language: "hcl",
          filename: "main.tf - problema e correção",
          code: "# problema: SSH aberto para a internet\nresource \"aws_security_group_rule\" \"ssh_bad\" {\n  type              = \"ingress\"\n  from_port         = 22\n  to_port           = 22\n  protocol          = \"tcp\"\n  cidr_blocks       = [\"0.0.0.0/0\"]   # <- scanner acusa\n  security_group_id = aws_security_group.app.id\n}\n\n# correção: só a rede de administração\nresource \"aws_security_group_rule\" \"ssh_ok\" {\n  type              = \"ingress\"\n  from_port         = 22\n  to_port           = 22\n  protocol          = \"tcp\"\n  cidr_blocks       = [var.admin_cidr]\n  security_group_id = aws_security_group.app.id\n}",
        },
      ],
    },
    {
      heading: "O estado do Terraform é sensível",
      body: [
        "O arquivo de estado guarda o que o Terraform criou, e isso pode incluir segredos em texto (senhas geradas, chaves). Ele não deve ir para o repositório. Use um backend remoto cifrado, com controle de acesso estrito e bloqueio de concorrência, e dê ao pipeline apenas as permissões que o plano realmente precisa.",
      ],
      code: [
        {
          language: "hcl",
          filename: "backend.tf",
          code: "terraform {\n  backend \"s3\" {\n    bucket         = \"minha-org-tfstate\"\n    key            = \"prod/network.tfstate\"\n    region         = \"us-east-1\"\n    encrypt        = true\n    use_lockfile   = true             # bloqueio nativo contra apply simultâneo\n  }\n}",
        },
      ],
    },
    {
      heading: "Drift: o que mudou por fora",
      body: [
        "Alguém altera um recurso no console durante um incidente e esquece de voltar. O estado real diverge do código (drift), e o código deixa de ser a verdade. Rodar um plano periódico, ou ferramentas de detecção de drift, transforma essa divergência em alerta, e a gestão de postura da nuvem (CSPM) olha o mesmo problema pelo lado do ambiente.",
      ],
    },
    {
      heading: "Módulos aprovados",
      bullets: [
        "Módulos internos com os padrões seguros embutidos (cifragem, logs, tags de dono): o caminho seguro vira o caminho fácil.",
        "Versões fixadas de módulos e providers, com revisão para atualizá-las.",
        "Permissões mínimas para a identidade que executa o apply, separadas por ambiente.",
        "Revisão obrigatória e plano anexado ao PR para que o revisor veja o efeito real.",
      ],
    },
  ],
};
