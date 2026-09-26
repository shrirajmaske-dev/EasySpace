import { Router } from 'express';
import { MasteryController } from '../controllers/masteryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/ledger', requireAuth, MasteryController.getLedger);

export default router;
