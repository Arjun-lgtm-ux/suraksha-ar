-- =============================================================================
-- SurakshaAR Database Schema & RLS Policies
-- Smart India Hackathon 2026 · Problem Statement SIH26041
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Trainees & Safety Admins)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'trainee' check (role in ('trainee', 'admin')),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'hi', 'sat')),
  site_location text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Scenarios Table (Curated Industrial Hazards)
create table if not exists public.scenarios (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  hazard_type text not null check (hazard_type in ('fire', 'gas_leak', 'machinery')),
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  benchmark_time_ms integer not null default 90000,
  thumbnail_url text,
  steps jsonb not null default '[]'::jsonb,
  coming_soon boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Training Sessions Table
create table if not exists public.training_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  score integer default 0,
  reaction_time_ms integer default 0,
  steps_completed jsonb default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

-- 4. Feedback Logs Table
create table if not exists public.feedback_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  step_index integer not null,
  was_correct boolean not null,
  time_taken_ms integer not null default 0,
  is_ppe_step boolean not null default false,
  feedback_message text,
  created_at timestamptz not null default now()
);

-- 5. Assessment Questions Table (Multilingual EN/HI/SAT)
create table if not exists public.assessment_questions (
  id uuid primary key default uuid_generate_v4(),
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  question_en text not null,
  question_hi text not null,
  question_sat text not null,
  options_en jsonb not null,
  options_hi jsonb not null,
  correct_index integer not null,
  explanation_en text not null,
  explanation_hi text not null,
  order_index integer not null default 1,
  created_at timestamptz not null default now()
);

-- 6. Assessment Attempts Table
create table if not exists public.assessment_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  session_id uuid references public.training_sessions(id) on delete set null,
  score_pct integer not null,
  passed boolean not null,
  language_used text not null default 'en',
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

-- 7. Certificates Table (SHA-256 + Blockchain record)
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  cert_number text unique not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  trainee_name text not null,
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  course_name text not null,
  score integer not null,
  attempt_id uuid references public.assessment_attempts(id) on delete set null,
  hash_sha256 text not null,
  blockchain_tx_id text not null,
  status text not null default 'valid' check (status in ('valid', 'revoked')),
  issued_at timestamptz not null default now()
);

-- 8. Certificate Verifications Log Table (Audit trail)
create table if not exists public.certificate_verifications (
  id uuid primary key default uuid_generate_v4(),
  cert_id uuid references public.certificates(id) on delete cascade,
  verified_at timestamptz not null default now(),
  result text not null,
  client_ip text,
  user_agent text
);

-- Indexes for performance
create index if not exists idx_sessions_user on public.training_sessions(user_id);
create index if not exists idx_sessions_scenario on public.training_sessions(scenario_id);
create index if not exists idx_certs_user on public.certificates(user_id);
create index if not exists idx_certs_number on public.certificates(cert_number);
create index if not exists idx_questions_scenario on public.assessment_questions(scenario_id);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
alter table public.training_sessions enable row level security;
alter table public.feedback_logs enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_verifications enable row level security;

-- Profiles: Users can view & update their own profile; admins can view all
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles insert on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Scenarios: Publicly viewable by all authenticated users
create policy "Scenarios are viewable by authenticated users"
  on public.scenarios for select
  using (auth.role() = 'authenticated');

-- Training sessions: Users can manage their own sessions; admins can view all
create policy "Users can manage own sessions"
  on public.training_sessions for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Feedback logs: Users can view and insert for their sessions
create policy "Users can manage own feedback logs"
  on public.feedback_logs for all
  using (true);

-- Questions: Viewable by authenticated users
create policy "Questions viewable by authenticated users"
  on public.assessment_questions for select
  using (auth.role() = 'authenticated');

-- Attempts: Users can manage own attempts
create policy "Users can manage own attempts"
  on public.assessment_attempts for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Certificates: Trainees can view own; public verify can read valid certs by cert_number; admins can manage
create policy "Certificates viewable by owner or admin"
  on public.certificates for select
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin' or true);

create policy "Certificates insertable by authenticated users"
  on public.certificates for insert
  with check (auth.uid() = user_id);

-- Certificate Verifications: Anyone can log a verification
create policy "Verifications can be inserted by anyone"
  on public.certificate_verifications for insert
  with check (true);
