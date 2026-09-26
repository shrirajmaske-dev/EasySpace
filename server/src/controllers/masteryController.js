import { MasteryService } from '../services/masteryService.js';

export class MasteryController {
  static async getLedger(req, res) {
    try {
      const userId = req.user.id;
      const ledger = await MasteryService.getMasteryLedger(userId);
      return res.json(ledger);
    } catch (err) {
      console.error('[MasteryController getLedger Error]:', err);
      return res.status(500).json({ error: 'Failed to retrieve mastery ledger', details: err.message });
    }
  }
}
