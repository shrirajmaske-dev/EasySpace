import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';

import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { SearchCurationPage } from './pages/SearchCurationPage.jsx';
import { LearningWorkspacePage } from './pages/LearningWorkspacePage.jsx';
import { DiagnosticQuizPage } from './pages/DiagnosticQuizPage.jsx';
import { DiagnosticResultsPage } from './pages/DiagnosticResultsPage.jsx';
import { RemediationPage } from './pages/RemediationPage.jsx';
import { MasteryLedgerPage } from './pages/MasteryLedgerPage.jsx';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-cyan-400 font-mono space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center animate-spin shadow-glow-cyan">
          <div className="w-4 h-4 rounded-full bg-cyan-400" />
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-wider">INITIALIZING EASYSPACE COGNITIVE ENGINE...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Main App Layout with Navbar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <Navbar />
      <main className="flex-1 pb-16">
        {children}
      </main>
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-slate-500 font-mono bg-surface-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">EasySpace Academic Platform</span>
            <span>&bull;</span>
            <span>AI Diagnostic & Closed-Loop Remediation</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Engineered for STEM Mastery &bull; Noise-Free Lecture Curation &bull; 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<LoginPage />} />

            {/* Protected Application Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SearchCurationPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/learn/:pathId/video/:videoId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LearningWorkspacePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/diagnostic/:quizId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DiagnosticQuizPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/diagnostic/:quizId/results"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DiagnosticResultsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/diagnostic/attempt/:attemptId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DiagnosticResultsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/remediation/:remediationId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RemediationPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mastery"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MasteryLedgerPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
