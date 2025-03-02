const API_KEY = window.API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const animeList = document.getElementById("animeList");
const searchBar = document.getElementById("searchBar");
const yearSelect = document.getElementById("yearSelect");
const categoryButtons = document.querySelectorAll(".category-btn");
const favoritesButton = document.getElementById("favoritesButton");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let allAnimes = [];
let showFavoritesOnly = false;
let selectedGenre = "";

// 🟢 Fonction pour récupérer les animes
async function fetchAnimes(query = "", year = "", genre = "") {
    query = query.trim();
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_origin_country=JP`;

    if (query.length > 0) {
        url = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&with_genres=16&with_origin_country=JP`;
    }
    if (year) url += `&first_air_date.gte=${year}-01-01`;
    if (genre) url += `&with_genres=${genre}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur réseau ${response.status}`);
        const data = await response.json();
        allAnimes = data.results || [];
        displayAnimes();
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error);
        animeList.innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
    }
}

// 🟢 Fonction pour afficher les animes
async function displayAnimes() {
    animeList.innerHTML = "";
    let animesToDisplay = showFavoritesOnly ? await fetchFavoritesDetails() : allAnimes;

    if (!animesToDisplay || animesToDisplay.length === 0) {
        animeList.innerHTML = `<p>${showFavoritesOnly ? "Aucun favori enregistré." : "Aucun résultat trouvé."}</p>`;
        return;
    }

    animesToDisplay.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const isFavorite = favorites.includes(String(id)); // 🔥 Assurer le type string
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");

        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? IMAGE_BASE_URL + poster_path : './assets/img/placeholder.png'}" alt="${name}">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" src="./assets/img/${isFavorite ? 'check.png' : 'heart-filled.png'}" 
                        data-id="${id}" title="Favori">
                    <img class="info-icon" src="./assets/img/info.png" 
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

    // 🟢 Ajouter les événements pour gérer les favoris
    document.querySelectorAll(".favorite-icon").forEach(icon => {
        icon.addEventListener("click", (event) => {
            toggleFavorite(event.target.dataset.id, event.target);
        });
    });

    // 🟢 Ajouter les événements pour afficher les détails
    document.querySelectorAll(".info-icon").forEach(icon => {
        icon.addEventListener("click", async (event) => {
            const animeId = event.target.dataset.id;
            const anime = await fetchAnimeDetails(animeId);
            if (anime) showModal(anime);
        });
    });
}

// 🟢 Fonction pour gérer les favoris
function toggleFavorite(animeId, iconElement) {
    animeId = String(animeId); // 🔥 Convertir en string pour éviter les erreurs

    if (favorites.includes(animeId)) {
        favorites = favorites.filter(id => id !== animeId);
        console.log(`❌ Supprimé des favoris: ${animeId}`);
        iconElement.src = "./assets/img/heart-filled.png"; // 🔄 Change l'icône
    } else {
        favorites.push(animeId);
        console.log(`✅ Ajouté aux favoris: ${animeId}`);
        iconElement.src = "./assets/img/check.png"; // 🔄 Change l'icône
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (showFavoritesOnly) displayAnimes(); // 🔄 Rafraîchir la liste si on affiche les favoris
}

// 🟢 Fonction pour récupérer les détails des favoris
async function fetchFavoritesDetails() {
    if (favorites.length === 0) return [];

    const promises = favorites.map(async id => {
        const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Impossible de récupérer l'anime favori ID ${id}:`, error);
            return null;
        }
    });

    const favoritesData = await Promise.all(promises);
    return favoritesData.filter(anime => anime !== null);
}

// 🟢 Fonction pour récupérer les détails d'un anime
async function fetchAnimeDetails(id) {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des détails de l'anime ID ${id}:`, error);
        return null;
    }
}

// 🟢 Fonction pour afficher la fenêtre modale
function showModal(anime) {
    document.getElementById("animeTitle").textContent = anime.name;
    document.getElementById("animeDate").textContent = `Date : ${anime.first_air_date || "Inconnue"}`;
    document.getElementById("animeRating").textContent = `⭐ Note : ${anime.vote_average.toFixed(1)}/10`;
    document.getElementById("animeGenres").textContent = `📌 Genres : ${anime.genres.map(g => g.name).join(", ")}`;
    document.getElementById("animeImage").src = anime.poster_path ? IMAGE_BASE_URL + anime.poster_path : './assets/img/placeholder.png';
    document.getElementById("animeDescription").textContent = anime.overview || "Aucune description disponible.";
    modal.style.display = "flex";
}

// 🟢 Gestion du modal
closeModal.addEventListener("click", () => modal.style.display = "none");
document.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
});

// 🟢 Gestion des filtres et recherche
categoryButtons.forEach(button => button.addEventListener("click", () => {
    selectedGenre = button.dataset.category;
    fetchAnimes(searchBar.value, yearSelect.value, selectedGenre);
}));

searchBar.addEventListener("input", () => fetchAnimes(searchBar.value, yearSelect.value, selectedGenre));
yearSelect.addEventListener("change", () => fetchAnimes(searchBar.value, yearSelect.value, selectedGenre));

// 🟢 Gestion du bouton favoris
favoritesButton.addEventListener("click", () => {
    showFavoritesOnly = !showFavoritesOnly;
    favoritesButton.textContent = showFavoritesOnly ? "Voir Tous" : "Voir Favoris";
    displayAnimes();
});

// 🟢 Chargement initial
document.addEventListener("DOMContentLoaded", () => fetchAnimes());
