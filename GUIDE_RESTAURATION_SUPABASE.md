# Guide de Restauration du Projet Supabase
## Application AS/400 Comptabilité TAC Hockey Club

Ce guide vous aidera à recréer votre projet Supabase depuis zéro.

---

## 📋 Étapes de Restauration

### Étape 1 : Créer un nouveau projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : `AS400 TAC Hockey` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le bien !)
   - **Region** : Choisissez la région la plus proche de vous
   - **Pricing Plan** : Free (ou autre selon vos besoins)
5. Cliquez sur "Create new project"
6. **Attendez** que le projet soit complètement créé (cela peut prendre quelques minutes)

### Étape 2 : Récupérer vos credentials

Une fois le projet créé :

1. Allez dans **Settings** (icône d'engrenage dans le menu de gauche)
2. Cliquez sur **API** dans le sous-menu
3. Notez les informations suivantes :
   - **Project URL** (sous "Project URL")
   - **anon public** key (sous "Project API keys")

Ces informations ressembleront à :
```
URL: https://xxxxxxxxxxxxxx.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### Étape 3 : Créer les tables de la base de données

1. Dans votre projet Supabase, allez dans **SQL Editor** (icône de base de données)
2. Cliquez sur "New query"
3. **Copiez TOUT le contenu** du fichier `supabase/migrations/00_complete_schema.sql`
4. **Collez-le** dans l'éditeur SQL
5. Cliquez sur **RUN** (ou appuyez sur Ctrl+Enter)
6. Vérifiez qu'il n'y a pas d'erreurs (vous devriez voir "Success. No rows returned")

### Étape 4 : Vérifier que les tables sont créées

1. Allez dans **Table Editor** (icône de table dans le menu de gauche)
2. Vous devriez voir 5 tables :
   - ✅ `companies`
   - ✅ `accounts`
   - ✅ `journals`
   - ✅ `journal_entries`
   - ✅ `regles`

### Étape 5 : Mettre à jour les credentials dans votre application

**IMPORTANT** : Vous devez maintenant mettre à jour le fichier `supabase-client.js` avec vos nouvelles credentials.

1. Ouvrez le fichier `supabase-client.js`
2. Remplacez les lignes 2 et 3 par vos nouvelles informations :

```javascript
const SUPABASE_URL = 'https://VOTRE-PROJECT-ID.supabase.co';  // ⬅️ Remplacez par votre URL
const SUPABASE_ANON_KEY = 'eyJhbGc...VOTRE-CLE-ICI';  // ⬅️ Remplacez par votre clé
```

### Étape 6 : Tester votre application

1. Ouvrez votre fichier `index.html` dans un navigateur
2. Créez un nouveau compte utilisateur
3. Testez la création d'une société
4. Testez la création de comptes et de journaux

---

## 📊 Structure des Tables Créées

### 1. **companies** (Sociétés)
- `id` : Identifiant unique
- `name` : Nom de la société (ex: "TAC Hockey Club")
- `user_id` : Propriétaire de la société
- Chaque utilisateur peut créer plusieurs sociétés

### 2. **accounts** (Plan Comptable)
- `id` : Identifiant unique
- `account_number` : Numéro de compte (ex: "512000")
- `label` : Libellé du compte (ex: "Banque")
- `user_id` : Propriétaire du compte
- Les comptes sont partagés entre toutes les sociétés d'un utilisateur

### 3. **journals** (Journaux)
- `id` : Identifiant unique
- `code` : Code du journal (ex: "AC" pour Achats)
- `name` : Nom du journal (ex: "Achats")
- `company_id` : Société à laquelle appartient le journal
- `user_id` : Propriétaire du journal

### 4. **journal_entries** (Écritures Comptables)
- `id` : Identifiant unique
- `compte` : Numéro de compte
- `s` : Sens ('D' = Débit, 'C' = Crédit)
- `montant` : Montant de l'écriture
- `libelle` : Description de l'écriture
- `date` : Date de l'écriture (format DD/MM/YYYY)
- `batch_id` : Identifiant du lot d'écritures
- `journal_id` : Journal associé
- `company_id` : Société associée
- `user_id` : Propriétaire de l'écriture

### 5. **regles** (Règles de Comptabilisation)
- `id` : Identifiant unique
- `Quand` : Condition de la règle
- `Alors` : Action à effectuer
- `Débit` : Compte à débiter
- `Crédit` : Compte à créditer

---

## 🔒 Sécurité (Row Level Security - RLS)

Toutes les tables ont des politiques de sécurité activées :

- **Isolation des données** : Chaque utilisateur ne peut voir que ses propres données
- **CRUD complet** : Les utilisateurs peuvent créer, lire, modifier et supprimer leurs données
- **Cascade** : La suppression d'une société supprime automatiquement ses journaux et écritures

---

## ⚠️ Points Importants

1. **Sauvegardez vos credentials** : Notez votre URL et votre clé API dans un endroit sûr
2. **Mot de passe de la base** : Conservez le mot de passe de votre base de données (nécessaire pour certaines opérations avancées)
3. **Sauvegarde régulière** : Pensez à exporter régulièrement vos données importantes
4. **Plan gratuit** : Le plan gratuit Supabase a des limites (500 Mo de DB, 2 Go de bande passante)

---

## 🆘 En cas de problème

### Erreur "relation does not exist"
- Vérifiez que vous avez bien exécuté le script SQL complet
- Allez dans Table Editor pour vérifier que les tables existent

### Erreur "JWT expired" ou "Invalid JWT"
- Vérifiez que vous avez bien copié la clé `anon public` (et non la clé `service_role`)
- Vérifiez que l'URL est correcte

### Les données ne s'affichent pas
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez les politiques RLS dans Settings > Policies

### Permission denied
- Vérifiez que vous êtes bien connecté
- Vérifiez que les politiques RLS sont bien créées (voir Étape 3)

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez la documentation Supabase : https://supabase.com/docs
2. Vérifiez les logs dans le SQL Editor
3. Utilisez la console du navigateur pour voir les erreurs JavaScript

---

**Date de création de ce guide** : 2025-10-22
**Version du schéma** : 1.0
