// Gestion des favoris

let favorites = new Set();
let showFavoritesOnly = false;

// Initialisation des favoris
function initFavorites() {
    favorites = new Set(getCookie("favorites"));
    
    const favoritesButton = document.getElementById("favoritesButton");
    favoritesButton.addEventListener("click", toggleFavoritesView);
}

// Fonction pour basculer l'affichage des favoris
function toggleFavoritesView() {
    showFavoritesOnly = !showFavoritesOnly;
    const favoritesButton = document.getElementById("favoritesButton");
    favoritesButton.textContent = showFavoritesOnly 
        ? `Voir Tous (${favorites.size} favoris)` 
        : "Voir Favoris";
    displayAnimes();
}

// Fonction pour ajouter/retirer un anime des favoris
function toggleFavorite(animeId, buttonElement) {
    animeId = String(animeId);
    if (favorites.has(animeId)) {
        favorites.delete(animeId);
        buttonElement.textContent = "Ajouter aux Favoris";
    } else {
        favorites.add(animeId);
        buttonElement.textContent = "Retirer des Favoris";
    }
    setCookie("favorites", Array.from(favorites), 365);
    updateFavoritesCount();
    if (showFavoritesOnly) displayAnimes();
}

// Mise à jour du compteur de favoris
function updateFavoritesCount() {
    let totalFavs = favorites.size;
    let title = document.getElementById("favoritesCount");

    if (!title) {
        title = document.createElement("h1");
        title.id = "favoritesCount";
        const animeList = document.getElementById("animeList");
        document.body.insertBefore(title, animeList);
    }

    title.textContent = `Total Favoris : ${totalFavs}`;
}
