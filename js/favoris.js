(function () {
    "use strict";

    window.favorites = new Set();
    window.showFavoritesOnly = false;

    window.initFavorites = function() {
        const favorites = Cookies.get("favorites");
        if (favorites && Array.isArray(favorites)) {
            window.favorites = new Set(favorites);
        } else {
            window.favorites = new Set();
        }
        window.updateFavoritesCount();
    };

    window.toggleFavoritesView = function() {
        window.showFavoritesOnly = !window.showFavoritesOnly;
        const favoritesButton = document.getElementById("favoritesButton");

        if (favoritesButton) {
            favoritesButton.textContent = window.showFavoritesOnly
                ? `Voir Tous (${window.favorites.size} favoris)`
                : "Voir Favoris";
        }
    };

    window.toggleFavorite = function(animeId, buttonElement) {
        animeId = String(animeId);

        if (window.favorites.has(animeId)) {
            window.favorites.delete(animeId);
            if(buttonElement) buttonElement.textContent = "Ajouter aux Favoris";
        } else {
            window.favorites.add(animeId);
            if(buttonElement) buttonElement.textContent = "Retirer des Favoris";
        }

        Cookies.set("favorites", Array.from(window.favorites), { days: 365 });
        window.updateFavoritesCount();

        if (window.showFavoritesOnly)
            window.displayAnimes();
    };

    window.updateFavoritesCount = function () {
        const totalFavs = window.favorites.size;
        const title = document.getElementById("favoritesCount");

        if (title) {
            title.textContent = `Total Favoris : ${totalFavs}`;
        }
    };
})();