-- ============================================================
-- CareerAI — schema for your own Supabase project
-- Project: lhktbabwrnjinnfhdelb.supabase.co
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- ============================================================

-- 1. ROLES ENUM + helpers ------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 2. PROFILES ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE,
  display_name text,
  headline     text,
  bio          text,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"      ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"      ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. USER_ROLES ----------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  role       public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "Users can view own roles"  ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 4. JOBS ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  company      text NOT NULL,
  location     text NOT NULL,
  job_type     text NOT NULL DEFAULT 'Full-time',
  salary_range text,
  description  text NOT NULL,
  apply_url    text NOT NULL,
  tags         text[] NOT NULL DEFAULT '{}',
  is_remote    boolean NOT NULL DEFAULT false,
  posted_at    timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);

-- 5. SAVED_JOBS ----------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  job_id     uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Users save jobs"           ON public.saved_jobs;
DROP POLICY IF EXISTS "Users unsave jobs"         ON public.saved_jobs;
CREATE POLICY "Users view own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users save jobs"           ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unsave jobs"         ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- 6. CONTACT_MESSAGES ----------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can read contact"   ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact"   ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 7. AUTO-CREATE PROFILE ON SIGNUP ---------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DONE -------------------------------------------------------
