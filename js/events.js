// Fichier principal - Initialisation et coordination

document.addEventListener("DOMContentLoaded", () => {
    // Initialiser les variables globales si elles n'existent pas déjà
    window.currentPage = window.currentPage || 1;
    window.allAnimes = window.allAnimes || [];
    window.favorites = window.favorites || new Set();
    window.showFavoritesOnly = window.showFavoritesOnly || false;
    
    // Initialiser tous les modules
    if (window.initUI) window.initUI();
    if (window.initSearch) window.initSearch();
    if (window.initFavorites) window.initFavorites();
    
    // Configurer le bouton pour voir les favoris
    const favoritesButton = document.getElementById("favoritesButton");
    if (favoritesButton) {
        favoritesButton.addEventListener("click", window.toggleFavoritesView);
    }
    
    // Configurer le bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            if (window.showFavoritesOnly) {
                window.displayAnimes();
            } else {
                const searchBar = document.getElementById("searchBar");
                window.currentPage++;
                window.fetchAnimes(searchBar ? searchBar.value : "", window.currentPage);
            }
        });
    }
    
    // Vérifier le chemin courant pour déterminer quelle page est chargée
    const isOnFavoritesPage = window.location.pathname.includes("favoris.html");
    
    if (isOnFavoritesPage) {
        // Sur la page des favoris
        window.showFavoritesOnly = true;
        if (window.updateFavoritesCount) window.updateFavoritesCount();
        window.fetchAnimes();
    } else {
        // Sur la page principale
        window.fetchAnimes();
        if (window.updateFavoritesCount) window.updateFavoritesCount();
    }
});