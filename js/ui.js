window.svgIcons = {};

// 🔄 Chargement asynchrone des icônes SVG
window.loadSVGs = async function () {
    const iconNames = ['cancel', 'check', 'heart-filled', 'info', 'placeholder'];
    const basePath = '../assets/img/';

    const fetches = iconNames.map(async (name) => {
        try {
            const res = await fetch(`${basePath}${name}.svg`);
            if (!res.ok) throw new Error(`❌ Erreur lors du chargement de ${name}.svg`);
            const svg = await res.text();
            window.svgIcons[name] = svg;
        } catch (error) {
            console.error(error.message);
        }
    });

    await Promise.all(fetches);
};

// 🛠 Initialisation de l'UI
window.initUI = function () {
    const animeList = document.getElementById("animeList");
    if (!animeList) {
        console.warn("⚠️ L'élément 'animeList' est introuvable (peut être normal sur certaines pages)");
    }
};

// 🎞 Affichage des animes (favoris ou tous selon le contexte)
window.displayAnimes = function () {
    const animeList = document.getElementById("animeList");
    if (!animeList) return;

    animeList.innerHTML = "";

    if (!window.allAnimes || !Array.isArray(window.allAnimes)) {
        animeList.innerHTML = `<p class="info-message">⏳ Chargement des données...</p>`;
        return;
    }

    const animesToDisplay = window.showFavoritesOnly
        ? window.allAnimes.filter(anime => window.favorites.has(String(anime.id)))
        : window.allAnimes;

    if (animesToDisplay.length === 0) {
        animeList.innerHTML = `<p class="info-message">${window.showFavoritesOnly ? "⭐ Aucun favori enregistré." : "🔍 Aucun résultat trouvé."}</p>`;
        return;
    }

    animesToDisplay.forEach(anime => {
        const { id, name, first_air_date, poster_path } = anime;
        const isFavorite = window.favorites.has(String(id));

        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");

        const posterHTML = poster_path
            ? `<img src="${window.IMAGE_BASE_URL + poster_path}" alt="${name}" onerror="this.src='../assets/img/placeholder.svg'">`
            : window.svgIcons['placeholder'];

        animeCard.innerHTML = `
            <div class="card-container">
                <div class="poster">${posterHTML}</div>
                <div class="card-buttons">
                    <div class="favorite-icon" data-id="${id}" title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                        ${isFavorite ? window.svgIcons['check'] : window.svgIcons['heart-filled']}
                    </div>
                    <div class="info-icon" data-id="${id}" title="Voir plus d'infos">
                        ${window.svgIcons['info']}
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="anime-title">${name}</h3>
                    <p class="anime-year"><strong>Année :</strong> ${first_air_date ? first_air_date.split("-")[0] : "Inconnue"}</p>
                </div>
            </div>
        `;

        animeList.appendChild(animeCard);
    });

    // ✅ Événements interactifs
    document.querySelectorAll(".favorite-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            const target = event.currentTarget;
            window.toggleFavorite(target.dataset.id, target);
        });
    });

    document.querySelectorAll(".info-icon").forEach(button => {
        button.addEventListener("click", (event) => {
            const target = event.currentTarget;
            if (window.openModal) window.openModal(target.dataset.id);
        });
    });

    console.log(`✅ ${animesToDisplay.length} animes affichés`);
};

// 🔁 Initialisation automatique après chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
    await window.loadSVGs(); // Charger les SVG avant tout
    window.initUI();
    if (window.allAnimes) window.displayAnimes(); // Ne pas afficher si les données ne sont pas prêtes
});
