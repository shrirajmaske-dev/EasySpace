import { z } from 'zod';

export const CuratePathRequestSchema = z.object({
  topic: z.string().trim().min(2, "Topic must be at least 2 characters").max(100, "Topic too long"),
  query: z.string().optional(),
  discipline: z.string().trim().min(2, "Discipline is required").default("Engineering"),
  domainId: z.string().trim().min(2, "domainId is required").default("computer_science"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate')
});
