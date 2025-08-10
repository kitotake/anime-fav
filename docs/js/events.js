// 📜 Gestion des événements globaux - VERSION CORRIGÉE

// 📌 Initialiser les gestionnaires d'événements pour l'application
window.addEventListeners = function() {
    console.log("🎯 Initialisation des événements globaux");
    
    // Bouton "Charger Plus"
    initLoadMoreButton();
    
    // Événements de la modale
    initModalEvents();
    
    // Événements des boutons de navigation
    initNavigationEvents();
    
    console.log("✅ Événements globaux initialisés");
};

// 📌 Initialiser le bouton "Charger Plus"
function initLoadMoreButton() {
    const loadMoreButton = document.getElementById("loadMore");
    if (!loadMoreButton) {
        console.warn("⚠️ Bouton 'loadMore' introuvable");
        return;
    }

    // Supprimer les anciens événements pour éviter les doublons
    const newButton = loadMoreButton.cloneNode(true);
    loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton);

    newButton.addEventListener("click", () => {
        console.log("🔄 Clic sur 'Voir plus'");
        
        try {
            // Si on est sur la page favoris, pas de pagination
            if (window.showFavoritesOnly) {
                console.log("⭐ Page favoris - Pas de pagination");
                return;
            }

            // Page principale - charger plus d'animes
            if (window.fetchAnimes && window.currentPage !== undefined) {
                window.currentPage++;
                
                const searchBar = document.getElementById("searchBar");
                const yearSelect = document.getElementById("yearSelect");
                
                // Récupérer les filtres actuels
                const currentFilters = {
                    query: searchBar ? searchBar.value.trim() : "",
                    page: window.currentPage,
                    year: yearSelect ? yearSelect.value : "",
                    category: getCurrentCategory()
                };
                
                console.log("📄 Chargement page", window.currentPage, "avec filtres:", currentFilters);
                
                window.fetchAnimes(currentFilters);
            } else {
                console.warn("⚠️ Impossible de charger plus d'animes - fonction ou page manquante");
            }
        } catch (error) {
            console.error("❌ Erreur lors du chargement de plus d'animes:", error);
        }
    });
    
    console.log("✅ Bouton 'Charger Plus' initialisé");
}

// 📌 Obtenir la catégorie actuellement sélectionnée
function getCurrentCategory() {
    const activeButton = document.querySelector(".category-btn.active");
    return activeButton ? activeButton.dataset.category : "16";
}

// 📌 Initialiser les événements de la modale
function initModalEvents() {
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close");
    
    if (!modal) {
        console.warn("⚠️ Modale introuvable");
        return;
    }

    // Bouton de fermeture
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            console.log("❌ Fermeture modale via bouton");
            modal.style.display = "none";
        });
    }

    // Fermeture en cliquant à l'extérieur
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            console.log("❌ Fermeture modale via clic extérieur");
            modal.style.display = "none";
        }
    });

    // Fermeture avec la touche Échap
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "flex") {
            console.log("❌ Fermeture modale via touche Échap");
            modal.style.display = "none";
        }
    });
    
    console.log("✅ Événements modale initialisés");
}

// 📌 Initialiser les événements de navigation
function initNavigationEvents() {
    // Bouton Favoris (page principale)
    const favoritesButton = document.getElementById("favoritesButton");
    if (favoritesButton) {
        favoritesButton.addEventListener("click", (e) => {
            console.log("⭐ Navigation vers les favoris");
            // Le lien <a> gère déjà la navigation
        });
    }

    // Bouton Retour (page favoris)
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", (e) => {
            console.log("🏠 Navigation vers la page principale");
            // Le lien <a> gère déjà la navigation
        });
    }
    
    console.log("✅ Événements de navigation initialisés");
}

// 📌 Gestionnaire global des erreurs JavaScript
window.addEventListener("error", (event) => {
    console.error("❌ Erreur JavaScript globale:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// 📌 Gestionnaire des promesses rejetées
window.addEventListener("unhandledrejection", (event) => {
    console.error("❌ Promise rejetée non gérée:", event.reason);
});

// 📌 Fonction utilitaire pour déboguer les événements
window.debugEvents = function() {
    const elements = {
        loadMore: !!document.getElementById("loadMore"),
        modal: !!document.getElementById("modal"),
        closeButton: !!document.querySelector(".close"),
        searchBar: !!document.getElementById("searchBar"),
        yearSelect: !!document.getElementById("yearSelect"),
        categoryButtons: document.querySelectorAll(".category-btn").length,
        favoritesButton: !!document.getElementById("favoritesButton"),
        backButton: !!document.getElementById("backButton")
    };
    
    console.log("🐛 Debug événements:", elements);
    return elements;
};

// 📌 Initialisation automatique sécurisée
document.addEventListener("DOMContentLoaded", () => {
    // Attendre un peu pour s'assurer que tous les éléments sont chargés
    setTimeout(() => {
        try {
            if (typeof window.addEventListeners === 'function') {
                window.addEventListeners();
            } else {
                console.warn("⚠️ Fonction addEventListeners non disponible");
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'initialisation des événements:", error);
        }
    }, 150);
});

// 📌 Réinitialisation des événements (utile pour le debug)
window.reinitEvents = function() {
    console.log("🔄 Réinitialisation des événements");
    window.addEventListeners();
};