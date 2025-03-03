// Gestion de l'affichage des animes

// Initialisation de l'UI
function initUI() {
    // Initialisation des éléments d'interface si nécessaire
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.error("❌ Erreur: L'élément 'animeList' est introuvable!");
    }
}

// Fonction pour afficher les animes
function displayAnimes() {
    const animeList = document.getElementById("animeList");
    const IMAGE_BASE_URL = window.IMAGE_BASE_URL;
    
    animeList.innerHTML = "";
    let animesToDisplay = showFavoritesOnly ? allAnimes.filter(anime => favorites.has(String(anime.id))) : allAnimes;
    
    if (animesToDisplay.length === 0) {
        animeList.innerHTML = `<p>${showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé."}</p>`;
        return;
    }
    
    animesToDisplay.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const isFavorite = favorites.has(String(id));
        
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <div class="card-container">
                <img src="${poster_path ? IMAGE_BASE_URL + poster_path : './assets/img/placeholder.png'}" alt="${name}">
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
        button.addEventListener("click", (event) => toggleFavorite(event.target.dataset.id, event.target));
    });
}
