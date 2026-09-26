import { Router } from 'express';
import { RemediationController } from '../controllers/remediationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { GenerateRemediationRequestSchema, VerifyRemediationRequestSchema } from '../schemas/remediationSchemas.js';

const router = Router();

router.post('/generate', requireAuth, aiRateLimiter, validate(GenerateRemediationRequestSchema), RemediationController.generateRemediation);
router.get('/pending', requireAuth, RemediationController.getPendingRemediations);
router.get('/:id', requireAuth, RemediationController.getRemediationById);
router.post('/verify', requireAuth, validate(VerifyRemediationRequestSchema), RemediationController.verifyRemediation);

export default router;
