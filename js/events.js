// events.js
// 📜 Gestion des événements - Version améliorée

// ✅ Initialiser les gestionnaires d'événements pour l'application
window.addEventListeners = function () {
    console.log("🎯 Initialisation des événements...");

    // ✅ Bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    if (loadMoreButton) {
        // Remplacer le bouton pour éviter les doublons d'événements
        const newButton = loadMoreButton.cloneNode(true);
        loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton);

        newButton.addEventListener("click", () => {
            console.log("🔄 Bouton 'Charger Plus' cliqué");

            const currentFilters = window.getCurrentFilters?.() || {};
            const query = document.getElementById("searchBar")?.value || currentFilters.query || "";

            if (window.showFavoritesOnly) {
                window.displayAnimes?.();
            } else {
                window.currentPage = (window.currentPage || 1) + 1;
                window.fetchAnimes?.({
                    query,
                    page: window.currentPage,
                    year: currentFilters.year || "",
                    category: currentFilters.category || "16"
                });
            }
        });

        console.log("✅ Bouton 'Charger Plus' configuré");
    }

    // ✅ Bouton de retour
    const backButton = document.getElementById("backButton");
    backButton?.querySelector("a")?.addEventListener("click", (e) => {
        console.log("🔙 Navigation :", e.currentTarget.href);
    });

    if (backButton) {
        console.log("✅ Bouton de retour configuré");
    }

    // ✅ Gestion des erreurs d'image
    document.addEventListener("error", (e) => {
        if (e.target.tagName === "IMG") {
            console.warn("⚠️ Erreur de chargement d'image :", e.target.src);
            e.target.src = "../assets/img/placeholder.svg";
        }
    }, true);

    console.log("✅ Gestionnaires d'événements initialisés");
};

// ✅ Fonction pour gérer les événements spécifiques à la page favoris
window.initFavoritesPageEvents = function () {
    console.log("📱 Initialisation des événements page favoris...");

    const loadMoreButton = document.getElementById("loadMore");
    loadMoreButton?.addEventListener("click", () => {
        console.log("🔄 Rechargement des favoris");
        window.displayFavoriteAnimes?.();
    });

    const yearSelect = document.getElementById("yearSelect");
    yearSelect?.addEventListener("change", () => {
        console.log("📅 Filtre année changé :", yearSelect.value);
        window.displayFavoriteAnimes?.();
    });

    console.log("✅ Événements page favoris configurés");
};

// ✅ Fonction pour nettoyer les événements globaux
window.cleanupEventListeners = function () {
    console.log("🧹 Nettoyage des événements...");
    window.onclick = null;
    console.log("✅ Événements nettoyés");
};

// ✅ Initialisation après chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM chargé, initialisation des événements...");

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

    // ✅ Fermeture modale avec Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const modal = document.getElementById("modal");
            if (modal?.style.display === "flex") {
                modal.style.display = "none";
                console.log("🚪 Modale fermée avec Escape");
            }
        }
    });

    console.log("✅ Tous les événements sont configurés");
});
