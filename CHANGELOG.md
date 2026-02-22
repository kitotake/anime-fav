# 📝 CHANGELOG — AnimeFavoris

## v2.1.0 — 22 Février 2026 ✨ Mise à Jour Complète

### 🔧 Améliorations

#### Configuration API (`api/config.js`)
- ✅ **Documentation améliorée** : Ajout de commentaires explicites sur l'utilisation correcte de TMDB API
- ✅ **Exemple d'usage TV/anime** : Clarification sur comment faire des appels directs avec `fetch()` pour les séries TV
- ✅ **Organisation** : Réorganisation des sections (Config → callAPI → Utilitaires → Initialisation)
- ✅ **Logging amélioré** : Format structuré pour les logs de démarrage

#### Feuilles de style (`assets/`)
- ✅ **Consolidation dark mode** : `styles.css` contient maintenant l'intégralité du dark mode (CSS variables + sélecteurs `[data-theme]`)
- ⚠️ **Fichier obsolète** : `darkmode.css` reste pour compatibilité mais n'est plus utilisé (toutes les règles sont dans `styles.css`)

#### Architecture
- ✅ **Ordre de chargement des scripts** : Confirmé et optimisé pour éviter les dépendances manquantes
- ✅ **Chemins d'assets** : Tous les chemins d'images utilisent le format correct (`./assets/img/`)
- ✅ **Favoris persistants** : Système de cookies validé et fonctionnel (365 jours)

### 🐛 Bugs Corrigés
- ✅ Documentation config.js concernant l'utilisation restrictive de `callAPI()` (movies seulement)
- ✅ Clarification des endpoints TV vs Movies

### 📚 Documentation
- ✅ Création de ce CHANGELOG
- ✅ Amélioration des commentaires dans `api/config.js`

---

## v2.0.0 — Versions Antérieures

Voir les fichiers documentaires:
- [IMPORTS_ANALYSIS.md](.github/IMPORTS_ANALYSIS.md) — Analyse détaillée des dépendances
- [NAVIGATION.md](.github/NAVIGATION.md) — Flux de navigation et routes
- [copilot-instructions.md](.github/copilot-instructions.md) — Guide d'architecture du projet

---

## Comment Utiliser

### Ajouter des Animes
1. Naviguez vers `index.html`
2. Utilisez la barre de recherche ou les filtres (Année, Catégorie)
3. Cliquez sur ♥ pour ajouter aux favoris (persiste en cookie)

### Voir les Favoris
1. Cliquez sur **Voir Favoris ⭐** (page principale)
2. Les animes favoris sont affichés avec un indicateur ✓

### Changer de Thème
- Cliquez **🌙 Mode Sombre** / **☀️ Mode Clair** (persisté en localStorage)

---

## Stack Technique
- **Frontend** : HTML5 + CSS3 + Vanilla JavaScript (no frameworks)
- **API** : TMDB (discover/search TV), Jikan (top anime carousel)
- **Stockage** : Cookies (favoris) + localStorage (thème)
- **Carousel** : Swiper.js (CDN)

---

## Fichiers Clés à Connaître
| Fichier | Rôle |
|---------|------|
| `api/config.js` | Configuration TMDB + utilitaires |
| `js/animes.js` | Fetch + affichage des animes |
| `js/favoris.js` | Gestion des favoris (cookies) |
| `js/rechercher.js` | Barre de recherche + filtres |
| `js/darkmods.js` | Basculement thème clair/sombre |
| `js/swiper.js` | Carousel Top 5 Jikan API |
| `js/events.js` | Événements globaux (modal, boutons) |
| `assets/styles.css` | Styles + CSS variables + dark mode |

---

## Notes de Développement
- ✅ Tous les scripts utilisent le pattern `window.*` pour l'exposition globale
- ✅ Pas de bundler/modules ES6 — compatible navigateur antique
- ✅ Dark mode utilise CSS variables + `data-theme` attribute
- ✅ Favoris persistés en tant que `Set<String>` + sérialisés en JSON dans cookies
- ⚠️ `config.js` expédie des logs au démarrage — normalement aucun appel API (sandbox safety)
- ⚠️ `rechercher.js` utilise un délai de 100ms pour éviter les appels concurrents

---

**Dernière mise à jour** : 22 février 2026  
**Auteur** : GitHub Copilot  
**Version Node/Build** : Vanilla JS (aucune dépendance npm)
