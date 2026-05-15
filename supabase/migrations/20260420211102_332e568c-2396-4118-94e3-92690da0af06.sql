
-- =========== Shared timestamp trigger ===========
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========== Profiles ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== Roles (separate table — secure) ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =========== Contact messages ===========
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact"
  ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact"
  ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =========== Jobs ===========
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  salary_range TEXT,
  description TEXT NOT NULL,
  apply_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_remote BOOLEAN NOT NULL DEFAULT false,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
  ON public.jobs FOR SELECT USING (true);

-- Seed sample jobs
INSERT INTO public.jobs (title, company, location, job_type, salary_range, description, apply_url, tags, is_remote) VALUES
('Senior Frontend Engineer', 'Stripe', 'San Francisco, CA', 'Full-time', '$160k - $220k', 'Build delightful interfaces for millions of businesses using React, TypeScript, and modern web tech.', 'https://stripe.com/jobs', ARRAY['React','TypeScript','CSS'], false),
('AI/ML Engineer', 'OpenAI', 'Remote', 'Full-time', '$200k - $320k', 'Train and deploy large-scale ML models. Strong Python and PyTorch background required.', 'https://openai.com/careers', ARRAY['Python','PyTorch','LLM'], true),
('Product Designer', 'Linear', 'Remote', 'Full-time', '$140k - $190k', 'Design beautiful, fast software tools for high-performance teams.', 'https://linear.app/careers', ARRAY['Figma','UI/UX','Product'], true),
('Backend Engineer', 'Vercel', 'New York, NY', 'Full-time', '$170k - $230k', 'Scale infrastructure that powers millions of websites globally.', 'https://vercel.com/careers', ARRAY['Node.js','Go','AWS'], false),
('Data Scientist', 'Airbnb', 'Remote', 'Full-time', '$150k - $210k', 'Use data to shape product strategy and improve guest experiences.', 'https://careers.airbnb.com', ARRAY['SQL','Python','Statistics'], true),
('DevOps Engineer', 'GitHub', 'Remote', 'Full-time', '$155k - $210k', 'Maintain reliable, secure infrastructure for the world''s largest developer platform.', 'https://github.com/careers', ARRAY['Kubernetes','Terraform','AWS'], true),
('Mobile Engineer (iOS)', 'Notion', 'San Francisco, CA', 'Full-time', '$170k - $230k', 'Craft Notion''s native iOS experience used by millions worldwide.', 'https://notion.so/careers', ARRAY['Swift','iOS','UIKit'], false),
('Junior Software Engineer', 'Shopify', 'Toronto, Canada', 'Full-time', '$90k - $120k', 'Start your career building commerce tools used by millions of merchants.', 'https://shopify.com/careers', ARRAY['Ruby','Rails','React'], false);

-- =========== Saved jobs ===========
CREATE TABLE public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own saved jobs"
  ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users save jobs"
  ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unsave jobs"
  ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);
