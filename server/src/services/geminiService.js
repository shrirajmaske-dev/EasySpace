import { ai, GEMINI_FLASH_MODEL, GEMINI_PRO_MODEL } from '../config/gemini.js';
import { DiagnosticQuizZodSchema } from '../schemas/diagnosticSchemas.js';
import { RemediationPayloadZodSchema } from '../schemas/remediationSchemas.js';
import { SEED_QUIZZES, SEED_REMEDIATION } from '../utils/seedFallbackData.js';

const SYSTEM_INSTRUCTION = `You are EasySpace AI, an elite Academic Cognitive Diagnostic & Remediation Engine designed for higher education in technical, engineering, and scientific fields.

Your core duties:
1. Deconstruct complex academic subjects into granular, atomic micro-concepts.
2. Formulate diagnostic questions that strictly target conceptual misconceptions, boundary condition misunderstandings, and procedural bugs, rather than superficial rote memorization.
3. Categorize cognitive failures into specific classifications:
   - "Mental Model Inversion" (fundamental rule reversed)
   - "Boundary Neglect" (applying a rule where it does not apply)
   - "Superficial Association" (relying on buzzwords rather than mechanics)
   - "Formula Misapplication" (algebraic or variable assignment flaw)
4. Build targeted remediation paths that do not simply repeat the lecture, but actively deconstruct the cognitive failure via targeted cognitive anchors, contrast tables, and application challenges.

Never produce markdown wrappers, codeblocks (like \`\`\`json), or prose outside of the required structured JSON schema. Respond strictly with validated JSON conforming to the requested schema.`;

export class GeminiService {
  /**
   * Generates a 5-to-10 question diagnostic quiz for a curated video
   */
  static async generateDiagnosticQuiz({ topic, videoTitle, videoDescription, difficulty = 'Intermediate' }) {
    // Check seed fallback first if AI is not available
    const matchingTopic = Object.keys(SEED_QUIZZES).find(
      (key) => key.toLowerCase() === topic.toLowerCase() || topic.toLowerCase().includes(key.toLowerCase())
    );

    if (ai) {
      try {
        const prompt = `Topic: ${topic}
Video Title: ${videoTitle}
Video Description: ${videoDescription || 'Technical academic lecture'}
Target Difficulty: ${difficulty}

Generate a rigorous 5-to-10 question diagnostic quiz designed to assess student comprehension of the sub-concepts taught in this technical lecture.

Requirements:
1. Every question must be tagged with a distinct, atomic micro_concept (e.g., "Entropy Change in Irreversible Processes", "Carnot Thermal Efficiency").
2. Assign appropriate difficulty level ('Basic', 'Conceptual', 'Application') ensuring a balanced distribution (approx 30% Basic, 40% Conceptual, 30% Application).
3. Provide exactly 4 options. Distractors must be plausible and map to specific, common undergraduate engineering/science misconceptions.
4. Provide a thorough pedagogical explanation and explicit distractor rationales explaining the specific misconception represented by each wrong choice.
Respond with pure JSON conforming to:
{
  "title": "${topic} Diagnostic Assessment",
  "topic": "${topic}",
  "questions": [
    {
      "micro_concept": "...",
      "difficulty": "Basic" | "Conceptual" | "Application",
      "question_text": "...",
      "options": ["A", "B", "C", "D"],
      "correct_option_index": 0,
      "explanation": "...",
      "distractor_rationales": { "0": "...", "1": "...", "2": "...", "3": "..." }
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: GEMINI_FLASH_MODEL,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const rawText = response.text?.trim() || '';
        const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        const parsed = JSON.parse(cleanedText);
        const validated = DiagnosticQuizZodSchema.parse(parsed);
        return validated;
      } catch (err) {
        console.warn('[Gemini AI Warning]: AI Quiz Generation failed or rate-limited. Falling back to academic seed curriculum.', err.message);
      }
    }

    // Fallback: If matching seed quiz exists, return a deep copy
    if (matchingTopic && SEED_QUIZZES[matchingTopic]) {
      return JSON.parse(JSON.stringify(SEED_QUIZZES[matchingTopic]));
    }

    // Fallback: Dynamically synthesized academic diagnostic quiz
    return {
      title: `${topic} Sub-Concept Diagnostic Assessment`,
      topic,
      questions: [
        {
          micro_concept: `${topic} Governing Invariants`,
          difficulty: "Basic",
          question_text: `Which statement represents the foundational physical or mathematical invariant of ${topic}?`,
          options: [
            `The system invariant holds unconditionally across all state transitions`,
            `The invariant applies only in an open non-equilibrium system`,
            `The invariant is a path-dependent boundary function`,
            `The invariant is strictly zero for all irreversible processes`
          ],
          correct_option_index: 0,
          explanation: `In ${topic}, foundational state invariants govern the conserved quantities across arbitrary state transitions.`,
          distractor_rationales: {
            "1": "Boundary constraints cannot selectively invert foundational invariants.",
            "2": "Invariants are state functions, not path-dependent quantities.",
            "3": "Irreversible processes exhibit non-zero dissipative terms."
          }
        },
        {
          micro_concept: `${topic} Boundary Conditions`,
          difficulty: "Conceptual",
          question_text: `Under what boundary condition does the classical ${topic} formulation break down?`,
          options: [
            `When moving from discrete to continuous state spaces`,
            `When boundary dissipation exceeds the quasi-static equilibrium threshold`,
            `When system temperature approaches absolute zero`,
            `When work output is measured in Joules`
          ],
          correct_option_index: 1,
          explanation: `Classical formulations require quasi-static equilibrium; significant boundary dissipation invalidates reversible trajectory assumptions.`,
          distractor_rationales: {
            "0": "Continuous state representations are fully standard in undergraduate engineering.",
            "2": "Third-law formulations govern zero-Kelvin limits without breaking the core framework.",
            "3": "Standard SI units do not impact physical validity."
          }
        },
        {
          micro_concept: `${topic} Transfer Mechanics`,
          difficulty: "Application",
          question_text: `Given an efficiency or transfer ratio of 0.65 in a ${topic} system operating at nominal load, what is the dissipated loss fraction?`,
          options: [
            `0.35`,
            `0.65`,
            `1.35`,
            `0.00`
          ],
          correct_option_index: 0,
          explanation: `By conservation of energy/flux: Loss fraction = 1 - Useful fraction = 1 - 0.65 = 0.35.`,
          distractor_rationales: {
            "1": "0.65 is the utilized efficiency, not the dissipated loss.",
            "2": "Exceeds 1.0, violating conservation laws.",
            "3": "Assumes an impossible 100% ideal frictionless device."
          }
        },
        {
          micro_concept: `${topic} Dynamic Response`,
          difficulty: "Conceptual",
          question_text: `How does system latency or relaxation time scale when capacity is doubled in ${topic}?`,
          options: [
            `System time constant scales proportionally with capacity (tau = R * C)`,
            `Latency drops instantly to zero`,
            `Response becomes completely unstable without feedback`,
            `Capacity has no coupling with relaxation timescale`
          ],
          correct_option_index: 0,
          explanation: `First-order and second-order dynamic response times scale directly with thermal, capacitive, or inertial storage coefficients.`,
          distractor_rationales: {
            "1": "Higher storage capacity increases lag time rather than eliminating it.",
            "2": "Passive storage addition alone does not cause unstable unbounded poles.",
            "3": "Time constants fundamentally depend on storage capacity."
          }
        },
        {
          micro_concept: `${topic} Numerical Stability`,
          difficulty: "Application",
          question_text: `When discretizing ${topic} equations for computational simulation, what guarantees numerical convergence?`,
          options: [
            `Selecting a time step Delta t satisfying the Courant-Friedrichs-Lewy (CFL) condition`,
            `Setting step size to infinity to minimize roundoff error`,
            `Ignoring boundary condition constraints during matrix inversion`,
            `Using exclusively explicit forward-Euler integration without damping`
          ],
          correct_option_index: 0,
          explanation: `The CFL condition ensures information propagation speed does not outpace grid discretization velocity, preventing numerical divergence.`,
          distractor_rationales: {
            "1": "Infinite step size causes catastrophic divergence.",
            "2": "Ignoring boundaries produces ill-posed unsolvable linear systems.",
            "3": "Forward Euler is conditionally stable and can easily explode if step size is too large."
          }
        }
      ]
    };
  }

  /**
   * Generates a 3-tier closed-loop remediation recovery module for an isolated deficit (accuracy <= 50%)
   */
  static async generateRemediationModule({ topic, micro_concept, accuracy = 0, missedQuestionsSummary = '' }) {
    // Check seed fallback first
    if (SEED_REMEDIATION[micro_concept]) {
      return JSON.parse(JSON.stringify(SEED_REMEDIATION[micro_concept]));
    }

    if (ai) {
      try {
        const prompt = `Topic: ${topic}
Failed Micro-Concept: ${micro_concept}
Student Accuracy on this Concept: ${accuracy}%
Identified Error Patterns / Missed Questions:
${missedQuestionsSummary || 'The student demonstrated fundamental confusion on mechanics and boundary conditions.'}

Generate an authoritative 3-tier closed-loop remediation recovery module for this student.

Requirements:
- Tier 1 (Foundation): A concise mental model (under 120 words), the foundational axiom/equation, and a recommended search term/timestamp trigger to re-watch in the video.
- Tier 2 (Discrimination): Pinpoint the root misconception. Provide a structured contrast table highlighting the "Faulty Intuition" vs. the "Physical/Scientific Reality" (2 to 4 items).
- Tier 3 (Application Drill): Exactly 2 targeted verification problems with 4 choices each to assess whether the cognitive gap has been fully resolved.
Respond with pure JSON conforming to:
{
  "micro_concept": "${micro_concept}",
  "topic": "${topic}",
  "tier_1_foundation": {
    "mental_model": "...",
    "core_formula": "...",
    "timestamp_hint": "..."
  },
  "tier_2_discrimination": {
    "misconception": "...",
    "corrective_rule": "...",
    "contrast_table": [
      {
        "faulty_belief": "...",
        "scientific_reality": "..."
      }
    ]
  },
  "tier_3_drills": [
    {
      "question_text": "...",
      "options": ["A", "B", "C", "D"],
      "correct_option_index": 0,
      "explanation": "..."
    },
    {
      "question_text": "...",
      "options": ["A", "B", "C", "D"],
      "correct_option_index": 0,
      "explanation": "..."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: GEMINI_PRO_MODEL,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const rawText = response.text?.trim() || '';
        const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        const parsed = JSON.parse(cleanedText);
        const validated = RemediationPayloadZodSchema.parse(parsed);
        return validated;
      } catch (err) {
        console.warn('[Gemini AI Warning]: AI Remediation Generation failed. Using fallback module.', err.message);
      }
    }

    // Dynamic fallback module
    return {
      micro_concept,
      topic,
      tier_1_foundation: {
        mental_model: `Think of ${micro_concept} not as an abstract definition, but as a balance equation. When input energy or signals enter the boundary, they either accumulate within state variables or dissipate across impedance barriers. You cannot violate the conservation invariant.`,
        core_formula: `State Transformation: Delta(State) = Input - Output - Dissipation`,
        timestamp_hint: `Rewatch the lecture segment around 06:30 where the lecturer illustrates boundary conditions and state diagrams.`
      },
      tier_2_discrimination: {
        misconception: `Assuming that ${micro_concept} behaves identically in dynamic transients as it does in steady-state equilibrium.`,
        corrective_rule: `Always separate instantaneous dynamic boundary conditions from long-term asymptotic equilibrium behavior.`,
        contrast_table: [
          {
            faulty_belief: `Treating ${micro_concept} as an unconstrained independent variable.`,
            scientific_reality: `It is tightly coupled to state constraints and conservation boundaries.`
          },
          {
            faulty_belief: `Assuming ideal 100% lossless conversion occurs spontaneously.`,
            scientific_reality: `Second-law and resistive dissipations ensure non-zero irreversible losses in every real-world transition.`
          }
        ]
      },
      tier_3_drills: [
        {
          question_text: `Under ideal boundary conditions for ${micro_concept}, which physical parameter remains invariant?`,
          options: [
            `Total energy/information within the closed system boundary`,
            `Instantaneous velocity regardless of applied force`,
            `Arbitrary heat transfer without temperature gradient`,
            `Static pressure when fluid velocity approaches Mach 1`
          ],
          correct_option_index: 0,
          explanation: `Conservation within a defined closed boundary requires total energy/information to remain strictly invariant.`
        },
        {
          question_text: `If a system violates ${micro_concept} constraints during a transient phase, what is the corrective mechanism?`,
          options: [
            `Damping or negative feedback drives the system back toward stable equilibrium`,
            `The system produces infinite energy output indefinitely`,
            `The physical laws invert their sign convention permanently`,
            `All state variables freeze at zero`
          ],
          correct_option_index: 0,
          explanation: `Physical stability is restored through intrinsic damping, resistance, or feedback mechanisms that dissipate excess state energy.`
        }
      ]
    };
  }
}
