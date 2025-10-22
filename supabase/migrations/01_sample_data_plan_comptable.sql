-- ============================================
-- Données d'exemple : Plan Comptable Français Standard
-- ============================================
-- Ce fichier est OPTIONNEL
-- Il permet de pré-remplir le plan comptable avec les comptes standards
--
-- IMPORTANT : Ce script ajoute les comptes pour TOUS les utilisateurs
-- Si vous préférez créer vos comptes manuellement, ignorez ce fichier
-- ============================================

-- Note: Vous devez remplacer 'VOTRE-USER-ID' par votre vrai user_id
-- Pour obtenir votre user_id:
-- 1. Créez un compte dans l'application
-- 2. Allez dans SQL Editor
-- 3. Exécutez: SELECT id, email FROM auth.users;
-- 4. Copiez l'ID et remplacez dans ce script

-- ============================================
-- CLASSE 1 : COMPTES DE CAPITAUX
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('101000', 'Capital', 'VOTRE-USER-ID'),
('106000', 'Réserves', 'VOTRE-USER-ID'),
('108000', 'Compte de l''exploitant', 'VOTRE-USER-ID'),
('110000', 'Report à nouveau (solde créditeur)', 'VOTRE-USER-ID'),
('119000', 'Report à nouveau (solde débiteur)', 'VOTRE-USER-ID'),
('120000', 'Résultat de l''exercice (bénéfice)', 'VOTRE-USER-ID'),
('129000', 'Résultat de l''exercice (perte)', 'VOTRE-USER-ID'),
('164000', 'Emprunts auprès des établissements de crédit', 'VOTRE-USER-ID'),
('168000', 'Autres emprunts et dettes assimilées', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 2 : COMPTES D'IMMOBILISATIONS
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('205000', 'Concessions et droits similaires, brevets, licences, marques', 'VOTRE-USER-ID'),
('206000', 'Droit au bail', 'VOTRE-USER-ID'),
('207000', 'Fonds commercial', 'VOTRE-USER-ID'),
('211000', 'Terrains', 'VOTRE-USER-ID'),
('213000', 'Constructions', 'VOTRE-USER-ID'),
('215000', 'Installations techniques, matériel et outillage industriels', 'VOTRE-USER-ID'),
('218000', 'Autres immobilisations corporelles', 'VOTRE-USER-ID'),
('218100', 'Installations générales, agencements, aménagements divers', 'VOTRE-USER-ID'),
('218300', 'Matériel de bureau et matériel informatique', 'VOTRE-USER-ID'),
('218400', 'Mobilier', 'VOTRE-USER-ID'),
('218500', 'Matériel de transport', 'VOTRE-USER-ID'),
('280000', 'Amortissements des immobilisations incorporelles', 'VOTRE-USER-ID'),
('281000', 'Amortissements des immobilisations corporelles', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 3 : COMPTES DE STOCKS
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('310000', 'Matières premières', 'VOTRE-USER-ID'),
('320000', 'Autres approvisionnements', 'VOTRE-USER-ID'),
('355000', 'Produits finis', 'VOTRE-USER-ID'),
('370000', 'Stocks de marchandises', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 4 : COMPTES DE TIERS
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('400000', 'Fournisseurs', 'VOTRE-USER-ID'),
('401000', 'Fournisseurs - Achats de biens et de prestations de services', 'VOTRE-USER-ID'),
('404000', 'Fournisseurs d''immobilisations', 'VOTRE-USER-ID'),
('408000', 'Fournisseurs - Factures non parvenues', 'VOTRE-USER-ID'),
('409000', 'Fournisseurs débiteurs', 'VOTRE-USER-ID'),
('410000', 'Clients', 'VOTRE-USER-ID'),
('411000', 'Clients - Ventes de biens ou de prestations de services', 'VOTRE-USER-ID'),
('416000', 'Clients douteux ou litigieux', 'VOTRE-USER-ID'),
('418000', 'Clients - Produits non encore facturés', 'VOTRE-USER-ID'),
('419000', 'Clients créditeurs', 'VOTRE-USER-ID'),
('421000', 'Personnel - Rémunérations dues', 'VOTRE-USER-ID'),
('425000', 'Personnel - Avances et acomptes', 'VOTRE-USER-ID'),
('428000', 'Personnel - Charges à payer et produits à recevoir', 'VOTRE-USER-ID'),
('431000', 'Sécurité sociale', 'VOTRE-USER-ID'),
('437000', 'Autres organismes sociaux', 'VOTRE-USER-ID'),
('443000', 'Opérations particulières avec l''État', 'VOTRE-USER-ID'),
('445000', 'État - Taxes sur le chiffre d''affaires', 'VOTRE-USER-ID'),
('445100', 'État - TVA à décaisser', 'VOTRE-USER-ID'),
('445200', 'État - TVA due intracommunautaire', 'VOTRE-USER-ID'),
('445510', 'TVA à décaisser', 'VOTRE-USER-ID'),
('445620', 'TVA sur immobilisations', 'VOTRE-USER-ID'),
('445660', 'TVA sur autres biens et services', 'VOTRE-USER-ID'),
('445670', 'Crédit de TVA à reporter', 'VOTRE-USER-ID'),
('445710', 'TVA collectée', 'VOTRE-USER-ID'),
('455000', 'Associés - Comptes courants', 'VOTRE-USER-ID'),
('456000', 'Associés - Opérations sur le capital', 'VOTRE-USER-ID'),
('467000', 'Autres comptes débiteurs ou créditeurs', 'VOTRE-USER-ID'),
('468000', 'Divers - Charges à payer et produits à recevoir', 'VOTRE-USER-ID'),
('471000', 'Comptes d''attente', 'VOTRE-USER-ID'),
('486000', 'Charges constatées d''avance', 'VOTRE-USER-ID'),
('487000', 'Produits constatés d''avance', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 5 : COMPTES FINANCIERS
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('512000', 'Banques', 'VOTRE-USER-ID'),
('512100', 'Compte courant bancaire', 'VOTRE-USER-ID'),
('512200', 'Compte d''épargne', 'VOTRE-USER-ID'),
('530000', 'Caisse', 'VOTRE-USER-ID'),
('540000', 'Valeurs mobilières de placement', 'VOTRE-USER-ID'),
('580000', 'Virements internes', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 6 : COMPTES DE CHARGES
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('601000', 'Achats stockés - Matières premières', 'VOTRE-USER-ID'),
('602000', 'Achats stockés - Autres approvisionnements', 'VOTRE-USER-ID'),
('606000', 'Achats non stockés de matières et fournitures', 'VOTRE-USER-ID'),
('606100', 'Fournitures non stockables', 'VOTRE-USER-ID'),
('606300', 'Fournitures d''entretien et de petit équipement', 'VOTRE-USER-ID'),
('606400', 'Fournitures administratives', 'VOTRE-USER-ID'),
('607000', 'Achats de marchandises', 'VOTRE-USER-ID'),
('611000', 'Sous-traitance générale', 'VOTRE-USER-ID'),
('613000', 'Locations', 'VOTRE-USER-ID'),
('614000', 'Charges locatives et de copropriété', 'VOTRE-USER-ID'),
('615000', 'Entretien et réparations', 'VOTRE-USER-ID'),
('616000', 'Primes d''assurances', 'VOTRE-USER-ID'),
('618000', 'Divers', 'VOTRE-USER-ID'),
('621000', 'Personnel extérieur à l''entreprise', 'VOTRE-USER-ID'),
('622000', 'Rémunérations d''intermédiaires et honoraires', 'VOTRE-USER-ID'),
('623000', 'Publicité, publications, relations publiques', 'VOTRE-USER-ID'),
('624000', 'Transports de biens et transports collectifs du personnel', 'VOTRE-USER-ID'),
('625000', 'Déplacements, missions et réceptions', 'VOTRE-USER-ID'),
('626000', 'Frais postaux et de télécommunications', 'VOTRE-USER-ID'),
('627000', 'Services bancaires et assimilés', 'VOTRE-USER-ID'),
('628000', 'Divers', 'VOTRE-USER-ID'),
('631000', 'Impôts, taxes et versements assimilés sur rémunérations', 'VOTRE-USER-ID'),
('633000', 'Impôts, taxes et versements assimilés sur rémunérations', 'VOTRE-USER-ID'),
('635000', 'Autres impôts, taxes et versements assimilés', 'VOTRE-USER-ID'),
('641000', 'Rémunérations du personnel', 'VOTRE-USER-ID'),
('645000', 'Charges de sécurité sociale et de prévoyance', 'VOTRE-USER-ID'),
('647000', 'Autres charges sociales', 'VOTRE-USER-ID'),
('661000', 'Charges d''intérêts', 'VOTRE-USER-ID'),
('665000', 'Escomptes accordés', 'VOTRE-USER-ID'),
('668000', 'Autres charges financières', 'VOTRE-USER-ID'),
('681000', 'Dotations aux amortissements et aux provisions - Charges d''exploitation', 'VOTRE-USER-ID'),
('686000', 'Dotations aux amortissements et aux provisions - Charges financières', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- CLASSE 7 : COMPTES DE PRODUITS
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('701000', 'Ventes de produits finis', 'VOTRE-USER-ID'),
('706000', 'Prestations de services', 'VOTRE-USER-ID'),
('707000', 'Ventes de marchandises', 'VOTRE-USER-ID'),
('708000', 'Produits des activités annexes', 'VOTRE-USER-ID'),
('713000', 'Variation des stocks (en-cours de production, produits)', 'VOTRE-USER-ID'),
('740000', 'Subventions d''exploitation', 'VOTRE-USER-ID'),
('758000', 'Produits divers de gestion courante', 'VOTRE-USER-ID'),
('761000', 'Produits de participations', 'VOTRE-USER-ID'),
('764000', 'Revenus des valeurs mobilières de placement', 'VOTRE-USER-ID'),
('765000', 'Escomptes obtenus', 'VOTRE-USER-ID'),
('768000', 'Autres produits financiers', 'VOTRE-USER-ID'),
('775000', 'Produits des cessions d''éléments d''actif', 'VOTRE-USER-ID'),
('778000', 'Autres produits exceptionnels', 'VOTRE-USER-ID'),
('781000', 'Reprises sur amortissements et provisions - Produits d''exploitation', 'VOTRE-USER-ID'),
('786000', 'Reprises sur provisions pour risques - Produits financiers', 'VOTRE-USER-ID'),
('787000', 'Reprises sur provisions - Produits exceptionnels', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- COMPTES SPÉCIFIQUES POUR CLUB DE HOCKEY
-- ============================================
INSERT INTO public.accounts (account_number, label, user_id) VALUES
('706100', 'Cotisations des membres', 'VOTRE-USER-ID'),
('706200', 'Vente de billets - Matchs', 'VOTRE-USER-ID'),
('706300', 'Stages et formations', 'VOTRE-USER-ID'),
('740100', 'Subventions municipales', 'VOTRE-USER-ID'),
('740200', 'Subventions fédérales', 'VOTRE-USER-ID'),
('758100', 'Dons et mécénat', 'VOTRE-USER-ID'),
('606500', 'Équipements sportifs', 'VOTRE-USER-ID'),
('613100', 'Location patinoire', 'VOTRE-USER-ID'),
('622100', 'Honoraires entraîneurs', 'VOTRE-USER-ID'),
('625100', 'Déplacements équipes', 'VOTRE-USER-ID')
ON CONFLICT (account_number, user_id) DO NOTHING;

-- ============================================
-- Message de confirmation
-- ============================================
-- Si vous voyez ce message, le plan comptable a été ajouté avec succès !
SELECT 'Plan comptable ajouté avec succès !' as message,
       COUNT(*) as nombre_comptes
FROM public.accounts
WHERE user_id = 'VOTRE-USER-ID';
