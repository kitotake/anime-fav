document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Vérifier si un thème est déjà stocké
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
            document.body.classList.add("dark-mode");
            darkModeToggle.textContent = "☀️ Mode Clair";
        }
    }

    // Gestion du Mode Sombre
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggle.textContent = "☀️ Mode Clair";
            localStorage.setItem("theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            darkModeToggle.textContent = "🌙 Mode Sombre";
            localStorage.setItem("theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
        }
    });
});

 