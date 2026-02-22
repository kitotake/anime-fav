# 🛠️ Guide Développeur — AnimeFavoris

> **Guide complet pour contribuer et ajouter des features**

---

## 📖 Avant de Commencer

**Prérequis Lecture** :
1. [README.md](./README.md) — 5 min
2. [GETTING_STARTED.md](./GETTING_STARTED.md) — 20 min
3. [copilot-instructions.md](./.github/copilot-instructions.md) —  25 min

**Outils Nécessaires** :
- ✅ Navigateur moderne (Chrome, Firefox, Edge)
- ✅ Éditeur code (VS Code, Sublime, etc.)
- ✅ Terminal/PowerShell
- ✅ Git (optionnel pour commits)

**Setup Initial** :
```bash
cd d:/NEW/web/autre/anime-fav/
python -m http.server 8000
# Ouvrir http://localhost:8000
```

---

## 🏗️ Architecture de Base

```
AnimeFavoris = Page HTML + Scripts JS Globals + CSS Variables
│
├─ index.html / favoris.html
│  └─ Charge 8 scripts dans un ordre spécifique
│
├─ js/ (logique métier)
│  ├─ config.js    (API keys)
│  ├─ cookies.js   (stockage)
│  ├─ favoris.js   (⭐ favoris)
│  ├─ animes.js    (📺 données + UI)
│  ├─ rechercher.js (🔍 filtres)
│  ├─ darkmods.js  (🌙 thème)
│  ├─ swiper.js    (🎠 carousel)
│  └─ events.js    (🎯 listeners)
│
├─ api/config.js   (TMDB API)
│
└─ assets/         (styles + images)
   ├─ styles.css   (CSS variables + responsive)
   └─ img/         (SVG icons)
```

---

## ⚡ Workflow Ajouter une Feature

### Étape 1 : Planifier

```markdown
### Feature: Ajouter une Note aux Animes

- Objectif: Permettre utilisateurs de noter animes (1-5 ⭐)
- Scope: Index + Favoris pages
- Storage: Cookie "animeRatings" ou localStorage
- UI: Afficher stars sur card + modal

Impact:
- [ ] Nouvel élément DOM (star rating)
- [ ] Nouvelle fonction JS
- [ ] Nouveau stockage données
- [✓] Pas d'API change
```

### Étape 2 : Implémenter HTML

```html
<!-- Ajouter dans .anime-card ou modal -->
<div class="rating">
  <span class="stars" data-rating="0">
    ☆☆☆☆☆
  </span>
</div>
```

### Étape 3 : Ajouter CSS

```css
/* assets/styles.css */
.rating {
  margin: 10px 0;
  font-size: 1.5rem;
  cursor: pointer;
}

.rating .stars {
  color: var(--text-color);
  transition: color 0.2s;
}

.rating .stars:hover {
  color: #ffd700; /* gold */
}

[data-theme="dark"] .rating .stars:hover {
  color: #ffed4e;
}
```

### Étape 4 : Logique JavaScript

Ajouter dans **js/animes.js** :

```javascript
// 📌 Gestion des notes
window.currentRatings = new Map(); // animeId -> rating (1-5)

window.rateAnime = function(animeId, rating) {
    try {
        animeId = String(animeId);
        rating = Math.max(1, Math.min(5, parseInt(rating))); // 1-5
        
        window.currentRatings.set(animeId, rating);
        window.saveRatings();
        
        // Update UI
        const starEl = document.querySelector(`[data-id="${animeId}"] .stars`);
        if (starEl) {
            const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
            starEl.textContent = stars;
            starEl.setAttribute("data-rating", rating);
        }
        
        console.log(`⭐ Anime ${animeId} noté ${rating}/5`);
    } catch (error) {
        console.error("❌ Erreur notation :", error);
    }
};

window.saveRatings = function() {
    try {
        if (window.Cookies) {
            const ratingsArray = Array.from(window.currentRatings.entries());
            window.Cookies.set("ratings", ratingsArray, { days: 365 });
        }
    } catch (error) {
        console.error("❌ Erreur sauvegarde notes :", error);
    }
};

window.loadRatings = function() {
    try {
        const stored = window.Cookies ? window.Cookies.get("ratings") : null;
        if (stored && Array.isArray(stored)) {
            window.currentRatings = new Map(stored);
        }
        console.log("✅ Notes chargées :", window.currentRatings.size);
    } catch (error) {
        console.error("❌ Erreur chargement notes :", error);
    }
};
```

### Étape 5 : Ajouter Événements

Dans **js/events.js** :

```javascript
// 📌 Initialiser events notation
function initRatingEvents() {
    document.querySelectorAll(".stars").forEach(starEl => {
        starEl.addEventListener("click", (e) => {
            const animeId = e.target.closest("[data-id]")?.dataset.id;
            const rating = e.target.textContent.match(/★/g)?.length || 0;
            
            if (animeId && rating > 0) {
                window.rateAnime(animeId, rating);
            }
        });
    });
}

// Ajouter à window.addEventListeners()
window.addEventListeners = function() {
    // ... existing code ...
    initRatingEvents();
};
```

### Étape 6 : Initialiser au Démarrage

Dans **js/animes.js** `DOMContentLoaded` :

```javascript
document.addEventListener("DOMContentLoaded", () => {
    // ... existing init ...
    
    // Charger les notes
    if (window.loadRatings) {
        window.loadRatings();
    }
});
```

### Étape 7 : Tester

```javascript
// F12 Console
window.rateAnime("12345", 5)        // Rater un anime
window.currentRatings.get("12345")  // Voir la note
window.saveRatings()                 // Sauvegarder
document.cookie                      // Vérifier cookie
```

---

## 📋 Checklist Feature Complete

Avant de considérer une feature finie :

```javascript
// ✅ Fonctionnalité Core
- [ ] Code écrit et fonctionnel
- [ ] Pas d'erreurs console (F12)
- [ ] Sauvegarde/restauration OK

// ✅ Intégration
- [ ] Événements liés
- [ ] localStorage/cookie persisté
- [ ] CSS variables utilisées (pas de couleurs hardcoded)
- [ ] Responsive design (Ctrl+Shift+M)

// ✅ Dark Mode
- [ ] Testé en mode clair ET sombre
- [ ] Utilise `var(--text-color)` etc.
- [ ] Contraste acceptable WCAG AA

// ✅ Documentation
- [ ] Commentaire expliquant la logique
- [ ] Variables bien nommées
- [ ] Console logs clairs

// ✅ Tests Edge Cases
- [ ] window.favorites.size === 0 (vide)
- [ ] Après page reload (persistence)
- [ ] Navigation index ↔ favoris
- [ ] Pas de double-click issues

// ✅ Code Quality
- [ ] Pas de var globales inutiles
- [ ] Pas de fetch() sans try/catch
- [ ] Pas de eval()
- [ ] Async/await propre (pas de callback hell)
```

---

## 🎨 Ajouter Un Filtre

### Scénario: "Je veux filtrer par note min (4+ stars)"

1. **Ajouter dropdown HTML** (index.html) :
```html
<select id="ratingMinSelect">
    <option value="">Toutes les notes</option>
    <option value="4">4+ ⭐</option>
    <option value="5">5 ⭐</option>
</select>
```

2. **Modifier fetchAnimes()** (js/animes.js) :
```javascript
async function fetchAnimes({ ..., ratingMin = "" } = {}) {
    // Si ratingMin, filtrer côté client après fetch
    const allData = await /* ... fetch ... */;
    
    if (ratingMin) {
        return allData.filter(anime => {
            const rating = window.currentRatings?.get(String(anime.id)) || 0;
            return rating >= parseInt(ratingMin);
        });
    }
    return allData;
}
```

3. **Ajouter événement** (js/rechercher.js) :
```javascript
const ratingSelect = document.getElementById("ratingMinSelect");
if (ratingSelect) {
    ratingSelect.addEventListener("change", (e) => {
        currentRatingMin = e.target.value;
        applyFilters();
    });
}
```

4. **Intégrer dans applyFilters()** :
```javascript
function applyFilters() {
    if (window.fetchAnimes) {
        window.fetchAnimes({
            query: currentQuery,
            year: currentYear,
            category: currentCategory,
            ratingMin: currentRatingMin  // ← New!
        });
    }
}
```

---

## 🌐 Ajouter Une API Externe

### Contexte: "Je veux importer top anime de MyAnimeList"

1. **Vérifier CORS** :
```javascript
// Dans console, tester si API répond sans CORS issues
fetch("https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=5")
  .then(r => r.json())
  .catch(e => console.error("CORS issue:", e))
```

2. **Si pas CORS**, utiliser proxy/JSONP :
```javascript
// Option A: Utiliser CORS anywhere proxy
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://api.myanimelist.net/...";
fetch(proxyUrl + apiUrl)

// Option B: Changer d'API (ex: jikan.moe - déjà CORS-friendly)
fetch("https://api.jikan.moe/v4/...") // Deja utilisée ✓
```

3. **Ajouter fetch** dans nouveau script :
```javascript
// js/myanimelist.js
async function fetchFromMAL() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/...");
        const data = await response.json();
        console.log("✅ MAL data:", data);
        return data;
    } catch (error) {
        console.error("❌ MAL fetch failed:", error);
        return null;
    }
}

window.fetchFromMAL = fetchFromMAL;
```

4. **Charger le script** (index.html) :
```html
<script src="./js/animes.js"></script>
<script src="./js/myanimelist.js"></script>  <!-- ← New -->
<script src="./js/swiper.js"></script>
```

---

## 🎯 Tests Manuels Checklist

```bash
## Avant chaque push:

# 1. Browser Tests
- F5 refresh → chercher un anime
- Ajouter aux favoris → affiche ✓ sur la carte
- Allez sur favoris.html → anime présent
- Mode sombre toggle 🌙 → entier UI sombre
- Charger plus → pagination fonctionne
- Cliquez info ℹ️ → modal s'ouvre avec détails
- Escape key → modal ferme

# 2. Persistence Tests
- F5 refresh → favoris toujours là
- Token localStorage.theme voir "dark"/"light"
- Token document.cookie voir "favorites"
- Vider cache (Ctrl+Shift+Delete) → reset

# 3. Erreur Tests
- Débrancher Internet → erreur gracieuse
- Chercher rien → pas de crash
- 1000 favoris → performance OK?
- Mobile 320px → layout OK? (bonus)

# 4. Console Clean
- F12 → console aucune error en rouge
- Network tab → aucune 404
- Application > Cookies → "favorites" present
```

---

## 🚀 Bonnes Pratiques

### ✅ À Faire

```javascript
// ✓ Utiliser async/await
async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// ✓ Nommer les variables clairement
const favoriteAnimeIds = ["123", "456"];
const isInFavorites = window.favorites.has(animeId);

// ✓ Exposer via window.* directement
window.myNewFunction = function() { /* ... */ };

// ✓ Utiliser CSS variables
color: var(--text-color);
background: var(--card-bg);

// ✓ Ajouter console.log avec emojis
console.log("✅ Feature loaded");
console.error("❌ Error occurred");
console.warn("⚠️ Warning");
```

### ❌ À Éviter

```javascript
// ✗ Ne pas utiliser var
var myVar = "bad";  // ← Utiliser let/const

// ✗ Ne pas hardcoder les couleurs
color: #ff4d4d;  // ← Utiliser var(--button-bg)

// ✗ Ne pas utiliser eval()
eval(userInput);  // ← Sécurité!

// ✗ Ne pas oublier error handling
fetch(url).then(r => r.json());  // ← Pas de .catch()!

// ✗ Ne pas créer globals inutiles
window.myTempVar = 123;  // ← Utiliser let/const local

// ✗ Ne pas changer l'ordre des scripts
<!-- scripts dans un ordre aléatoire → dépendances cassées -->
```

---

## 📦 Submitting Changes

### Dans un repo Git:

```bash
# 1. Créer branche feature
git checkout -b feature/my-awesome-feature

# 2. Faire changements
# ... modifier fichiers ...

# 3. Test
# ... F12, F5, checks ...

# 4. Commit
git add .
git commit -m "✨ Add anime rating feature #42"

# 5. Push
git push origin feature/my-awesome-feature

# 6. Créer Pull Request
# Expliquer: what, why, testing, screenshots
```

### Commit Message Format:
```
✨ Add feature
🐛 Fix bug
📝 Add docs
🎨 Style/refactor
⚡ Performance
✅ Tests
```

---

## 🐛 Troubleshooting Développement

### Problème: Script pas chargé
```javascript
// Console
window.myFunction  // undefined = pas chargé

// Fix:
// 1. Vérifier <script src> correct dans HTML
// 2. Vérifier ordre scripts (dépendances)
// 3. Vérifier pas d'erreurs dans script (voir console)
// 4. Essayer hard refresh: Ctrl+Shift+R
```

### Problème: Événement ne se attach
```javascript
// Console
document.querySelector(".my-button")?.click() // Test manuel

// Fix:
// 1. Vérifier l'elemento existe dans DOM (F12 Elements)
// 2. Vérifier addEventListener après DOMContentLoaded
// 3. Utiliser event delegation si éléments dynamiques
// 4. Vérifier pas de console errors qui stopent le script
```

### Problèmr: Data pas persiste
```javascript
// Console
document.cookie              // Voir cookies
localStorage               // Voir localStorage

// Fix:
// 1. Vérifier window.Cookies.set() appelé
// 2. Vérifier pas d'erreurs JSON parsing
// 3. Vérifier cookies pas désactivés (settings navig)
// 4. Utiliser http:// (pas file://) pour secure cookies
```

---

## 📞 Obtenir Aide

| Besoin | Ressource |
|--------|-----------|
| Architecture? | [copilot-instructions.md](./.github/copilot-instructions.md) |
| APIs? | [NAVIGATION.md](./.github/NAVIGATION.md) + [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| Erreur? | [GETTING_STARTED.md#-dépannage-courant](./GETTING_STARTED.md#-dépannage-courant) |
| Debug? | [QUICK_REFERENCE.md#-debug-commands](./QUICK_REFERENCE.md#-debug-commands) |
| Flow? | [NAVIGATION.md](./.github/NAVIGATION.md) |

---

<div align="center">

**Prêt à coder? Bonne chance! 🚀**

---

Questions? Voir [INDEX.md](./INDEX.md) pour toute la documentation

</div>
