# Logiciel de Comptabilité AS/400

Cette application reproduit fidèlement l'interface et les fonctionnalités d'un système de comptabilité AS/400.

## Description

Ce logiciel est une réplique exacte de l'interface AS/400 que vous avez fournie, incluant :

- **Interface authentique AS/400** : Fond noir, texte vert, police monospace Courier New
- **Barre d'outils Mocha TN5250** : Reproduction de l'émulateur terminal
- **Navigation par menus** : Système de navigation identique à l'original
- **Écrans de comptabilité** : Tous les écrans principaux reproduits
- **Fonctionnalités de base** : Saisie d'écritures, gestion des comptes

## Structure de l'application

### Écrans principaux

1. **Écran de connexion** - Dialogue de connexion AS/400 Host
2. **Écran système** - Informations d'ouverture système
3. **Choix société** - Sélection de la société de travail (TAC - Touquet Hockey Club)
4. **Menu général** - Menu principal de comptabilité
5. **Menu comptabilité** - Options comptables (Comptes, Journaux, Écritures, etc.)
6. **Écritures** - Menu des écritures comptables
7. **Saisie écriture** - Formulaire de saisie d'écriture
8. **Saisie détaillée** - Saisie d'écriture sans masque

### Navigation

- **Touches de fonction** :
  - `F3` ou `Échap` : Retour/Exit
  - `F4` : Aide/Invite
  - `F5` : Rafraîchir
  - `F12` : Annuler
- **Saisie numérique** : Tapez le numéro de l'option et appuyez sur Entrée
- **Clic souris** : Cliquez directement sur les options de menu

### Fonctionnalités implémentées

#### ✅ Fonctionnalités disponibles
- Navigation complète entre tous les écrans
- Interface graphique identique à l'AS/400 original
- Émulation des touches de fonction
- Sélection de société (TAC - Touquet Hockey Club pré-sélectionné)
- Affichage des formulaires de saisie d'écriture
- Simulation temps réel avec horloge
- Sauvegarde locale des données (localStorage)

#### ⏳ À développer
- Logique complète de comptabilité
- Validation des comptes
- Calculs automatiques
- Impression des rapports
- Gestion des utilisateurs
- Base de données complète

## Installation et utilisation

1. **Ouvrir l'application** : Double-cliquez sur `index.html`
2. **Connexion** : Cliquez sur "OK" dans le dialogue de connexion
3. **Navigation** : Utilisez les menus pour naviguer dans l'application

### Séquence d'utilisation typique

1. **Connexion** → Écran système → Choix société
2. **TAC** est pré-sélectionné → Menu général
3. **Option 1** → Menu comptabilité
4. **Option 3** → Écritures
5. **Option 3** → Saisie d'écriture directe
6. **Remplir code document** → Appuyer sur Entrée → **Saisie sans masque**

### Navigation vers saisie sans masque

Dans l'écran "Saisie écritures" (BRO02G) :
- Remplissez au minimum le champ **Code document**
- Appuyez sur **Entrée** dans n'importe quel champ
- Vous serez automatiquement dirigé vers l'écran **"Saisie écriture sans masque"** (BRO03G)
- Tous les champs de saisie sont maintenant disponibles pour l'écriture comptable

### Champs obligatoires (BRO03G)

L'écran de saisie sans masque contient une section spéciale avec les **champs obligatoires** :

#### 📋 Champs requis
- **Compte** : Numéro de compte comptable (minimum 3 caractères alphanumériques)
- **S** : Sens de l'écriture 
- **Montant** : Montant de l'écriture (format décimal, ex: 150,50)
- **Libellé** : Description de l'écriture comptable
- **Date** : Date au format JJ/MM/AA (ex: 29/07/25)

#### ✅ Fonctionnalités de validation
- **Validation en temps réel** : Les champs deviennent rouges si invalides
- **Navigation Entrée** : Appuyez sur Entrée pour passer au champ suivant
- **Sauvegarde automatique** : L'écriture est sauvée quand tous les champs sont valides
- **Messages d'aide** : Affichage des erreurs et confirmations

#### 🎯 Utilisation
1. Remplissez tous les champs obligatoires dans l'ordre
2. Utilisez **Entrée** pour valider chaque champ
3. L'écriture est automatiquement sauvegardée quand tout est correct
4. Les champs se vident automatiquement après sauvegarde

## Structure des fichiers

```
AS400 beta 2/
├── index.html      # Page principale avec tous les écrans
├── style.css       # Styles AS/400 authentiques
├── app.js          # Logique de navigation et fonctionnalités
└── README.md       # Cette documentation
```

## Caractéristiques techniques

### Interface utilisateur
- **Couleurs** : Fond noir (#000), texte vert (#00ff00), bleu (#0080ff)
- **Police** : Courier New monospace pour l'authenticité
- **Résolution** : Adaptable, optimisé pour écrans standards
- **Compatibilité** : Tous navigateurs modernes

### Technologies utilisées
- **HTML5** : Structure des écrans
- **CSS3** : Styles et apparence AS/400
- **JavaScript ES6** : Logique applicative et navigation
- **LocalStorage** : Persistance des données

## Personnalisation

### Modification des sociétés
Éditez le fichier `index.html` section "company-list" pour ajouter/modifier les sociétés disponibles.

### Ajout de fonctionnalités
Modifiez `app.js` pour étendre les fonctionnalités comptables.

### Personnalisation visuelle
Ajustez `style.css` pour modifier l'apparence tout en conservant l'authenticité AS/400.

## Support et développement

Cette application est conçue pour reproduire au maximum l'expérience utilisateur AS/400 authentique tout en utilisant des technologies web modernes pour la facilité de déploiement et de maintenance.

Pour toute question ou amélioration, référez-vous aux fichiers sources bien commentés.

---

**© 2025 - Réplique AS/400 pour TAC Touquet Hockey Club** 