import { z } from 'zod';

// Closed-Loop Adaptive Remediation Structured Schema from Master Specification
export const RemediationPayloadZodSchema = z.object({
  micro_concept: z.string(),
  topic: z.string(),
  tier_1_foundation: z.object({
    mental_model: z.string().describe("Concise intuition-builder under 120 words"),
    core_formula: z.string().describe("Core governing equation, axiom, or invariant rule"),
    timestamp_hint: z.string().describe("What specific visual or explanation to look for in the video")
  }),
  tier_2_discrimination: z.object({
    misconception: z.string().describe("The primary cognitive error the student exhibited"),
    corrective_rule: z.string().describe("The invariant rule that resolves the misconception"),
    contrast_table: z.array(z.object({
      faulty_belief: z.string(),
      scientific_reality: z.string()
    })).min(2).max(4)
  }),
  tier_3_drills: z.array(z.object({
    question_text: z.string(),
    options: z.array(z.string()).length(4),
    correct_option_index: z.number().int().min(0).max(3),
    explanation: z.string()
  })).length(2)
});

// Incoming HTTP request schema for POST /api/v1/remediation/generate
export const GenerateRemediationRequestSchema = z.object({
  quizAttemptId: z.string().optional(),
  micro_concept: z.string().min(1, "micro_concept is required"),
  topic: z.string().min(1, "topic is required"),
  accuracy: z.number().min(0).max(100),
  missedQuestionsSummary: z.string().optional().default("")
});

// Incoming HTTP request schema for POST /api/v1/remediation/verify
export const VerifyRemediationRequestSchema = z.object({
  remediationId: z.string().min(1, "remediationId is required"),
  answers: z.array(z.number().int().min(0).max(3)).length(2, "Exactly 2 drill answers required")
});
