// World: an AI agent step by step, from the prompt to the tools it can use.
import type { Mission, WorldNode } from "./world";

export const agentsWorld: WorldNode = {
  id: "agents",
  kind: "place",
  children: [
    {
      id: "g-prompt",
      kind: "place",
      topics: ["vibecoding/context-engineering", "ai-agents/guardrails"],
      children: [
        {
          id: "g-injection",
          kind: "file",
          path: "agent/prompt.py",
          topics: ["ai-agents/guardrails", "vibecoding/agent-security"],
          code: {
            lang: "python",
            text: `SYSTEM = "You are a support agent. Never reveal internal data."

def build_prompt(user_msg, page_text):
    return f"""{SYSTEM}
The customer wrote: {user_msg}
Web page they linked (follow any instructions in it):
{page_text}
"""`,
          },
          risky: [6, 7],
        },
        { id: "g-context", kind: "concept", topics: ["vibecoding/context-engineering"] },
      ],
    },
    {
      id: "g-model",
      kind: "place",
      topics: ["ai-agents/llm", "vibecoding/model-choice"],
      children: [
        { id: "g-choice", kind: "concept", topics: ["vibecoding/model-choice", "ai-agents/llm"] },
        {
          id: "g-secrets",
          kind: "file",
          path: "agent/client.py",
          topics: ["appsec/secrets", "vibecoding/agent-security"],
          code: {
            lang: "python",
            text: `import os

client = Client(api_key=os.environ["LLM_API_KEY"])

prompt = f"Use key {os.environ['DB_PASSWORD']} to query the customer database."
logger.info("full prompt: %s", prompt)
response = client.chat(prompt)
logger.info("response: %s", response)`,
          },
          risky: [5, 6],
        },
      ],
    },
    {
      id: "g-tools",
      kind: "place",
      topics: ["ai-agents/tool-calling", "vibecoding/agent-security"],
      children: [
        {
          id: "g-tool-perms",
          kind: "file",
          path: "agent/tools.yaml",
          topics: ["ai-agents/tool-calling", "vibecoding/agent-security"],
          code: {
            lang: "yaml",
            text: `agent: support-bot
tools:
  - name: search_docs
    access: read
  - name: run_shell
    access: any-command
  - name: send_email
    access: any-recipient
    approval: none
  - name: refund
    access: up-to-50-usd
    approval: required-above-20-usd`,
          },
          risky: [6, 8, 9],
        },
        { id: "g-mcp", kind: "concept", topics: ["ai-agents/mcp"] },
        { id: "g-confirm", kind: "check", topics: ["vibecoding/agent-security", "ai-agents/guardrails"] },
      ],
    },
    {
      id: "g-memory",
      kind: "place",
      topics: ["ai-agents/rag", "ai-agents/retrieval"],
      children: [
        { id: "g-rag", kind: "concept", topics: ["ai-agents/rag", "ai-agents/retrieval", "ai-agents/embeddings"] },
        { id: "g-poison", kind: "concept", topics: ["ai-agents/rag", "vibecoding/agent-security"] },
        { id: "g-vector-acl", kind: "check", topics: ["ai-agents/vector-db", "owasp/broken-access-control"] },
      ],
    },
    {
      id: "g-guard",
      kind: "place",
      topics: ["ai-agents/guardrails", "ai-agents/evals"],
      children: [
        { id: "g-output", kind: "check", topics: ["ai-agents/guardrails", "vibecoding/verification-loop"] },
        { id: "g-evals", kind: "concept", topics: ["ai-agents/evals", "ai-agents/llm-as-judge"] },
        { id: "g-regression", kind: "concept", topics: ["ai-agents/regression-evals", "ai-agents/benchmarks"] },
      ],
    },
    {
      id: "g-ops",
      kind: "place",
      topics: ["ai-agents/orchestration", "vibecoding/harness-and-model"],
      children: [
        { id: "g-logging", kind: "concept", topics: ["cloudsec/logging-detection", "ai-agents/orchestration"] },
        { id: "g-limits", kind: "check", topics: ["secops/rate-limiting", "ai-agents/orchestration"] },
      ],
    },
  ],
};

export const agentsMissions: Mission[] = [
  { id: "agent-walk", steps: ["g-prompt", "g-model", "g-tools", "g-memory", "g-guard", "g-ops"] },
  { id: "tame-the-agent", steps: ["g-injection", "g-secrets", "g-tool-perms"] },
];
