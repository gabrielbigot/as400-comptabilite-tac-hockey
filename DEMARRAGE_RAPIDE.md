# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## ⚠️ Avant de commencer
Votre application **NE FONCTIONNERA PAS** tant que vous n'aurez pas configuré Supabase !

Le bouton "Ajouter Société" ne fonctionne pas car l'application essaie de se connecter à un serveur Supabase qui n'existe pas.

---

## 📋 Liste des étapes (15 minutes)

### ✅ Étape 1 : Créer le projet Supabase (5 min)

1. Allez sur **https://supabase.com**
2. Cliquez sur **"New Project"**
3. Remplissez :
   - **Name** : `TAC Hockey Comptabilite`
   - **Database Password** : Choisissez un mot de passe fort et **NOTEZ-LE** !
   - **Region** : Choisissez la plus proche (ex: West EU - Ireland)
4. Cliquez sur **"Create new project"**
5. ⏱️ **ATTENDEZ 2-3 MINUTES** que le projet soit créé

---

### ✅ Étape 2 : Créer les tables (5 min)

1. Dans votre projet Supabase, cliquez sur **SQL Editor** (icône de base de données dans le menu de gauche)
2. Cliquez sur **"New query"**
3. Ouvrez le fichier **`supabase/migrations/00_complete_schema.sql`** sur votre ordinateur
4. **Copiez TOUT** le contenu du fichier (Ctrl+A puis Ctrl+C)
5. **Collez** dans l'éditeur SQL de Supabase
6. Cliquez sur **"RUN"** (ou Ctrl+Enter)
7. Vérifiez qu'il y a écrit **"Success. No rows returned"** en bas

---

### ✅ Étape 3 : Récupérer vos credentials (2 min)

1. Dans votre projet Supabase, cliquez sur **Settings** (icône d'engrenage)
2. Cliquez sur **API** dans le sous-menu
3. Notez ces 2 informations :

```
PROJECT URL: https://xxxxxxxxx.supabase.co
ANON KEY: eyJhbGc........... (très longue clé)
```

**💡 IMPORTANT** : Copiez la clé **"anon public"**, PAS la "service_role" !

---

### ✅ Étape 4 : Configurer l'application (3 min)

1. Ouvrez le fichier **`supabase-client.js`** dans un éditeur de texte
2. Remplacez les lignes 2 et 3 :

**AVANT :**
```javascript
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
```

**APRÈS :**
```javascript
const SUPABASE_URL = 'https://VOTRE-PROJECT-ID.supabase.co';  // ⬅️ Collez votre URL ici
const SUPABASE_ANON_KEY = 'eyJhbGc...VOTRE-VRAIE-CLE';  // ⬅️ Collez votre clé anon ici
```

3. **Sauvegardez** le fichier (Ctrl+S)

---

### ✅ Étape 5 : Tester l'application

1. **Rechargez** complètement la page web (Ctrl+Shift+R ou Cmd+Shift+R)
2. Créez un compte utilisateur (email + mot de passe)
3. Essayez de cliquer sur **"Ajouter Société"** maintenant
4. ✅ **Ça devrait fonctionner !**

---

## 🐛 Toujours des problèmes ?

### Vérifier les erreurs dans la console

1. Appuyez sur **F12** pour ouvrir la console du navigateur
2. Allez dans l'onglet **Console**
3. Regardez s'il y a des erreurs rouges

### Erreurs courantes

| Erreur | Solution |
|--------|----------|
| `Failed to fetch` | Vérifiez que l'URL Supabase est correcte |
| `Invalid API key` | Vérifiez que vous avez copié la bonne clé (anon public) |
| `relation "companies" does not exist` | Exécutez le script SQL 00_complete_schema.sql |
| Rien ne s'affiche | Rechargez la page avec Ctrl+Shift+R |

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape, dites-moi :
1. À quelle étape vous êtes bloqué
2. Quel message d'erreur vous voyez (dans la console F12)
3. Ce que vous avez essayé

---

## ✅ Checklist rapide

- [ ] J'ai créé mon projet sur supabase.com
- [ ] J'ai attendu que le projet soit complètement créé (vert)
- [ ] J'ai exécuté le script SQL 00_complete_schema.sql
- [ ] J'ai vu "Success" après avoir exécuté le script
- [ ] J'ai copié mon PROJECT URL
- [ ] J'ai copié ma clé ANON PUBLIC (pas service_role)
- [ ] J'ai modifié supabase-client.js avec mes vraies credentials
- [ ] J'ai sauvegardé le fichier
- [ ] J'ai rechargé la page web (Ctrl+Shift+R)
- [ ] J'ai créé un compte utilisateur
- [ ] Le bouton "Ajouter Société" fonctionne maintenant ! 🎉
