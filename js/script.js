document.addEventListener("DOMContentLoaded", () => {
    // ✅ Initialisation sécurisée des modules
    window.initUI?.();
    window.initSearch?.();
    window.initFavorites?.();

    // ✅ Supprimer le carousel (remplacé par swiper.js)
    document.querySelector(".carousel-container")?.remove();

    // ✅ Chargement initial des animes
    window.fetchAnimes?.();

    // ✅ Mise à jour du compteur de favoris
    window.updateFavoritesCount?.();

    // ✅ Bouton "Charger Plus"
    const loadMoreButton = document.getElementById("loadMore");
    loadMoreButton?.addEventListener("click", () => {
        if (window.showFavoritesOnly) {
            window.displayAnimes?.();
        } else {
            window.currentPage = (window.currentPage || 1) + 1;

            const filters = window.getCurrentFilters?.() || {
                query: "",
                year: "",
                category: "16"
            };

            window.fetchAnimes?.({
                query: filters.query,
                year: filters.year,
                category: filters.category,
                page: window.currentPage
            });
        }
    });
});
