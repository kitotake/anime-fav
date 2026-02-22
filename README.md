# 🎬 AnimeFavoris

> **Une application web vanilla JS pour découvrir, rechercher et sauvegarder vos animes préférés**

<div align="center">

![Status](https://img.shields.io/badge/status-v2.1.0-brightgreen)
![License](https://img.shields.io/badge/license-libre-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Responsive](https://img.shields.io/badge/responsive-HTML5%20%2B%20CSS3-orange)

[🚀 Démarrer](#-démarrage-rapide) • [📚 Documentation](#-documentation) • [🎯 Fonctionnalités](#-fonctionnalités) • [🛠️ Architecture](#-architecture)

</div>

---

## 🌟 Fonctionnalités

✨ **Recherche & Filtrage**
- 🔍 Barre de recherche en temps réel
- 📅 Filtrer par année
- 🎬 Filtrer par catégorie (Anime, Action, Comédie)

⭐ **Favoris Persistants**
- 💾 Sauvegardés en cookie (365 jours)
- 📱 Page dédiée aux favoris
- ⚡ Sync instantané entre pages

🎨 **Interface Adaptée**
- 🌙 Mode sombre / Clair
- 📱 Design responsive
- ♿ Accessibilité optimisée

🎠 **Carousel Top Anime**
- Swiper.js carousel interactif
- Top 5 animes Jikan API
- Navette automatique

📊 **Détails Complets**
- 🖼️ Affiches de haute qualité
- 📝 Synopsis des animes
- ⭐ Notes & genres
- 📅 Dates de diffusion

---

## 🚀 Démarrage Rapide

### 1. Ouvrir l'App
```bash
# Option A : Directement dans le navigateur
file:///d:/NEW/web/autre/anime-fav/index.html

# Option B : Avec un serveur local
cd d:/NEW/web/autre/anime-fav
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

### 2. Utilisation
```
1. 🏠 Page principale (index.html)
   ├─ 🔍 Rechercher : "Dragon Ball Z"
   ├─ 📅 Filtrer : 2024
   ├─ 🎬 Catégories : Action, Comédie, etc.
   ├─ ♥  Cliquer pour ajouter aux favoris
   ├─ ℹ️  Cliquer pour voir détails
   └─ ⭐ Voir mes favoris

2. ⭐ Page favoris (favoris.html)
   ├─ 📚 Liste de tous les favoris
   ├─ ✓  Cliquer pour retirer
   ├─ 🔍 Aussi filtrable par année
   └─ ← Retour à la liste
```

---

## 📚 Documentation

| Document | Contenu |
|----------|---------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | 🎓 Guide de démarrage détaillé |
| [CHANGELOG.md](./CHANGELOG.md) | 📝 Historique des versions |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | 🏗️ Architecture complète du projet |
| [.github/IMPORTS_ANALYSIS.md](./.github/IMPORTS_ANALYSIS.md) | 📦 Analyse des dépendances & imports |
| [.github/NAVIGATION.md](./.github/NAVIGATION.md) | 🗺️ Flux de navigation & routes |

**👉 [Commencer ici →](./GETTING_STARTED.md)**

---

## 🛠️ Architecture

```
AnimeFavoris (Vanilla JS)
├── 🏠 Pages HTML
│   ├── index.html           # Browse & recherche
│   └── favoris.html         # Page favoris
│
├── ⚙️ Configuration
│   └── api/config.js        # TMDB API keys + utilitaires
│
├── 📱 Logique Frontend
│   ├── js/animes.js         # Fetch + affichage
│   ├── js/favoris.js        # Gestion cookies
│   ├── js/rechercher.js     # Search + filtres
│   ├── js/darkmods.js       # Thème clair/sombre
│   ├── js/swiper.js         # Carousel
│   ├── js/events.js         # Événements globaux
│   └── js/cookies.js        # Utilitaire cookies
│
├── 🎨 Stylisation
│   └── assets/
│       ├── styles.css       # Styles + CSS variables + dark mode
│       └── img/             # Icônes SVG
│           ├── heart-filled.svg
│           ├── check.svg
│           ├── info.svg
│           ├── placeholder.svg
│           └── cancel.svg
│
└── 📖 Documentation
    ├── README.md            # Vous êtes ici 👈
    ├── GETTING_STARTED.md   # Guide d'utilisation
    ├── CHANGELOG.md         # Historique versions
    └── .github/             # Docs techniques
```

### Stack
- **Frontend** : HTML5 + CSS3 + Vanilla JavaScript
- **APIs** :
  - 🎬 **TMDB** : Données animes (discover/search/details TV)
  - 🌸 **Jikan** : Top anime pour carousel
- **Librairies** : Swiper.js (carousel CDN)
- **Stockage** : Cookies (favoris) + localStorage (thème)

---

## 🎯 Fonctionnement Détaillé

### 1️⃣ Découvrir Animes
`index.html` → TMDB API `/discover/tv` → Affichage grille

### 2️⃣ Rechercher
`Barre de recherche` → Debounce 500ms → TMDB `/search/tv` → Résultats filtrés

### 3️⃣ Filtrer
- **Année** : Filtre côté client sur `first_air_date`
- **Catégorie** : Filtre API via `with_genres` TMDB

### 4️⃣ Ajouter aux Favoris
`Clic ♥` → `window.toggleFavorite()` → Set JS + Cookie → `Affiche ✓`

### 5️⃣ Voir Favoris
`favoris.html` → Charge cookie → Récupère détails TMDB → Affiche liste

### 6️⃣ Thème Clair/Sombre
`Clic 🌙` → `localStorage["theme"]` → CSS variables `[data-theme]` → Refresh UI

---

## 💾 Données Persistantes

| Données | Format | Stockage | Durée | Géré par |
|---------|--------|----------|-------|----------|
| **Favoris** | `Array<String>` (IDs) | Cookie `"favorites"` | 365j | `favoris.js` |
| **Thème** | `"light" \| "dark"` | localStorage `"theme"` | ∞ | `darkmods.js` |

---

## 🚨 Points Importants

⚠️ **Limitations Connues**
- Pas de responsive mobile (optimisé desktop)
- Pagination 20 résultats par page
- Carousel 5 animes seulement (top Jikan)
- Pas de sauvegarde cloud

✅ **Points Forts**
- Zéro dépendances npm (vanilla JS)
- Fonctionne offline une fois les animes chargés
- Cache navigateur + cookies
- Compatible navigateurs modernes

---

## 🔐 Sécurité & Confidentialité

✅ **Ce qu'on ne collecte PAS**
- Pas d'identifiants utilisateur
- Pas de tracking analytics
- Pas de connexion serveur
- Données stockées localement uniquement

⚠️ **À savoir**
- Clé API TMDB en clair (acceptable pour usage public)
- Appels directs à TMDB (peut être bloqué par CORS en certains contextes)
- Favoris stockés localement (pas synchronisés entre appareils)

---

## 🤝 Contribuer

Cette application a été créée pour **montrer ce qui est possible en vanilla JS**.

Pour améliorer :
1. Fork le projet
2. Créez une branche `feature/nom-feature`
3. Committez vos changements
4. Pushez et créez une Pull Request

**Idées d'améliorations** :
- [ ] Responsive mobile complet
- [ ] Filtres avancés (score min, état, stagiaire)
- [ ] Historique des animes visionnés
- [ ] Watchlist avec états (watching/dropped/completed)
- [ ] Mode hors ligne (service workers)
- [ ] Export favoris (JSON/CSV)

---

## 📄 License

Ce projet est libre d'utilisation. Faites-en ce que bon vous semble! 🎉

---

## 🙏 Crédits

- **TMDB API** : Données animes & images
- **Jikan API** : Top 5 anime
- **Swiper.js** : Carousel interactif
- **GitHub Copilot** : Génération & optimisation du code

---

<div align="center">

**Créé avec ❤️ en vanilla JS**

[⬆ Retour au top](#-animefavoris)

</div>
