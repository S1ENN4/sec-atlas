# Como contribuir

Obrigado por querer melhorar o appsec/kb. A forma mais valiosa de ajudar é **achar
e corrigir erros**: este é um projeto de segurança, e conteúdo impreciso é pior que
conteúdo ausente.

## Formas de contribuir

- **Corrigir uma imprecisão** num tópico, quiz, cenário ou glossário (prioridade máxima).
- **Melhorar uma explicação** que ficou confusa ou incompleta.
- **Adicionar um tópico** ou ligar tópicos existentes (pontes, trilhas, cenários).
- **Corrigir um bug** no site, no validador ou nos scripts.
- **Reportar** problemas de acessibilidade ou desempenho.

Para erros de conteúdo, o caminho mais rápido é abrir uma issue com o modelo
"Erro de conteúdo", citando o tópico, o trecho e a fonte que sustenta a correção.

## Rodando localmente

Requisitos: Node.js 24 ou superior.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # validador (R1 a R8) + export estático + orçamento de tamanho
```

O `npm run build` é o mesmo que roda no CI. Se ele passa na sua máquina, deve passar no PR.

## Escrevendo conteúdo

O guia passo a passo para adicionar um tópico (arquivo, registro no domínio, posição
no mapa, relações, esteira, quiz) está no [README](README.md#adicionando-um-tópico).
Resumo do que o validador exige de cada tópico:

- ao menos **4 seções**, com **código** ou ao menos **3 itens de lista**;
- `tagline` não vazia e **3 ou mais ferramentas**;
- posição no mapa do domínio;
- **quiz** com no mínimo 3 perguntas (4 opções distintas, `explain` preenchido).

### Idiomas

O inglês é a fonte da verdade. **Escreva conteúdo novo em inglês.** Se você alterar um texto em inglês, as traduções dele ficam desatualizadas e o build (regra R9) vai listar quais: você pode atualizá-las, removê-las com `npm run i18n -- prune` (o conteúdo cai para o inglês com um aviso e vira trabalho pendente) ou, se foi só um typo, confirmá-las com `npm run i18n -- keep`. Textos da interface (`src/i18n/ui-source.ts`) precisam estar nos 3 idiomas. Veja a seção "Idiomas" do README.

### Padrão de qualidade

- **Precisão antes de volume.** Prefira dizer menos e estar certo. Se algo é
  específico de uma ferramenta ou versão, diga qual.
- **Fontes.** Afirmações não óbvias devem ser rastreáveis a uma fonte primária
  (OWASP, NIST, documentação oficial). Acrescente à página de fontes quando fizer sentido.
- **Neutro quanto a fornecedor.** Exemplos de uma ferramenta específica são bem-vindos
  como ilustração, mas o conceito vem primeiro. Sem texto promocional.
- **Código de exemplo** deve ser curto, legível e marcado como ilustrativo quando não
  for executável como está. Nunca inclua segredos reais: use as chaves de exemplo
  documentadas dos provedores (por exemplo, `AKIAIOSFODNN7EXAMPLE`).
- **Texto próprio.** Não copie trechos de livros, artigos ou documentação de terceiros.
  Resuma com suas palavras e cite a fonte.
- **Português do Brasil**, tom direto e didático.

## Contribuições com apoio de IA

São bem-vindas, com duas condições:

1. **Você é o autor responsável.** Leia, entenda e verifique cada afirmação e cada
   linha de código antes de enviar. "A IA escreveu" não é justificativa para um erro.
2. **Declare o uso** no PR (marque a caixa no modelo). Não é para barrar, é para o
   revisor saber onde olhar com mais atenção.

PRs que parecem texto gerado sem verificação (fontes inventadas, APIs que não
existem, exemplos que não funcionam) serão fechados.

### Agentes de código e o servidor MCP

Se você usa um agente, conecte o servidor MCP do repositório (veja o README): ele entrega
as regras do projeto (`get_authoring_guide`), cria o esqueleto de um tópico
(`scaffold_topic`) e roda o validador (`validate_content`). O servidor ajuda a seguir o
processo, mas **não substitui a verificação humana**: a política acima continua valendo.

## Processo de PR

1. Abra uma issue antes de mudanças grandes (um domínio novo, uma refatoração).
2. Faça o fork, crie uma branch e mantenha o PR focado em uma coisa.
3. Rode `npm run build` e confirme que passa.
4. Preencha o modelo do PR, incluindo a checklist de fontes.
5. O mantenedor revisa; pode haver pedidos de ajuste. Mudanças de conteúdo
   recebem atenção extra de precisão.

Mensagens de commit seguem o formato `tipo(escopo): resumo` (por exemplo,
`fix(secops): corrige a descrição do modo shadow do WAF`).

## Licença das contribuições

Ao contribuir você concorda que o seu trabalho será licenciado como o resto do
projeto: **MIT** para código e **CC BY-SA 4.0** para conteúdo
(veja [LICENSE](LICENSE) e [LICENSE-CONTENT.md](LICENSE-CONTENT.md)).

## Conduta

Este projeto segue o [Código de Conduta](CODE_OF_CONDUCT.md). Seja respeitoso: o
objetivo é aprender juntos.
