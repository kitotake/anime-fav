
window.API_KEY = "089d41486b450e0b3dfcfdaaca591f3a";
window.BASE_URL = "https://api.themoviedb.org/3";
window.IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Pour les affiches d'animes

console.log("✅ Vérification des scripts chargés :");

console.log("➡️ config.js chargé !");


console.log("API_KEY:", window.API_KEY);
console.log("BASE_URL:", window.BASE_URL);
console.log("IMAGE_BASE_URL:", window.IMAGE_BASE_URL);

document.addEventListener("DOMContentLoaded", () => {
    console.log("➡️ Le DOM est entièrement chargé !");
    
    console.log("➡️ Vérification des éléments HTML :");
    console.log("animeList:", document.getElementById("animeList"));
    console.log("animeFavori:", document.getElementById("animeFavori"));
    console.log("loadMore:", document.getElementById("loadMore"));
    
    console.log("➡️ Vérification des scripts JS :");
    console.log("cookies.js ?", window.Cookies ? "✅ Chargé" : "❌ Non chargé !");
    console.log("animes.js ?", window.fetchAnimes ? "✅ Chargé" : "❌ Non chargé !");
    console.log("ui.js ?", window.updateFavoritesCount ? "✅ Chargé" : "❌ Non chargé !");
    console.log("favoris.js ?", window.toggleFavorite ? "✅ Chargé" : "❌ Non chargé !");
    console.log("rechercher.js ?", window.searchAnimes ? "✅ Chargé" : "❌ Non chargé !");
    console.log("darkmode.js ?", document.getElementById("darkModeToggle") ? "✅ Chargé" : "❌ Non chargé !");
    console.log("events.js ?", window.addEventListeners ? "✅ Chargé" : "❌ Non chargé !");
});
