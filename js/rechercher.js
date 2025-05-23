// recherche.js
window.initSearch = function () {
    const searchBar = document.getElementById("searchBar");
    const yearSelect = document.getElementById("yearSelect");
    const categoryButtons = document.querySelectorAll(".category-btn");

    // ✅ États des filtres
    let currentQuery = "";
    let currentYear = "";
    let currentCategory = "16"; // Anime par défaut

    // ✅ Application de tous les filtres
    function applyFilters() {
        window.currentPage = 1;

        window.fetchAnimes?.({
            query: currentQuery,
            page: 1,
            year: currentYear,
            category: currentCategory
        });

        categoryButtons.forEach(btn =>
            btn.classList.toggle("active", btn.dataset.category === currentCategory)
        );

        console.log("🔍 Filtres appliqués :", { currentQuery, currentYear, currentCategory });
    }

    // ✅ Recherche avec debounce
    if (searchBar) {
        let typingTimer;
        const TYPING_DELAY = 300;

        searchBar.addEventListener("input", (e) => {
            clearTimeout(typingTimer);
            currentQuery = e.target.value.trim();
            typingTimer = setTimeout(applyFilters, TYPING_DELAY);
        });

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

    // ✅ Sélection de l'année
    yearSelect?.addEventListener("change", (e) => {
        currentYear = e.target.value;
        applyFilters();
    });

    if (yearSelect) {
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

        categoryButtons[0]?.classList.add("active");
        console.log("✅ Boutons de catégorie initialisés :", categoryButtons.length);
    }

    // ✅ Fonction publique : réinitialisation
    window.resetFilters = function () {
        currentQuery = "";
        currentYear = "";
        currentCategory = "16";

        if (searchBar) searchBar.value = "";
        if (yearSelect) yearSelect.value = "";

        categoryButtons.forEach(btn =>
            btn.classList.toggle("active", btn.dataset.category === "16")
        );

        applyFilters();
        console.log("🔄 Filtres réinitialisés");
    };

    // ✅ Fonction publique : récupération des filtres
    window.getCurrentFilters = function () {
        return { query: currentQuery, year: currentYear, category: currentCategory };
    };

    console.log("🔍 Système de recherche initialisé");
};

// ✅ Initialisation conditionnelle
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("animeFavori")) {
        console.log("🔍 Initialisation de la recherche...");
        window.initSearch();
    } else {
        console.log("📱 Page favoris : recherche désactivée");
    }
});
