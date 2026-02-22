# 🤖 Copilot Instructions — AnimeFavoris

## Project Overview
AnimeFavoris is a vanilla JS + HTML/CSS web app that displays anime series fetched from **TMDB API** (TV discover/search), with a Swiper carousel powered by the **Jikan API** (top anime). Users can browse, search, filter, and favorite animes. Favorites are persisted via cookies.

---

## Architecture

```
/
├── index.html          # Main page: browse + search + carousel
├── favoris.html        # Favorites page: list saved animes
├── api/
│   └── config.js       # TMDB API config + callAPI() helper
├── assets/
│   ├── styles.css      # Main stylesheet (CSS variables, dark mode)
│   ├── darkmode.css    # Legacy dark mode CSS (superseded by styles.css)
│   └── img/            # SVG icons: heart-filled, check, info, placeholder, cancel
└── js/
    ├── cookies.js      # Cookie get/set/delete utility (window.Cookies)
    ├── favoris.js      # Favorites logic: init, toggle, save, display
    ├── darkmods.js     # Dark/light theme toggle (localStorage)
    ├── rechercher.js   # Search bar + year/category filters
    ├── animes.js       # TMDB fetch, card creation, modal
    ├── swiper.js       # Jikan API carousel initialization
    ├── events.js       # Global event listeners (loadMore, modal, keyboard)
    ├── ui.js           # (Legacy - superseded by animes.js, keep for compat)
    └── script.js       # (Legacy init script - superseded by per-page scripts)
```

---

## Key Global Variables

| Variable | Set in | Purpose |
|---|---|---|
| `window.API_KEY` | config.js | TMDB API key |
| `window.BASE_URL` | config.js | TMDB base URL |
| `window.IMAGE_BASE_URL` | config.js | TMDB image CDN |
| `window.favorites` | favoris.js | `Set<String>` of favorite anime IDs |
| `window.allAnimes` | animes.js | Array of currently loaded anime objects |
| `window.currentPage` | animes.js | Current pagination page |
| `window.showFavoritesOnly` | index.html / favoris.html | Boolean flag to switch display mode |

---

## Script Load Order (index.html & favoris.html)
Scripts must be loaded in this exact order to avoid dependency errors:
1. `api/config.js` — defines API constants + `window.callAPI`
2. `js/cookies.js` — defines `window.Cookies`
3. `js/favoris.js` — depends on `window.Cookies`, `window.BASE_URL`
4. `js/darkmods.js` — standalone, depends only on DOM
5. `js/rechercher.js` — depends on `window.fetchAnimes`
6. `js/animes.js` — depends on `window.API_KEY`, `window.BASE_URL`, `window.favorites`
7. `js/swiper.js` — depends on Swiper CDN (index.html only)
8. `js/events.js` — depends on all above

---

## API Calls

### TMDB (primary data source)
- **Discover anime:** `GET /discover/tv?with_genres=16&with_origin_country=JP`
- **Search:** `GET /search/tv?query=...`
- **Details:** `GET /tv/{id}?language=fr-FR`
- All calls use `window.API_KEY` appended as query param

### Jikan (carousel only)
- `GET https://api.jikan.moe/v4/top/anime` — top 5 for carousel slides

---

## Favorites System
- Stored as JSON array in cookie named `"favorites"` (365 days)
- Managed as `window.favorites` (Set of string IDs) at runtime
- `window.toggleFavorite(animeId, buttonElement)` — adds/removes + saves + updates UI
- `window.initFavorites()` — loads from cookie into Set on page load
- `window.updateFavoritesCount()` — updates `#favoritesCount` element

---

## Common Pitfalls / Known Issues to Avoid

1. **Icon paths** — always use `./assets/img/` (relative, no leading slash or `/../`)
2. **`window.currentPage`** must be reset to `1` on new search/filter
3. **`ui.js`** references undefined `posterHTML` and `window.svgIcons` — do not call `window.initUI()` or extend `displayAnimes` from ui.js; use animes.js instead
4. **`config.js`** makes live API calls at module load — these will fail silently in the browser console; they are demo calls only and should be removed in production
5. **Dark mode** uses both `data-theme` attribute (CSS variables) and `body.dark-mode` class — both must be toggled together (darkmods.js handles this)
6. **Swiper** requires the CDN `swiper-bundle.min.css` and `swiper-bundle.min.js` to be loaded **before** `js/swiper.js`

---

## Coding Conventions
- All JS modules expose functions via `window.*` globals (no ES modules/bundler)
- `async/await` + `fetch` for all API calls
- `console.log` prefixed with emoji for easy filtering: `✅` success, `❌` error, `⚠️` warning, `🔗` URL, `📦` data
- CSS custom properties (`--bg-color`, `--text-color`, etc.) in `:root` for theming
- Cards always use class `.anime-card > .card-container > (.poster + .card-buttons + .card-info)`

---

## Adding a New Feature Checklist
- [ ] Define the function in the appropriate JS module
- [ ] Expose it via `window.myFunction = ...` if needed cross-module
- [ ] Use `./assets/img/` for icon paths
- [ ] Add error handling with `try/catch`
- [ ] Test with `window.favorites.size === 0` edge case
- [ ] Verify dark mode compatibility (use CSS variables, not hardcoded colors)
