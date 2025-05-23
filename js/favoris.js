// 📜 Gestion des favoris - Version corrigée

// ✅ Initialisation des favoris
window.initFavorites = function () {
    try {
        // ✅ Récupération sécurisée des favoris depuis les cookies
        let storedFavorites = window.Cookies?.get("favorites");
        
        if (storedFavorites && Array.isArray(storedFavorites)) {
            window.favorites = new Set(storedFavorites.map(String));
        } else {
            window.favorites = new Set();
        }
        
        console.log("✅ Favoris initialisés:", window.favorites);
        
        // ✅ Mise à jour de l'affichage
        window.updateFavoritesCount();
        
        // ✅ Affichage des favoris si on est sur la page favoris
        if (document.getElementById("animeFavori")) {
            window.displayFavoriteAnimes();
        }
        
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des favoris:", error);
        window.favorites = new Set();
    }
};

// ✅ Sauvegarde des favoris
window.saveFavorites = function () {
    try {
        if (window.Cookies && window.favorites) {
            window.Cookies.set("favorites", Array.from(window.favorites), { days: 30 });
            console.log("✅ Favoris sauvegardés:", Array.from(window.favorites));
        }
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde des favoris:", error);
    }
};

// ✅ Basculer un favori
window.toggleFavorite = function (animeId, buttonElement) {
    if (!animeId || !buttonElement) return;
    
    animeId = String(animeId);
    
    // ✅ S'assurer que favorites existe
    if (!window.favorites) {
        window.favorites = new Set();
    }
    
    if (window.favorites.has(animeId)) {
        window.favorites.delete(animeId);
        buttonElement.src = "../assets/img/heart-filled.svg";
        buttonElement.title = "Ajouter aux favoris";
        console.log("❌ Favori retiré:", animeId);
    } else {
        window.favorites.add(animeId);
        buttonElement.src = "../assets/img/check.svg";
        buttonElement.title = "Retirer des favoris";
        console.log("✅ Favori ajouté:", animeId);
    }
    
    // ✅ Sauvegarde et mise à jour
    window.saveFavorites();
    window.updateFavoritesCount();
    
    // ✅ Mise à jour de l'affichage selon la page
    if (document.getElementById("animeFavori")) {
        // Page favoris
        window.displayFavoriteAnimes();
    } else if (window.showFavoritesOnly) {
        // Mode favoris sur la page principale
        window.displayAnimes();
    }
};

// ✅ Mise à jour du compteur de favoris
window.updateFavoritesCount = function () {
    if (!window.favorites) {
        window.favorites = new Set();
    }
    
    const count = window.favorites.size;
    const favoritesCounter = document.getElementById("favoritesCount");
    
    if (favoritesCounter) {
        favoritesCounter.textContent = `Total Favoris : ${count}`;
    }
    
    console.log("📊 Nombre de favoris:", count);
};

// ✅ Affichage des animes favoris (pour la page favoris)
window.displayFavoriteAnimes = function () {
    const animeFavori = document.getElementById("animeFavori");
    if (!animeFavori) {
        console.warn("⚠️ Élément 'animeFavori' introuvable (normal si pas sur la page favoris)");
        return;
    }

    animeFavori.innerHTML = "";
    
    // ✅ S'assurer que les données existent
    if (!window.allAnimes || !Array.isArray(window.allAnimes)) {
        animeFavori.innerHTML = `<p class="info-message">⏳ Chargement des animes...</p>`;
        return;
    }
    
    if (!window.favorites) {
        window.favorites = new Set();
    }

    let favoriteAnimes = window.allAnimes.filter(anime => 
        window.favorites.has(String(anime.id))
    );
    
    if (favoriteAnimes.length === 0) {
        animeFavori.innerHTML = `<p class="info-message">⭐ Aucun favori enregistré.</p>`;
        return;
    }

    // ✅ Création des cartes d'animes favoris
    favoriteAnimes.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
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
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        `;
        animeFavori.appendChild(animeCard);
    });

    // ✅ Ajout des événements sur les boutons
    document.querySelectorAll("#animeFavori .favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.toggleFavorite(event.target.dataset.id, event.target);
        });
    });
    
    document.querySelectorAll("#animeFavori .info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (window.openModal) {
                window.openModal(event.target.dataset.id);
            }
        });
    });
    
    console.log("✅ Favoris affichés:", favoriteAnimes.length);
};

// ✅ Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initialisation des favoris...");
    window.initFavorites();
    
    // ✅ Si on est sur la page favoris, activer le mode favoris
    if (document.getElementById("animeFavori")) {
        window.showFavoritesOnly = true;
        console.log("📱 Page favoris détectée");
    }
});