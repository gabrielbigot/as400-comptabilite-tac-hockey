# Guide des Paramètres et Clôture d'Exercice

Ce document explique comment utiliser les nouvelles fonctionnalités **Paramètres** et **Traitements fin exercice** de votre application de comptabilité AS/400 pour le TAC Hockey Club.

## 📋 Table des matières

1. [Paramètres (Option 5)](#paramètres-option-5)
2. [Traitements fin exercice (Option 6)](#traitements-fin-exercice-option-6)
3. [Prérequis](#prérequis)
4. [Workflow complet de clôture](#workflow-complet-de-clôture)

---

## ⚙️ Paramètres (Option 5)

Accès : **Menu Comptabilité > Option 5 - Paramètres**

Cette fonctionnalité vous permet de configurer les paramètres essentiels de votre club.

### 1. Exercice Comptable

**Pourquoi c'est important ?**
L'exercice comptable définit la période sur laquelle vous suivez vos comptes (généralement du 1er septembre au 31 août pour un club sportif).

**Champs disponibles :**
- **Date début d'exercice** : Date de début de votre exercice comptable (ex: 01/09/2024)
- **Date fin d'exercice** : Date de fin de votre exercice comptable (ex: 31/08/2025)
- **Exercice clôturé** : Case cochée automatiquement lors de la clôture (non modifiable manuellement)

**Comment remplir :**
1. Cliquez dans le champ "Date début d'exercice"
2. Sélectionnez la date de début (ex: 2024-09-01)
3. Cliquez dans le champ "Date fin d'exercice"
4. Sélectionnez la date de fin (ex: 2025-08-31)
5. Cliquez sur **"Enregistrer Exercice"**

**Validation :** La date de fin doit être postérieure à la date de début.

---

### 2. Informations du Club

**Pourquoi c'est important ?**
Ces informations apparaîtront sur vos éditions et rapports comptables.

**Champs disponibles :**
- **Nom du club** : Nom complet de votre club (ex: TAC Hockey Club)
- **Adresse** : Adresse du siège social (ex: 12 rue du Stade)
- **Ville** : Ville du club (ex: Tourcoing)
- **Code postal** : Code postal (ex: 59200)
- **Téléphone** : Numéro de téléphone (ex: 03 20 XX XX XX)
- **Email** : Email de contact (ex: contact@tachockey.fr)

**Comment remplir :**
1. Remplissez tous les champs souhaités
2. Cliquez sur **"Enregistrer Club"**

---

### 3. Comptes par Défaut

**Pourquoi c'est important ?**
Ces comptes seront utilisés automatiquement lors des opérations de clôture et autres traitements automatiques.

**Champs disponibles :**
- **Compte banque** : Compte principal de banque (ex: 512000)
- **Compte caisse** : Compte de caisse (ex: 530000)
- **Compte résultat** : Compte de report à nouveau / résultat (ex: 120000)

**Comment remplir :**
1. Saisissez le numéro de compte à 6 chiffres
2. Assurez-vous que ces comptes existent dans votre plan comptable
3. Cliquez sur **"Enregistrer Comptes"**

---

## 🔐 Traitements fin exercice (Option 6)

Accès : **Menu Comptabilité > Option 6 - Traitements fin exercice**

Cette fonctionnalité vous permet de clôturer votre exercice comptable en 3 étapes.

### ⚠️ AVERTISSEMENT IMPORTANT

La clôture d'exercice est une opération **IRRÉVERSIBLE**. Une fois l'exercice clôturé :
- Vous ne pourrez plus modifier les écritures de cet exercice
- Vous ne pourrez plus ajouter d'écritures dans cet exercice
- Le résultat sera figé

**Assurez-vous d'avoir :**
- Saisi toutes les écritures de l'exercice
- Vérifié tous vos comptes
- Effectué un export CSV de sauvegarde
- Validé vos rapports comptables

---

### Informations affichées à l'écran

Lorsque vous accédez à cet écran, vous voyez :

- **Période** : Les dates de début et fin d'exercice
- **Statut** : OUVERT (vert) ou CLOS (rouge)
- **Nombre d'écritures** : Total des écritures saisies dans l'exercice
- **Résultat actuel** : Résultat calculé en temps réel (vert si bénéfice, rouge si déficit)

---

### Étape 1 : Calculer le résultat

**Bouton** : 🔢 **1. Calculer le résultat**

**Ce que ça fait :**
- Recalcule le résultat de l'exercice
- Résultat = Total des produits (comptes 7xxxxx) - Total des charges (comptes 6xxxxx)

**Quand l'utiliser :**
- Après avoir saisi toutes vos écritures
- Pour vérifier votre résultat avant de clôturer

**Exemple :**
```
Produits (comptes 7xxxxx) :
  - Cotisations : 15 000 €
  - Sponsors : 8 000 €
  - Subventions : 5 000 €
  Total produits : 28 000 €

Charges (comptes 6xxxxx) :
  - Équipements : 10 000 €
  - Licences : 3 000 €
  - Déplacements : 5 000 €
  Total charges : 18 000 €

Résultat = 28 000 - 18 000 = +10 000 € (BÉNÉFICE)
```

---

### Étape 2 : Générer les écritures de clôture

**Bouton** : 📝 **2. Générer écritures de clôture**

**Ce que ça fait :**
- Crée automatiquement les écritures pour "solder" tous les comptes de charges et produits
- Transfère le résultat au compte de résultat (120000 par défaut)
- Toutes les écritures sont créées dans le journal **OD** (Opérations Diverses)

**Prérequis :**
- Avoir un journal OD créé
- Avoir défini un compte de résultat dans les paramètres

**Détail du traitement :**

1. **Solde des comptes de produits (7xxxxx) :**
   - Pour chaque compte de produit ayant un solde créditeur
   - Génère une écriture au DÉBIT pour ramener le solde à 0
   - Exemple : Si le compte 706000 (Cotisations) a un solde créditeur de 15 000 €
     - Débit 706000 : 15 000 € (pour solder le compte)

2. **Solde des comptes de charges (6xxxxx) :**
   - Pour chaque compte de charge ayant un solde débiteur
   - Génère une écriture au CRÉDIT pour ramener le solde à 0
   - Exemple : Si le compte 606100 (Équipements) a un solde débiteur de 10 000 €
     - Crédit 606100 : 10 000 € (pour solder le compte)

3. **Écriture de résultat :**
   - Crée une ligne au compte 120000 (Résultat)
   - CRÉDIT si bénéfice (résultat positif)
   - DÉBIT si déficit (résultat négatif)

**Exemple complet :**

```
Journal OD - Lot CLOTURE-1729512345678 - Date : 31/08/2025

Solde des produits :
D  706000  Cotisations adhérents          15 000,00 €
D  756000  Sponsors et partenaires         8 000,00 €
D  740000  Subventions d'exploitation      5 000,00 €

Solde des charges :
C  606100  Achats équipements sportifs    10 000,00 €
C  618000  Licences fédérales              3 000,00 €
C  625000  Déplacements matchs             5 000,00 €

Résultat de l'exercice :
C  120000  Résultat de l'exercice 2024    10 000,00 €

TOTAL :    28 000,00 €                    28 000,00 €
```

**Message de confirmation :**
```
7 écritures de clôture générées. Résultat: 10000.00 €
```

---

### Étape 3 : Clôturer définitivement

**Bouton** : 🔒 **3. Clôturer définitivement** (rouge)

**Ce que ça fait :**
- Marque l'exercice comme CLÔTURÉ dans la base de données
- Désactive tous les boutons de l'écran de clôture
- Change le statut de OUVERT à CLOS

**⚠️ ATTENTION :**
- Cette action est **IRRÉVERSIBLE**
- Une boîte de dialogue de confirmation s'affichera
- Assurez-vous d'avoir bien :
  1. ✅ Calculé le résultat
  2. ✅ Généré les écritures de clôture
  3. ✅ Vérifié tous les comptes

**Message de confirmation :**
```
⚠️ ATTENTION ⚠️

La clôture de l'exercice est IRRÉVERSIBLE.
Vous ne pourrez plus modifier les écritures de cet exercice.

Avez-vous :
1. Calculé le résultat ?
2. Généré les écritures de clôture ?
3. Vérifié tous les comptes ?

Confirmer la clôture définitive ?
```

Cliquez sur **OK** pour confirmer ou **Annuler** pour revenir en arrière.

**Après clôture :**
- Le statut passe à **CLOS** (rouge)
- Tous les boutons sont désactivés
- Message : `✓ Exercice clôturé définitivement`

---

## 🎯 Prérequis

Avant de pouvoir utiliser la clôture d'exercice, assurez-vous d'avoir :

### 1. Défini l'exercice comptable
- Aller dans **Menu Comptabilité > Option 5 - Paramètres**
- Section "Exercice Comptable"
- Renseigner les dates de début et fin

### 2. Créé un journal OD (Opérations Diverses)
- Aller dans **Menu Comptabilité > Option 2 - Journaux**
- Créer un journal avec le code **OD**

### 3. Défini un compte de résultat (optionnel)
- Aller dans **Menu Comptabilité > Option 5 - Paramètres**
- Section "Comptes par Défaut"
- Renseigner le compte résultat (par défaut : 120000)

### 4. Saisi toutes les écritures de l'exercice
- Vérifier dans **Menu Comptabilité > Option 4 - Éditions**
- Générer une Balance pour vérifier tous les comptes

---

## 📊 Workflow complet de clôture

Voici le processus recommandé pour clôturer votre exercice :

### Semaine avant la clôture

1. **Vérifier les paramètres**
   - Menu Comptabilité > Option 5
   - Vérifier les dates d'exercice
   - Vérifier les comptes par défaut

2. **Saisir les dernières écritures**
   - Menu Comptabilité > Option 3 - Écritures
   - Saisir tous les achats, ventes, opérations de l'exercice

3. **Générer et vérifier les rapports**
   - Menu Comptabilité > Option 4 - Éditions
   - Générer la **Balance des comptes** → Vérifier tous les soldes
   - Générer le **Grand livre** → Vérifier le détail par compte
   - Générer le **Journal centralisateur** → Vérifier les totaux

4. **Exporter les données de sauvegarde**
   - Exporter tous les journaux en CSV
   - Exporter le plan comptable
   - Conserver ces fichiers en sécurité

### Jour de la clôture

5. **Calculer le résultat**
   - Menu Comptabilité > Option 6
   - Cliquer sur **"1. Calculer le résultat"**
   - Noter le résultat affiché

6. **Générer les écritures de clôture**
   - Cliquer sur **"2. Générer écritures de clôture"**
   - Vérifier le message : `X écritures de clôture générées. Résultat: XXXX.XX €`

7. **Vérifier les écritures générées**
   - Retourner dans Menu Comptabilité > Option 3 - Écritures
   - Chercher le lot `CLOTURE-XXXXXXXXXX`
   - Vérifier que les écritures sont correctes

8. **Clôturer définitivement**
   - Retourner dans Menu Comptabilité > Option 6
   - Cliquer sur **"3. Clôturer définitivement"**
   - Lire attentivement la confirmation
   - Cliquer sur **OK** pour confirmer

9. **Vérification finale**
   - Le statut doit être **CLOS** (rouge)
   - Les boutons doivent être désactivés
   - Message : `✓ Exercice clôturé définitivement`

### Après la clôture

10. **Préparer le nouvel exercice**
    - Menu Comptabilité > Option 5
    - Modifier les dates d'exercice pour le nouvel exercice
    - Exemple : 01/09/2025 - 31/08/2026

---

## ❓ Questions fréquentes

### Q : Puis-je modifier une écriture après la clôture ?
**R :** Non, la clôture est irréversible. C'est pourquoi il faut bien vérifier avant.

### Q : Que se passe-t-il si je n'ai pas de journal OD ?
**R :** Le système vous demandera de créer un journal OD avant de pouvoir générer les écritures de clôture.

### Q : Puis-je clôturer sans générer les écritures de clôture ?
**R :** Techniquement oui, mais ce n'est pas recommandé. Les écritures de clôture sont essentielles pour une comptabilité conforme.

### Q : Le compte résultat 120000 n'existe pas dans mon plan comptable, que faire ?
**R :** Créez le compte 120000 "Résultat de l'exercice" dans votre plan comptable, ou utilisez un autre compte et renseignez-le dans les paramètres.

### Q : Comment annuler une clôture si je me suis trompé ?
**R :** Il n'est pas possible d'annuler une clôture via l'application. Vous devrez utiliser l'interface Supabase pour modifier manuellement le statut dans la table `company_settings` (déconseillé).

### Q : Les comptes de bilan (1, 2, 3, 4, 5) sont-ils clôturés aussi ?
**R :** Non, seuls les comptes de charges (6) et produits (7) sont clôturés. Les comptes de bilan sont reportés automatiquement sur le nouvel exercice (report à nouveau).

---

## 📝 Notes techniques

### Base de données

Une nouvelle table `company_settings` a été créée pour stocker :
- Les dates d'exercice
- Le statut de clôture
- Les informations du club
- Les comptes par défaut

### Sécurité

- Row Level Security (RLS) activé sur la table
- Chaque utilisateur ne peut voir que les paramètres de ses propres sociétés
- Les dates sont validées (fin > début)

### Migration

Le fichier de migration SQL est disponible :
- `supabase/migrations/20251023000000_create_settings_table.sql`

Exécutez-le dans votre interface Supabase si la table n'existe pas encore.

---

## ✅ Checklist de clôture

Avant de clôturer, cochez mentalement cette liste :

- [ ] Toutes les écritures de l'exercice sont saisies
- [ ] Les dates d'exercice sont correctes dans les paramètres
- [ ] Un journal OD existe
- [ ] Un compte de résultat est défini
- [ ] La balance des comptes est vérifiée
- [ ] Les exports CSV de sauvegarde sont faits
- [ ] Le résultat est calculé et vérifié
- [ ] Les écritures de clôture sont générées
- [ ] Les écritures de clôture ont été vérifiées
- [ ] Tous les responsables ont validé
- [ ] La clôture définitive peut être lancée

---

**Bonne clôture d'exercice ! 🏑**

*Guide créé pour le TAC Hockey Club - Comptabilité AS/400*
