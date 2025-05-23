// 📜 Gestion de la recherche et des filtres - Version corrigée

window.initSearch = function() {
    const searchBar = document.getElementById("searchBar");
    const yearSelect = document.getElementById("yearSelect");
    const categoryButtons = document.querySelectorAll(".category-btn");
    
    // ✅ Variables pour stocker les filtres actifs
    let currentQuery = "";
    let currentYear = "";
    let currentCategory = "16"; // Par défaut: anime
    
    // ✅ Fonction pour appliquer tous les filtres
    function applyFilters() {
        window.currentPage = 1; // Réinitialiser à la première page
        
        // ✅ Appel corrigé avec objet de paramètres
        window.fetchAnimes({
            query: currentQuery,
            page: 1,
            year: currentYear,
            category: currentCategory
        });
        
        // ✅ Mettre à jour l'apparence des boutons de catégorie
        categoryButtons.forEach(button => {
            if (button.dataset.category === currentCategory) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
        
        console.log("🔍 Filtres appliqués:", { currentQuery, currentYear, currentCategory });
    }
    
    // ✅ Recherche avec délai de frappe (debounce)
    if (searchBar) {
        let typingTimer;
        const TYPING_DELAY = 300; // 300ms de délai
        
        searchBar.addEventListener("input", (e) => {
            clearTimeout(typingTimer);
            currentQuery = e.target.value.trim();
            
            typingTimer = setTimeout(() => {
                applyFilters();
            }, TYPING_DELAY);
        });
        
        // ✅ Recherche immédiate sur Entrée
        searchBar.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                clearTimeout(typingTimer);
                currentQuery = e.target.value.trim();
                applyFilters();
            }
        });
        
        console.log("✅ Barre de recherche initialisée");
    }
    
    // ✅ Filtre par année
    if (yearSelect) {
        yearSelect.addEventListener("change", (e) => {
            currentYear = e.target.value;
            applyFilters();
        });
        
        console.log("✅ Sélecteur d'année initialisé");
    }
    
    // ✅ Filtres par catégorie
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                currentCategory = button.dataset.category;
                applyFilters();
            });
        });
        
        // ✅ Activer le premier bouton par défaut
        const firstButton = categoryButtons[0];
        if (firstButton) {
            firstButton.classList.add("active");
        }
        
        console.log("✅ Boutons de catégorie initialisés:", categoryButtons.length);
    }
    
    // ✅ Fonction pour réinitialiser les filtres
    window.resetFilters = function() {
        currentQuery = "";
        currentYear = "";
        currentCategory = "16";
        
        if (searchBar) searchBar.value = "";
        if (yearSelect) yearSelect.value = "";
        
        categoryButtons.forEach(button => {
            button.classList.remove("active");
            if (button.dataset.category === "16") {
                button.classList.add("active");
            }
        });
        
        applyFilters();
        console.log("🔄 Filtres réinitialisés");
    };
    
    // ✅ Exposer les filtres actuels
    window.getCurrentFilters = function() {
        return {
            query: currentQuery,
            year: currentYear,
            category: currentCategory
        };
    };
    
    console.log("🔍 Système de recherche initialisé");
};

// ✅ Initialisation automatique si on n'est pas sur la page favoris
document.addEventListener("DOMContentLoaded", () => {
    // ✅ Initialiser la recherche seulement sur la page principale
    if (!document.getElementById("animeFavori")) {
        console.log("🔍 Initialisation de la recherche...");
        window.initSearch();
    } else {
        console.log("📱 Page favoris: recherche désactivée");
    }
});