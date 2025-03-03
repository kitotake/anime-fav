document.addEventListener("DOMContentLoaded", function () {
    const carouselContent = document.querySelector(".swiper-wrapper");

    if (!carouselContent) {
        console.error("❌ Erreur: 'swiper-wrapper' est introuvable !");
        return;
    }

    function fetchPopularAnimes() {
        fetch("https://api.jikan.moe/v4/top/anime")
            .then(response => response.json())
            .then(data => {
                data.data.slice(0, 5).forEach(anime => {
                    const animeSlide = document.createElement("div");
                    animeSlide.classList.add("swiper-slide");
                    animeSlide.innerHTML = `
                        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                        <h3>${anime.title}</h3>
                    `;
                    carouselContent.appendChild(animeSlide);
                });

                // Initialiser Swiper après le chargement des éléments
                setTimeout(() => {
                    var swiper = new Swiper(".swiper-container", {
                        slidesPerView: 3, // Nombre d'images visibles
                        spaceBetween: 10, // Espace entre les images
                        loop: true, // Défilement en boucle
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true,
                        },
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },
                    });
                }, 100);
            })
            .catch(error => console.error("❌ Erreur lors de la récupération des animes populaires :", error));
    }

    fetchPopularAnimes();
});
