import type { Topic } from "@/content/types";

export const incidentResponse: Topic = {
  domain: "cloudsec",
  slug: "incident-response",
  title: "Resposta a incidentes em cloud",
  short: "do alerta à contenção, com a prova preservada",
  tagline:
    "Detectar não basta: quando o alerta dispara, é a velocidade e a qualidade da contenção que decidem se vira um susto ou uma manchete.",
  kind: "pratica",
  stage: "responder",
  tools: ["AWS Security Hub", "Amazon GuardDuty", "AWS Systems Manager", "PagerDuty", "Velociraptor"],
  sections: [
    {
      heading: "O que é",
      body: [
        "Resposta a incidentes é o processo que começa quando um sinal de detecção (um alerta do GuardDuty, uma anomalia no CloudTrail, um aviso do CWPP) é confirmado como evento real e termina quando o ambiente está contido, restaurado e aprendeu algo com o ocorrido.",
        "Em cloud o jogo muda em dois pontos. Primeiro, tudo é API: dá para isolar uma instância, revogar uma credencial ou trocar uma chave em segundos e por script. Segundo, o ambiente é efêmero: se você não preservar a evidência antes de derrubar o recurso, ela desaparece junto com ele.",
      ],
    },
    {
      heading: "As fases do ciclo",
      body: ["O modelo do NIST (SP 800-61) continua a melhor espinha dorsal, mesmo para cloud:"],
      bullets: [
        "Preparação: runbooks escritos, contatos de plantão, contas de resposta com acesso pronto e testado, logs centralizados.",
        "Detecção e análise: confirmar que o alerta é real, estimar o escopo (quais identidades, recursos e dados) e classificar a gravidade.",
        "Contenção, erradicação e recuperação: parar o dano, remover o acesso do atacante e restaurar o serviço a partir de um estado confiável.",
        "Lições aprendidas: revisão sem culpa, ajustes nos controles e no inventário, e atualização dos runbooks.",
      ],
    },
    {
      heading: "Contenção por identidade primeiro",
      body: [
        "O vetor mais comum em cloud é uma credencial vazada, então o primeiro movimento costuma ser neutralizar a identidade, não a máquina. Desativar a chave de acesso e anexar uma policy de negação total corta o atacante sem derrubar o workload legítimo, e preserva o estado para a análise.",
      ],
      code: [
        {
          language: "bash",
          filename: "contain-key.sh - desativar chave comprometida",
          code: "USER=svc-deploy\nKEY=AKIAEXAMPLEKEYID\n\n# 1. desativa a chave (não apaga: preserva para forense)\naws iam update-access-key --user-name \"$USER\" \\\n  --access-key-id \"$KEY\" --status Inactive\n\n# 2. nega tudo para sessões já emitidas antes de agora\naws iam put-user-policy --user-name \"$USER\" \\\n  --policy-name quarantine \\\n  --policy-document file://deny-all.json",
        },
      ],
    },
    {
      heading: "Preservar a evidência antes de destruir",
      body: [
        "Para um workload suspeito, o reflexo de \"terminar a instância\" apaga memória, processos e conexões abertas. O caminho correto é isolar primeiro (trocar o security group por um que não permite tráfego), tirar snapshot dos volumes, capturar o que for volátil e só então decidir se descarta ou investiga.",
        "Contas separadas de forense, com snapshots copiados para um bucket imutável (Object Lock) e cadeia de custódia anotada, evitam que a evidência seja alterada por quem comprometeu a conta original.",
      ],
    },
    {
      heading: "Automatizar o que é repetível",
      body: [
        "Boa parte da contenção é repetitiva e urgente, o ambiente perfeito para automação: um alerta de alta confiança aciona uma função que isola o recurso, abre o ticket e avisa o plantão. Decisões ambíguas continuam humanas.",
        "A métrica que importa é o MTTR (tempo médio até a resposta). Runbooks testados em exercícios (game days) e automações com aprovação para ações destrutivas derrubam o MTTR sem criar o risco de a própria automação causar o incidente.",
      ],
    },
  ],
};
