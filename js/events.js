// Fichier events.js - Gestion des événements et initialisation

document.addEventListener("DOMContentLoaded", () => {
    // Initialiser la recherche
    window.initSearch();
    
    // Configurer le bouton pour voir les favoris
    const favoritesButton = document.getElementById("favoritesButton");
    favoritesButton.addEventListener("click", window.toggleFavoritesView);
    
    // Configurer le bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    loadMoreButton.addEventListener("click", () => {
        if (window.showFavoritesOnly) {
            window.displayAnimes();
        } else {
            const searchBar = document.getElementById("searchBar");
            window.currentPage++;
            window.fetchAnimes(searchBar.value, window.currentPage);
        }
    });
    
    // Supprimer le carousel s'il existe (comme dans le script d'origine)
    const carousel = document.querySelector(".carousel-container");
    if (carousel) carousel.remove();
    
    // Charger les animes et initialiser l'affichage
    window.fetchAnimes();
    window.updateFavoritesCount();
});