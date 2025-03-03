// Fichier animes.js - Gestion de l'affichage et de la récupération des animes

let allAnimes = [];
let currentPage = 1;

async function fetchAnimes(query = "", page = 1) {
    let url = `${window.BASE_URL}/discover/tv?api_key=${window.API_KEY}&with_genres=16&with_origin_country=JP&page=${page}`;
    if (query.trim()) {
        url = `${window.BASE_URL}/search/tv?api_key=${window.API_KEY}&query=${encodeURIComponent(query)}&with_genres=16&with_origin_country=JP&page=${page}`;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur réseau ${response.status}`);
        const data = await response.json();
        allAnimes = page === 1 ? data.results : [...allAnimes, ...data.results];
        displayAnimes();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des animes :", error);
    }
}

function displayAnimes() {
    const animeList = document.getElementById("animeList");
    animeList.innerHTML = "";
    let animesToDisplay = window.showFavoritesOnly ? allAnimes.filter(anime => window.favorites.has(String(anime.id))) : allAnimes;
    
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
                <img src="${poster_path ? IMAGE_BASE_URL + poster_path : '../assets/img/placeholder.png'}" alt="${name}">
            </div>
            <div class="card-buttons">
                <img class="favorite-icon" src="../assets/img/${isFavorite ? 'check.png' : 'heart-filled.png'}" 
                    data-id="${id}" title="Favori">
                <img class="info-icon" src="../assets/img/info.png" 
                    data-id="${id}" title="Voir plus d'infos">
            </div>
            <div class="card-info">
                <h3 class="anime-title">${name}</h3>
                <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
            </div>
        </div>
    `;

    animeList.appendChild(animeCard);
});
    
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", (event) => window.toggleFavorite(event.target.dataset.id, event.target));
    });
    window.updateFavoritesCount();
}

// Exporter les fonctions et variables pour les utiliser dans d'autres fichiers
window.fetchAnimes = fetchAnimes;
window.displayAnimes = displayAnimes;
window.allAnimes = allAnimes;