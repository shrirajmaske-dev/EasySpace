import { create } from 'zustand';

export const useMasteryStore = create((set, get) => ({
  // Active Path & Video
  currentPath: null,
  currentVideos: [],
  currentVideo: null,

  setCurrentPath: (path, videos = []) => set({ currentPath: path, currentVideos: videos }),
  setCurrentVideo: (video) => set({ currentVideo: video }),

  // Active Diagnostic Quiz
  activeQuiz: null,
  quizQuestions: [],
  quizAnswers: {},
  quizConfidence: {},

  setActiveQuiz: (quiz, questions) =>
    set({
      activeQuiz: quiz,
      quizQuestions: questions,
      quizAnswers: {},
      quizConfidence: {},
    }),

  setQuizAnswer: (questionIndex, optionIndex) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [questionIndex]: optionIndex },
    })),

  setQuizConfidence: (questionIndex, confidence) =>
    set((state) => ({
      quizConfidence: { ...state.quizConfidence, [questionIndex]: confidence },
    })),

  resetQuiz: () =>
    set({
      activeQuiz: null,
      quizQuestions: [],
      quizAnswers: {},
      quizConfidence: {},
    }),

  // Last Quiz Attempt Results & Matrix
  lastAttemptResult: null,
  setLastAttemptResult: (result) => set({ lastAttemptResult: result }),

  // Active Remediation Session
  activeRemediation: null,
  setActiveRemediation: (session) => set({ activeRemediation: session }),

  // Longitudinal Mastery Ledger
  masterySummary: null,
  setMasterySummary: (summary) => set({ masterySummary: summary }),

  // Pending Remediations
  pendingRemediations: [],
  setPendingRemediations: (list) => set({ pendingRemediations: list }),
}));
