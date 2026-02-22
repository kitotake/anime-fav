# 📦 IMPORTS_ANALYSIS.md — AnimeFavoris

> Analyse complète des dépendances, imports, chemins et bugs liés aux ressources.

---

## 1. CDN External Dependencies

| Resource | File | URL | Status |
|---|---|---|---|
| Swiper CSS | index.html | `https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css` | ✅ OK |
| Swiper JS | index.html | `https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js` | ✅ OK |

> ⚠️ **favoris.html** does NOT include Swiper (correct, no carousel on favorites page).

---

## 2. Local Script Load Order Analysis

### index.html — Script Load Order

```html
<!-- ✅ Correct order -->
<script src="./api/config.js"></script>      <!-- 1. API config -->
<script src="./js/cookies.js"></script>       <!-- 2. Cookie utility -->
<script src="./js/favoris.js"></script>       <!-- 3. Favorites (needs Cookies) -->
<script src="./js/darkmods.js"></script>      <!-- 4. Dark mode -->
<script src="./js/rechercher.js"></script>    <!-- 5. Search (needs fetchAnimes) -->
<script src="./js/animes.js"></script>        <!-- 6. Anime fetch + display -->
<script src="./js/swiper.js"></script>        <!-- 7. Carousel -->
<script src="./js/events.js"></script>        <!-- 8. Global events -->
```

**Issue:** `rechercher.js` is loaded **before** `animes.js`, meaning `window.fetchAnimes` is not yet defined when `initSearch()` runs. This is handled by the `setTimeout(100ms)` in rechercher.js, but is fragile. ➜ Fixed in updated code by reordering and using a safe-call pattern.

### favoris.html — Script Load Order

```html
<script src="./api/config.js"></script>
<script src="./js/cookies.js"></script>
<script src="./js/favoris.js"></script>
<script src="./js/darkmods.js"></script>  <!-- ⚠️ Was named darkmods.js but file is darkmods.js ✅ -->
<script src="./js/animes.js"></script>
<!-- ❌ MISSING: rechercher.js, events.js, swiper.js (ok for favorites) -->
```

---

## 3. Asset Path Issues (Bugs)

### Icon Paths — Inconsistencies Found

| File | Path Used | Correct Path | Status |
|---|---|---|---|
| `js/animes.js` (getFavoriteIcon) | `/./assets/img/check.svg` | `./assets/img/check.svg` | ❌ Bug |
| `js/animes.js` (getFavoriteIcon) | `/./assets/img/heart-filled.svg` | `./assets/img/heart-filled.svg` | ❌ Bug |
| `js/animes.js` (getInfoIcon) | `/./assets/img/info.svg` | `./assets/img/info.svg` | ❌ Bug |
| `js/animes.js` (getPlaceholderImage) | `/./assets/img/placeholder.svg` | `./assets/img/placeholder.svg` | ❌ Bug |
| `js/favoris.js` (displayFavoriteAnimes) | `./assets/img/check.svg` | `./assets/img/check.svg` | ✅ OK |
| `js/favoris.js` (displayFavoriteAnimes) | `./assets/img/info.svg` | `./assets/img/info.svg` | ✅ OK |
| `favoris.html` (inline script) | `/../assets/img/check.svg` | `./assets/img/check.svg` | ❌ Bug |
| `favoris.html` (inline script) | `/../assets/img/info.svg` | `./assets/img/info.svg` | ❌ Bug |
| `favoris.html` (inline script) | `/../assets/img/placeholder.svg` | `./assets/img/placeholder.svg` | ❌ Bug |

**Root Cause:** `/./` and `/../` are invalid relative paths. Use `./` only.

---

## 4. Module Dependency Graph

```
config.js
    └── [exposes] window.API_KEY, window.BASE_URL, window.IMAGE_BASE_URL, window.callAPI

cookies.js
    └── [exposes] window.Cookies { get, set, delete }

favoris.js
    ├── [depends on] window.Cookies
    ├── [depends on] window.BASE_URL, window.API_KEY, window.IMAGE_BASE_URL
    ├── [depends on] window.openModal (animes.js)
    └── [exposes] window.favorites, window.initFavorites, window.toggleFavorite,
                  window.saveFavorites, window.updateFavoritesCount,
                  window.loadAndDisplayFavorites

darkmods.js
    └── [standalone] reads/writes localStorage "theme"

animes.js
    ├── [depends on] window.API_KEY, window.BASE_URL, window.IMAGE_BASE_URL
    ├── [depends on] window.favorites (favoris.js)
    ├── [depends on] window.toggleFavorite (favoris.js)
    ├── [depends on] window.updateFavoritesCount (favoris.js)
    └── [exposes] window.fetchAnimes, window.displayAnimes, window.openModal,
                  window.allAnimes, window.createAnimeCard, window.currentPage

rechercher.js
    ├── [depends on] window.fetchAnimes (animes.js)
    └── [exposes] window.initSearch, window.resetFilters, window.getCurrentFilters,
                  window.setFilters

swiper.js
    ├── [depends on] Swiper CDN global
    └── [fetches] Jikan API (external, no key needed)

events.js
    ├── [depends on] window.fetchAnimes, window.showFavoritesOnly, window.currentPage
    ├── [depends on] window.getCurrentFilters (rechercher.js)
    └── [exposes] window.addEventListeners, window.debugEvents, window.reinitEvents

ui.js  ⚠️ BROKEN
    ├── [depends on] window.favorites, window.allAnimes, window.showFavoritesOnly
    ├── [depends on] window.svgIcons ← ❌ NEVER DEFINED ANYWHERE
    ├── [depends on] posterHTML variable ← ❌ NEVER DEFINED IN SCOPE
    └── [exposes] window.initUI, window.displayAnimes (conflicts with animes.js!)
```

---

## 5. Global Window Namespace Conflicts

| Function | Defined in | Also defined in | Risk |
|---|---|---|---|
| `window.displayAnimes` | `animes.js` | `ui.js` | ❌ Last loaded wins — ui.js version is broken |
| `window.currentPage` | `animes.js` | `events.js` (reads) | ✅ Managed correctly |

**Fix:** Remove or stub out `window.displayAnimes` from `ui.js`.

---

## 6. API Calls in config.js — Side Effects at Load Time

`config.js` makes two live `fetch()` calls when loaded:
```js
// These execute immediately when the file is parsed:
callAPI('movie/popular', { page: 1, language: 'fr-FR' })
callAPI('search/movie', { query: 'Avengers', language: 'fr-FR' })
```

**Issues:**
- Uses `movie/*` endpoints but the app fetches `tv/*` data — these are wasted calls
- The `callAPI` whitelist only allows `movie/*` and `search/movie` — this means `callAPI` **cannot** be used for the actual app data (TV shows). `window.fetchAnimes` uses `fetch()` directly instead.
- These calls appear in browser Network tab as unnecessary requests

**Fix:** Remove these demo calls from config.js.

---

## 7. CSS Import Analysis

| File | Imported in | Notes |
|---|---|---|
| `assets/styles.css` | index.html, favoris.html | Main stylesheet — CSS variables + dark mode |
| `assets/darkmode.css` | ❌ Nowhere | **Orphaned file** — never imported |
| Swiper CSS (CDN) | index.html only | Needed for carousel |

**Fix:** Either import `darkmode.css` or delete it (functionality is in `styles.css`).

---

## 8. Summary of All Bugs Found

| # | File | Type | Description | Fix |
|---|---|---|---|---|
| 1 | `js/animes.js` | Path bug | `/./assets/img/*.svg` invalid paths | Use `./assets/img/` |
| 2 | `favoris.html` | Path bug | `/../assets/img/*.svg` invalid paths | Use `./assets/img/` |
| 3 | `js/ui.js` | Undefined var | `posterHTML` not defined | Remove or fix |
| 4 | `js/ui.js` | Undefined var | `window.svgIcons` never set | Remove or fix |
| 5 | `js/ui.js` | Conflict | Redefines `window.displayAnimes` (broken version) | Remove export |
| 6 | `api/config.js` | Side effect | Makes live `movie/*` API calls on load | Remove demo calls |
| 7 | `assets/darkmode.css` | Orphaned | Never imported anywhere | Import or delete |
| 8 | `index.html` | Load order | `rechercher.js` before `animes.js` | Reorder or guard |
| 9 | `js/animes.js` | Scope | `currentPage` is `let` local but exposed as `window.currentPage` inconsistently | Always use `window.currentPage` |
