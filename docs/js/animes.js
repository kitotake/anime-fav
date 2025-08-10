// 📜 Gestion des animés - VERSION CORRIGÉE

let currentPage = 1;
let allAnimes = [];

// 📌 Récupération des animes avec filtres (query, année, catégorie)
async function fetchAnimes({ query = "", page = 1, year = "", category = "" } = {}) {
    try {
        const params = new URLSearchParams({
            api_key: window.API_KEY,
            page
        });

        let url;

        // Si recherche par texte
        if (query.trim()) {
            params.append("query", query);
            url = `${window.BASE_URL}/search/tv?${params}`;
        } else {
            // Découverte avec filtres
            params.append("with_genres", category || "16"); // 16 = Animation
            params.append("with_origin_country", "JP");

            if (year) {
                params.append("first_air_date.gte", `${year}-01-01`);
                params.append("first_air_date.lte", `${year}-12-31`);
            }

            url = `${window.BASE_URL}/discover/tv?${params}`;
        }

        console.log("🔗 URL API :", url);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur réseau ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Données reçues :", data);

        if (!data.results || data.results.length === 0) {
            showError("Aucun anime trouvé !");
            return;
        }

        // Filtrer pour garder seulement les animes japonais
        const filteredResults = data.results.filter(anime => 
            anime.origin_country && anime.origin_country.includes('JP')
        );

        if (page === 1) {
            allAnimes = filteredResults;
        } else {
            allAnimes = [...allAnimes, ...filteredResults];
        }

        displayAnimes();

        // Gestion du bouton "Voir plus"
        const loadMoreButton = document.getElementById("loadMore");
        if (loadMoreButton) {
            loadMoreButton.style.display = page < data.total_pages ? "block" : "none";
        }

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des animes :", error);
        showError(error.message || "Une erreur est survenue.");
    }
}

// 📌 Récupérer les détails d'un anime
async function fetchAnimeDetails(animeId) {
    try {
        const response = await fetch(`${window.BASE_URL}/tv/${animeId}?api_key=${window.API_KEY}&language=fr-FR`);
        
        if (!response.ok) {
            throw new Error(`Erreur réseau ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des détails :", error);
        return null;
    }
}

// 📌 Affichage des animes
function displayAnimes() {
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.warn("⚠️ Élément 'animeList' introuvable");
        return;
    }

    animeList.innerHTML = ""; // Réinitialisation

    const animesToDisplay = window.showFavoritesOnly
        ? allAnimes.filter(anime => window.favorites && window.favorites.has(String(anime.id)))
        : allAnimes;

    if (animesToDisplay.length === 0) {
        showError(window.showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé.");
        return;
    }

    animesToDisplay.forEach(anime => {
        const animeCard = createAnimeCard(anime);
        animeList.appendChild(animeCard);
    });

    // Ajouter les événements après le rendu
    addCardEventListeners();
    
    // Mettre à jour le compteur de favoris
    if (window.updateFavoritesCount) {
        window.updateFavoritesCount();
    }
}

// 📌 Création d'une carte d'anime
function createAnimeCard(anime) {
    const { id, name, first_air_date, poster_path } = anime;
    const isFavorite = window.favorites && window.favorites.has(String(id));

    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");
    
    animeCard.innerHTML = `
        <div class="card-container">
            <div class="poster">
                <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : getPlaceholderImage()}" 
                     alt="${name}" loading="lazy">
            </div>
            <div class="card-buttons">
                <img class="favorite-icon" 
                     src="${getFavoriteIcon(isFavorite)}"
                     data-id="${id}" 
                     title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                <img class="info-icon" 
                     src="${getInfoIcon()}"
                     data-id="${id}" 
                     title="Voir plus d'infos">
            </div>
            <div class="card-info">
                <h3 class="anime-title">${name}</h3>
                <p class="anime-year">
                    <strong>Année :</strong> 
                    ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}
                </p>
            </div>
        </div>
    `;

    return animeCard;
}

// 📌 Ajouter les événements aux cartes
function addCardEventListeners() {
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            if (window.toggleFavorite) {
                window.toggleFavorite(event.target.dataset.id, event.target);
            }
        });
    });

    document.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            openModal(event.target.dataset.id);
        });
    });
}

// 📌 Fonctions utilitaires pour les icônes
function getFavoriteIcon(isFavorite) {
    return isFavorite 
        ? '../assets/img/check.svg'
        : '../assets/img/heart-filled.svg';
}

function getInfoIcon() {
    return '../assets/img/info.svg';
}

function getPlaceholderImage() {
    return '../assets/img/placeholder.svg';
}

// 📌 Affichage d'un message d'erreur
function showError(message) {
    const animeList = document.getElementById("animeList");
    if (animeList) {
        animeList.innerHTML = `<p style="text-align: center; margin: 50px; font-size: 1.2rem;">${message}</p>`;
    }
}

// 📌 Ouvrir la modale avec les détails de l'anime
async function openModal(animeId) {
    const modal = document.getElementById("modal");
    if (!modal) {
        console.warn("⚠️ Modale introuvable");
        return;
    }

    modal.style.display = "flex";
    
    // Éléments de la modale
    const elements = {
        title: document.getElementById("animeTitle"),
        date: document.getElementById("animeDate"),
        rating: document.getElementById("animeRating"),
        genres: document.getElementById("animeGenres"),
        image: document.getElementById("animeImage"),
        description: document.getElementById("animeDescription")
    };

    // État de chargement
    if (elements.title) elements.title.textContent = "Chargement...";
    if (elements.description) elements.description.textContent = "Chargement des informations...";

    const animeDetails = await fetchAnimeDetails(animeId);

    if (animeDetails) {
        if (elements.title) elements.title.textContent = animeDetails.name;
        if (elements.date) elements.date.textContent = `Première diffusion : ${animeDetails.first_air_date || "Inconnue"}`;
        if (elements.rating) elements.rating.textContent = `Note : ${animeDetails.vote_average}/10`;
        
        if (elements.genres) {
            const genres = animeDetails.genres ? animeDetails.genres.map(genre => genre.name).join(", ") : "Non spécifiés";
            elements.genres.textContent = `Genres : ${genres}`;
        }

        if (elements.image) {
            elements.image.src = animeDetails.poster_path
                ? window.IMAGE_BASE_URL + animeDetails.poster_path
                : getPlaceholderImage();
        }

        if (elements.description) {
            elements.description.textContent = animeDetails.overview || "Aucune description disponible.";
        }
    } else {
        if (elements.title) elements.title.textContent = "Erreur";
        if (elements.description) elements.description.textContent = "Impossible de charger les détails de l'anime.";
    }

    // Gestionnaires de fermeture
    setupModalCloseEvents(modal);
}

// 📌 Configuration des événements de fermeture de modale
function setupModalCloseEvents(modal) {
    const closeButton = document.querySelector(".close");
    
    if (closeButton) {
        closeButton.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// 📌 Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM chargé - Initialisation des animes");
    
    // Vérifier les dépendances
    if (!window.API_KEY || !window.BASE_URL || !window.IMAGE_BASE_URL) {
        console.error("❌ Configuration API manquante");
        return;
    }

    // Charger les animes par défaut
    fetchAnimes();
});

// 📌 Exporter les fonctions globalement
window.fetchAnimes = fetchAnimes;
window.displayAnimes = displayAnimes;
window.openModal = openModal;
window.allAnimes = allAnimes;
window.createAnimeCard = createAnimeCard;