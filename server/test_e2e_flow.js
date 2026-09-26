// EasySpace End-to-End Automated Integration Test
const BASE_URL = 'http://localhost:5000/api/v1';

async function runE2EValidation() {
  console.log('================================================================');
  console.log('🧪 RUNNING EASYSPACE END-TO-END FLOW VERIFICATION');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // 1. Health Check
    console.log('--- Step 1: Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'Backend is healthy and responsive');

    // 2. Taxonomy Domains
    console.log('\n--- Step 2: Academic Taxonomy Domains ---');
    const domainsRes = await fetch(`${BASE_URL}/curate/domains`);
    const domainsData = await domainsRes.json();
    assert(Array.isArray(domainsData.domains), 'Taxonomy domains array exists');
    assert(domainsData.domains.length >= 3, `Expected at least 3 domains, got ${domainsData.domains.length}`);
    console.log(`   Domains: ${domainsData.domains.map(d => d.name).join(', ')}`);

    // 3. Curate Academic Video Path (Thermodynamics)
    console.log('\n--- Step 3: Curate Academic Learning Path ---');
    const curateRes = await fetch(`${BASE_URL}/curate/path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        topic: 'Thermodynamics',
        discipline: 'Mechanical Engineering',
        domainId: 'mechanical_engineering',
        difficulty: 'Intermediate'
      })
    });
    const curateData = await curateRes.json();
    assert(curateData.success === true, 'Path curation succeeded');
    assert(Array.isArray(curateData.videos), 'Curated videos list returned');
    assert(curateData.videos.length >= 3, `Curated at least 3 videos, got ${curateData.videos.length}`);
    console.log(`   Path ID: ${curateData.learningPath.id}`);
    console.log(`   Modules: ${curateData.videos.map(v => v.title).join(' | ')}`);

    const selectedVideo = curateData.videos[0];
    const learningPathId = curateData.learningPath.id;

    // 4. Generate Sub-Concept Diagnostic Quiz
    console.log('\n--- Step 4: AI Diagnostic Quiz Generation ---');
    const quizGenRes = await fetch(`${BASE_URL}/diagnostic/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        videoId: selectedVideo.id || selectedVideo.youtube_video_id,
        videoTitle: selectedVideo.title,
        videoDescription: selectedVideo.description,
        topic: 'Thermodynamics',
        difficulty: 'Intermediate',
        learningPathId
      })
    });
    const quizGenData = await quizGenRes.json();
    assert(quizGenData.quiz && quizGenData.quiz.id, 'Diagnostic quiz record created');
    assert(Array.isArray(quizGenData.questions), 'Diagnostic quiz questions returned');
    assert(quizGenData.questions.length >= 5, `Expected 5-10 questions, got ${quizGenData.questions.length}`);
    
    // Verify question schema structure
    const sampleQ = quizGenData.questions[0];
    assert(Boolean(sampleQ.micro_concept), `Question micro_concept tag present: "${sampleQ.micro_concept}"`);
    assert(Boolean(sampleQ.difficulty), `Question difficulty present: "${sampleQ.difficulty}"`);
    assert(sampleQ.options.length === 4, `Question has exactly 4 options: got ${sampleQ.options.length}`);
    console.log(`   Quiz Title: ${quizGenData.quiz.title}`);
    console.log(`   Total Questions: ${quizGenData.questions.length}`);

    const quizId = quizGenData.quiz.id;

    // 5. Submit Diagnostic Assessment (Deliberately miss some to test gap isolation)
    console.log('\n--- Step 5: Submit Diagnostic Assessment & Isolate Deficits ---');
    // Deliberately select option 0 for all questions
    const answers = quizGenData.questions.map(() => 0);
    const submitRes = await fetch(`${BASE_URL}/diagnostic/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        quizId,
        answers,
        timeTakenSeconds: 180
      })
    });
    const submitData = await submitRes.json();
    assert(submitData.success === true, 'Quiz submission evaluated successfully');
    assert(submitData.evaluation && typeof submitData.evaluation.accuracyPercentage === 'number', 'Accuracy percentage computed');
    assert(Array.isArray(submitData.evaluation.conceptMatrix), 'Cognitive concept matrix returned');
    console.log(`   Overall Score: ${submitData.evaluation.totalScore}%`);
    console.log(`   Concepts Evaluated: ${submitData.evaluation.conceptMatrix.length}`);

    // Verify concept classifications
    submitData.evaluation.conceptMatrix.forEach(c => {
      console.log(`     - [${c.status}] ${c.micro_concept}: ${c.accuracy}% (Error: ${c.primaryErrorType || 'None'})`);
    });

    assert(Array.isArray(submitData.remediations), 'Remediations array returned');
    assert(submitData.remediations.length > 0, `Auto-provisioned ${submitData.remediations.length} remediation module(s) for critical deficits`);

    const remediationToTest = submitData.remediations[0];
    console.log(`   Selected Remediation ID: ${remediationToTest.id} for "${remediationToTest.micro_concept}"`);

    // 6. Test 3-Tier Remediation Payload Structure
    console.log('\n--- Step 6: Verify 3-Tier Remediation Architecture ---');
    assert(Boolean(remediationToTest.tier_1_foundation.mental_model), 'Tier 1 Mental Model present');
    assert(Boolean(remediationToTest.tier_1_foundation.core_formula), 'Tier 1 Core Formula present');
    assert(Boolean(remediationToTest.tier_2_discrimination.misconception), 'Tier 2 Misconception present');
    assert(Array.isArray(remediationToTest.tier_2_discrimination.contrast_table), 'Tier 2 Contrast Table present');
    assert(remediationToTest.tier_3_drills.length === 2, `Tier 3 has exactly 2 verification problems: got ${remediationToTest.tier_3_drills.length}`);
    console.log(`   Mental Model: "${remediationToTest.tier_1_foundation.mental_model.slice(0, 80)}..."`);
    console.log(`   Misconception: "${remediationToTest.tier_2_discrimination.misconception}"`);

    // 7. Verify Tier 3 Application Drill & Upgrade Concept Mastery
    console.log('\n--- Step 7: Verify Tier 3 Drill & Upgrade Mastery ---');
    // Provide correct answers for both drill problems
    const drillCorrectAnswers = [
      remediationToTest.tier_3_drills[0].correct_option_index,
      remediationToTest.tier_3_drills[1].correct_option_index
    ];

    const verifyRes = await fetch(`${BASE_URL}/remediation/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      body: JSON.stringify({
        remediationId: remediationToTest.id,
        answers: drillCorrectAnswers
      })
    });
    const verifyData = await verifyRes.json();
    assert(verifyData.success === true, 'Verification API call succeeded');
    assert(verifyData.verification.passed === true, 'Student passed Tier 3 verification drill (2/2 correct)');
    assert(verifyData.verification.postRemediationScore >= 80, `Mastery elevated to >= 80%: got ${verifyData.verification.postRemediationScore}%`);
    assert(verifyData.verification.newStatus === 'Mastered', `Status updated to Mastered: got ${verifyData.verification.newStatus}`);
    console.log(`   Baseline Score: ${verifyData.verification.baselineScore}% -> Upgraded Score: ${verifyData.verification.postRemediationScore}% (+${verifyData.verification.masteryDelta}%)`);
    console.log(`   Session Status: ${verifyData.verification.sessionStatus}`);

    // 8. Longitudinal Mastery Ledger & Decay Indicator
    console.log('\n--- Step 8: Longitudinal Mastery Ledger ---');
    const ledgerRes = await fetch(`${BASE_URL}/mastery/ledger`, {
      headers: {
        'Authorization': 'Bearer demo-token'
      }
    });
    const ledgerData = await ledgerRes.json();
    assert(typeof ledgerData.overallMasteryIndex === 'number', 'Overall mastery index computed');
    assert(Array.isArray(ledgerData.radarData), 'Radar chart topic aggregates returned');
    assert(Array.isArray(ledgerData.concepts), 'Longitudinal concept history array returned');
    assert(ledgerData.concepts.length > 0, `Total concepts tracked: ${ledgerData.concepts.length}`);
    console.log(`   Overall Mastery Index: ${ledgerData.overallMasteryIndex}%`);
    console.log(`   Tracked Concepts: ${ledgerData.concepts.length}`);
    console.log(`   Radar Dimensions: ${ledgerData.radarData.map(r => `${r.topic} (${r.averageMastery}%)`).join(', ')}`);

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  }
}

runE2EValidation();
