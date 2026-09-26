import { GeminiService } from '../services/geminiService.js';
import { MasteryService } from '../services/masteryService.js';
import { supabase, isSupabaseConfigured, localStore } from '../config/supabase.js';

export class DiagnosticController {
  /**
   * Generates a 5-10 question sub-concept diagnostic quiz for a specific video
   */
  static async generateQuiz(req, res) {
    try {
      const { videoId, videoTitle, videoDescription, topic, difficulty, learningPathId } = req.body;
      const userId = req.user.id;

      // 1. Generate quiz via Gemini structured output
      const quizPayload = await GeminiService.generateDiagnosticQuiz({
        topic,
        videoTitle,
        videoDescription,
        difficulty
      });

      // 2. Persist diagnostic_quizzes record
      const quizId = crypto.randomUUID();
      const quizRecord = {
        id: quizId,
        learning_path_id: learningPathId || crypto.randomUUID(),
        curated_video_id: videoId,
        title: quizPayload.title || `${topic} Diagnostic Quiz`,
        topic: quizPayload.topic || topic,
        total_questions: quizPayload.questions.length,
        created_at: new Date().toISOString()
      };

      const questionRecords = quizPayload.questions.map((q) => ({
        id: crypto.randomUUID(),
        quiz_id: quizId,
        micro_concept: q.micro_concept,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: q.options,
        correct_option_index: q.correct_option_index,
        explanation: q.explanation,
        distractor_rationales: q.distractor_rationales
      }));

      if (isSupabaseConfigured) {
        try {
          await supabase.from('diagnostic_quizzes').insert([quizRecord]);
          await supabase.from('quiz_questions').insert(questionRecords);
        } catch (dbErr) {
          console.warn('[Supabase Quiz Insert Warning]:', dbErr.message);
        }
      }

      // Also persist to localStore
      localStore.insert('diagnostic_quizzes', quizRecord);
      questionRecords.forEach((q) => localStore.insert('quiz_questions', q));

      // Sanitize questions for student test mode (remove correct_option_index from client initial view)
      const clientQuestions = questionRecords.map((q) => ({
        id: q.id,
        quiz_id: q.quiz_id,
        micro_concept: q.micro_concept,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: q.options
      }));

      return res.status(201).json({
        quiz: quizRecord,
        questions: clientQuestions
      });
    } catch (err) {
      console.error('[DiagnosticController generateQuiz Error]:', err);
      return res.status(500).json({ error: 'Failed to generate diagnostic quiz', details: err.message });
    }
  }

  /**
   * Retrieves quiz details and questions
   */
  static async getQuizById(req, res) {
    try {
      const { quizId } = req.params;
      let quiz = null;
      let questions = [];

      if (isSupabaseConfigured) {
        try {
          const { data: qData } = await supabase
            .from('diagnostic_quizzes')
            .select('*')
            .eq('id', quizId)
            .maybeSingle();

          if (qData) {
            quiz = qData;
            const { data: qs } = await supabase
              .from('quiz_questions')
              .select('*')
              .eq('quiz_id', quizId);
            questions = qs || [];
          }
        } catch (err) {
          console.warn('[Supabase Quiz Fetch Warning]:', err.message);
        }
      }

      if (!quiz) {
        quiz = localStore.get('diagnostic_quizzes', quizId);
        questions = localStore.find('quiz_questions', (q) => q.quiz_id === quizId);
      }

      if (!quiz) {
        return res.status(404).json({ error: 'Diagnostic quiz not found' });
      }

      // Sanitize for testing
      const clientQuestions = questions.map((q) => ({
        id: q.id,
        quiz_id: q.quiz_id,
        micro_concept: q.micro_concept,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: q.options
      }));

      return res.json({ quiz, questions: clientQuestions });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch quiz', details: err.message });
    }
  }

  /**
   * Submits answers, computes micro-concept accuracies, updates concept_mastery, flags critical gaps
   */
  static async submitQuiz(req, res) {
    try {
      const { quizId, answers, timeTakenSeconds } = req.body;
      const userId = req.user.id;

      // 1. Fetch full quiz questions with answers and distractor rationales
      let quiz = null;
      let questions = [];

      if (isSupabaseConfigured) {
        try {
          const { data: qData } = await supabase
            .from('diagnostic_quizzes')
            .select('*')
            .eq('id', quizId)
            .maybeSingle();
          if (qData) {
            quiz = qData;
            const { data: qs } = await supabase
              .from('quiz_questions')
              .select('*')
              .eq('quiz_id', quizId);
            questions = qs || [];
          }
        } catch (err) {
          console.warn('[Supabase Submit Fetch Warning]:', err.message);
        }
      }

      if (!quiz) {
        quiz = localStore.get('diagnostic_quizzes', quizId);
        questions = localStore.find('quiz_questions', (q) => q.quiz_id === quizId);
      }

      if (!quiz || questions.length === 0) {
        return res.status(404).json({ error: 'Quiz or quiz questions not found' });
      }

      // 2. Run mastery evaluation engine
      const evaluation = MasteryService.evaluateQuizSubmission({
        quiz: { ...quiz, questions },
        answers,
        timeTakenSeconds: timeTakenSeconds || 60,
        userId
      });

      // 3. Persist attempt record and update longitudinal concept_mastery ledger
      const attemptRecord = await MasteryService.persistQuizAttemptAndMastery({
        userId,
        quizId,
        evaluation,
        quizTopic: quiz.topic
      });

      // 4. Pre-generate or provision remediation session records for all critical deficits (<= 50%)
      const generatedRemediations = [];
      for (const deficit of evaluation.criticalDeficits) {
        try {
          const remediationPayload = await GeminiService.generateRemediationModule({
            topic: quiz.topic,
            micro_concept: deficit.micro_concept,
            accuracy: deficit.accuracy,
            missedQuestionsSummary: deficit.missedQuestions
              .map((m) => `Q: ${m.questionText} | Student Chose: ${m.userAnswer} | Error: ${m.errorType}`)
              .join('\n')
          });

          const remediationId = crypto.randomUUID();
          const sessionRecord = {
            id: remediationId,
            user_id: userId,
            quiz_attempt_id: attemptRecord.id,
            micro_concept: deficit.micro_concept,
            topic: quiz.topic,
            baseline_score: deficit.accuracy,
            post_remediation_score: null,
            tier_1_foundation: remediationPayload.tier_1_foundation,
            tier_2_discrimination: remediationPayload.tier_2_discrimination,
            tier_3_drills: remediationPayload.tier_3_drills,
            status: 'pending',
            created_at: new Date().toISOString()
          };

          if (isSupabaseConfigured) {
            try {
              await supabase.from('remediation_sessions').insert([sessionRecord]);
            } catch (rErr) {
              console.warn('[Supabase Remediation Insert Warning]:', rErr.message);
            }
          }
          localStore.insert('remediation_sessions', sessionRecord);
          generatedRemediations.push(sessionRecord);
        } catch (rErr) {
          console.warn('[Remediation Auto-provision Warning]:', rErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        attemptId: attemptRecord.id,
        quizTitle: quiz.title,
        topic: quiz.topic,
        evaluation,
        remediations: generatedRemediations
      });
    } catch (err) {
      console.error('[DiagnosticController submitQuiz Error]:', err);
      return res.status(500).json({ error: 'Failed to process quiz submission', details: err.message });
    }
  }

  /**
   * Retrieves past quiz attempt with diagnostic breakdown
   */
  static async getAttemptResults(req, res) {
    try {
      const { attemptId } = req.params;
      let attempt = null;

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('id', attemptId)
            .maybeSingle();
          if (data) attempt = data;
        } catch (err) {
          console.warn('[Supabase Attempt Results Warning]:', err.message);
        }
      }

      if (!attempt) {
        attempt = localStore.get('quiz_attempts', attemptId);
      }

      if (!attempt) {
        return res.status(404).json({ error: 'Quiz attempt not found' });
      }

      // Fetch corresponding remediations
      let remediations = [];
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('remediation_sessions')
            .select('*')
            .eq('quiz_attempt_id', attemptId);
          if (data) remediations = data;
        } catch (rErr) {
          console.warn('[Supabase Fetch Remediations Warning]:', rErr.message);
        }
      }

      if (remediations.length === 0) {
        remediations = localStore.find('remediation_sessions', (r) => r.quiz_attempt_id === attemptId);
      }

      return res.json({ attempt, remediations });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve attempt results', details: err.message });
    }
  }
}
