# ⚡ Quick Reference — AnimeFavoris

> **Cheat sheet rapide pour devs — Toutes les infos essentielles en un coup d'oeil**

---

## 🎯 Links Essentiels

| 🎬 Lancer | Docs | Code |
|-----------|------|------|
| `file:///d:/NEW/web/autre/anime-fav/index.html` | [README.md](./README.md) | [index.html](./index.html) |
| `http://localhost:8000` | [GETTING_STARTED.md](./GETTING_STARTED.md) | [favoris.html](./favoris.html) |

---

## 📺 Globals JavaScript (window.*)

```javascript
// 🔐 API Config (api/config.js)
window.API_KEY              // TMDB API key
window.BASE_URL             // https://api.themoviedb.org/3
window.IMAGE_BASE_URL       // https://image.tmdb.org/t/p/w500
window.callAPI()            // ⚠️ Movies only
window.getImageUrl()        // Retourne URL image TMDB
window.handleImageError()   // Fallback en placeholder

// ⭐ Favoris (js/favoris.js)
window.favorites            // Set<String> — anime IDs en favoris
window.initFavorites()      // Charger favoris depuis cookie
window.saveFavorites()      // Sauvegarder Set dans cookie
window.toggleFavorite()     // Ajouter/retirer favori
window.updateFavoritesCount()  // Update #favoritesCount
window.loadAndDisplayFavorites() // Afficher favoris (favoris.html)

// 🍪 Cookies (js/cookies.js)
window.Cookies.get()        // Lire cookie
window.Cookies.set()        // Écrire cookie
window.Cookies.delete()     // Supprimer cookie

// 📺 Animes (js/animes.js)
window.allAnimes            // Array<Object> — animes chargés
window.currentPage          // Number — page actuelle
window.fetchAnimes()        // Fetch animes TMDB avec filtres
window.displayAnimes()      // Afficher cartes animes
window.openModal()          // Ouvrir modal détails
window.createAnimeCard()    // Créer HTML carte

// 🔍 Recherche (js/rechercher.js)
window.initSearch()         // Init search bar + filtres
window.resetFilters()       // Réinitialiser filtres
window.getCurrentFilters()  // { query, year, category }
window.setFilters()         // Définir filtres
window.debugSearch()        // Debug info

// 🌙 Dark Mode (js/darkmods.js)
localStorage.getItem("theme")  // "light" | "dark"
document.documentElement.getAttribute("data-theme") // CSS variables

// 🎠 Carousel (js/swiper.js)
new Swiper(".swiper-container", {...}) // Swiper instance

// 🎯 Événements (js/events.js)
window.addEventListeners()  // Init tous les événements
window.debugEvents()        // Debug info
window.reinitEvents()       // Réinitialiser

// 🚀 Page Flag
window.showFavoritesOnly    // bool — index.html (false) vs favoris.html (true)
```

---

## 🎨 CSS Variables

```css
/* Mode Clair (:root) */
--bg-color:      white
--text-color:    black
--header-bg:     #ff4d4d
--button-bg:     #ff4d4d
--button-hover:  #e64a19
--card-bg:       #f5f5f5

/* Mode Sombre ([data-theme="dark"]) */
--bg-color:      #121212
--text-color:    white
--header-bg:     #333
--button-bg:     #ff6b6b
--button-hover:  #d84315
--card-bg:       #1e1e1e
```

---

## 🌐 API Calls

```javascript
// ===== TMDB (Animes) =====

// Fetch avec paramètres
const url = `${window.BASE_URL}/discover/tv?with_genres=16&with_origin_country=JP&api_key=${window.API_KEY}`;
const data = await fetch(url).then(r => r.json());

// Search
const url = `${window.BASE_URL}/search/tv?query=Dragon%20Ball&api_key=${window.API_KEY}&language=fr-FR`;

// Détails
const url = `${window.BASE_URL}/tv/{id}?api_key=${window.API_KEY}&language=fr-FR`;

// ===== Jikan (Top Anime) =====

const data = await fetch("https://api.jikan.moe/v4/top/anime")
    .then(r => r.json());
// result.data[0..4] = top 5

// ===== Cookies =====

window.Cookies.set("favorites", [1, 2, 3], { days: 365 });
const favs = window.Cookies.get("favorites"); // [1, 2, 3]
window.Cookies.delete("favorites");
```

---

## 📦 Structure Données

```javascript
// Anime Object (TMDB)
{
  id: 12345,
  name: "Dragon Ball Z",
  first_air_date: "1989-04-26",
  poster_path: "/abc123.jpg",
  vote_average: 8.2,
  genres: [
    { id: 16, name: "Animation" },
    { id: 10759, name: "Action & Adventure" }
  ],
  overview: "Continuation de Dragon Ball...",
  ... // + 50+ autres champs
}

// Favoris Stockage (Cookie)
{
  "favorites": ["12345", "67890", "11111"]
}

// localStorage
{
  "theme": "dark" // ou "light"
}
```

---

## 🔄 Script Load Order

```html
<!-- index.html -->
1. config.js        ← API keys
2. cookies.js       ← window.Cookies
3. favoris.js       ← Dépend cookies + BASE_URL
4. darkmods.js      ← Standalone
5. animes.js        ← Dépend API_KEY
6. rechercher.js    ← Dépend fetchAnimes (animes.js)
7. swiper.js        ← Swiper CDN lib
8. events.js        ← Dépend tous les autres

<!-- favoris.html -->
1. config.js
2. cookies.js
3. favoris.js
4. darkmods.js
5. animes.js
6. events.js
<!-- No rechercher.js, swiper.js (pas utiles) -->
```

---

## 🎬 Fichiers Source Clés

| Fichier | Lignes | Rôle | Dépend |
|---------|--------|------|---------|
| `api/config.js` | 63 | Config TMDB | Aucune |
| `js/cookies.js` | 40 | Les Cookies | Aucune |
| `js/favoris.js` | 220 | Gestion favoris | cookies.js, config.js |
| `js/darkmods.js` | 30 | Toggle thème | Aucune |
| `js/animes.js` | 248 | Fetch + affichage | config.js |
| `js/rechercher.js` | 190 | Search + filtres | animes.js |
| `js/swiper.js` | 40 | Carousel Jikan | Swiper CDN |
| `js/events.js` | 190 | Événements globaux | Tous les autres |

---

## 🎯 Événements DOM

```javascript
// Boutons Favoris
.favorite-icon on click → window.toggleFavorite(id, btn)

// Info Modal
.info-icon on click → window.openModal(id)

// Charger Plus
#loadMore on click → window.fetchAnimes({ page: currentPage + 1 })

// Recherche
#searchBar on input → debounce 500ms → fetchAnimes({ query })

// Filtres Année/Catégorie
#yearSelect on change → fetchAnimes({ year })
.category-btn on click → fetchAnimes({ category })

// Thème
#darkModeToggle on click → toggle data-theme + localStorage

// Modal Close
.close on click → modal.style.display = "none"
Escape key → modal.style.display = "none"
click outside → modal.style.display = "none"
```

---

## 🐛 Debug Commands

```javascript
// Console (F12)
window.favorites.size           // Nombre de favoris
window.allAnimes.length         // Nombre d'animes chargés
window.currentPage              // Page actuelle
window.showFavoritesOnly        // Mode favoris?

// Cookies
document.cookie                 // Voir tous les cookies

// LocalStorage
localStorage.getItem("theme")   // Thème actuel

// Debug Functions
window.debugEvents()            // État des éléments
window.debugSearch()            // État search
window.reinitEvents()           // Réinitialiser événements

// Fetch Test
fetch(`${window.BASE_URL}/discover/tv?api_key=${window.API_KEY}`)
  .then(r => r.json())
  .then(d => console.log(d))

// Clear All (destructive!)
document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
localStorage.clear();
```

---

## 📋 Checklist Avant Push

- [ ] Tous les scripts dans ordre correct (index.html + favoris.html)
- [ ] Pas d'erreurs console (F12)
- [ ] Recherche fonctionne (besoin Internet)
- [ ] Favoris sauvegardent (cookie)
- [ ] Dark mode bascule (localStorage)
- [ ] Modal s'ouvre/ferme
- [ ] Pages naviguent proprement (index ↔ favoris)
- [ ] Responsive OK (Ctrl+Shift+M)
- [ ] Links tous valides
- [ ] Aucun hardcoded `/./` paths

---

## ✨ Tips Rapides

```javascript
// Ajouter un favori programmatiquement
window.toggleFavorite("12345", document.querySelector('.favorite-icon'));

// Charger animes avec filtre
window.fetchAnimes({ 
  query: "Bleach", 
  year: "2024", 
  category: "10759", 
  page: 1 
});

// Viser toutes les cartes
document.querySelectorAll(".anime-card")

// Forcer refresh favoris
window.loadAndDisplayFavorites();

// Reset interface
window.resetFilters();
window.reinitEvents();

// Export favoris JSON
JSON.stringify(Array.from(window.favorites))
```

---

## 🚀 Déploiement Rapide

```bash
# 1. Local server
python -m http.server 8000
# Ouvrir http://localhost:8000

# 2. Sur GitHub Pages (si repo)
# Push à master/main → GH Pages auto-deploy

# 3. Autre hébergement statique
# Uploader les fichiers (SFTP/drag-drop)
# Aucune dépendance npm/build needed
```

---

## 📞 Erreurs Courantes

```javascript
// ❌ "window.fetchAnimes is not a function"
// Fix: Vérifier animes.js chargé après cookies.js

// ❌ "Cannot read properties of null (reading 'add')"
// Fix: window.initFavorites() not called

// ❌ "TMDB 401 Unauthorized"
// Fix: Clé API invalide ou expirée dans config.js

// ❌ "Swiper is not defined"
// Fix: swiper-bundle.min.js CDN not loaded (index.html only)

// ❌ "Images not loading"
// Fix: CORS/Internet. Check placeholder.svg fallback.
```

---

<div align="center">

**Signets cette page pour accès rapide! →**

---

Last Updated: 22 février 2026  
Quick ref v1.0

</div>
