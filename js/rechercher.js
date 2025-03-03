// Gestion des requêtes API et recherche

let allAnimes = [];

// Fonction pour récupérer les animes depuis l'API
async function fetchAnimes(query = "", page = 1) {
    const API_KEY = window.API_KEY;
    const BASE_URL = window.BASE_URL;
    
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_origin_country=JP&page=${page}`;
    if (query.trim()) {
        url = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&with_genres=16&with_origin_country=JP&page=${page}`;
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

// Initialisation de la fonctionnalité de recherche
function initSearch() {
    const searchBar = document.getElementById("searchBar");
    
    // Ajouter un délai pour éviter trop de requêtes pendant la saisie
    let searchTimeout;
    
    searchBar.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchAnimes(searchBar.value);
        }, 500); // Délai de 500ms après la dernière frappe
    });
}
