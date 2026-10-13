import type { DomainId, QuizBank, QuizQuestion } from "@/content/types";

import { aiAgentsQuiz } from "./ai-agents";
import { appsecQuiz } from "./appsec";
import { cloudsecQuiz } from "./cloudsec";
import { secopsQuiz } from "./secops";
import { secengQuiz } from "./seceng";
import { owaspQuiz } from "./owasp";
import { vibecodingQuiz } from "./vibecoding";
import { devopsQuiz } from "./devops";

export const quizzes: Record<DomainId, QuizBank> = {
  appsec: appsecQuiz,
  cloudsec: cloudsecQuiz,
  "ai-agents": aiAgentsQuiz,
  secops: secopsQuiz,
  seceng: secengQuiz,
  owasp: owaspQuiz,
  vibecoding: vibecodingQuiz,
  devops: devopsQuiz,
};

export function getQuiz(domain: DomainId, slug: string): QuizQuestion[] {
  return quizzes[domain]?.[slug] ?? [];
}
