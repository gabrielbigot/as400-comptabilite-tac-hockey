-- Script de génération de données de test pour l'application AS/400 Comptabilité TAC Hockey sur Gazon
-- Ce script génère des journaux, des comptes et des écritures comptables aléatoires
-- spécifiques aux activités d'un club de hockey sur gazon

-- IMPORTANT: Remplacez les valeurs suivantes avant d'exécuter ce script :
-- 1. Remplacez 'VOTRE_USER_ID' par votre UUID utilisateur (obtenu depuis auth.users)
-- 2. Remplacez 'VOTRE_COMPANY_ID' par votre UUID société (obtenu depuis companies)

-- Pour obtenir votre user_id :
-- SELECT id FROM auth.users WHERE email = 'votre@email.com';

-- Pour obtenir votre company_id :
-- SELECT id FROM companies WHERE name = 'Nom de votre société';

-- =============================================
-- VARIABLES À CONFIGURER (remplacez les valeurs)
-- =============================================
DO $$
DECLARE
    v_user_id UUID := 'VOTRE_USER_ID';  -- ⚠️ REMPLACEZ CETTE VALEUR
    v_company_id UUID := 'VOTRE_COMPANY_ID';  -- ⚠️ REMPLACEZ CETTE VALEUR

    -- Variables pour les journaux
    v_journal_ac_id UUID;
    v_journal_vt_id UUID;
    v_journal_bq_id UUID;
    v_journal_ca_id UUID;
    v_journal_od_id UUID;

    -- Variables pour la génération
    v_batch_id UUID;
    v_compte VARCHAR;
    v_date DATE;
    v_montant NUMERIC;
    v_libelle TEXT;
    i INTEGER;
    j INTEGER;
    v_nb_lignes INTEGER;
    v_total_debit NUMERIC;
    v_total_credit NUMERIC;
    v_compte_contrepartie VARCHAR;
BEGIN
    -- Vérification que les IDs ont été configurés
    IF v_user_id = 'VOTRE_USER_ID' OR v_company_id = 'VOTRE_COMPANY_ID' THEN
        RAISE EXCEPTION 'ERREUR: Vous devez configurer v_user_id et v_company_id dans le script avant de l''exécuter !';
    END IF;

    RAISE NOTICE '=== Début de la génération des données de test ===';

    -- =============================================
    -- 1. CRÉATION DES JOURNAUX
    -- =============================================
    RAISE NOTICE 'Création des journaux...';

    -- Journal Achats
    INSERT INTO journals (code, name, company_id, user_id)
    VALUES ('AC', 'Achats', v_company_id, v_user_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_journal_ac_id;

    IF v_journal_ac_id IS NULL THEN
        SELECT id INTO v_journal_ac_id FROM journals
        WHERE code = 'AC' AND company_id = v_company_id;
    END IF;

    -- Journal Ventes
    INSERT INTO journals (code, name, company_id, user_id)
    VALUES ('VT', 'Ventes', v_company_id, v_user_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_journal_vt_id;

    IF v_journal_vt_id IS NULL THEN
        SELECT id INTO v_journal_vt_id FROM journals
        WHERE code = 'VT' AND company_id = v_company_id;
    END IF;

    -- Journal Banque
    INSERT INTO journals (code, name, company_id, user_id)
    VALUES ('BQ', 'Banque', v_company_id, v_user_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_journal_bq_id;

    IF v_journal_bq_id IS NULL THEN
        SELECT id INTO v_journal_bq_id FROM journals
        WHERE code = 'BQ' AND company_id = v_company_id;
    END IF;

    -- Journal Caisse
    INSERT INTO journals (code, name, company_id, user_id)
    VALUES ('CA', 'Caisse', v_company_id, v_user_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_journal_ca_id;

    IF v_journal_ca_id IS NULL THEN
        SELECT id INTO v_journal_ca_id FROM journals
        WHERE code = 'CA' AND company_id = v_company_id;
    END IF;

    -- Journal Opérations Diverses
    INSERT INTO journals (code, name, company_id, user_id)
    VALUES ('OD', 'Opérations Diverses', v_company_id, v_user_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_journal_od_id;

    IF v_journal_od_id IS NULL THEN
        SELECT id INTO v_journal_od_id FROM journals
        WHERE code = 'OD' AND company_id = v_company_id;
    END IF;

    RAISE NOTICE 'Journaux créés avec succès';

    -- =============================================
    -- 2. CRÉATION DE COMPTES SUPPLÉMENTAIRES (Hockey sur Gazon)
    -- =============================================
    RAISE NOTICE 'Ajout de comptes supplémentaires...';

    INSERT INTO accounts (account_number, label, user_id) VALUES
    ('401000', 'Fournisseurs équipements sportifs', v_user_id),
    ('411000', 'Adhérents et licenciés', v_user_id),
    ('512000', 'Banque', v_user_id),
    ('530000', 'Caisse', v_user_id),
    ('445660', 'TVA déductible', v_user_id),
    ('445710', 'TVA collectée', v_user_id),
    ('606100', 'Achats équipements sportifs', v_user_id),
    ('606200', 'Achats crosses et balles', v_user_id),
    ('606300', 'Achats tenues et maillots', v_user_id),
    ('615400', 'Entretien terrain gazon', v_user_id),
    ('615500', 'Arrosage et entretien pelouse', v_user_id),
    ('616000', 'Assurance club', v_user_id),
    ('618000', 'Licences fédérales', v_user_id),
    ('625000', 'Déplacements matchs et tournois', v_user_id),
    ('625100', 'Location bus équipe', v_user_id),
    ('626000', 'Frais postaux et télécom', v_user_id),
    ('627000', 'Services bancaires', v_user_id),
    ('706000', 'Cotisations adhérents', v_user_id),
    ('707000', 'Vente articles club (maillots, etc)', v_user_id),
    ('708000', 'Subventions reçues', v_user_id),
    ('740000', 'Subventions d''exploitation', v_user_id),
    ('756000', 'Sponsors et partenaires', v_user_id),
    ('771000', 'Produits exceptionnels', v_user_id)
    ON CONFLICT (account_number, user_id) DO NOTHING;

    RAISE NOTICE 'Comptes supplémentaires ajoutés';

    -- =============================================
    -- 3. GÉNÉRATION DES ÉCRITURES COMPTABLES
    -- =============================================
    RAISE NOTICE 'Génération des écritures comptables (cela peut prendre quelques secondes)...';

    -- Générer 100 lots d'écritures sur les 6 derniers mois
    FOR i IN 1..100 LOOP
        v_batch_id := gen_random_uuid();

        -- Date aléatoire sur les 6 derniers mois
        v_date := CURRENT_DATE - (random() * 180)::INTEGER;

        -- Nombre de lignes par lot (2 à 6)
        v_nb_lignes := 2 + floor(random() * 5)::INTEGER;

        v_total_debit := 0;
        v_total_credit := 0;

        -- Choisir un journal aléatoire
        CASE floor(random() * 5)::INTEGER
            WHEN 0 THEN
                -- Journal Achats (équipements hockey sur gazon)
                FOR j IN 1..v_nb_lignes LOOP
                    IF j = 1 THEN
                        -- Ligne achat équipement
                        CASE floor(random() * 3)::INTEGER
                            WHEN 0 THEN
                                v_compte := '606100';
                                v_libelle := CASE floor(random() * 5)::INTEGER
                                    WHEN 0 THEN 'Protège-tibias équipe senior'
                                    WHEN 1 THEN 'Gants gardien de but'
                                    WHEN 2 THEN 'Cages de hockey portables'
                                    WHEN 3 THEN 'Cônes et plots entrainement'
                                    ELSE 'Kit premiers secours'
                                END;
                            WHEN 1 THEN
                                v_compte := '606200';
                                v_libelle := CASE floor(random() * 4)::INTEGER
                                    WHEN 0 THEN 'Lot 20 crosses hockey outdoor'
                                    WHEN 1 THEN 'Balles hockey gazon x100'
                                    WHEN 2 THEN 'Crosses junior débutants'
                                    ELSE 'Balles entrainement indoor'
                                END;
                            ELSE
                                v_compte := '606300';
                                v_libelle := CASE floor(random() * 4)::INTEGER
                                    WHEN 0 THEN 'Maillots équipe 1ère série'
                                    WHEN 1 THEN 'Shorts équipe école de hockey'
                                    WHEN 2 THEN 'Chaussettes club sérigraphie'
                                    ELSE 'Survêtements éducateurs'
                                END;
                        END CASE;
                        v_montant := 150 + (random() * 2850)::NUMERIC(10,2);
                        v_total_debit := v_total_debit + v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_ac_id, v_batch_id);

                    ELSIF j = 2 THEN
                        -- TVA déductible (20%)
                        v_compte := '445660';
                        v_montant := round(v_total_debit * 0.2, 2);
                        v_libelle := 'TVA déductible';
                        v_total_debit := v_total_debit + v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_ac_id, v_batch_id);

                    ELSE
                        -- Fournisseur (crédit)
                        v_compte := '401000';
                        v_montant := v_total_debit;
                        v_libelle := CASE floor(random() * 4)::INTEGER
                            WHEN 0 THEN 'Decathlon Pro - Fact ' || lpad(floor(random() * 10000)::TEXT, 5, '0')
                            WHEN 1 THEN 'Intersport Pro - Fact ' || lpad(floor(random() * 10000)::TEXT, 5, '0')
                            WHEN 2 THEN 'Sport 2000 - Fact ' || lpad(floor(random() * 10000)::TEXT, 5, '0')
                            ELSE 'Go Sport - Fact ' || lpad(floor(random() * 10000)::TEXT, 5, '0')
                        END;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'C', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_ac_id, v_batch_id);
                    END IF;
                END LOOP;

            WHEN 1 THEN
                -- Journal Ventes (cotisations, articles club, subventions)
                FOR j IN 1..v_nb_lignes LOOP
                    IF j = 1 THEN
                        -- Ligne adhérent/sponsor (débit)
                        v_compte := '411000';
                        v_montant := 50 + (random() * 1950)::NUMERIC(10,2);

                        -- Choix aléatoire du type de recette
                        CASE floor(random() * 3)::INTEGER
                            WHEN 0 THEN
                                v_libelle := 'Cotisation annuelle adhérent ' || lpad(floor(random() * 500)::TEXT, 4, '0');
                            WHEN 1 THEN
                                v_libelle := 'Sponsor ' || CASE floor(random() * 5)::INTEGER
                                    WHEN 0 THEN 'Carrefour - Partenariat'
                                    WHEN 1 THEN 'Crédit Agricole - Maillots'
                                    WHEN 2 THEN 'Boulangerie locale - Goûters'
                                    WHEN 3 THEN 'Mairie - Subvention terrain'
                                    ELSE 'Entreprise locale - Sponsoring'
                                END;
                            ELSE
                                v_libelle := 'Vente maillot/article club n°' || floor(random() * 100)::TEXT;
                        END CASE;
                        v_total_debit := v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_vt_id, v_batch_id);

                    ELSIF j = 2 THEN
                        -- Produit (crédit) selon le type
                        IF v_libelle LIKE '%Cotisation%' THEN
                            v_compte := '706000';
                            v_montant := v_total_debit;
                            v_libelle := 'Produit cotisation';
                        ELSIF v_libelle LIKE '%Sponsor%' OR v_libelle LIKE '%Subvention%' THEN
                            v_compte := '756000';
                            v_montant := v_total_debit;
                            v_libelle := 'Produit sponsor/partenaire';
                        ELSE
                            v_compte := '707000';
                            v_montant := round(v_total_debit / 1.2, 2);
                            v_libelle := 'Vente article club';
                        END IF;
                        v_total_credit := v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'C', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_vt_id, v_batch_id);

                    ELSE
                        -- TVA collectée si vente article (20%)
                        IF v_compte = '707000' THEN
                            v_compte := '445710';
                            v_montant := v_total_debit - v_total_credit;
                            v_libelle := 'TVA collectée';

                            INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                            VALUES (v_compte, 'C', v_montant, v_libelle,
                                    to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_vt_id, v_batch_id);
                        END IF;
                    END IF;
                END LOOP;

            WHEN 2 THEN
                -- Journal Banque (paiements club hockey sur gazon)
                FOR j IN 1..v_nb_lignes LOOP
                    IF j = 1 THEN
                        -- Compte de charge spécifique au hockey sur gazon
                        CASE floor(random() * 6)::INTEGER
                            WHEN 0 THEN
                                v_compte := '615400';
                                v_libelle := CASE floor(random() * 3)::INTEGER
                                    WHEN 0 THEN 'Tonte et marquage terrain'
                                    WHEN 1 THEN 'Réparation gazon synthétique'
                                    ELSE 'Traitement herbicide terrain'
                                END;
                            WHEN 1 THEN
                                v_compte := '615500';
                                v_libelle := CASE floor(random() * 3)::INTEGER
                                    WHEN 0 THEN 'Système arrosage automatique'
                                    WHEN 1 THEN 'Facture eau arrosage pelouse'
                                    ELSE 'Entretien système irrigation'
                                END;
                            WHEN 2 THEN
                                v_compte := '616000';
                                v_libelle := 'Assurance responsabilité civile club';
                            WHEN 3 THEN
                                v_compte := '618000';
                                v_libelle := 'Licences fédération française hockey';
                            WHEN 4 THEN
                                v_compte := '625100';
                                v_libelle := CASE floor(random() * 4)::INTEGER
                                    WHEN 0 THEN 'Location bus match à Lille'
                                    WHEN 1 THEN 'Location bus tournoi régional'
                                    WHEN 2 THEN 'Transport équipe championnat'
                                    ELSE 'Déplacement match extérieur'
                                END;
                            ELSE
                                v_compte := '627000';
                                v_libelle := 'Frais bancaires mensuels';
                        END CASE;
                        v_montant := 80 + (random() * 1420)::NUMERIC(10,2);
                        v_total_debit := v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_bq_id, v_batch_id);

                    ELSE
                        -- Banque (crédit)
                        v_compte := '512000';
                        v_montant := v_total_debit;
                        v_libelle := 'Prélèvement automatique';

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'C', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_bq_id, v_batch_id);
                    END IF;
                END LOOP;

            WHEN 3 THEN
                -- Journal Caisse (petites dépenses hockey sur gazon)
                FOR j IN 1..v_nb_lignes LOOP
                    IF j = 1 THEN
                        -- Petites charges
                        CASE floor(random() * 4)::INTEGER
                            WHEN 0 THEN
                                v_compte := '606200';
                                v_libelle := CASE floor(random() * 3)::INTEGER
                                    WHEN 0 THEN 'Achat balles entrainement'
                                    WHEN 1 THEN 'Petits équipements entrainement'
                                    ELSE 'Cônes et chasubles'
                                END;
                            WHEN 1 THEN
                                v_compte := '615400';
                                v_libelle := 'Petite réparation cage';
                            WHEN 2 THEN
                                v_compte := '625000';
                                v_libelle := 'Carburant déplacement match amical';
                            ELSE
                                v_compte := '626000';
                                v_libelle := 'Affranchissement courriers adhérents';
                        END CASE;
                        v_montant := 15 + (random() * 185)::NUMERIC(10,2);
                        v_total_debit := v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_ca_id, v_batch_id);

                    ELSE
                        -- Caisse (crédit)
                        v_compte := '530000';
                        v_montant := v_total_debit;
                        v_libelle := 'Sortie espèces caisse club';

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'C', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_ca_id, v_batch_id);
                    END IF;
                END LOOP;

            ELSE
                -- Journal Opérations Diverses (club hockey sur gazon)
                FOR j IN 1..v_nb_lignes LOOP
                    IF j <= (v_nb_lignes / 2)::INTEGER THEN
                        -- Débits - opérations spéciales
                        CASE floor(random() * 4)::INTEGER
                            WHEN 0 THEN
                                v_compte := '512000';
                                v_libelle := 'Encaissement subvention municipale';
                            WHEN 1 THEN
                                v_compte := '411000';
                                v_libelle := 'Régularisation cotisations impayées';
                            WHEN 2 THEN
                                v_compte := '708000';
                                v_libelle := 'Subvention Conseil Départemental';
                            ELSE
                                v_compte := '771000';
                                v_libelle := 'Don exceptionnel mécène';
                        END CASE;
                        v_montant := 200 + (random() * 2800)::NUMERIC(10,2);
                        v_total_debit := v_total_debit + v_montant;

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'D', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_od_id, v_batch_id);
                    ELSE
                        -- Crédits pour équilibrer - contreparties
                        CASE floor(random() * 4)::INTEGER
                            WHEN 0 THEN
                                v_compte := '740000';
                                v_libelle := 'Subvention d''exploitation';
                            WHEN 1 THEN
                                v_compte := '756000';
                                v_libelle := 'Produit partenariat';
                            WHEN 2 THEN
                                v_compte := '530000';
                                v_libelle := 'Remise caisse';
                            ELSE
                                v_compte := '771000';
                                v_libelle := 'Produit exceptionnel';
                        END CASE;
                        v_montant := v_total_debit / ((v_nb_lignes / 2.0)::NUMERIC);

                        INSERT INTO journal_entries (compte, s, montant, libelle, date, user_id, company_id, journal_id, batch_id)
                        VALUES (v_compte, 'C', v_montant, v_libelle,
                                to_char(v_date, 'DD/MM/YY'), v_user_id, v_company_id, v_journal_od_id, v_batch_id);
                    END IF;
                END LOOP;
        END CASE;

        -- Afficher la progression tous les 10 lots
        IF i % 10 = 0 THEN
            RAISE NOTICE 'Progression : % lots générés sur 100', i;
        END IF;
    END LOOP;

    RAISE NOTICE '=== Génération terminée avec succès ! ===';
    RAISE NOTICE 'Résumé :';
    RAISE NOTICE '- 5 journaux créés (AC, VT, BQ, CA, OD)';
    RAISE NOTICE '- 23 comptes créés ou vérifiés (spécifiques au hockey sur gazon)';
    RAISE NOTICE '- 100 lots d''écritures générés avec des libellés réalistes';
    RAISE NOTICE '- Écritures sur les 6 derniers mois';
    RAISE NOTICE '';
    RAISE NOTICE 'Types d''écritures générées :';
    RAISE NOTICE '  * Achats : équipements, crosses, balles, maillots';
    RAISE NOTICE '  * Ventes : cotisations, sponsors, vente d''articles club';
    RAISE NOTICE '  * Banque : entretien terrain, arrosage, licences, déplacements';
    RAISE NOTICE '  * Caisse : petits achats et dépenses courantes';
    RAISE NOTICE '  * OD : subventions, dons, régularisations';
    RAISE NOTICE '';
    RAISE NOTICE 'Vous pouvez maintenant tester toutes les fonctionnalités de l''application !';
    RAISE NOTICE 'Le club TAC Hockey sur Gazon dispose de données réalistes pour ses tests.';

END $$;
