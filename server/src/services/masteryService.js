import { supabase, isSupabaseConfigured, localStore } from '../config/supabase.js';

// Cognitive error classification heuristics based on question difficulty & distractor chosen
export const classifyCognitiveError = (question, selectedIndex) => {
  if (selectedIndex === question.correct_option_index) return null;

  const rationale = question.distractor_rationales?.[selectedIndex] || '';
  const rationaleLower = rationale.toLowerCase();

  if (rationaleLower.includes('violat') || rationaleLower.includes('invers') || rationaleLower.includes('revers')) {
    return 'Mental Model Inversion';
  }
  if (rationaleLower.includes('boundar') || rationaleLower.includes('limit') || rationaleLower.includes('condition')) {
    return 'Boundary Neglect';
  }
  if (rationaleLower.includes('formula') || rationaleLower.includes('arithmetic') || rationaleLower.includes('calculat')) {
    return 'Formula Misapplication';
  }
  return 'Superficial Association';
};

export class MasteryService {
  /**
   * Evaluates quiz submission answers and isolates micro-concept knowledge gaps
   */
  static evaluateQuizSubmission({ quiz, answers, timeTakenSeconds, userId }) {
    const totalPossible = quiz.questions.length;
    let correctCount = 0;
    const microConceptStats = {};
    const detailedBreakdown = [];

    quiz.questions.forEach((q, idx) => {
      const selectedIndex = answers[idx] !== undefined ? answers[idx] : -1;
      const isCorrect = selectedIndex === q.correct_option_index;
      if (isCorrect) correctCount++;

      const concept = q.micro_concept;
      if (!microConceptStats[concept]) {
        microConceptStats[concept] = {
          total: 0,
          correct: 0,
          questions: [],
          missedList: []
        };
      }

      microConceptStats[concept].total++;
      if (isCorrect) {
        microConceptStats[concept].correct++;
      } else {
        const errorType = classifyCognitiveError(q, selectedIndex);
        microConceptStats[concept].missedList.push({
          questionText: q.question_text,
          userAnswer: q.options[selectedIndex] || 'Unanswered',
          correctAnswer: q.options[q.correct_option_index],
          explanation: q.explanation,
          errorType,
          distractorRationale: q.distractor_rationales?.[selectedIndex] || 'Misconception'
        });
      }

      detailedBreakdown.push({
        questionIndex: idx,
        microConcept: concept,
        difficulty: q.difficulty,
        questionText: q.question_text,
        userAnswerIndex: selectedIndex,
        correctOptionIndex: q.correct_option_index,
        isCorrect,
        errorType: isCorrect ? null : classifyCognitiveError(q, selectedIndex),
        explanation: q.explanation
      });
    });

    const totalScore = (correctCount / totalPossible) * 100;
    const accuracyPercentage = parseFloat(totalScore.toFixed(2));

    // Compile micro-concept matrix
    const conceptMatrix = Object.entries(microConceptStats).map(([concept, data]) => {
      const conceptAccuracy = parseFloat(((data.correct / data.total) * 100).toFixed(2));
      let status = 'Mastered';
      if (conceptAccuracy <= 50.0) {
        status = 'Critical Deficit';
      } else if (conceptAccuracy <= 75.0) {
        status = 'Developing';
      }

      return {
        micro_concept: concept,
        topic: quiz.topic,
        accuracy: conceptAccuracy,
        status, // 'Critical Deficit' | 'Developing' | 'Mastered'
        totalTested: data.total,
        correctCount: data.correct,
        missedQuestions: data.missedList,
        primaryErrorType: data.missedList[0]?.errorType || null
      };
    });

    const criticalDeficits = conceptMatrix.filter((c) => c.status === 'Critical Deficit');

    return {
      totalScore,
      totalPossible,
      accuracyPercentage,
      timeTakenSeconds,
      conceptMatrix,
      criticalDeficits,
      detailedBreakdown
    };
  }

  /**
   * Persists quiz attempt and updates concept mastery ledger
   */
  static async persistQuizAttemptAndMastery({ userId, quizId, evaluation, quizTopic }) {
    const attemptRecord = {
      id: crypto.randomUUID(),
      quiz_id: quizId,
      user_id: userId,
      total_score: evaluation.totalScore,
      total_possible: evaluation.totalPossible,
      accuracy_percentage: evaluation.accuracyPercentage,
      time_taken_seconds: evaluation.timeTakenSeconds,
      user_answers: evaluation.detailedBreakdown.map((d) => d.userAnswerIndex),
      concept_matrix: evaluation.conceptMatrix,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('quiz_attempts').insert([attemptRecord]);

        // Upsert into concept_mastery
        for (const concept of evaluation.conceptMatrix) {
          const { data: existing } = await supabase
            .from('concept_mastery')
            .select('*')
            .eq('user_id', userId)
            .eq('topic', quizTopic)
            .eq('micro_concept', concept.micro_concept)
            .maybeSingle();

          if (existing) {
            // Weighted update for mastery score
            const updatedScore = parseFloat(
              ((Number(existing.mastery_score) + concept.accuracy) / 2).toFixed(2)
            );
            const status = updatedScore > 75 ? 'Mastered' : updatedScore > 50 ? 'Developing' : 'Critical Deficit';

            await supabase
              .from('concept_mastery')
              .update({
                mastery_score: updatedScore,
                status,
                last_evaluated_at: new Date().toISOString(),
                attempts_count: existing.attempts_count + 1
              })
              .eq('id', existing.id);
          } else {
            await supabase.from('concept_mastery').insert([
              {
                user_id: userId,
                topic: quizTopic,
                micro_concept: concept.micro_concept,
                mastery_score: concept.accuracy,
                status: concept.status,
                last_evaluated_at: new Date().toISOString(),
                attempts_count: 1
              }
            ]);
          }
        }
      } catch (err) {
        console.warn('[Supabase Quiz Persist Warning]:', err.message);
      }
    } else {
      localStore.insert('quiz_attempts', attemptRecord);

      // Upsert in localStore
      for (const concept of evaluation.conceptMatrix) {
        const existing = localStore.find(
          'concept_mastery',
          (c) => c.user_id === userId && c.topic === quizTopic && c.micro_concept === concept.micro_concept
        )[0];

        if (existing) {
          const updatedScore = parseFloat(
            ((Number(existing.mastery_score) + concept.accuracy) / 2).toFixed(2)
          );
          const status = updatedScore > 75 ? 'Mastered' : updatedScore > 50 ? 'Developing' : 'Critical Deficit';

          localStore.update('concept_mastery', existing.id, {
            mastery_score: updatedScore,
            status,
            last_evaluated_at: new Date().toISOString(),
            attempts_count: existing.attempts_count + 1
          });
        } else {
          localStore.insert('concept_mastery', {
            id: crypto.randomUUID(),
            user_id: userId,
            topic: quizTopic,
            micro_concept: concept.micro_concept,
            mastery_score: concept.accuracy,
            status: concept.status,
            last_evaluated_at: new Date().toISOString(),
            attempts_count: 1
          });
        }
      }
    }

    return attemptRecord;
  }

  /**
   * Retrieves aggregated mastery ledger and retention decay indicators
   */
  static async getMasteryLedger(userId) {
    let records = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('concept_mastery')
          .select('*')
          .eq('user_id', userId)
          .order('last_evaluated_at', { ascending: false });

        if (!error && data) {
          records = data;
        }
      } catch (err) {
        console.warn('[Supabase Mastery Fetch Warning]:', err.message);
      }
    }

    if (records.length === 0) {
      records = localStore.find('concept_mastery', (c) => c.user_id === userId);
    }

    // If records are empty for demo user, seed initial realistic mastery records
    if (records.length === 0) {
      const seedEntries = [
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Thermodynamics',
          micro_concept: 'State Functions vs Path Functions',
          mastery_score: 40.0,
          status: 'Critical Deficit',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
          attempts_count: 2
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Thermodynamics',
          micro_concept: 'First Law Closed System Balance',
          mastery_score: 85.0,
          status: 'Mastered',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
          attempts_count: 3
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Thermodynamics',
          micro_concept: 'Carnot Thermal Efficiency',
          mastery_score: 50.0,
          status: 'Critical Deficit',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
          attempts_count: 1
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Operating Systems',
          micro_concept: 'Virtual Address Translation & TLB',
          mastery_score: 45.0,
          status: 'Critical Deficit',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
          attempts_count: 2
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Operating Systems',
          micro_concept: 'Race Conditions & Atomic Operations',
          mastery_score: 90.0,
          status: 'Mastered',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
          attempts_count: 4
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Operating Systems',
          micro_concept: 'Coffman Conditions & Deadlock',
          mastery_score: 70.0,
          status: 'Developing',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 140).toISOString(),
          attempts_count: 2
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Data Structures & Algorithms',
          micro_concept: 'Optimal Substructure & Overlapping Subproblems',
          mastery_score: 48.0,
          status: 'Critical Deficit',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
          attempts_count: 1
        },
        {
          id: crypto.randomUUID(),
          user_id: userId,
          topic: 'Data Structures & Algorithms',
          micro_concept: 'Dijkstra Relaxation Invariant',
          mastery_score: 95.0,
          status: 'Mastered',
          last_evaluated_at: new Date(Date.now() - 3600 * 1000 * 200).toISOString(),
          attempts_count: 5
        }
      ];

      for (const entry of seedEntries) {
        localStore.insert('concept_mastery', entry);
      }
      records = seedEntries;
    }

    // Compute retention decay flags (e.g., > 7 days or > 30 days since evaluation)
    const now = Date.now();
    const enrichedRecords = records.map((rec) => {
      const elapsedDays = Math.floor((now - new Date(rec.last_evaluated_at).getTime()) / (1000 * 3600 * 24));
      let decayRisk = 'Low';
      if (elapsedDays >= 30) decayRisk = 'High';
      else if (elapsedDays >= 7) decayRisk = 'Medium';

      return {
        ...rec,
        elapsedDays,
        lastTestedDaysAgo: elapsedDays,
        decayRisk
      };
    });

    // Compute domain / topic aggregations for radar chart
    const topicAggregates = {};
    enrichedRecords.forEach((r) => {
      if (!topicAggregates[r.topic]) {
        topicAggregates[r.topic] = {
          topic: r.topic,
          totalScore: 0,
          count: 0,
          mastered: 0,
          developing: 0,
          deficits: 0
        };
      }
      topicAggregates[r.topic].totalScore += Number(r.mastery_score);
      topicAggregates[r.topic].count++;
      if (r.status === 'Mastered') topicAggregates[r.topic].mastered++;
      else if (r.status === 'Developing') topicAggregates[r.topic].developing++;
      else topicAggregates[r.topic].deficits++;
    });

    const radarData = Object.values(topicAggregates).map((t) => ({
      topic: t.topic,
      averageMastery: parseFloat((t.totalScore / t.count).toFixed(1)),
      conceptsCount: t.count,
      masteredCount: t.mastered,
      developingCount: t.developing,
      deficitCount: t.deficits
    }));

    const totalConcepts = enrichedRecords.length;
    const masteredTotal = enrichedRecords.filter((r) => r.status === 'Mastered').length;
    const overallMasteryIndex = totalConcepts > 0
      ? parseFloat(((masteredTotal / totalConcepts) * 100).toFixed(1))
      : 0;

    return {
      overallMasteryIndex,
      totalConceptsTracked: totalConcepts,
      masteredCount: masteredTotal,
      developingCount: enrichedRecords.filter((r) => r.status === 'Developing').length,
      deficitCount: enrichedRecords.filter((r) => r.status === 'Critical Deficit').length,
      radarData,
      concepts: enrichedRecords
    };
  }

  /**
   * Updates mastery score following Tier 3 remediation drill verification
   */
  static async verifyRemediationAndUpgradeMastery({ remediation, answers, userId }) {
    let drillCorrectCount = 0;
    const drillQuestions = remediation.tier_3_drills;
    const results = drillQuestions.map((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected === q.correct_option_index;
      if (isCorrect) drillCorrectCount++;
      return {
        questionText: q.question_text,
        selectedIndex: selected,
        correctIndex: q.correct_option_index,
        isCorrect,
        explanation: q.explanation
      };
    });

    // Score Delta Calculation
    // 2/2 correct -> 85% (Resolved / Mastered)
    // 1/2 correct -> 65% (Developing)
    // 0/2 correct -> remains at baseline
    let postRemediationScore = remediation.baseline_score;
    let newStatus = 'Critical Deficit';

    if (drillCorrectCount === 2) {
      postRemediationScore = 85.0;
      newStatus = 'Mastered';
    } else if (drillCorrectCount === 1) {
      postRemediationScore = 65.0;
      newStatus = 'Developing';
    }

    const sessionStatus = drillCorrectCount === 2 ? 'resolved' : 'in_progress';

    // Update remediation session record
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('remediation_sessions')
          .update({
            post_remediation_score: postRemediationScore,
            status: sessionStatus,
            completed_at: drillCorrectCount === 2 ? new Date().toISOString() : null
          })
          .eq('id', remediation.id);

        // Update concept_mastery
        await supabase
          .from('concept_mastery')
          .update({
            mastery_score: postRemediationScore,
            status: newStatus,
            last_evaluated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('topic', remediation.topic)
          .eq('micro_concept', remediation.micro_concept);
      } catch (err) {
        console.warn('[Supabase Remediation Verify Warning]:', err.message);
      }
    } else {
      localStore.update('remediation_sessions', remediation.id, {
        post_remediation_score: postRemediationScore,
        status: sessionStatus,
        completed_at: drillCorrectCount === 2 ? new Date().toISOString() : null
      });

      const existingMastery = localStore.find(
        'concept_mastery',
        (c) => c.user_id === userId && c.topic === remediation.topic && c.micro_concept === remediation.micro_concept
      )[0];

      if (existingMastery) {
        localStore.update('concept_mastery', existingMastery.id, {
          mastery_score: postRemediationScore,
          status: newStatus,
          last_evaluated_at: new Date().toISOString()
        });
      }
    }

    return {
      remediationId: remediation.id,
      drillCorrectCount,
      totalDrills: drillQuestions.length,
      passed: drillCorrectCount === 2,
      baselineScore: remediation.baseline_score,
      postRemediationScore,
      masteryDelta: parseFloat((postRemediationScore - remediation.baseline_score).toFixed(2)),
      sessionStatus,
      newStatus,
      results
    };
  }
}
