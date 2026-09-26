import { GeminiService } from '../services/geminiService.js';
import { MasteryService } from '../services/masteryService.js';
import { supabase, isSupabaseConfigured, localStore } from '../config/supabase.js';

export const createDemoRemediationSession = (userId = 'demo-user-1') => ({
  id: '10000000-0000-0000-0000-000000000001',
  user_id: userId,
  quiz_attempt_id: null,
  micro_concept: 'State Functions vs Path Functions',
  topic: 'Thermodynamics',
  baseline_score: 0.0,
  post_remediation_score: null,
  tier_1_foundation: {
    mental_model: 'Elevation on a hike is a state function (depends only on your current altitude, not which trail you hiked). But sweat produced and calories expended are path functions (depends directly on the length and steepness of your route).',
    core_formula: 'oint d(State Function) = 0; Delta U = Q - W where dU is exact, delta Q and delta W are inexact',
    timestamp_hint: 'Review 04:15 in the lecture showing the P-v indicator diagram and cycle area.'
  },
  tier_2_discrimination: {
    misconception: 'Believing that heat and work are static substances stored inside an object.',
    corrective_rule: 'Matter stores energy (U, H, S). Heat and work are solely dynamic boundary interactions that exist while a process is taking place.',
    contrast_table: [
      {
        faulty_belief: 'A hot cup of coffee possesses a high amount of heat.',
        scientific_reality: 'It possesses high internal kinetic energy. Heat is only transferred when it interacts with cooler ambient air.'
      },
      {
        faulty_belief: 'Work can be computed knowing only initial and final states.',
        scientific_reality: 'Work is the integral of P dV and requires knowing the explicit path curve.'
      }
    ]
  },
  tier_3_drills: [
    {
      question_text: 'For an adiabatic process (Q = 0) between state 1 and state 2, is the work performed path-dependent?',
      options: [
        'Yes, work is always path-dependent in all thermodynamic processes',
        'No, because W = -Delta U, which depends solely on initial and final equilibrium states',
        'Work is always zero for any adiabatic process',
        'Yes, because entropy changes during adiabatic execution'
      ],
      correct_option_index: 1,
      explanation: 'Because Delta U = Q - W and Q = 0, W = -Delta U. Since U is a state function, adiabatic work becomes path-independent between fixed endpoints.'
    },
    {
      question_text: 'Which quantity has an exact differential such that oint d(Quantity) = 0 over any closed cycle?',
      options: [
        'Boundary Work (W)',
        'Heat Interaction (Q)',
        'Specific Enthalpy (h)',
        'Entropy Generation (S_gen)'
      ],
      correct_option_index: 2,
      explanation: 'Enthalpy (h) is a true state function and has an exact differential dh. Its cyclic integral around any closed loop is identically zero.'
    }
  ],
  status: 'pending',
  created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
});

export class RemediationController {
  /**
   * Generates a 3-tier remediation payload for an isolated concept
   */
  static async generateRemediation(req, res) {
    try {
      const { quizAttemptId, micro_concept, topic, accuracy, missedQuestionsSummary } = req.body;
      const userId = req.user.id;

      const payload = await GeminiService.generateRemediationModule({
        topic,
        micro_concept,
        accuracy: accuracy !== undefined ? accuracy : 0,
        missedQuestionsSummary: missedQuestionsSummary || ''
      });

      const remediationId = crypto.randomUUID();
      const sessionRecord = {
        id: remediationId,
        user_id: userId,
        quiz_attempt_id: quizAttemptId || null,
        micro_concept,
        topic,
        baseline_score: accuracy !== undefined ? accuracy : 0,
        post_remediation_score: null,
        tier_1_foundation: payload.tier_1_foundation,
        tier_2_discrimination: payload.tier_2_discrimination,
        tier_3_drills: payload.tier_3_drills,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured) {
        try {
          await supabase.from('remediation_sessions').insert([sessionRecord]);
        } catch (dbErr) {
          console.warn('[Supabase Remediation Insert Error]:', dbErr.message);
        }
      }

      localStore.insert('remediation_sessions', sessionRecord);

      return res.status(201).json({
        success: true,
        remediation: sessionRecord
      });
    } catch (err) {
      console.error('[RemediationController generateRemediation Error]:', err);
      return res.status(500).json({ error: 'Failed to generate remediation module', details: err.message });
    }
  }

  /**
   * Retrieves remediation session details by ID
   */
  static async getRemediationById(req, res) {
    try {
      const { id } = req.params;
      let session = null;

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('remediation_sessions')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          if (data) session = data;
        } catch (err) {
          console.warn('[Supabase Fetch Remediation Warning]:', err.message);
        }
      }

      if (!session) {
        session = localStore.get('remediation_sessions', id);
      }

      if (!session && id === '10000000-0000-0000-0000-000000000001') {
        session = createDemoRemediationSession(req.user?.id || 'demo-user-1');
        localStore.insert('remediation_sessions', session);
      }

      if (!session) {
        return res.status(404).json({ error: 'Remediation session not found' });
      }

      return res.json({ remediation: session });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch remediation session', details: err.message });
    }
  }

  /**
   * Retrieves all pending/active remediation sessions for the authenticated user
   */
  static async getPendingRemediations(req, res) {
    try {
      const userId = req.user.id;
      let sessions = [];

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('remediation_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (data) sessions = data;
        } catch (err) {
          console.warn('[Supabase Pending Remediation Warning]:', err.message);
        }
      }

      if (sessions.length === 0) {
        sessions = localStore.find('remediation_sessions', (s) => s.user_id === userId);
      }

      // If user has zero sessions yet, initialize with demo session for State Functions vs Path Functions
      if (sessions.length === 0) {
        const demoSession = createDemoRemediationSession(userId);
        localStore.insert('remediation_sessions', demoSession);
        sessions = [demoSession];
      }

      return res.json({ sessions });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch pending remediations', details: err.message });
    }
  }

  /**
   * Verifies Tier 3 drill answers, updates mastery score, marks resolved
   */
  static async verifyRemediation(req, res) {
    try {
      const { remediationId, answers } = req.body;
      const userId = req.user.id;

      let session = null;
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('remediation_sessions')
            .select('*')
            .eq('id', remediationId)
            .maybeSingle();
          if (data) session = data;
        } catch (err) {
          console.warn('[Supabase Verify Fetch Warning]:', err.message);
        }
      }

      if (!session) {
        session = localStore.get('remediation_sessions', remediationId);
      }

      if (!session) {
        return res.status(404).json({ error: 'Remediation session not found' });
      }

      const verification = await MasteryService.verifyRemediationAndUpgradeMastery({
        remediation: session,
        answers,
        userId
      });

      return res.status(200).json({
        success: true,
        verification
      });
    } catch (err) {
      console.error('[RemediationController verifyRemediation Error]:', err);
      return res.status(500).json({ error: 'Failed to verify drill submission', details: err.message });
    }
  }
}
