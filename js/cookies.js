(function () {
    "use strict";

    window.Cookies = {
        get: function (name) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

            if (cookie) {
                try {
                    return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                } catch (error) {
                    console.error(`Erreur lors de l'analyse du cookie JSON : ${error.message}`)
                    return null;
                }
            }
            return null;
        },

        set: function (name, value, options = {}) {
            const defaultOptions = {
                days: 365,
                path: "/",
                domain: null,
                secure: false,
                sameSite: "lax"
            };
            const mergedOptions = { ...defaultOptions, ...options };
            const expires = new Date(Date.now() + mergedOptions.days * 24 * 60 * 60 * 1000);
            let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=${mergedOptions.path}; sameSite=${mergedOptions.sameSite}`;

            if (mergedOptions.domain)
                cookieString += `; domain=${mergedOptions.domain}`;
            if (mergedOptions.secure)
                cookieString += '; secure';

            document.cookie = cookieString;
        },

        delete: function (name, options = { path: "/" }) {
            this.set(name, "", { ...options, days: -1 });
        }
    };
})();
