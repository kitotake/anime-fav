// 📜 Gestion de la recherche et des filtres - VERSION CORRIGÉE

// Variables pour stocker les filtres actifs
let currentQuery = "";
let currentYear = "";
let currentCategory = "16"; // Par défaut: anime (genre 16)

// 📌 Initialisation de la recherche
window.initSearch = function() {
    console.log("🔍 Initialisation du système de recherche");
    
    const searchBar = document.getElementById("searchBar");
    const yearSelect = document.getElementById("yearSelect");
    const categoryButtons = document.querySelectorAll(".category-btn");
    
    // Barre de recherche avec délai de frappe (debounce)
    if (searchBar) {
        let typingTimer;
        const TYPING_DELAY = 500; // 500ms de délai
        
        searchBar.addEventListener("input", (e) => {
            clearTimeout(typingTimer);
            
            typingTimer = setTimeout(() => {
                currentQuery = e.target.value.trim();
                console.log("🔍 Recherche :", currentQuery);
                applyFilters();
            }, TYPING_DELAY);
        });
        
        // Recherche immédiate sur Entrée
        searchBar.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                clearTimeout(typingTimer);
                currentQuery = searchBar.value.trim();
                console.log("🔍 Recherche immédiate :", currentQuery);
                applyFilters();
            }
        });
        
        console.log("✅ Barre de recherche initialisée");
    }
    
    // Filtre par année
    if (yearSelect) {
        yearSelect.addEventListener("change", (e) => {
            currentYear = e.target.value;
            console.log("📅 Filtre année :", currentYear || "Toutes");
            applyFilters();
        });
        
        console.log("✅ Filtre année initialisé");
    }
    
    // Filtres par catégorie
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                const newCategory = button.dataset.category;
                
                if (newCategory !== currentCategory) {
                    currentCategory = newCategory;
                    console.log("🏷️ Nouvelle catégorie :", currentCategory);
                    updateCategoryButtons(categoryButtons);
                    applyFilters();
                }
            });
        });
        
        // Marquer le bouton actif au démarrage
        updateCategoryButtons(categoryButtons);
        console.log("✅ Filtres catégories initialisés");
    }
};

// 📌 Appliquer tous les filtres
function applyFilters() {
    console.log("🔄 Application des filtres:", {
        query: currentQuery,
        year: currentYear,
        category: currentCategory
    });
    
    // Réinitialiser à la première page
    window.currentPage = 1;
    
    // Appeler la fonction de récupération des animes
    if (window.fetchAnimes) {
        window.fetchAnimes({
            query: currentQuery,
            page: 1,
            year: currentYear,
            category: currentCategory
        });
    } else {
        console.error("❌ Fonction fetchAnimes non disponible");
    }
}

// 📌 Mettre à jour l'apparence des boutons de catégorie
function updateCategoryButtons(buttons) {
    buttons.forEach(button => {
        if (button.dataset.category === currentCategory) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// 📌 Réinitialiser les filtres
window.resetFilters = function() {
    console.log("🔄 Réinitialisation des filtres");
    
    currentQuery = "";
    currentYear = "";
    currentCategory = "16";
    
    // Réinitialiser les éléments UI
    const searchBar = document.getElementById("searchBar");
    if (searchBar) searchBar.value = "";
    
    const yearSelect = document.getElementById("yearSelect");
    if (yearSelect) yearSelect.value = "";
    
    const categoryButtons = document.querySelectorAll(".category-btn");
    updateCategoryButtons(categoryButtons);
    
    applyFilters();
};

// 📌 Obtenir les filtres actuels
window.getCurrentFilters = function() {
    return {
        query: currentQuery,
        year: currentYear,
        category: currentCategory
    };
};

// 📌 Définir les filtres (utile pour la synchronisation entre pages)
window.setFilters = function(filters) {
    if (filters.query !== undefined) currentQuery = filters.query;
    if (filters.year !== undefined) currentYear = filters.year;
    if (filters.category !== undefined) currentCategory = filters.category;
    
    // Mettre à jour l'interface
    const searchBar = document.getElementById("searchBar");
    if (searchBar && filters.query !== undefined) {
        searchBar.value = filters.query;
    }
    
    const yearSelect = document.getElementById("yearSelect");
    if (yearSelect && filters.year !== undefined) {
        yearSelect.value = filters.year;
    }
    
    const categoryButtons = document.querySelectorAll(".category-btn");
    if (categoryButtons.length > 0 && filters.category !== undefined) {
        updateCategoryButtons(categoryButtons);
    }
};

// 📌 Fonction utilitaire pour déboguer
window.debugSearch = function() {
    console.log("🐛 Debug recherche:", {
        currentQuery,
        currentYear,
        currentCategory,
        searchBar: !!document.getElementById("searchBar"),
        yearSelect: !!document.getElementById("yearSelect"),
        categoryButtons: document.querySelectorAll(".category-btn").length
    });
};

// 📌 Initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    // Attendre un peu pour que les autres éléments soient chargés
    setTimeout(() => {
        if (typeof window.initSearch === 'function') {
            window.initSearch();
        }
    }, 100);
});

// 📌 Export des variables pour debug (développement uniquement)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.searchDebug = {
        getCurrentQuery: () => currentQuery,
        getCurrentYear: () => currentYear,
        getCurrentCategory: () => currentCategory,
        applyFilters,
        resetFilters: window.resetFilters
    };
}