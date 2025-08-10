// Configuration de l'API TMDB
window.IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Pour les affiches d'animes
window.API_KEY = "089d41486b450e0b3dfcfdaaca591f3a";
window.BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fonction pour appeler l'API TMDB de manière sécurisée
 * @param {string} action - L'endpoint de l'API à appeler
 * @param {Object} params - Les paramètres supplémentaires pour la requête
 * @returns {Promise} - Promesse contenant la réponse de l'API
 */
function callAPI(action, params = {}) {
    // Liste blanche des actions autorisées
    const allowedActions = [
        'movie/popular', 
        'movie/top_rated', 
        'movie/now_playing',
        'search/movie',
        'movie/upcoming'
    ];

    if (!allowedActions.includes(action)) {
        return Promise.reject(new Error("Action non autorisée"));
    }

    // Construire URL avec params + clé API
    const url = new URL(`${window.BASE_URL}/${action}`);
    url.searchParams.append('api_key', window.API_KEY);
    
    // Ajouter les paramètres supplémentaires
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });

    return fetch(url.toString())
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erreur HTTP: ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
        .catch(error => {
            console.error('Erreur lors de l\'appel API:', error);
            throw error;
        });
}

// Exemples d'utilisation :
// Utilisation autorisée
callAPI('movie/popular', { page: 1, language: 'fr-FR' })
    .then(data => console.log('Films populaires:', data))
    .catch(err => console.error('Erreur:', err.message));

// Utilisation avec recherche
callAPI('search/movie', { query: 'Avengers', language: 'fr-FR' })
    .then(data => console.log('Résultats de recherche:', data))
    .catch(err => console.error('Erreur:', err.message));

// Vérification des scripts chargés
console.log("✅ Vérification des scripts chargés :");
console.log("➡️ config.js chargé !");

// Affichage sécurisé des configurations (sans exposer la clé API)
console.log("IMAGE_BASE_URL:", window.IMAGE_BASE_URL);
console.log("BASE_URL:", window.BASE_URL);
console.log("API_KEY:", window.API_KEY ? "✅ Configurée" : "❌ Manquante");

// Fonction d'initialisation
function initializeApp() {
    console.log("➡️ Le DOM est entièrement chargé !");
    
    console.log("➡️ Vérification des éléments HTML :");
    const elements = [
        'animeList',
        'animeFavori', 
        'loadMore',
        'searchInput',
        'darkModeToggle'
    ];
    
    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        console.log(`${elementId}:`, element ? "✅ Trouvé" : "❌ Non trouvé");
    });
    
    console.log("➡️ Vérification des scripts JS :");
    const scripts = [
        { name: 'cookies.js', check: () => window.Cookies },
        { name: 'animes.js', check: () => window.fetchAnimes },
        { name: 'ui.js', check: () => window.updateFavoritesCount },
        { name: 'favoris.js', check: () => window.toggleFavorite },
        { name: 'rechercher.js', check: () => window.searchAnimes },
        { name: 'darkmode.js', check: () => document.getElementById("darkModeToggle") },
        { name: 'events.js', check: () => window.addEventListeners }
    ];
    
    scripts.forEach(script => {
        const isLoaded = script.check();
        console.log(`${script.name} ?`, isLoaded ? "✅ Chargé" : "❌ Non chargé !");
    });
    
    // Initialiser les event listeners si disponibles
    if (window.addEventListeners && typeof window.addEventListeners === 'function') {
        window.addEventListeners();
        console.log("✅ Event listeners initialisés");
    }
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Le DOM est déjà chargé
    initializeApp();
}

// Fonction utilitaire pour construire l'URL complète d'une image
window.getImageUrl = function(imagePath, size = 'w500') {
    if (!imagePath) return null;
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
};

// Fonction utilitaire pour gérer les erreurs d'image
window.handleImageError = function(imgElement, fallbackSrc = null) {
    if (fallbackSrc) {
        imgElement.src = fallbackSrc;
    } else {
        imgElement.style.display = 'none';
        // Ou afficher une image par défaut
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
    }
};

// Exposer la fonction callAPI globalement
window.callAPI = callAPI;