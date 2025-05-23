document.addEventListener("DOMContentLoaded", function () {
    const carouselContent = document.querySelector(".swiper-wrapper");

    if (!carouselContent) {
        console.error("❌ Erreur: '.swiper-wrapper' est introuvable !");
        return;
    }

    async function fetchPopularAnimes() {
        try {
            const response = await fetch("https://api.jikan.moe/v4/top/anime");
            const result = await response.json();
            const popularAnimes = result.data.slice(0, 5);

            // 🔄 Vider le contenu existant du carrousel
            carouselContent.innerHTML = "";

            popularAnimes.forEach(anime => {
                const animeSlide = document.createElement("div");
                animeSlide.classList.add("swiper-slide");
                animeSlide.innerHTML = `
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}" loading="lazy">
                    <h3>${anime.title}</h3>
                `;
                carouselContent.appendChild(animeSlide);
            });

            // 🌀 Initialiser Swiper uniquement après que les images soient bien insérées
            initSwiper();

        } catch (error) {
            console.error("❌ Erreur lors de la récupération des animes populaires :", error);
        }
    }

    function initSwiper() {
        new Swiper(".swiper-container", {
            slidesPerView: 3,
            spaceBetween: 16,
            loop: true,
            centeredSlides: true,
            grabCursor: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    fetchPopularAnimes();
});
