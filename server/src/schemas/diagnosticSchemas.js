import { z } from 'zod';

// Quiz Question schema from Master Specification
export const QuizQuestionZodSchema = z.object({
  micro_concept: z.string().describe("Specific sub-concept tested, e.g. Second Law Thermodynamic Efficiency"),
  difficulty: z.enum(['Basic', 'Conceptual', 'Application']),
  question_text: z.string().describe("Clear, unambiguous technical question"),
  options: z.array(z.string()).length(4).describe("Array of exactly 4 choices"),
  correct_option_index: z.number().int().min(0).max(3),
  explanation: z.string().describe("Deep explanation of the correct physical/computational principle"),
  distractor_rationales: z.record(z.string(), z.string()).describe("Keyed 0-3 with reason why each distractor is wrong")
});

// Full Diagnostic Quiz schema from Master Specification
export const DiagnosticQuizZodSchema = z.object({
  title: z.string(),
  topic: z.string(),
  questions: z.array(QuizQuestionZodSchema).min(5).max(10)
});

// Incoming HTTP request schema for POST /api/v1/diagnostic/generate
export const GenerateQuizRequestSchema = z.object({
  videoId: z.string().min(1, "videoId is required"),
  videoTitle: z.string().min(1, "videoTitle is required"),
  videoDescription: z.string().optional().default(""),
  topic: z.string().min(1, "topic is required"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
  learningPathId: z.string().optional()
});

// Incoming HTTP request schema for POST /api/v1/diagnostic/submit
export const SubmitQuizRequestSchema = z.object({
  quizId: z.string().min(1, "quizId is required"),
  answers: z.array(z.number().int().min(0).max(3)),
  timeTakenSeconds: z.number().int().min(0).default(60),
  confidenceRatings: z.array(z.enum(['Low', 'Medium', 'High'])).optional()
});
