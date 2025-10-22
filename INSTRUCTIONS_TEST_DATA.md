# Instructions pour générer les données de test

Ce document explique comment utiliser le script SQL pour générer des données de test réalistes pour votre club de hockey sur gazon.

## 📋 Prérequis

Avant d'exécuter le script, vous devez avoir :
1. Un compte utilisateur créé dans l'application
2. Une société/club créée dans l'application

## 🔍 Étape 1 : Récupérer vos identifiants

Connectez-vous à votre interface Supabase (ou utilisez le SQL Editor) et exécutez les requêtes suivantes :

### Récupérer votre USER_ID

```sql
SELECT id, email FROM auth.users WHERE email = 'votre@email.com';
```

Copiez l'UUID retourné (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Récupérer votre COMPANY_ID

```sql
SELECT id, name FROM companies WHERE name = 'TAC Hockey Club';
```

Ou si vous ne connaissez pas le nom exact :

```sql
SELECT id, name FROM companies;
```

Copiez l'UUID de votre club.

## ✏️ Étape 2 : Modifier le script

Ouvrez le fichier `generate_test_data.sql` et remplacez les valeurs suivantes aux lignes 24-25 :

```sql
v_user_id UUID := 'VOTRE_USER_ID';      -- ⚠️ Collez votre UUID utilisateur ici
v_company_id UUID := 'VOTRE_COMPANY_ID'; -- ⚠️ Collez votre UUID société ici
```

**Exemple :**
```sql
v_user_id UUID := '8f3e4c2a-1234-5678-9abc-def012345678';
v_company_id UUID := '7a2b3c4d-5678-90ab-cdef-123456789abc';
```

## 🚀 Étape 3 : Exécuter le script

1. Copiez tout le contenu du fichier `generate_test_data.sql`
2. Allez dans l'interface Supabase > SQL Editor
3. Collez le script complet
4. Cliquez sur "Run" (ou "Exécuter")

## ⏱️ Durée d'exécution

Le script prend environ 10-30 secondes pour générer toutes les données. Vous verrez des messages de progression :
- Progression : 10 lots générés sur 100
- Progression : 20 lots générés sur 100
- etc.

## 📊 Données générées

Le script va créer :

### 5 Journaux comptables :
- **AC** - Achats (équipements, crosses, maillots)
- **VT** - Ventes (cotisations, sponsors, articles club)
- **BQ** - Banque (paiements automatiques, virements)
- **CA** - Caisse (petites dépenses en espèces)
- **OD** - Opérations Diverses (subventions, régularisations)

### 23 Comptes comptables spécifiques au hockey sur gazon :

**Comptes de tiers :**
- 401000 - Fournisseurs équipements sportifs
- 411000 - Adhérents et licenciés

**Comptes de trésorerie :**
- 512000 - Banque
- 530000 - Caisse

**Comptes de TVA :**
- 445660 - TVA déductible
- 445710 - TVA collectée

**Comptes de charges :**
- 606100 - Achats équipements sportifs
- 606200 - Achats crosses et balles
- 606300 - Achats tenues et maillots
- 615400 - Entretien terrain gazon
- 615500 - Arrosage et entretien pelouse
- 616000 - Assurance club
- 618000 - Licences fédérales
- 625000 - Déplacements matchs et tournois
- 625100 - Location bus équipe
- 626000 - Frais postaux et télécom
- 627000 - Services bancaires

**Comptes de produits :**
- 706000 - Cotisations adhérents
- 707000 - Vente articles club (maillots, etc)
- 708000 - Subventions reçues
- 740000 - Subventions d'exploitation
- 756000 - Sponsors et partenaires
- 771000 - Produits exceptionnels

### 100 Lots d'écritures comptables

Chaque lot contient 2 à 6 lignes d'écritures équilibrées (débit = crédit) avec des libellés réalistes :

**Exemples d'achats :**
- Lot 20 crosses hockey outdoor
- Balles hockey gazon x100
- Maillots équipe 1ère série
- Protège-tibias équipe senior
- Cages de hockey portables

**Exemples de recettes :**
- Cotisation annuelle adhérent
- Sponsor Carrefour - Partenariat
- Subvention Mairie - Terrain
- Vente maillot/article club

**Exemples de dépenses courantes :**
- Tonte et marquage terrain
- Facture eau arrosage pelouse
- Licences fédération française hockey
- Location bus match à Lille
- Assurance responsabilité civile club

**Période couverte :** Les écritures sont réparties sur les 6 derniers mois avec des dates aléatoires.

## ✅ Vérification

Après l'exécution, vérifiez que tout s'est bien passé :

```sql
-- Vérifier les journaux créés
SELECT code, name FROM journals WHERE company_id = 'VOTRE_COMPANY_ID';

-- Vérifier les comptes créés
SELECT account_number, label FROM accounts WHERE user_id = 'VOTRE_USER_ID' ORDER BY account_number;

-- Compter les écritures générées
SELECT COUNT(*) as total_ecritures FROM journal_entries WHERE company_id = 'VOTRE_COMPANY_ID';

-- Compter les lots générés
SELECT COUNT(DISTINCT batch_id) as total_lots FROM journal_entries WHERE company_id = 'VOTRE_COMPANY_ID';
```

Vous devriez avoir :
- 5 journaux
- Au moins 23 comptes (plus ceux déjà existants)
- Environ 250-350 écritures comptables
- 100 lots distincts

## 🧪 Tester les fonctionnalités

Maintenant que vous avez des données de test, vous pouvez tester :

1. **Liste des lots** : Menu Écritures > Option 4
   - Filtrer par journal (AC, VT, BQ, CA, OD)
   - Filtrer par dates
   - Consulter, modifier, supprimer des lots

2. **Export CSV** :
   - Exporter les écritures d'un journal
   - Exporter les écritures d'un compte
   - Exporter la liste des lots
   - Exporter le plan comptable

3. **Rapports comptables** : Menu Comptabilité > Option 4
   - Balance des comptes (voir les totaux par compte)
   - Grand livre (détail par compte)
   - Journal centralisateur (synthèse par journal)
   - Exporter et imprimer les rapports

4. **Recherche et navigation** :
   - Détail d'un journal (voir toutes ses écritures)
   - Détail d'un compte (voir tous ses mouvements)
   - Tri par date ascendant/descendant
   - Filtrage par date

## 🔄 Réinitialisation

Si vous voulez supprimer toutes les données de test et recommencer :

```sql
-- ATTENTION : Cela supprime TOUTES vos écritures !
DELETE FROM journal_entries WHERE company_id = 'VOTRE_COMPANY_ID';

-- Si vous voulez aussi supprimer les journaux créés
DELETE FROM journals WHERE company_id = 'VOTRE_COMPANY_ID';

-- Si vous voulez aussi supprimer les comptes créés
DELETE FROM accounts WHERE user_id = 'VOTRE_USER_ID';
```

Puis réexécutez le script `generate_test_data.sql`.

## 📝 Notes importantes

- Les montants sont générés aléatoirement dans des fourchettes réalistes
- Tous les lots sont équilibrés (débit = crédit)
- Les dates sont réparties sur les 6 derniers mois
- Les libellés sont spécifiques au hockey sur gazon
- La TVA est calculée à 20% quand applicable

## 🐛 En cas de problème

**Erreur "VOTRE_USER_ID" :**
- Vous avez oublié de remplacer les valeurs par vos vrais UUID

**Aucune donnée générée :**
- Vérifiez que vos UUID sont corrects
- Vérifiez que vous avez les permissions sur la base de données

**Données partielles :**
- Le script a peut-être été interrompu
- Supprimez les données partielles et relancez

## 💡 Conseils

- Gardez une copie de vos UUID quelque part pour une utilisation future
- Vous pouvez modifier les montants dans le script si vous voulez des valeurs différentes
- Vous pouvez augmenter le nombre de lots générés en changeant `FOR i IN 1..100` par `FOR i IN 1..200` par exemple
