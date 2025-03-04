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
             <div class="anime-card">
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : '../assets/img/placeholder.png'}" alt="${name}">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" src="../assets/img/${isFavorite ? 'check.png' : 'heart-filled.png'}"
                        data-id="${id}" title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                    <img class="info-icon" src="../assets/img/info.png"
                        data-id="${id}" title="Voir plus d'infos">
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        </div>
    `;
        animeList.appendChild(animeCard);
    });
    
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => window.toggleFavorite(event.target.dataset.id, event.target));
    });
};