# 🎬 AnimeFavoris — Guide de Démarrage Rapide

Bienvenue dans **AnimeFavoris** ! Une application web simple pour découvrir, rechercher et sauvegarder vos animes préférés.

## 🚀 Démarrage Rapide

### 1. Ouvrir l'Application
```bash
# Dans votre navigateur, ouvrez simplement:
file:///d:/NEW/web/autre/anime-fav/index.html
```

Ou lancez un serveur local:
```bash
# Si vous avez Python 3:
python -m http.server 8000

# Si vous avez Node.js:
npx http-server
```

### 2. Fonctionnalités Principales

#### 🏠 Page Principale (`index.html`)
- **Rechercher** : Tapez un nom d'anime dans la barre de recherche
- **Filtrer par année** : Utilisez le dropdown "Filtrer par année"
- **Filtrer par catégorie** : 
  - `Anime` : Tous les animes TV
  - `Action` : Films d'action & aventure
  - `Comédie` : Comédies
- **Ajouter aux favoris** : Cliquez sur le ♥ sur n'importe quelle carte
- **Voir détails** : Cliquez sur l'icône ℹ️ pour voir plus d'infos
- **Charger plus** : Cliquez sur "Voir plus" pour paginer la liste

#### ⭐ Page Favoris (`favoris.html`)
- Affiche tous vos animes favoris
- Cliquez sur ✓ pour retirer un favori
- Filtrez aussi par année
- Cliquez ← pour revenir à la liste principale

#### 🌙 Mode Sombre
- Cliquez sur **"🌙 Mode Sombre"** / **"☀️ Mode Clair"** dans le header
- Votre choix est mémorisé (localStorage)

---

## 🛠️ Architecture du Projet

```
anime-fav/
├── index.html                # Page principale (browse + carousel)
├── favoris.html              # Page favoris
├── CHANGELOG.md              # 📝 Historique des mises à jour
├── api/
│   └── config.js            # ⚙️ Clé API TMDB + utilitaires
├── assets/
│   ├── styles.css           # 🎨 Styles + dark mode (CSS variables)
│   ├── darkmode.css         # ⚠️ Obsolète (garder pour compati)
│   └── img/                 # 🖼️ Icônes SVG
│       ├── check.svg        # ✓ Favori confirmé
│       ├── heart-filled.svg  # ♥ Ajouter aux favoris
│       ├── info.svg         # ℹ️ Plus d'infos
│       ├── placeholder.svg   # 📺 Image manquante (fallback)
│       └── cancel.svg        # ✕ Bouton fermer
└── js/
    ├── animes.js            # 📺 Fetch TMDB + affichage cartes
    ├── favoris.js           # ⭐ Gestion des favoris (cookies)
    ├── rechercher.js        # 🔍 Barre recherche + filtres
    ├── darkmods.js          # 🌙 Basculement thème
    ├── swiper.js            # 🎠 Carousel Top 5 Jikan
    ├── events.js            # 🎯 Événements globaux
    ├── cookies.js           # 🍪 Utilitaire cookies
    ├── ui.js                # (Compat — ne pas utiliser)
    └── script.js            # (Compat — ne pas utiliser)
```

---

## 🔌 APIKeys & Configuration

### TMDB (Données d'Anime)
- **Clé API** : Configurée dans `api/config.js`
- **Endpoints utilisés** :
  - `GET /discover/tv?with_genres=16&with_origin_country=JP` — Découvrir animes JP
  - `GET /search/tv?query=...` — Rechercher par nom
  - `GET /tv/{id}?language=fr-FR` — Détails complets d'un anime

### Jikan (Top Anime)
- **Endpoint** : `https://api.jikan.moe/v4/top/anime`
- **Usage** : Carousel des 5 meilleurs animes (public, no API key needed)

---

## 💾 Stockage des Données

### Favoris (Cookie)
```javascript
// Les favoris sont stockés dans un cookie nommé "favorites"
// Durée : 365 jours
// Format : Array de String (anime IDs)
// Géré par : js/favoris.js
```

### Thème (localStorage)
```javascript
// Le choix de thème (light/dark) est stoké dans localStorage
// Clé : "theme"
// Valeurs : "light" ou "dark"
// Géré par : js/darkmods.js
```

---

## 🚨 Dépannage Courant

### ❌ Les animes ne s'affichent pas
1. Vérifiez la console (F12) pour les erreurs
2. Vérifiez que vous êtes connecté à Internet (appels TMDB API)
3. Vérifiez que `api/config.js` contient une clé API valide

### ❌ Les favoris ne se sauvegardent pas
1. Vérifiez que les cookies sont activés dans votre navigateur
2. Vérifiez la console pour les erreurs de cookies
3. Essayez d'ouvrir les pages en `http://` (pas `file://`) pour plus de sécurité

### ❌ Les images n'apparaissent pas
1. C'est normal — les placeholder SVG s'affichent si TMDB n'a pas d'image
2. Vérifiez votre connexion Internet
3. Vérifiez que `assets/img/placeholder.svg` existe

### ❌ Le dark mode ne fonctionne pas
1. Rafraîchissez la page (Ctrl+F5)
2. Videz le cache du navigateur
3. Vérifiez que `js/darkmods.js` est chargé (F12 → Network)

---

## 📖 Conventions de Code

- ✅ **Vanilla JS** — Pas de frameworks, compatible ancien navigateurs
- ✅ **Globals** — Tout est exposé via `window.*` (pas de modules)
- ✅ **Logging** — Console logs avec emojis :
  - ✅ = succès
  - ❌ = erreur
  - ⚠️ = warning
  - 🔗 = URLs
  - 📦 = données
- ✅ **CSS Variables** — Utilisées pour le thème (--bg-color, --text-color, etc.)
- ✅ **Async/Await** — Utilisé pour toutes les requêtes API

---

## 🎯 Prochaines Étapes

1. **Amélioration UI** : Responsive design pour mobile
2. **Filtres avancés** : Par note, par statut (ongoing/ended), etc.
3. **Historique** : Animes récemment visionnés
4. **Watchlist** : États (watching, on-hold, dropped)
5. **Sync Cloud** : Sauvegarder favoris dans le cloud

---

## 📚 Ressources

- [CHANGELOG.md](./CHANGELOG.md) — Historique des versions
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) — Architecture complète
- [.github/IMPORTS_ANALYSIS.md](./.github/IMPORTS_ANALYSIS.md) — Analyse des dépendances
- [.github/NAVIGATION.md](./.github/NAVIGATION.md) — Flux de navigation

---

**Créé avec ❤️ par GitHub Copilot**  
**Date** : 22 février 2026  
**License** : Libre d'usage
