document.addEventListener("DOMContentLoaded", () => {
    // Initialiser tous les modules
    initUI();
    initSearch();
    initFavorites();
    
    // Supprimer le carousel s'il existe (remplacé par swiper.js)
    const carousel = document.querySelector(".carousel-container");
    if (carousel) carousel.remove();
    
    // Charger les animes et initialiser l'affichage
    fetchAnimes();
    updateFavoritesCount();
    
    // Configurer le bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    loadMoreButton.addEventListener("click", () => {
        if (showFavoritesOnly) {
            displayAnimes();
        } else {
            const searchBar = document.getElementById("searchBar");
            currentPage++;
            fetchAnimes(searchBar.value, currentPage);
        }
    });
});
