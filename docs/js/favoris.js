// 📜 Gestion des favoris - VERSION CORRIGÉE

// Variables globales pour les favoris
window.favorites = new Set();

// 📌 Initialisation des favoris
window.initFavorites = function() {
    try {
        const storedFavorites = window.Cookies ? window.Cookies.get("favorites") : null;
        
        let favoritesArray = [];
        
        if (storedFavorites) {
            // S'assurer que c'est un tableau
            if (Array.isArray(storedFavorites)) {
                favoritesArray = storedFavorites;
            } else if (typeof storedFavorites === 'string') {
                try {
                    favoritesArray = JSON.parse(storedFavorites);
                } catch (e) {
                    console.warn("⚠️ Impossible de parser les favoris stockés");
                    favoritesArray = [];
                }
            }
        }

        // Convertir en Set avec des strings pour la cohérence
        window.favorites = new Set(favoritesArray.map(String));
        
        console.log("✅ Favoris initialisés :", window.favorites.size, "éléments");
        
        // Mettre à jour l'affichage
        updateFavoritesCount();
        
        // Si on est sur la page favoris, charger les favoris
        const animeFavori = document.getElementById("animeFavori");
        if (animeFavori) {
            loadAndDisplayFavorites();
        }
        
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des favoris :", error);
        window.favorites = new Set();
    }
};

// 📌 Sauvegarder les favoris
window.saveFavorites = function() {
    try {
        if (window.Cookies) {
            const favoritesArray = Array.from(window.favorites);
            window.Cookies.set("favorites", favoritesArray, { days: 365 });
            console.log("✅ Favoris sauvegardés :", favoritesArray.length, "éléments");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
};

// 📌 Toggle favori
window.toggleFavorite = function(animeId, buttonElement) {
    try {
        animeId = String(animeId);
        
        if (window.favorites.has(animeId)) {
            // Retirer des favoris
            window.favorites.delete(animeId);
            buttonElement.src = "../docs/assets/img/heart-filled.svg";
            buttonElement.title = "Ajouter aux favoris";
            console.log("➖ Retiré des favoris :", animeId);
        } else {
            // Ajouter aux favoris
            window.favorites.add(animeId);
            buttonElement.src = "../docs/assets/img/check.svg";
            buttonElement.title = "Retirer des favoris";
            console.log("➕ Ajouté aux favoris :", animeId);
        }
        
        saveFavorites();
        updateFavoritesCount();
        
        // Si on est sur la page favoris, actualiser l'affichage
        const animeFavori = document.getElementById("animeFavori");
        if (animeFavori) {
            loadAndDisplayFavorites();
        }
        
        // Si showFavoritesOnly est activé (page favoris), rafraîchir la liste
        if (window.showFavoritesOnly && window.displayAnimes) {
            window.displayAnimes();
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du toggle favori :", error);
    }
};

// 📌 Mettre à jour le compteur de favoris
window.updateFavoritesCount = function() {
    try {
        const count = window.favorites.size;
        const favoritesCounter = document.getElementById("favoritesCount");
        
        if (favoritesCounter) {
            favoritesCounter.textContent = `Total Favoris : ${count}`;
        }
        
        console.log("📊 Compteur mis à jour :", count, "favoris");
    } catch (error) {
        console.error("❌ Erreur mise à jour compteur :", error);
    }
};

// 📌 Charger et afficher les favoris sur la page favoris
window.loadAndDisplayFavorites = async function() {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) return;

    try {
        if (window.favorites.size === 0) {
            displayNoFavorites();
            return;
        }

        // Affichage d'un message de chargement
        animeFavori.innerHTML = `<p style="text-align: center; margin: 50px;">Chargement des favoris...</p>`;

        const favoriteAnimes = [];
        const favoriteIds = Array.from(window.favorites);

        // Charger les détails de chaque anime favori
        for (const animeId of favoriteIds) {
            try {
                const response = await fetch(`${window.BASE_URL}/tv/${animeId}?api_key=${window.API_KEY}&language=fr-FR`);
                
                if (response.ok) {
                    const animeDetails = await response.json();
                    favoriteAnimes.push(animeDetails);
                }
            } catch (error) {
                console.warn(`⚠️ Impossible de charger l'anime ${animeId}:`, error);
            }
        }

        if (favoriteAnimes.length === 0) {
            displayNoFavorites();
            return;
        }

        // Afficher les favoris
        displayFavoriteAnimes(favoriteAnimes);

    } catch (error) {
        console.error("❌ Erreur lors du chargement des favoris :", error);
        animeFavori.innerHTML = `<p style="text-align: center; margin: 50px; color: red;">Erreur lors du chargement des favoris.</p>`;
    }
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
                    <img src="${poster_path ? window.IMAGE_BASE_URL + poster_path : '../assets/img/placeholder.svg'}" 
                         alt="${name}" loading="lazy">
                </div>
                <div class="card-buttons">
                    <img class="favorite-icon" 
                         src="../docs/assets/img/check.svg"
                         data-id="${id}" 
                         title="Retirer des favoris">
                    <img class="info-icon" 
                         src="../docs/assets/img/info.svg"
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

    // Ajouter les événements
    animeFavori.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            window.toggleFavorite(event.target.dataset.id, event.target);
        });
    });

    animeFavori.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            if (window.openModal) {
                window.openModal(event.target.dataset.id);
            }
        });
    });
}

// 📌 Afficher le message quand aucun favori
function displayNoFavorites() {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) return;

    animeFavori.innerHTML = `
        <div style="text-align: center; margin: 50px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">📺</div>
            <h3>Aucun anime en favori</h3>
            <p style="margin: 20px 0; opacity: 0.8;">
                Retournez à la liste principale pour ajouter des animes à vos favoris !
            </p>
            <a href="index.html" style="
                display: inline-block;
                background: var(--button-bg, #ff4d4d);
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
            ">← Retour à la liste</a>
        </div>
    `;
}

// 📌 Initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initialisation du module favoris");
    
    // Attendre que les autres modules soient chargés
    setTimeout(() => {
        if (window.Cookies) {
            window.initFavorites();
        } else {
            console.warn("⚠️ Module Cookies non disponible, réessai dans 500ms");
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