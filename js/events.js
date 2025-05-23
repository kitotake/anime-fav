// 📜 Gestion des événements - Version corrigée

// ✅ Initialiser les gestionnaires d'événements pour l'application
window.addEventListeners = function() {
    console.log("🎯 Initialisation des événements...");
    
    // ✅ Bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    if (loadMoreButton) {
        // ✅ Supprimer les anciens événements pour éviter les doublons
        loadMoreButton.replaceWith(loadMoreButton.cloneNode(true));
        const newLoadMoreButton = document.getElementById("loadMore");
        
        newLoadMoreButton.addEventListener("click", () => {
            console.log("🔄 Bouton 'Charger Plus' cliqué");
            
            if (window.showFavoritesOnly) {
                // ✅ Mode favoris: juste réafficher
                if (window.displayAnimes) {
                    window.displayAnimes();
                }
            } else {
                // ✅ Mode normal: charger la page suivante
                const searchBar = document.getElementById("searchBar");
                const currentFilters = window.getCurrentFilters ? window.getCurrentFilters() : {};
                
                window.currentPage = (window.currentPage || 1) + 1;
                
                if (window.fetchAnimes) {
                    window.fetchAnimes({
                        query: searchBar ? searchBar.value : (currentFilters.query || ""),
                        page: window.currentPage,
                        year: currentFilters.year || "",
                        category: currentFilters.category || "16"
                    });
                }
            }
        });
        
        console.log("✅ Bouton 'Charger Plus' configuré");
    }
    
    // ✅ Boutons de navigation
    const backButton = document.getElementById("backButton");
    if (backButton) {
        const link = backButton.querySelector("a");
        if (link) {
            link.addEventListener("click", (e) => {
                console.log("🔙 Navigation:", link.href);
            });
        }
        console.log("✅ Bouton de retour configuré");
    }
    
    // ✅ Gestion des erreurs d'images
    document.addEventListener("error", (e) => {
        if (e.target.tagName === "IMG") {
            console.warn("⚠️ Erreur de chargement d'image:", e.target.src);
            e.target.src = "../assets/img/placeholder.svg";
        }
    }, true);
    
    console.log("✅ Gestionnaires d'événements initialisés");
};

// ✅ Fonction pour gérer les événements spécifiques à la page favoris
window.initFavoritesPageEvents = function() {
    console.log("📱 Initialisation des événements page favoris...");
    
    // ✅ Bouton "Charger Plus" pour les favoris
    const loadMoreButton = document.getElementById("loadMore");
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            console.log("🔄 Rechargement des favoris");
            if (window.displayFavoriteAnimes) {
                window.displayFavoriteAnimes();
            }
        });
    }
    
    // ✅ Filtres spécifiques aux favoris (année uniquement)
    const yearSelect = document.getElementById("yearSelect");
    if (yearSelect) {
        yearSelect.addEventListener("change", () => {
            console.log("📅 Filtre année changé:", yearSelect.value);
            // ✅ Filtrer les favoris par année si nécessaire
            if (window.displayFavoriteAnimes) {
                window.displayFavoriteAnimes();
            }
        });
    }
    
    console.log("✅ Événements page favoris configurés");
};

// ✅ Fonction pour nettoyer les événements
window.cleanupEventListeners = function() {
    console.log("🧹 Nettoyage des événements...");
    
    // ✅ Supprimer les gestionnaires globaux si nécessaire
    window.onclick = null;
    
    console.log("✅ Événements nettoyés");
};

// ✅ Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM chargé, initialisation des événements...");
    
    // ✅ Déterminer le type de page
    const isHomePage = document.getElementById("animeList") && !document.getElementById("animeFavori");
    const isFavoritesPage = document.getElementById("animeFavori");
    
    if (isHomePage) {
        console.log("🏠 Page d'accueil détectée");
        window.showFavoritesOnly = false;
        window.addEventListeners();
    } else if (isFavoritesPage) {
        console.log("⭐ Page favoris détectée");
        window.showFavoritesOnly = true;
        window.addEventListeners();
        window.initFavoritesPageEvents();
    }
    
    // ✅ Événements communs à toutes les pages
    console.log("🎯 Configuration des événements communs...");
    
    // ✅ Gestion de la fermeture de modale avec Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const modal = document.getElementById("modal");
            if (modal && modal.style.display === "flex") {
                modal.style.display = "none";
                console.log("🚪 Modale fermée avec Escape");
            }
        }
    });
    
    console.log("✅ Tous les événements sont configurés");
});