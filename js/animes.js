// 📜 Gestion des animés - Version corrigée et optimisée

let currentPage = 1;
let allAnimes = [];

// 📌 Récupération des animes avec filtres
async function fetchAnimes({ query = "", page = 1, year = "", category = "16" } = {}) {
    try {
        const params = new URLSearchParams({
            api_key: window.API_KEY,
            with_origin_country: "JP",
            page
        });

        // Année de sortie
        if (year) {
            params.append("first_air_date.gte", `${year}-01-01`);
            params.append("first_air_date.lte", `${year}-12-31`);
        }

        let url;
        if (query.trim()) {
            params.set("query", query);
            url = `${window.BASE_URL}/search/tv?${params}`;
        } else {
            // Toujours inclure le genre "16" (anime) sauf si autre spécifié
            const genre = category !== "16" ? category : "16";
            params.set("with_genres", genre);
            url = `${window.BASE_URL}/discover/tv?${params}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur réseau ${response.status}`);

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error("Aucun anime trouvé !");
        }

        allAnimes = page === 1 ? data.results : [...allAnimes, ...data.results];
        currentPage = page;
        displayAnimes();

        const loadMoreButton = document.getElementById("loadMore");
        if (loadMoreButton) {
            loadMoreButton.style.display = page < data.total_pages ? "block" : "none";
        }

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des animes :", error);
        showError(error.message || "Une erreur est survenue.");
    }
}

// 📌 Détails d’un anime
async function fetchAnimeDetails(animeId) {
    try {
        const response = await fetch(`${window.BASE_URL}/tv/${animeId}?api_key=${window.API_KEY}&language=fr-FR`);
        if (!response.ok) throw new Error(`Erreur réseau ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des détails :", error);
        return null;
    }
}

// 📌 Affichage des animes
function displayAnimes() {
    const animeList = document.getElementById("animeList");
    if (!animeList) return;

    animeList.innerHTML = "";

    if (!window.favorites) window.favorites = new Set();

    const animesToDisplay = window.showFavoritesOnly
        ? allAnimes.filter(anime => window.favorites.has(String(anime.id)))
        : allAnimes;

    if (animesToDisplay.length === 0) {
        showError(window.showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé.");
        return;
    }

    animeList.innerHTML = animesToDisplay.map(anime => createAnimeCard(anime)).join("");
    addCardEventListeners();

    if (window.updateFavoritesCount) {
        window.updateFavoritesCount();
    }
}

// 📌 Ajout des événements sur les cartes
function addCardEventListeners() {
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (window.toggleFavorite) {
                window.toggleFavorite(event.target.dataset.id, event.target);
            }
        });
    });

    document.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openModal(event.target.dataset.id);
        });
    });
}

// 📌 Création d’une carte d’anime
function createAnimeCard(anime) {
    const { id, name, first_air_date, poster_path } = anime;
    if (!window.favorites) window.favorites = new Set();

    const isFavorite = window.favorites.has(String(id));
    const imageUrl = poster_path ? `${window.IMAGE_BASE_URL}${poster_path}` : "../assets/img/placeholder.svg";

    return `
        <div class="anime-card">
            <div class="card-container">
                <div class="poster">
                    <img src="${imageUrl}" alt="${name}" onerror="this.src='../assets/img/placeholder.svg'">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" 
                         src="../assets/img/${isFavorite ? 'check.svg' : 'heart-filled.svg'}"
                         data-id="${id}" 
                         title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                    <img class="info-icon" 
                         src="../assets/img/info.svg"
                         data-id="${id}" 
                         title="Voir plus d'infos">
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        </div>
    `;
}

// 📌 Affichage d’un message d’erreur
function showError(message) {
    const animeList = document.getElementById("animeList");
    if (animeList) {
        animeList.innerHTML = `<p class="error-message">${message}</p>`;
    }
}

// 📌 Modale détails d’un anime
async function openModal(animeId) {
    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.style.display = "flex";

    const titleElement = document.getElementById("animeTitle");
    const descriptionElement = document.getElementById("animeDescription");
    const dateElement = document.getElementById("animeDate");
    const ratingElement = document.getElementById("animeRating");
    const genresElement = document.getElementById("animeGenres");
    const imageElement = document.getElementById("animeImage");

    if (titleElement) titleElement.textContent = "Chargement...";
    if (descriptionElement) descriptionElement.textContent = "Chargement des informations...";

    const animeDetails = await fetchAnimeDetails(animeId);

    if (animeDetails) {
        if (titleElement) titleElement.textContent = animeDetails.name;
        if (dateElement) dateElement.textContent = `Première diffusion : ${animeDetails.first_air_date || "Inconnue"}`;
        if (ratingElement) ratingElement.textContent = `Note : ${animeDetails.vote_average}/10`;

        const genres = animeDetails.genres?.map(g => g.name).join(", ") || "Non spécifiés";
        if (genresElement) genresElement.textContent = `Genres : ${genres}`;

        if (imageElement) {
            imageElement.src = animeDetails.poster_path
                ? `${window.IMAGE_BASE_URL}${animeDetails.poster_path}`
                : "../assets/img/placeholder.svg";
            imageElement.onerror = () => imageElement.src = "../assets/img/placeholder.svg";
        }

        if (descriptionElement) {
            descriptionElement.textContent = animeDetails.overview || "Aucune description disponible.";
        }
    } else {
        if (titleElement) titleElement.textContent = "Erreur";
        if (descriptionElement) descriptionElement.textContent = "Impossible de charger les détails de l'anime.";
    }

    const closeButton = document.querySelector(".close");
    if (closeButton) {
        closeButton.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = "none";
    };
}

// 📌 Initialisation au chargement
document.addEventListener("DOMContentLoaded", () => {
    window.currentPage = 1;
    window.showFavoritesOnly = false;
    if (!document.getElementById("animeFavori")) {
        fetchAnimes();
    }
});

// 📌 Exports globaux
window.fetchAnimes = fetchAnimes;
window.displayAnimes = displayAnimes;
window.openModal = openModal;
window.addCardEventListeners = addCardEventListeners;
window.allAnimes = () => allAnimes;
window.currentPage = currentPage;
