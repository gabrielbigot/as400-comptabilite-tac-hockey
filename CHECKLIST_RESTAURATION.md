# ✅ Checklist de Restauration du Projet Supabase

Suivez cette checklist étape par étape pour restaurer votre projet.

---

## 📝 Avant de commencer

- [ ] J'ai un compte Supabase (sinon, créez-en un sur https://supabase.com)
- [ ] J'ai lu le fichier `GUIDE_RESTAURATION_SUPABASE.md`
- [ ] Je suis prêt à noter mes credentials dans un endroit sûr

---

## 🔧 Étape 1 : Créer le projet Supabase

- [ ] Je me suis connecté à https://supabase.com
- [ ] J'ai cliqué sur "New Project"
- [ ] J'ai rempli les informations :
  - Nom du projet : ___________________
  - Mot de passe DB : ___________________
  - Région : ___________________
- [ ] J'ai attendu que le projet soit complètement créé (⏱️ peut prendre 2-3 minutes)
- [ ] Le projet est actif et accessible

---

## 🔑 Étape 2 : Récupérer mes credentials

- [ ] Je suis allé dans **Settings** > **API**
- [ ] J'ai copié mon **Project URL** :
  ```
  URL: _____________________________________
  ```
- [ ] J'ai copié ma clé **anon public** :
  ```
  Key: _____________________________________
  ```
- [ ] J'ai sauvegardé ces informations dans un endroit sûr (gestionnaire de mots de passe, etc.)

---

## 💾 Étape 3 : Créer la structure de la base de données

- [ ] Je suis allé dans **SQL Editor** dans mon projet Supabase
- [ ] J'ai cliqué sur **New query**
- [ ] J'ai ouvert le fichier `supabase/migrations/00_complete_schema.sql` sur mon ordinateur
- [ ] J'ai copié **TOUT** le contenu du fichier
- [ ] J'ai collé le contenu dans l'éditeur SQL de Supabase
- [ ] J'ai cliqué sur **RUN** (ou Ctrl+Enter)
- [ ] J'ai vérifié qu'il n'y a pas d'erreurs (message "Success" affiché)

---

## ✅ Étape 4 : Vérifier les tables

- [ ] Je suis allé dans **Table Editor**
- [ ] Je vois bien ces 5 tables :
  - [ ] **companies**
  - [ ] **accounts**
  - [ ] **journals**
  - [ ] **journal_entries**
  - [ ] **regles**

---

## 🎨 Étape 5 : (Optionnel) Ajouter le plan comptable de base

**Cette étape est optionnelle.** Elle vous permet d'avoir un plan comptable pré-rempli.

**SI vous voulez ajouter le plan comptable standard :**

- [ ] J'ai créé un compte utilisateur dans mon application
- [ ] Je suis allé dans **SQL Editor** sur Supabase
- [ ] J'ai exécuté cette requête pour obtenir mon user_id :
  ```sql
  SELECT id, email FROM auth.users;
  ```
- [ ] J'ai noté mon user_id : _____________________________________
- [ ] J'ai ouvert le fichier `supabase/migrations/01_sample_data_plan_comptable.sql`
- [ ] J'ai remplacé TOUTES les occurrences de `'VOTRE-USER-ID'` par mon vrai user_id (avec les guillemets !)
- [ ] J'ai copié tout le contenu
- [ ] Je l'ai collé dans un nouveau SQL query sur Supabase
- [ ] J'ai cliqué sur **RUN**
- [ ] J'ai vérifié le message de confirmation

**SINON, si je préfère créer mes comptes manuellement :**

- [ ] Je passe cette étape

---

## 🔌 Étape 6 : Connecter l'application

- [ ] J'ai ouvert le fichier `supabase-client.js` dans un éditeur de texte
- [ ] J'ai remplacé la ligne 2 avec mon **SUPABASE_URL** :
  ```javascript
  const SUPABASE_URL = 'https://MON-PROJECT-ID.supabase.co';
  ```
- [ ] J'ai remplacé la ligne 3 avec ma **SUPABASE_ANON_KEY** :
  ```javascript
  const SUPABASE_ANON_KEY = 'eyJhbGc...MA-VRAIE-CLE';
  ```
- [ ] J'ai sauvegardé le fichier

---

## 🧪 Étape 7 : Tester l'application

- [ ] J'ai ouvert le fichier `index.html` dans mon navigateur
- [ ] La page s'affiche correctement
- [ ] Je vois l'écran de connexion/inscription
- [ ] J'ai créé un nouveau compte utilisateur
- [ ] La création de compte a réussi
- [ ] Je suis connecté et je vois l'écran de choix de société

**Tester la création de données :**

- [ ] J'ai créé une nouvelle société (ex: "TAC Hockey Club")
- [ ] La société apparaît dans la liste
- [ ] J'ai sélectionné la société
- [ ] Je vois le menu principal
- [ ] J'ai accédé au menu Comptabilité
- [ ] J'ai créé un nouveau compte (ex: 512000 - Banque)
- [ ] J'ai créé un nouveau journal (ex: BQ - Banque)
- [ ] Tout fonctionne correctement ! 🎉

---

## ⚠️ En cas de problème

**Si je rencontre une erreur...**

- [ ] J'ai ouvert la console du navigateur (F12) pour voir les erreurs
- [ ] J'ai vérifié que mes credentials sont corrects dans `supabase-client.js`
- [ ] J'ai vérifié que toutes les tables sont bien créées dans Supabase
- [ ] J'ai consulté le fichier `GUIDE_RESTAURATION_SUPABASE.md` section "En cas de problème"

**Erreurs courantes :**

| Erreur | Solution |
|--------|----------|
| "Invalid JWT" | Vérifier que la clé anon est correcte |
| "relation does not exist" | Vérifier que le script SQL a bien été exécuté |
| "Permission denied" | Vérifier que les politiques RLS sont créées |
| Rien ne s'affiche | Ouvrir la console (F12) et regarder les erreurs |

---

## 🎉 Félicitations !

Si vous avez coché toutes les cases, votre projet Supabase est restauré et fonctionnel !

**N'oubliez pas :**
- ✅ Sauvegardez régulièrement vos données importantes
- ✅ Notez vos credentials dans un endroit sûr
- ✅ Le plan gratuit Supabase a des limites (500 Mo, 2 Go/mois)

---

**Date de restauration :** ____ / ____ / ________

**Temps total :** __________ minutes

**Notes personnelles :**
```
_____________________________________________
_____________________________________________
_____________________________________________
```
