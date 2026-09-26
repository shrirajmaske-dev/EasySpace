import { Router } from 'express';
import { CurationController } from '../controllers/curationController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CuratePathRequestSchema } from '../schemas/curationSchemas.js';

const router = Router();

router.get('/domains', CurationController.getTaxonomy);
router.post('/path', requireAuth, validate(CuratePathRequestSchema), CurationController.curatePath);
router.get('/path/:pathId', requireAuth, CurationController.getPathById);
router.get('/user-paths', requireAuth, CurationController.getUserPaths);

export default router;
