// Configuration de l'API TMDB
window.IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
window.API_KEY = "089d41486b450e0b3dfcfdaaca591f3a";
window.BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fonction pour appeler l'API TMDB de manière sécurisée (movies seulement).
 * Pour les séries TV, utilisez fetch() directement avec window.BASE_URL et window.API_KEY.
 * @param {string} action - L'endpoint movie/* ou search/movie
 * @param {Object} params - Paramètres supplémentaires
 * @returns {Promise}
 */
function callAPI(action, params = {}) {
    const allowedActions = [
        "movie/popular",
        "movie/top_rated",
        "movie/now_playing",
        "search/movie",
        "movie/upcoming"
    ];

    if (!allowedActions.includes(action)) {
        return Promise.reject(new Error("Action non autorisée : " + action));
    }

    const url = new URL(`${window.BASE_URL}/${action}`);
    url.searchParams.append("api_key", window.API_KEY);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });

    return fetch(url.toString())
        .then(res => {
            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status} - ${res.statusText}`);
            return res.json();
        })
        .catch(error => {
            console.error("❌ Erreur lors de l'appel API:", error);
            throw error;
        });
}

// Fonctions utilitaires image
window.getImageUrl = function (imagePath, size = "w500") {
    if (!imagePath) return null;
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
};

window.handleImageError = function (imgElement, fallbackSrc = "./assets/img/placeholder.svg") {
    imgElement.src = fallbackSrc;
};

// Exposer globalement
window.callAPI = callAPI;

console.log("✅ config.js chargé");
console.log("IMAGE_BASE_URL:", window.IMAGE_BASE_URL);
console.log("BASE_URL:", window.BASE_URL);
console.log("API_KEY:", window.API_KEY ? "✅ Configurée" : "❌ Manquante");
