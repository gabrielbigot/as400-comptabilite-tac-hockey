-- ============================================
-- Script de création complète de la base de données
-- Application AS/400 Comptabilité TAC Hockey Club
-- ============================================

-- Suppression des tables existantes (si elles existent)
DROP TABLE IF EXISTS public.journal_entries CASCADE;
DROP TABLE IF EXISTS public.journals CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.regles CASCADE;

-- ============================================
-- Table: companies (Sociétés)
-- ============================================
CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_companies_user_id ON public.companies(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs ne peuvent voir que leurs propres sociétés
CREATE POLICY "Users can view their own companies"
    ON public.companies FOR SELECT
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent créer leurs propres sociétés
CREATE POLICY "Users can create their own companies"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent modifier leurs propres sociétés
CREATE POLICY "Users can update their own companies"
    ON public.companies FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent supprimer leurs propres sociétés
CREATE POLICY "Users can delete their own companies"
    ON public.companies FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Table: accounts (Comptes comptables)
-- ============================================
CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    account_number text NOT NULL,
    label text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(account_number, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_account_number ON public.accounts(account_number);

-- Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs ne peuvent voir que leurs propres comptes
CREATE POLICY "Users can view their own accounts"
    ON public.accounts FOR SELECT
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent créer leurs propres comptes
CREATE POLICY "Users can create their own accounts"
    ON public.accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent modifier leurs propres comptes
CREATE POLICY "Users can update their own accounts"
    ON public.accounts FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent supprimer leurs propres comptes
CREATE POLICY "Users can delete their own accounts"
    ON public.accounts FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Table: journals (Journaux comptables)
-- ============================================
CREATE TABLE public.journals (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(code, company_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_journals_company_id ON public.journals(company_id);
CREATE INDEX idx_journals_user_id ON public.journals(user_id);
CREATE INDEX idx_journals_code ON public.journals(code);

-- Row Level Security (RLS)
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs ne peuvent voir que leurs propres journaux
CREATE POLICY "Users can view their own journals"
    ON public.journals FOR SELECT
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent créer leurs propres journaux
CREATE POLICY "Users can create their own journals"
    ON public.journals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent modifier leurs propres journaux
CREATE POLICY "Users can update their own journals"
    ON public.journals FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent supprimer leurs propres journaux
CREATE POLICY "Users can delete their own journals"
    ON public.journals FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Table: journal_entries (Écritures comptables)
-- ============================================
CREATE TABLE public.journal_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    compte text NOT NULL,
    s text NOT NULL, -- 'D' pour débit, 'C' pour crédit
    montant numeric NOT NULL,
    libelle text NOT NULL,
    date text NOT NULL, -- Format DD/MM/YYYY
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    journal_id uuid NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
    batch_id uuid NULL -- Pour regrouper les écritures par lot
);

-- Index pour améliorer les performances
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_company_id ON public.journal_entries(company_id);
CREATE INDEX idx_journal_entries_journal_id ON public.journal_entries(journal_id);
CREATE INDEX idx_journal_entries_compte ON public.journal_entries(compte);
CREATE INDEX idx_journal_entries_batch_id ON public.journal_entries(batch_id);
CREATE INDEX idx_journal_entries_date ON public.journal_entries(date);

-- Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs ne peuvent voir que leurs propres écritures
CREATE POLICY "Users can view their own journal entries"
    ON public.journal_entries FOR SELECT
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent créer leurs propres écritures
CREATE POLICY "Users can create their own journal entries"
    ON public.journal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent modifier leurs propres écritures
CREATE POLICY "Users can update their own journal entries"
    ON public.journal_entries FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent supprimer leurs propres écritures
CREATE POLICY "Users can delete their own journal entries"
    ON public.journal_entries FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Table: regles (Règles de comptabilisation)
-- ============================================
CREATE TABLE public.regles (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "Quand" text NULL,
    "Alors" text NULL,
    "Débit" text NULL,
    "Crédit" text NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.regles ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Tous les utilisateurs authentifiés peuvent voir les règles
CREATE POLICY "Authenticated users can view rules"
    ON public.regles FOR SELECT
    USING (auth.role() = 'authenticated');

-- Politique RLS : Tous les utilisateurs authentifiés peuvent créer des règles
CREATE POLICY "Authenticated users can create rules"
    ON public.regles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Politique RLS : Tous les utilisateurs authentifiés peuvent modifier des règles
CREATE POLICY "Authenticated users can update rules"
    ON public.regles FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Politique RLS : Tous les utilisateurs authentifiés peuvent supprimer des règles
CREATE POLICY "Authenticated users can delete rules"
    ON public.regles FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================
-- Commentaires sur les tables
-- ============================================
COMMENT ON TABLE public.companies IS 'Sociétés gérées par les utilisateurs';
COMMENT ON TABLE public.accounts IS 'Plan comptable (comptes)';
COMMENT ON TABLE public.journals IS 'Journaux comptables (achats, ventes, banque, etc.)';
COMMENT ON TABLE public.journal_entries IS 'Écritures comptables';
COMMENT ON TABLE public.regles IS 'Règles de comptabilisation automatique';
