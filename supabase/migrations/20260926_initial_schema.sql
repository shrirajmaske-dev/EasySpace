-- EasySpace: Master Database Migration for Supabase PostgreSQL
-- Version: 20260926_initial_schema.sql
-- Enables UUID generation and sets up complete schema, constraints, indexes, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    academic_institution TEXT,
    field_of_study TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. LEARNING PATHS (Curated sequences)
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query_topic TEXT NOT NULL,
    discipline TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    target_difficulty TEXT CHECK (target_difficulty IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
    status TEXT CHECK (status IN ('in_progress', 'completed', 'archived')) DEFAULT 'in_progress' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CURATED VIDEOS
CREATE TABLE IF NOT EXISTS public.curated_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    youtube_video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    core_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. DIAGNOSTIC QUIZZES
CREATE TABLE IF NOT EXISTS public.diagnostic_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    curated_video_id UUID NOT NULL REFERENCES public.curated_videos(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.diagnostic_quizzes(id) ON DELETE CASCADE,
    micro_concept TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Basic', 'Conceptual', 'Application')) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings ["A", "B", "C", "D"]
    correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
    explanation TEXT NOT NULL,
    distractor_rationales JSONB NOT NULL -- Object mapping index to reason: {"0": "...", "1": "..."}
);

-- 6. QUIZ ATTEMPTS & DIAGNOSTIC ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.diagnostic_quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_score NUMERIC(5,2) NOT NULL,
    total_possible INTEGER NOT NULL,
    accuracy_percentage NUMERIC(5,2) NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    user_answers JSONB NOT NULL, -- Array of selected option indices
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. CONCEPT MASTERY LEDGER (Longitudinal Tracking)
CREATE TABLE IF NOT EXISTS public.concept_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    micro_concept TEXT NOT NULL,
    mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0.00, -- 0.00 to 100.00
    status TEXT CHECK (status IN ('Critical Deficit', 'Developing', 'Mastered')) NOT NULL,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    attempts_count INTEGER DEFAULT 1 NOT NULL,
    CONSTRAINT user_micro_concept_unique UNIQUE (user_id, topic, micro_concept)
);

-- 8. ADAPTIVE REMEDIATION SESSIONS
CREATE TABLE IF NOT EXISTS public.remediation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    micro_concept TEXT NOT NULL,
    topic TEXT NOT NULL,
    baseline_score NUMERIC(5,2) NOT NULL,
    post_remediation_score NUMERIC(5,2),
    tier_1_foundation JSONB NOT NULL, -- { mental_model: "", core_formula: "", timestamp_hint: "" }
    tier_2_discrimination JSONB NOT NULL, -- { misconception: "", corrective_rule: "", contrast_table: [] }
    tier_3_drills JSONB NOT NULL, -- Array of 2 verification questions with options, answers, rationales
    status TEXT CHECK (status IN ('pending', 'in_progress', 'resolved')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- INDEXES FOR SCALE
CREATE INDEX IF NOT EXISTS idx_curated_videos_path ON public.curated_videos(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_lookup ON public.concept_mastery(user_id, topic, micro_concept);
CREATE INDEX IF NOT EXISTS idx_remediation_sessions_user ON public.remediation_sessions(user_id, status);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remediation_sessions ENABLE ROW LEVEL SECURITY;

-- DROP POLICIES IF EXIST FOR CLEAN RE-APPLICATION
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can manage own learning paths" ON public.learning_paths;
    DROP POLICY IF EXISTS "Users can access videos in own paths" ON public.curated_videos;
    DROP POLICY IF EXISTS "Users can access quizzes in own paths" ON public.diagnostic_quizzes;
    DROP POLICY IF EXISTS "Users can view questions in own quizzes" ON public.quiz_questions;
    DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
    DROP POLICY IF EXISTS "Users can manage own concept mastery" ON public.concept_mastery;
    DROP POLICY IF EXISTS "Users can manage own remediation sessions" ON public.remediation_sessions;
END
$$;

-- 1. Profiles: Users can only read & update their own profile
CREATE POLICY "Users can manage own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- 2. Learning Paths: Isolated to owning user
CREATE POLICY "Users can manage own learning paths"
    ON public.learning_paths FOR ALL
    USING (auth.uid() = user_id);

-- 3. Curated Videos: Accessible if path belongs to user
CREATE POLICY "Users can access videos in own paths"
    ON public.curated_videos FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE public.learning_paths.id = public.curated_videos.learning_path_id
        AND public.learning_paths.user_id = auth.uid()
    ));

-- 4. Diagnostic Quizzes: Accessible if path belongs to user
CREATE POLICY "Users can access quizzes in own paths"
    ON public.diagnostic_quizzes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE public.learning_paths.id = public.diagnostic_quizzes.learning_path_id
        AND public.learning_paths.user_id = auth.uid()
    ));

-- 5. Quiz Questions: Read-only access through owned quiz
CREATE POLICY "Users can view questions in own quizzes"
    ON public.quiz_questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.diagnostic_quizzes
        JOIN public.learning_paths ON public.learning_paths.id = public.diagnostic_quizzes.learning_path_id
        WHERE public.diagnostic_quizzes.id = public.quiz_questions.quiz_id
        AND public.learning_paths.user_id = auth.uid()
    ));

-- 6. Quiz Attempts: Strict owner isolation
CREATE POLICY "Users can manage own quiz attempts"
    ON public.quiz_attempts FOR ALL
    USING (auth.uid() = user_id);

-- 7. Concept Mastery: Strict owner isolation
CREATE POLICY "Users can manage own concept mastery"
    ON public.concept_mastery FOR ALL
    USING (auth.uid() = user_id);

-- 8. Remediation Sessions: Strict owner isolation
CREATE POLICY "Users can manage own remediation sessions"
    ON public.remediation_sessions FOR ALL
    USING (auth.uid() = user_id);

-- TRIGGER TO AUTOMATICALLY INSERT PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
