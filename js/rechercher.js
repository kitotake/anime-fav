// Fichier rechercher.js amélioré - Gestion unifiée de la recherche et des filtres

window.initSearch = function() {
    const searchBar = document.getElementById("searchBar");
    const yearSelect = document.getElementById("yearSelect");
    const categoryButtons = document.querySelectorAll(".category-btn");
    
    // Variables pour stocker les filtres actifs
    let currentQuery = "";
    let currentYear = "";
    let currentCategory = "16"; // Par défaut: anime
    
    // Fonction pour appliquer tous les filtres
    function applyFilters() {
        window.currentPage = 1; // Réinitialiser à la première page
        window.fetchAnimes(currentQuery, 1, currentYear, currentCategory);
        
        // Mettre à jour l'apparence des boutons de catégorie
        categoryButtons.forEach(button => {
            if (button.dataset.category === currentCategory) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }
    
    // Recherche avec délai de frappe
    if (searchBar) {
        let typingTimer;
        searchBar.addEventListener("input", () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                currentQuery = searchBar.value;
                applyFilters();
            }, 500); // Délai de 500ms
        });
        
        // Empêcher la soumission du formulaire si dans un formulaire
        searchBar.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                clearTimeout(typingTimer);
                currentQuery = searchBar.value;
                applyFilters();
            }
        });
    }
    
    // Filtre par année
    if (yearSelect) {
        yearSelect.addEventListener("change", () => {
            currentYear = yearSelect.value;
            applyFilters();
        });
    }
    
    // Filtres par catégorie
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentCategory = button.dataset.category;
                applyFilters();
            });
        });
    }
};