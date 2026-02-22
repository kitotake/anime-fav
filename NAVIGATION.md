# 🗺️ NAVIGATION.md — AnimeFavoris

> Description complète des pages, routes, flux de navigation et interactions utilisateur.

---

## 1. Pages

### `/index.html` — Page principale (Browse)

**Rôle :** Afficher, rechercher et filtrer tous les animes. Permettre l'ajout aux favoris.

```
┌─────────────────────────────────────────────────┐
│  HEADER                                         │
│  [🌙 Mode Sombre] [AnimeFavoris] [Recherche...] │
│  [Filtre année ▼] [Anime] [Action] [Comédie]    │
│  [Voir Favoris →]                               │
├─────────────────────────────────────────────────┤
│  CAROUSEL (Swiper)                              │
│  ← [Top 5 animes Jikan API] →                  │
├─────────────────────────────────────────────────┤
│  GRID — Anime Cards                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │ Img  │ │ Img  │ │ Img  │ │ Img  │           │
│  │ ♥  ℹ │ │ ♥  ℹ │ │ ♥  ℹ │ │ ♥  ℹ │           │
│  │ Name │ │ Name │ │ Name │ │ Name │           │
│  │ Year │ │ Year │ │ Year │ │ Year │           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
├─────────────────────────────────────────────────┤
│  [Voir plus]                                    │
└─────────────────────────────────────────────────┘
```

**State:** `window.showFavoritesOnly = false`

---

### `/favoris.html` — Page Favoris

**Rôle :** Afficher uniquement les animes mis en favori. Permet de retirer des favoris, filtrer par année, voir les détails.

```
┌─────────────────────────────────────────────────┐
│  HEADER                                         │
│  [🌙 Mode Sombre] [AnimeFavoris]                │
│  [Filtre année ▼] [← Retour à la liste]         │
├─────────────────────────────────────────────────┤
│  Total Favoris : N                              │
├─────────────────────────────────────────────────┤
│  GRID — Favorite Cards                          │
│  ┌──────┐ ┌──────┐                              │
│  │ Img  │ │ Img  │                              │
│  │ ✓  ℹ │ │ ✓  ℹ │   (✓ = already favorited)  │
│  │ Name │ │ Name │                              │
│  │ Year │ │ Year │                              │
│  └──────┘ └──────┘                              │
│                                                 │
│  [If empty: 📺 Aucun anime en favori            │
│   ← Retour à la liste]                          │
└─────────────────────────────────────────────────┘
```

**State:** `window.showFavoritesOnly = true`

---

## 2. Navigation Flows

### Flow A — Browse to Favorites
```
index.html
  │
  ├─ User clicks [Voir Favoris] button
  │   └─ <a href="./favoris.html"> → navigates to favoris.html
  │
favoris.html
  │
  └─ User clicks [← Retour à la liste]
      └─ <a href="./index.html"> → navigates back to index.html
```

> ⚠️ Navigation uses plain `<a>` tags inside `<button>` elements. This is valid but non-standard. Prefer `window.location.href` or just `<a>` styled as button.

---

### Flow B — Adding a Favorite (index.html)
```
User clicks ♥ (heart-filled icon) on anime card
  │
  ├─ fires click on .favorite-icon
  ├─ calls window.toggleFavorite(animeId, imgElement)
  │   ├─ adds ID to window.favorites (Set)
  │   ├─ changes img.src → check.svg
  │   ├─ calls window.saveFavorites() → Cookies.set("favorites", [...])
  │   └─ calls window.updateFavoritesCount()
  └─ card icon updates visually
```

---

### Flow C — Removing a Favorite (favoris.html)
```
User clicks ✓ (check icon) on favorite card
  │
  ├─ fires click on .favorite-icon
  ├─ calls window.toggleFavorite(animeId, imgElement)
  │   ├─ removes ID from window.favorites (Set)
  │   ├─ calls window.saveFavorites() → Cookies.set updated
  │   └─ calls window.loadAndDisplayFavorites() → refreshes grid
  └─ card disappears from favorites grid
```

---

### Flow D — Search & Filter (index.html)
```
User types in #searchBar
  │
  ├─ debounce 500ms
  ├─ sets currentQuery
  ├─ calls applyFilters()
  │   ├─ resets window.currentPage = 1
  │   └─ calls window.fetchAnimes({ query, year, category })
  │       ├─ TMDB /search/tv?query=...  (if text)
  │       └─ TMDB /discover/tv?...      (if no text)
  └─ grid re-renders with results

User selects year in #yearSelect
  └─ same flow, adds first_air_date filter

User clicks category button [Anime|Action|Comédie]
  ├─ updates active button style
  └─ same flow, changes with_genres param
```

---

### Flow E — Load More (index.html)
```
User clicks [Voir plus]
  │
  ├─ window.currentPage++
  ├─ calls window.fetchAnimes({ ...currentFilters, page: currentPage })
  ├─ appends new results to window.allAnimes
  └─ re-renders grid (with all pages combined)
  
  Note: button hidden when page >= total_pages
```

---

### Flow F — Open Modal (both pages)
```
User clicks ℹ (info icon) on any card
  │
  ├─ calls openModal(animeId)
  ├─ sets modal display: flex
  ├─ shows loading state
  ├─ fetches TMDB /tv/{id}?language=fr-FR
  └─ fills modal with: title, date, rating, genres, poster, description

User closes modal via:
  ├─ [×] button → modal.style.display = "none"
  ├─ click outside modal → same
  └─ Escape key → same
```

---

## 3. URL & Route Summary

| Route | Page | Description |
|---|---|---|
| `/index.html` or `/` | index.html | Main browse page |
| `/favoris.html` | favoris.html | Favorites list page |

No SPA routing — pure multi-page application with full page reloads between pages.

---

## 4. Persistent State (across page navigations)

| Data | Storage | Key | Lifetime |
|---|---|---|---|
| Favorites list | Cookie | `"favorites"` | 365 days |
| Dark mode preference | localStorage | `"theme"` | Until cleared |

Both are restored on every `DOMContentLoaded`.

---

## 5. Component Inventory

### Anime Card
```html
<div class="anime-card">
  <div class="card-container">
    <div class="poster"><img></div>
    <div class="card-buttons">
      <img class="favorite-icon" data-id="...">  <!-- heart or check -->
      <img class="info-icon" data-id="...">       <!-- info -->
    </div>
    <div class="card-info">
      <h3 class="anime-title">...</h3>
      <p class="anime-year">...</p>
    </div>
  </div>
</div>
```

### Modal
```html
<div id="modal" class="modal">
  <div class="modal-content">
    <span class="close">×</span>
    <h2 id="animeTitle"></h2>
    <p id="animeDate"></p>
    <p id="animeRating"></p>
    <p id="animeGenres"></p>
    <img id="animeImage">
    <div class="modal-description">
      <h3>Description</h3>
      <p id="animeDescription"></p>
    </div>
  </div>
</div>
```

### Swiper Carousel (index.html only)
```html
<section id="carousel">
  <div class="swiper-container">
    <div class="swiper-wrapper"><!-- slides injected by swiper.js --></div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</section>
```

---

## 6. Genre ID Reference (TMDB)

| Button Label | `data-category` | TMDB Genre |
|---|---|---|
| Anime | `16` | Animation |
| Action | `10759` | Action & Adventure |
| Comédie | `35` | Comedy |

---

## 7. Known Navigation Issues

| Issue | Location | Impact | Fix |
|---|---|---|---|
| `<a>` inside `<button>` | index.html, favoris.html | Accessibility warning | Replace with `<a class="btn">` |
| No 404 handling | Both pages | If navigated directly, API errors show ugly console logs | Add error boundary |
| Back button always goes to `./index.html` | favoris.html | No browser history integration | Acceptable for SPA-lite |
| Favorites not reloaded on return from favoris.html | index.html | Icons may be stale until page refreshes | Use `sessionStorage` flag or update icons on `focus` event |
