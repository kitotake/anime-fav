// 📜 Gestion des favoris - VERSION CORRIGÉE v2

window.favorites = new Set();

// 📌 Initialisation des favoris
window.initFavorites = function () {
    try {
        const storedFavorites = window.Cookies ? window.Cookies.get("favorites") : null;

        let favoritesArray = [];
        if (storedFavorites) {
            if (Array.isArray(storedFavorites)) {
                favoritesArray = storedFavorites;
            } else if (typeof storedFavorites === "string") {
                try { favoritesArray = JSON.parse(storedFavorites); } catch (e) { favoritesArray = []; }
            }
        }

        window.favorites = new Set(favoritesArray.map(String));
        console.log("✅ Favoris initialisés :", window.favorites.size, "éléments");

        updateFavoritesCount();

        // Sur la page favoris, charger l'affichage
        if (document.getElementById("animeFavori")) {
            window.loadAndDisplayFavorites();
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des favoris :", error);
        window.favorites = new Set();
    }
};

// 📌 Sauvegarder les favoris
window.saveFavorites = function () {
    try {
        if (window.Cookies) {
            window.Cookies.set("favorites", Array.from(window.favorites), { days: 365 });
            console.log("✅ Favoris sauvegardés :", window.favorites.size, "éléments");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
};

// 📌 Toggle favori
window.toggleFavorite = function (animeId, buttonElement) {
    try {
        animeId = String(animeId);

        if (window.favorites.has(animeId)) {
            window.favorites.delete(animeId);
            if (buttonElement) {
                buttonElement.src = "./assets/img/heart-filled.svg";
                buttonElement.title = "Ajouter aux favoris";
            }
            console.log("➖ Retiré des favoris :", animeId);
        } else {
            window.favorites.add(animeId);
            if (buttonElement) {
                buttonElement.src = "./assets/img/check.svg";
                buttonElement.title = "Retirer des favoris";
            }
            console.log("➕ Ajouté aux favoris :", animeId);
        }

        window.saveFavorites();
        updateFavoritesCount();

        // Sur la page favoris : recharger la liste
        if (document.getElementById("animeFavori")) {
            window.loadAndDisplayFavorites();
        }
    } catch (error) {
        console.error("❌ Erreur lors du toggle favori :", error);
    }
};

// 📌 Mettre à jour le compteur de favoris
function updateFavoritesCount() {
    try {
        const favoritesCounter = document.getElementById("favoritesCount");
        if (favoritesCounter) {
            favoritesCounter.textContent = `Total Favoris : ${window.favorites.size}`;
        }
    } catch (error) {
        console.error("❌ Erreur mise à jour compteur :", error);
    }
}
window.updateFavoritesCount = updateFavoritesCount;

// 📌 Charger et afficher les favoris (page favoris.html)
window.loadAndDisplayFavorites = async function () {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) return;

    if (window.favorites.size === 0) {
        displayNoFavorites();
        return;
    }

    animeFavori.innerHTML = `<p style="text-align:center;margin:50px;">Chargement des favoris...</p>`;

    const favoriteAnimes = [];
    for (const animeId of Array.from(window.favorites)) {
        try {
            const response = await fetch(
                `${window.BASE_URL}/tv/${animeId}?api_key=${window.API_KEY}&language=fr-FR`
            );
            if (response.ok) {
                favoriteAnimes.push(await response.json());
            }
        } catch (error) {
            console.warn(`⚠️ Impossible de charger l'anime ${animeId}:`, error);
        }
    }

    if (favoriteAnimes.length === 0) {
        displayNoFavorites();
        return;
    }

    displayFavoriteAnimes(favoriteAnimes);
};

// 📌 Afficher les animes favoris
function displayFavoriteAnimes(favoriteAnimes) {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) return;

    animeFavori.innerHTML = "";

    favoriteAnimes.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : "./assets/img/placeholder.svg"}"
                         alt="${name}" loading="lazy"
                         onerror="this.src='./assets/img/placeholder.svg'">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon"
                         src="./assets/img/check.svg"
                         data-id="${id}"
                         title="Retirer des favoris">
                    <img class="info-icon"
                         src="./assets/img/info.svg"
                         data-id="${id}"
                         title="Voir plus d'infos">
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year">
                        <strong>Année :</strong>
                        ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}
                    </p>
                </div>
            </div>
        `;
        animeFavori.appendChild(animeCard);
    });

    animeFavori.querySelectorAll(".favorite-icon").forEach(btn => {
        btn.addEventListener("click", event => {
            window.toggleFavorite(event.target.dataset.id, event.target);
        });
    });

    animeFavori.querySelectorAll(".info-icon").forEach(btn => {
        btn.addEventListener("click", event => {
            if (window.openModal) window.openModal(event.target.dataset.id);
        });
    });

    console.log(`📺 ${favoriteAnimes.length} favoris affichés`);
}

// 📌 Message quand aucun favori
function displayNoFavorites() {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) return;
    animeFavori.innerHTML = `
        <div style="text-align:center;margin:50px;">
            <div style="font-size:4rem;margin-bottom:20px;">📺</div>
            <h3>Aucun anime en favori</h3>
            <p style="margin:20px 0;opacity:0.8;">
                Retournez à la liste principale pour ajouter des animes à vos favoris !
            </p>
            <a href="./index.html" style="
                display:inline-block;
                background:var(--button-bg,#ff4d4d);
                color:white;
                padding:10px 20px;
                text-decoration:none;
                border-radius:5px;
                margin-top:10px;
            ">← Retour à la liste</a>
        </div>
    `;
}

// 📌 Initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initialisation du module favoris");
    setTimeout(() => {
        if (window.Cookies) {
            window.initFavorites();
        } else {
            setTimeout(() => {
                if (window.Cookies) {
                    window.initFavorites();
                } else {
                    console.error("❌ Module Cookies toujours indisponible");
                }
            }, 500);
        }
    }, 100);
});
