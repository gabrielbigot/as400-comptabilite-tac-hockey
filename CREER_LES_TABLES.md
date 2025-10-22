# 🗄️ Créer les Tables Supabase

## ⚠️ IMPORTANT
Si le bouton "Ajouter Société" ne fait rien, c'est probablement parce que les tables n'existent pas encore dans votre base de données Supabase.

---

## 📋 Étapes pour Créer les Tables (5 minutes)

### Étape 1 : Aller dans le SQL Editor

1. Allez sur **https://supabase.com**
2. Ouvrez votre projet (swsyvokuthjvgmezeodv.supabase.co)
3. Dans le menu de gauche, cliquez sur **SQL Editor** (icône avec <>)
4. Cliquez sur **"New query"**

### Étape 2 : Copier le Script SQL

1. Ouvrez le fichier **`supabase/migrations/00_complete_schema.sql`** sur votre ordinateur
2. **Sélectionnez TOUT** le contenu du fichier (Ctrl+A sur Windows, Cmd+A sur Mac)
3. **Copiez** (Ctrl+C ou Cmd+C)

### Étape 3 : Coller et Exécuter

1. **Collez** le contenu dans l'éditeur SQL de Supabase (Ctrl+V ou Cmd+V)
2. Cliquez sur le bouton **"RUN"** en bas à droite (ou appuyez sur Ctrl+Enter)
3. Attendez quelques secondes

### Étape 4 : Vérifier le Résultat

Vous devriez voir en bas de l'écran :

```
✅ Success. No rows returned
```

Si vous voyez ça, **c'est bon** ! ✅

---

## 🔍 Vérifier que les Tables Existent

### Option 1 : Via Table Editor

1. Dans le menu de gauche, cliquez sur **Table Editor** (icône de tableau)
2. Vous devriez voir **5 tables** :
   - ✅ companies
   - ✅ accounts
   - ✅ journals
   - ✅ journal_entries
   - ✅ regles

### Option 2 : Via SQL

Exécutez cette requête dans le SQL Editor :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir les 5 tables listées ci-dessus.

---

## 🧪 Tester l'Application

Une fois les tables créées :

1. **Retournez** à votre application (index.html)
2. **Rechargez** la page complètement (Ctrl+Shift+R ou Cmd+Shift+R)
3. **Connectez-vous** avec votre compte
4. **Essayez à nouveau** de cliquer sur "Ajouter Société"
5. 🎉 **Ça devrait fonctionner maintenant !**

---

## ⚠️ Si Vous Voyez une Erreur

### Erreur : "relation does not exist"

C'est l'erreur typique quand les tables n'existent pas.

**Solution :** Exécutez le script SQL comme indiqué ci-dessus.

### Erreur : "permission denied"

Les politiques RLS (Row Level Security) ne sont pas configurées.

**Solution :** Le script SQL inclut déjà les politiques. Assurez-vous d'avoir exécuté TOUT le script, pas juste une partie.

### Erreur : "duplicate key value"

Vous essayez d'exécuter le script alors que les tables existent déjà.

**Solution :** C'est normal ! Les tables existent déjà. Ignorez cette erreur et testez l'application.

---

## 📞 Toujours Bloqué ?

Si après avoir créé les tables, le bouton ne fonctionne toujours pas :

1. Ouvrez la console (F12)
2. Cliquez sur le bouton "Ajouter Société"
3. Copiez le message d'erreur qui apparaît dans la console
4. Partagez-le avec moi pour que je puisse vous aider

---

## ✅ Checklist

- [ ] J'ai ouvert mon projet Supabase
- [ ] Je suis allé dans SQL Editor
- [ ] J'ai copié le contenu de `00_complete_schema.sql`
- [ ] J'ai collé et exécuté le script
- [ ] J'ai vu "Success" en bas
- [ ] J'ai vérifié que les 5 tables existent dans Table Editor
- [ ] J'ai rechargé mon application (Ctrl+Shift+R)
- [ ] J'ai testé le bouton "Ajouter Société"
- [ ] ✅ Ça fonctionne ! 🎉
