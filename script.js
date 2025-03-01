const API_KEY = 'TON_API_KEY_ICI'; // Remplace par ta clé API TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const ANIME_GENRE_ID = 16; // Genre "Animation" sur TMDb
const LANGUAGE = 'fr-FR'; // Français

// Fonction pour récupérer les animes depuis TMDb
async function fetchAnimes() {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${ANIME_GENRE_ID}&language=${LANGUAGE}`);
        const data = await response.json();
        
        if (data.results) {
            displayAnime(data.results);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des animes:', error);
    }
}

// Fonction pour générer le HTML des animes
function generateAnimeHTML(anime) {
    return `
        <div class="anime">
            <div class="poster" onclick="showModal('${anime.name}', '${anime.first_air_date}', '${anime.overview}', '${anime.poster_path}')">
                <img src="https://image.tmdb.org/t/p/w500${anime.poster_path}" alt="${anime.name}">
            </div>
            <div class="details">
                <h1>${anime.name}</h1>
                <p><strong>Année :</strong> ${anime.first_air_date}</p>
            </div>
        </div>
    `;
}

// Fonction pour afficher le popup
function showModal(titre, date, description, poster) {
    const modal = document.getElementById('animeModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h1>${titre}</h1>
        <img src="https://image.tmdb.org/t/p/w500${poster}" alt="${titre}" style="width: 150px; float: left; margin-right: 20px;">
        <p><strong>Date de sortie :</strong> ${date}</p>
        <p><strong>Description :</strong> ${description}</p>
    `;
    modal.style.display = 'block';
}

// Fonction pour afficher les animes
function displayAnime(animes) {
    const container = document.getElementById('animeContainer');
    container.innerHTML = ''; // Nettoie avant d'ajouter de nouveaux éléments
    animes.forEach(anime => {
        container.innerHTML += generateAnimeHTML(anime);
    });
}

// Charge les animes au chargement de la page
document.addEventListener('DOMContentLoaded', fetchAnimes);
