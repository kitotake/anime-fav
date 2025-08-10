// Gestion de l'affichage des animes

// Initialisation de l'UI
window.initUI = function() {
    // Initialisation des éléments d'interface si nécessaire
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.warn("⚠️ L'élément 'animeList' est introuvable (peut être normal sur certaines pages)");
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
        animeList.innerHTML = `<p class="info-message">${window.showFavoritesOnly ? "⭐ Aucun favori enregistré." : "🔍 Aucun résultat trouvé."}</p>`;
        return;
    }

    animesToDisplay.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const isFavorite = window.favorites.has(String(id));

        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">${posterHTML}</div>
                <div class="card-buttons">
                    <div class="favorite-icon" data-id="${id}" title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                        ${isFavorite ? window.svgIcons['check'] : window.svgIcons['heart-filled']}
                    </div>
                    <div class="info-icon" data-id="${id}" title="Voir plus d'infos">
                        ${window.svgIcons['info']}
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        `;

        animeList.appendChild(animeCard);
    });
    
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => window.toggleFavorite(event.target.dataset.id, event.target));
    });
};