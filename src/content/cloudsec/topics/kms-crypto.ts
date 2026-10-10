import type { Topic } from "@/content/types";

export const kmsCrypto: Topic = {
  domain: "cloudsec",
  slug: "kms-crypto",
  title: "KMS & crypto - chaves e envelopes",
  short: "gerenciamento de chaves e criptografia",
  tagline:
    "Criptografia em cloud começa no KMS: quem tem acesso à chave decide o que é 'criptografado'. Sem governar chaves, 'encrypted at rest' é só um checkbox na console.",
  kind: "tecnica",
  stage: "proteger",
  tools: ["AWS KMS", "HashiCorp Vault Transit", "Google Cloud KMS", "Azure Key Vault"],
  sections: [
    {
      heading: "O que é",
      body: [
        "KMS (Key Management Service) é o componente que cria, armazena, usa e revoga chaves criptográficas sem expor o segredo para o seu código. A aplicação pede ao KMS 'cifre isto' ou 'decifre isto', e a chave nunca sai do serviço de chave. O resto do sistema usa o ciphertext.",
        "Esse detalhe importa porque a maior parte das falhas de criptografia acontece no plano errado: chaves em variável de ambiente, chaves commitadas no Git, chaves em arquivos de config. Tirar a chave do caminho da aplicação é o que o KMS faz.",
      ],
    },
    {
      heading: "Por que 'encrypted at rest' é só o começo",
      body: [
        "Storage services já vêm com criptografia em repouso habilitada por padrão (S3 SSE, EBS encryption, RDS storage encryption). Isso protege o disco contra remoção física, mas não protege contra quem tem acesso à API: alguém com s3:GetObject lê o objeto cifrado e pede ao KMS para decifrar.",
        "Se a key policy permite uso amplo demais, qualquer identidade que já tenha permissão de leitura passa a ter acesso efetivo ao plaintext. A pergunta certa não é 'está cifrado?', e sim 'quem pode pedir ao KMS para decifrar isto?'.",
      ],
    },
    {
      heading: "Envelope encryption: chave protege chave",
      body: [
        "Enviar um arquivo grande inteiro para o KMS a cada cifragem é caro e lento. A solução padrão é a envelope encryption: o KMS gera uma data key simétrica, o payload é cifrado localmente com AES, e a data key é cifrada com a master key do KMS. O resultado vai junto com o dado.",
        "No fluxo abaixo, o cliente recebe plaintext e ciphertext da data key, cifra o documento com a chave local, e descarta o plaintext. Só o ciphertext da data key fica persistido ao lado do arquivo.",
      ],
      code: [
        {
          language: "python",
          filename: "envelope.py - exemplo conceitual",
          code: "import boto3\nfrom cryptography.hazmat.primitives.ciphers.aead import AESGCM\n\nkms = boto3.client(\"kms\")\nKEY_ID = \"arn:aws:kms:us-east-1:111122223333:key/abcd1234-...\"\n\ndef envelope_encrypt(plaintext: bytes, kms_key_id: str = KEY_ID):\n    # 1. KMS devolve uma data key em plaintext + a mesma chave cifrada\n    resp = kms.generate_data_key(KeyId=kms_key_id, KeySpec=\"AES_256\")\n    plaintext_key = resp[\"Plaintext\"]\n    encrypted_key = resp[\"CiphertextBlob\"]\n\n    # 2. cifra o payload localmente, sem nunca mandar ao KMS\n    nonce = b\"\\x00\" * 12\n    ciphertext_body = AESGCM(plaintext_key).encrypt(nonce, plaintext, None)\n\n    # 3. descarta o plaintext da data key, só ciphertext segue com o arquivo\n    del plaintext_key\n    return {\"encrypted_key\": encrypted_key, \"ciphertext_body\": ciphertext_body, \"nonce\": nonce}",
        },
      ],
    },
    {
      heading: "Key policy: quem usa a chave",
      body: [
        "A key policy é o documento que vale para uma chave KMS. Ela decide quem pode usar a chave, em quais operações e sob quais condições. O default para chaves geradas pela AWS é liberal: a conta root pode tudo, mas se ninguém restringir, qualquer IAM principal com kms:* no environment inteiro passa.",
        "Uma boa key policy separa uso administrativo (criar, rotacionar, deletar) de uso criptográfico (cifrar, decifrar). O time de aplicação só recebe o segundo via grants limitados a um padrão de ARN de bucket ou tabela.",
      ],
      code: [
        {
          language: "json",
          filename: "key-policy.json - separada por papel",
          code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"AdminsManageKey\",\n      \"Effect\": \"Allow\",\n      \"Principal\": { \"AWS\": \"arn:aws:iam::111122223333:role/SecTeam\" },\n      \"Action\": [\n        \"kms:Create*\", \"kms:Describe*\", \"kms:Enable*\", \"kms:Disable*\",\n        \"kms:ScheduleKeyDeletion\", \"kms:RotateKeyOnDemand\"\n      ],\n      \"Resource\": \"*\"\n    },\n    {\n      \"Sid\": \"AppEncryptsOnly\",\n      \"Effect\": \"Allow\",\n      \"Principal\": { \"AWS\": \"arn:aws:iam::111122223333:role/app-frontend\" },\n      \"Action\": [\n        \"kms:Encrypt\", \"kms:Decrypt\", \"kms:GenerateDataKey\", \"kms:DescribeKey\"\n      ],\n      \"Resource\": \"*\",\n      \"Condition\": {\n        \"StringEquals\": {\n          \"kms:ViaService\": \"s3.us-east-1.amazonaws.com\"\n        }\n      }\n    }\n  ]\n}",
        },
      ],
    },
    {
      heading: "Rotação e revogação",
      body: [
        "Rotação automática anual está habilitada por padrão em chaves KMS e custa quase nada para usar: a chave antiga continua válida para decifrar dados antigos, e a nova cifra os próximos. Quando você precisa, força rotação manual após suspeita de uso indevido.",
        "Revogação é diferente: ou você desabilita a chave (bloqueia decifragem) ou agenda a deleção. Bloquear a chave quebra aplicações legítimas que tentam ler dados antigos. Por isso a regra prática: monitorar uso, separar chaves por sensibilidade, e nunca misturar chave de produção com chave de teste no mesmo recurso.",
      ],
    },
    {
      heading: "Onde entra no dia a dia",
      bullets: [
        "storage padrão: S3, EBS, RDS, DynamoDB e similares já cifram com KMS, mas a key policy precisa dizer quem pode chamar decifragem",
        "envelope encryption: payloads sensíveis em fila ou blob passam pelo padrão de chave local + data key cifrada",
        "BYOK/HYOK: empresas reguladas importam chave própria (Bring Your Own Key) ou mantêm chave em HSM externo (Hold Your Own Key)",
        "auditoria: cada chamada GenerateDataKey, Encrypt ou Decrypt vira evento no CloudTrail com principal ARN e request ID",
      ],
    },
    {
      heading: "Pontos fortes",
      bullets: [
        "chave nunca toca a aplicação: mesmo atacante com RCE no servidor não consegue extrair a chave do KMS",
        "rotação centralizada: rotacionar em um lugar migra toda a árvore de data keys em uso",
        "audit trail nativo: cada uso é assinado e logado com identidade, recurso e timestamp",
      ],
    },
    {
      heading: "Limitações",
      bullets: [
        "custo por chamada: KMS cobra por operação, e envelope mal desenhado vira fatura pesada por request",
        "latência por hop: cada Encrypt/Decrypt adiciona ida ao KMS, e latência sensíveis precisam de chave em cache local",
        "BYOK/HYOK adiciona complexidade operacional: HSM em duas regiões, rotação manual, e procedimentos de disaster recovery separados",
      ],
    },
  ],
};