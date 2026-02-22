// darkmods.js
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (!darkModeToggle) return;

    const applyTheme = (theme) => {
        const isDark = theme === "dark";
        document.documentElement.setAttribute("data-theme", theme);
        document.body.classList.toggle("dark-mode", isDark);
        darkModeToggle.textContent = isDark ? "☀️ Mode Clair" : "🌙 Mode Sombre";
    };

    // Appliquer le thème au chargement
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Gestion du basculement
    darkModeToggle.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
});
