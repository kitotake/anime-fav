// Gestion des favoris

// Déclaration des variables globales
window.favorites = new Set();
window.showFavoritesOnly = false;

// Initialisation des favoris
window.initFavorites = function() {
    window.favorites = new Set(window.getCookie("favorites"));
};

// Fonction pour basculer l'affichage des favoris
window.toggleFavoritesView = function() {
    window.showFavoritesOnly = !window.showFavoritesOnly;
    const favoritesButton = document.getElementById("favoritesButton");
    
    if (favoritesButton) {
        favoritesButton.textContent = window.showFavoritesOnly 
            ? `Voir Tous (${window.favorites.size} favoris)` 
            : "Voir Favoris";
    }
    
    window.displayAnimes();
};

// Fonction pour ajouter/retirer un anime des favoris
window.toggleFavorite = function(animeId, buttonElement) {
    animeId = String(animeId);
    
    if (window.favorites.has(animeId)) {
        window.favorites.delete(animeId);
        buttonElement.textContent = "Ajouter aux Favoris";
    } else {
        window.favorites.add(animeId);
        buttonElement.textContent = "Retirer des Favoris";
    }
    
    window.setCookie("favorites", Array.from(window.favorites), 365);
    window.updateFavoritesCount();
    
    if (window.showFavoritesOnly) window.displayAnimes();
};

// Mise à jour du compteur de favoris
window.updateFavoritesCount = function() {
    let totalFavs = window.favorites.size;
    let title = document.getElementById("favoritesCount");

    if (title) {
        title.textContent = `Total Favoris : ${totalFavs}`;
    }
};