// favoris.js
window.initFavorites = function () {
    try {
        const storedFavorites = window.Cookies?.get("favorites");

        window.favorites = new Set(
            Array.isArray(storedFavorites) ? storedFavorites.map(String) : []
        );

        console.log("✅ Favoris initialisés :", window.favorites);

        window.updateFavoritesCount();

        if (document.getElementById("animeFavori")) {
            window.displayFavoriteAnimes();
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des favoris :", error);
        window.favorites = new Set();
    }
};

// ✅ Sauvegarde des favoris
window.saveFavorites = function () {
    try {
        if (window.Cookies && window.favorites) {
            window.Cookies.set("favorites", Array.from(window.favorites), { days: 30 });
            console.log("✅ Favoris sauvegardés :", Array.from(window.favorites));
        }
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde des favoris :", error);
    }
};

// ✅ Basculer un favori
window.toggleFavorite = function (animeId, buttonElement) {
    if (!animeId || !buttonElement) return;

    animeId = String(animeId);
    window.favorites ??= new Set();

    const isFavorite = window.favorites.has(animeId);

    if (isFavorite) {
        window.favorites.delete(animeId);
        buttonElement.src = "../assets/img/heart-filled.svg";
        buttonElement.title = "Ajouter aux favoris";
        console.log("❌ Favori retiré :", animeId);
    } else {
        window.favorites.add(animeId);
        buttonElement.src = "../assets/img/check.svg";
        buttonElement.title = "Retirer des favoris";
        console.log("✅ Favori ajouté :", animeId);
    }

    window.saveFavorites();
    window.updateFavoritesCount();

    if (document.getElementById("animeFavori")) {
        window.displayFavoriteAnimes();
    } else if (window.showFavoritesOnly) {
        window.displayAnimes?.();
    }
};

// ✅ Mise à jour du compteur de favoris
window.updateFavoritesCount = function () {
    window.favorites ??= new Set();

    const count = window.favorites.size;
    const counter = document.getElementById("favoritesCount");

    if (counter) {
        counter.textContent = `Total Favoris : ${count}`;
    }

    console.log("📊 Nombre de favoris :", count);
};

// ✅ Affichage des animes favoris
window.displayFavoriteAnimes = function () {
    const container = document.getElementById("animeFavori");
    if (!container) {
        console.warn("⚠️ Élément 'animeFavori' introuvable");
        return;
    }

    container.innerHTML = "";

    if (!Array.isArray(window.allAnimes)) {
        container.innerHTML = `<p class="info-message">⏳ Chargement des animes...</p>`;
        return;
    }

    window.favorites ??= new Set();

    const favoritesList = window.allAnimes.filter(anime =>
        window.favorites.has(String(anime.id))
    );

    if (favoritesList.length === 0) {
        container.innerHTML = `<p class="info-message">⭐ Aucun favori enregistré.</p>`;
        return;
    }

    favoritesList.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;

        const card = document.createElement("div");
        card.className = "anime-card";
        card.innerHTML = `
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : '../assets/img/placeholder.svg'}"
                         alt="${name}" 
                         onerror="this.src='../assets/img/placeholder.svg'">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" 
                         src="../assets/img/check.svg" 
                         data-id="${id}" 
                         title="Retirer des favoris">
                    <img class="info-icon" 
                         src="../assets/img/info.svg" 
                         data-id="${id}" 
                         title="Voir plus d'infos">
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date?.split("-")[0] || "Inconnue"}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // ✅ Événements des boutons
    container.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.toggleFavorite(button.dataset.id, button);
        });
    });

    container.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.openModal?.(button.dataset.id);
        });
    });

    console.log("✅ Favoris affichés :", favoritesList.length);
};

// ✅ Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initialisation des favoris...");
    window.initFavorites();

    if (document.getElementById("animeFavori")) {
        window.showFavoritesOnly = true;
        console.log("📱 Page favoris détectée");
    }
});
