# Política de segurança

## Escopo

O appsec/kb é um **site estático** (sem backend, banco ou formulários). A superfície
de ataque relevante é:

- vulnerabilidades no **código do site** (por exemplo, XSS no renderizador do mapa ou da busca);
- problemas na **cadeia de suprimentos** (dependências, workflows de CI);
- **cabeçalhos e CSP** que enfraqueçam a postura documentada em `/seguranca`.

## Como reportar uma vulnerabilidade

**Não abra uma issue pública.** Use o
[relato privado de vulnerabilidades do GitHub](https://github.com/S1ENN4/appsec-kb/security/advisories/new)
("Report a vulnerability" na aba Security). Se não conseguir, mande uma mensagem
direta ao mantenedor pelo [LinkedIn](https://www.linkedin.com/in/vitor-sienna/).

Inclua, se possível: descrição, passos para reproduzir, impacto e sugestão de
correção. Resposta inicial em até **7 dias**; correção ou plano em até **30 dias**
para problemas confirmados. Reconhecemos publicamente quem reportar (se desejar).

## Erros de conteúdo não são vulnerabilidades

Uma explicação imprecisa, um exemplo de código incorreto ou uma fonte quebrada
devem ser reportados em uma **issue pública** com o modelo "Erro de conteúdo": é
exatamente a ajuda que o projeto mais precisa.

## Versões suportadas

Apenas a branch principal (`main`) recebe correções.

## O que este projeto faz pela própria segurança

CSP restritiva e demais cabeçalhos versionados em `public/_headers`, dependências
com versão exata e lockfile, workflows de CI com permissões mínimas e actions
fixadas por SHA, análise estática (CodeQL) e atualizações automáticas
(Dependabot). Detalhes e trade-offs em `/seguranca`.
