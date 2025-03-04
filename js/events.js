// Initialiser les gestionnaires d'événements pour l'application
window.addEventListeners = function() {
    // Bouton Charger Plus
    const loadMoreButton = document.getElementById("loadMore");
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            if (window.showFavoritesOnly) {
                window.displayAnimes();
            } else {
                const searchBar = document.getElementById("searchBar");
                window.currentPage++;
                window.fetchAnimes({ 
                    query: searchBar ? searchBar.value : "", 
                    page: window.currentPage 
                });
            }
        });
    }

   
// Exécuter à l'initialisation
document.addEventListener("DOMContentLoaded", () => {
    window.showFavoritesOnly = true; // À activer automatiquement dans la page favoris
    window.addEventListeners();
});