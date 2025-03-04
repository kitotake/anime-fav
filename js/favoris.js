document.addEventListener("DOMContentLoaded", () => {
    window.initFavorites(); // Initialisation des favoris avec Cookies
});

window.initFavorites = function () {
    let storedFavorites = JSON.parse(window.Cookies.get("favorites") || "[]");

    // ✅ S'assurer que storedFavorites est un tableau
    if (!Array.isArray(storedFavorites)) {
        storedFavorites = [];
    }

    window.favorites = new Set(storedFavorites.map(String)); // 🔥 Convertir en string pour cohérence
    window.updateFavoritesCount();
    window.displayFavoriteAnimes();
};


window.saveFavorites = function () {
    window.Cookies.set("favorites", JSON.stringify([...window.favorites]), { days: 30 });
};

window.toggleFavorite = function (animeId, buttonElement) {
    animeId = String(animeId);
    
    if (window.favorites.has(animeId)) {
        window.favorites.delete(animeId);
        buttonElement.src = "../assets/img/heart-filled.png";
        buttonElement.title = "Ajouter aux favoris";
    } else {
        window.favorites.add(animeId);
        buttonElement.src = "../assets/img/check.png";
        buttonElement.title = "Retirer des favoris";
    }
    
    window.saveFavorites();
    window.updateFavoritesCount();
    window.displayFavoriteAnimes();
    
    if (window.showFavoritesOnly) {
        window.displayAnimes();
    }
};

window.updateFavoritesCount = function () {
    const count = window.favorites.size;
    const favoritesCounter = document.getElementById("favoritesCount");
    if (favoritesCounter) {
        favoritesCounter.textContent = `Total Favoris : ${count}`;
    }
};

window.displayFavoriteAnimes = function () {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) {
        console.warn("⚠️ Avertissement: L'élément 'animeFavori' est introuvable !");
        return;
    }


    animeFavori.innerHTML = "";
    let favoriteAnimes = window.allAnimes ? window.allAnimes.filter(anime => window.favorites.has(String(anime.id))) : [];
    
    if (favoriteAnimes.length === 0) {
        animeFavori.innerHTML = `<p>⭐ Aucun favori enregistré.</p>`;
        return;
    }

    favoriteAnimes.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : '../assets/img/placeholder.png'}" alt="${name}">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" src="../assets/img/check.png"
                        data-id="${id}" title="Retirer des favoris">
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        `;
        animeFavori.appendChild(animeCard);
    });

    document.querySelectorAll("#animeFavori .favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => window.toggleFavorite(event.target.dataset.id, event.target));
    });
};
