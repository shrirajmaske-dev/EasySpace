import { Router } from 'express';
import { DiagnosticController } from '../controllers/diagnosticController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { GenerateQuizRequestSchema, SubmitQuizRequestSchema } from '../schemas/diagnosticSchemas.js';

const router = Router();

router.post('/generate', requireAuth, aiRateLimiter, validate(GenerateQuizRequestSchema), DiagnosticController.generateQuiz);
router.get('/:quizId', requireAuth, DiagnosticController.getQuizById);
router.post('/submit', requireAuth, validate(SubmitQuizRequestSchema), DiagnosticController.submitQuiz);
router.get('/attempt/:attemptId', requireAuth, DiagnosticController.getAttemptResults);

export default router;
