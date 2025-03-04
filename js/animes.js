// 📜 Gestion des animés

let currentPage = 1;
let allAnimes = [];

// 📌 Récupération des animes avec filtres (query, année, catégorie)
async function fetchAnimes({ query = "", page = 1, year = "", category = "" } = {}) {
    try {
        const params = new URLSearchParams({
            api_key: window.API_KEY,
            with_genres: "16",  // S'assure que "16" (Anime) est toujours présent
            with_origin_country: "JP",
            page
        });

        if (year) {
            params.append("first_air_date.gte", `${year}-01-01`);
            params.append("first_air_date.lte", `${year}-12-31`);
        }

        if (category && category !== "16") {
            params.set("with_genres", category);
        }

        let url = `${window.BASE_URL}/discover/tv?${params}`;

        if (query.trim()) {
            params.set("query", query);
            url = `${window.BASE_URL}/search/tv?${params}`;
        }

    //    console.log("🔗 URL de l'API :", url); // Vérification de l'URL générée
//
        const response = await fetch(url);
     //   console.log("📡 Statut de la réponse :", response.status); // Vérifie si 200 ou erreur

        if (!response.ok) throw new Error(`Erreur réseau ${response.status}`);

        const data = await response.json();
   //     console.log("📦 Données reçues :", data); // Affiche les données retournées

        if (!data.results || data.results.length === 0) {
            throw new Error("Aucun anime trouvé !");
        }

        allAnimes = page === 1 ? data.results : [...allAnimes, ...data.results];
        displayAnimes();

        // Afficher / cacher le bouton "Voir plus"
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

    animeList.innerHTML = ""; // Réinitialisation

    const animesToDisplay = window.showFavoritesOnly
        ? allAnimes.filter(anime => window.favorites.has(String(anime.id)))
        : allAnimes;

    if (animesToDisplay.length === 0) {
        showError(window.showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé.");
        return;
    }

    animeList.innerHTML = animesToDisplay.map(anime => createAnimeCard(anime)).join("");

    // Ajouter les événements après le rendu
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            window.toggleFavorite(event.target.dataset.id, event.target);
        });
    });

    document.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            openModal(event.target.dataset.id);
        });
    });

    window.updateFavoritesCount();
}

// 📌 Création d'une carte d'anime
function createAnimeCard(anime) {
    const { id, name, first_air_date, poster_path } = anime;
    const isFavorite = window.favorites.has(String(id));

    return `
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
}

// 📌 Affichage d'un message d'erreur
function showError(message) {
    const animeList = document.getElementById("animeList");
    if (animeList) {
        animeList.innerHTML = `<p>${message}</p>`;
    }
}

// 📌 Ouvrir la modale avec les détails de l'anime
async function openModal(animeId) {
    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.style.display = "flex";
    document.getElementById("animeTitle").textContent = "Chargement...";
    document.getElementById("animeDescription").textContent = "Chargement des informations...";

    const animeDetails = await fetchAnimeDetails(animeId);

    if (animeDetails) {
        document.getElementById("animeTitle").textContent = animeDetails.name;
        document.getElementById("animeDate").textContent = `Première diffusion : ${animeDetails.first_air_date || "Inconnue"}`;
        document.getElementById("animeRating").textContent = `Note : ${animeDetails.vote_average}/10`;

        const genres = animeDetails.genres.map(genre => genre.name).join(", ");
        document.getElementById("animeGenres").textContent = `Genres : ${genres || "Non spécifiés"}`;

        document.getElementById("animeImage").src = animeDetails.poster_path
            ? window.IMAGE_BASE_URL + animeDetails.poster_path
            : '../assets/img/placeholder.png';

        document.getElementById("animeDescription").textContent = animeDetails.overview || "Aucune description disponible.";
    } else {
        document.getElementById("animeTitle").textContent = "Erreur";
        document.getElementById("animeDescription").textContent = "Impossible de charger les détails de l'anime.";
    }

    document.querySelector(".close").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// 📌 Initialisation des favoris et affichage des animes au chargement
document.addEventListener("DOMContentLoaded", () => {
  //  console.log("🚀 DOM chargé, récupération des animes...");
    window.fetchAnimes();
});

// 📌 Exporter les fonctions globalement
window.fetchAnimes = fetchAnimes;
window.displayAnimes = displayAnimes;
window.openModal = openModal;
window.allAnimes = allAnimes;
