// Gestion de l'affichage des animes

// Initialisation de l'UI
window.initUI = function() {
    // Initialisation des éléments d'interface si nécessaire
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.error("❌ Erreur: L'élément 'animeList' est introuvable!");
    }
};

// Fonction pour afficher les animes
window.displayAnimes = function() {
    const animeList = document.getElementById("animeList");
    if (!animeList) return;
    
    animeList.innerHTML = "";
    
    let animesToDisplay = window.showFavoritesOnly 
        ? window.allAnimes.filter(anime => window.favorites.has(String(anime.id))) 
        : window.allAnimes;
    
    if (animesToDisplay.length === 0) {
        animeList.innerHTML = `<p>${window.showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé."}</p>`;
        return;
    }
    
    animesToDisplay.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const isFavorite = window.favorites.has(String(id));
        
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : './assets/img/placeholder.png'}" alt="${name}">
                </div>
                <div class="card-info">
                    <h3>${name}</h3>
                    <p><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                    <button class="favorite-btn" data-id="${id}">${isFavorite ? "Retirer des Favoris" : "Ajouter aux Favoris"}</button>
                </div>
            </div>
        `;
        animeList.appendChild(animeCard);
    });
    
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", (event) => window.toggleFavorite(event.target.dataset.id, event.target));
    });
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
});};

window.initSearch = function() {

}