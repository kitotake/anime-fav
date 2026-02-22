// ============================================================================
// 📡 Configuration de l'API TMDB — AnimeFavoris v2.0
// ============================================================================

window.IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
window.API_KEY = "089d41486b450e0b3dfcfdaaca591f3a";
window.BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fonction pour appeler l'API TMDB de manière sécurisée (movies seulement).
 * Pour les séries TV (anime), utilisez fetch() directement avec window.BASE_URL et window.API_KEY.
 * 
 * Usage pour TV/anime:
 *   const url = `${window.BASE_URL}/tv/${id}?api_key=${window.API_KEY}&language=fr-FR`;
 *   const response = await fetch(url);
 *   const data = await response.json();
 * 
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

// ============================================================================
// 🛠️ Utilitaires Image & Initialisation
// ============================================================================

/**
 * Retourne l'URL complète d'une image TMDB
 * @param {string} imagePath - Chemin relatif de l'image depuis TMDB
 * @param {string} size - Taille de l'image (w500, w342, original, etc.)
 * @returns {string|null} URL complète ou null si imagePath est vide
 */
window.getImageUrl = function (imagePath, size = "w500") {
    if (!imagePath) return null;
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
};

/**
 * Gère le fallback en cas d'erreur de chargement d'image
 * @param {HTMLImageElement} imgElement - L'élément <img> qui a échoué
 * @param {string} fallbackSrc - Image de remplacement (par défaut: placeholder)
 */
window.handleImageError = function (imgElement, fallbackSrc = "./assets/img/placeholder.svg") {
    imgElement.src = fallbackSrc;
};

// Exposer globalement
window.callAPI = callAPI;

// ============================================================================
// 📋 Vérification au démarrage
// ============================================================================
console.log("✅ config.js chargé");
console.log("🔧 Configuration TMDB:", {
    IMAGE_BASE_URL: window.IMAGE_BASE_URL,
    BASE_URL: window.BASE_URL,
    API_KEY: window.API_KEY ? "✅ Configurée" : "❌ Manquante"
});
