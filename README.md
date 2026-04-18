# 🎓 CampusMe

CampusMe est une application mobile développée avec **React Native** et **Expo**, destinée aux étudiants pour faciliter la vie sur le campus — géolocalisation, caméra, gestion de compte sécurisée et bien plus.

---

##  Aperçu

CampusMe offre une expérience mobile complète avec :
- Navigation intuitive par onglets et par stack
- Carte interactive du campus
- Accès à la caméra pour scanner ou partager
- Géolocalisation en temps réel
- Authentification sécurisée (stockage de tokens)
- Communication avec un backend via API REST

---

##  Stack technique

| Technologie | Version |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.33 |
| TypeScript | ~5.9.2 |
| Redux Toolkit | ^2.11.2 |
| Axios | ^1.14.0 |

---

##  Installation

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Un émulateur Android/iOS **ou** l'application [Expo Go](https://expo.dev/client)

### Cloner le projet

```bash
git clone https://github.com/mary7604/CampusMe.git
cd CampusMe
```

### Installer les dépendances

```bash
npm install
```

---

##  Lancer l'application

```bash
# Démarrer le serveur Expo
npm start

# Sur Android
npm run android

# Sur iOS
npm run ios

# Sur navigateur web
npm run web
```

---

##  Structure du projet

```
CampusMe/
├── assets/          # Images, fonts et ressources statiques
├── backend/         # Serveur backend (API)
├── src/             # Code source principal (composants, screens, store...)
├── App.js           # Point d'entrée de l'application
├── index.js         # Entrée principale Expo
├── app.json         # Configuration Expo
├── package.json     # Dépendances npm
└── tsconfig.json    # Configuration TypeScript
```

---

##  Librairies utilisées

### Navigation
- `@react-navigation/native` — Navigation principale
- `@react-navigation/native-stack` — Navigation par stack (écrans empilés)
- `@react-navigation/stack` — Stack navigator avec animations
- `@react-navigation/bottom-tabs` — Barre de navigation en bas de l'écran

### État global
- `@reduxjs/toolkit` — Gestion de l'état avec Redux moderne
- `react-redux` — Connecteur Redux pour les composants React

### Réseau
- `axios` — Requêtes HTTP vers le backend

### Expo & React Native
- `expo` — Framework Expo
- `expo-camera` — Accès à la caméra du téléphone
- `expo-location` — Géolocalisation GPS
- `expo-secure-store` — Stockage sécurisé des tokens et données sensibles
- `expo-status-bar` — Contrôle de la barre de statut
- `react-native-maps` — Cartes interactives (Google Maps / Apple Maps)
- `react-native-safe-area-context` — Gestion des zones safe area (notch, etc.)
- `react-native-screens` — Optimisation des performances des écrans natifs

### Dev
- `typescript` — Typage statique JavaScript
- `@types/react` — Types TypeScript pour React

---

##  Backend

Le dossier `backend/` contient le serveur de l'application. Consulte le README interne du backend pour les instructions de démarrage.

---

##  Contribution

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une pull request.

---

##  Licence

Ce projet est privé. Tous droits réservés © 2025 mary7604.
