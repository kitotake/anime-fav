console.log("Cookies.js chargé !");

window.getCookie = function (name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];
};

window.setCookie = function (name, value, days) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 500);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/`;
};
