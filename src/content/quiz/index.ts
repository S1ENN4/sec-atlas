import type { DomainId, QuizBank, QuizQuestion } from "@/content/types";

import { aiAgentsQuiz } from "./ai-agents";
import { appsecQuiz } from "./appsec";
import { cloudsecQuiz } from "./cloudsec";
import { secopsQuiz } from "./secops";
import { secengQuiz } from "./seceng";

export const quizzes: Record<DomainId, QuizBank> = {
  appsec: appsecQuiz,
  cloudsec: cloudsecQuiz,
  "ai-agents": aiAgentsQuiz,
  secops: secopsQuiz,
  seceng: secengQuiz,
};

export function getQuiz(domain: DomainId, slug: string): QuizQuestion[] {
  return quizzes[domain]?.[slug] ?? [];
}
