-- =============================================
-- KHAATA — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- ============ TABLE: homes ============
CREATE TABLE IF NOT EXISTS public.homes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_name   TEXT NOT NULL,
  join_code   TEXT NOT NULL UNIQUE,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TABLE: users ============
CREATE TABLE IF NOT EXISTS public.users (
  id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name     TEXT,
  email    TEXT,
  home_id  UUID REFERENCES public.homes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TABLE: expenses ============
CREATE TABLE IF NOT EXISTS public.expenses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id    UUID NOT NULL REFERENCES public.homes(id) ON DELETE CASCADE,
  item_name  TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'others',
  amount     NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  notes      TEXT,
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  added_by   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_expenses_home_id ON public.expenses(home_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_users_home_id ON public.users(home_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.homes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- ---- HOMES policies ----

-- Anyone authenticated can read a home (needed for join by code)
CREATE POLICY "homes_select" ON public.homes
  FOR SELECT TO authenticated
  USING (true);

-- Only authenticated users can create a home
CREATE POLICY "homes_insert" ON public.homes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Only the creator can update/delete their home
CREATE POLICY "homes_update" ON public.homes
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "homes_delete" ON public.homes
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- ---- USERS policies ----

-- Users can read members of their own home
CREATE POLICY "users_select" ON public.users
  FOR SELECT TO authenticated
  USING (
    home_id IS NULL OR
    home_id = (SELECT home_id FROM public.users WHERE id = auth.uid())
  );

-- Users can insert their own row
CREATE POLICY "users_insert" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- ---- EXPENSES policies ----

-- Users can only read expenses from their own home
CREATE POLICY "expenses_select" ON public.expenses
  FOR SELECT TO authenticated
  USING (
    home_id = (SELECT home_id FROM public.users WHERE id = auth.uid())
  );

-- Users can only add expenses to their own home
CREATE POLICY "expenses_insert" ON public.expenses
  FOR INSERT TO authenticated
  WITH CHECK (
    home_id = (SELECT home_id FROM public.users WHERE id = auth.uid())
  );

-- Users can update any expense in their home (family system)
CREATE POLICY "expenses_update" ON public.expenses
  FOR UPDATE TO authenticated
  USING (
    home_id = (SELECT home_id FROM public.users WHERE id = auth.uid())
  );

-- Users can delete any expense in their home (family system)
CREATE POLICY "expenses_delete" ON public.expenses
  FOR DELETE TO authenticated
  USING (
    home_id = (SELECT home_id FROM public.users WHERE id = auth.uid())
  );

-- ============================================
-- REALTIME (enable for expenses table)
-- ============================================
-- Run this to enable realtime on the expenses table:
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;

-- ============================================
-- DONE! Your database is ready.
-- ============================================

