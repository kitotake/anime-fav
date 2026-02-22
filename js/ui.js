// ui.js — Module UI (compatibilité)
// ⚠️ Ce fichier est conservé pour compatibilité.
// La logique d'affichage est gérée dans js/animes.js (window.displayAnimes, window.createAnimeCard).
// Ne pas redéfinir window.displayAnimes ici pour éviter les conflits.

window.initUI = function () {
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.warn("⚠️ L'élément 'animeList' est introuvable (normal sur certaines pages)");
    } else {
        console.log("✅ UI initialisée — animeList trouvé");
    }
};

console.log("✅ ui.js chargé (mode compatibilité)");
