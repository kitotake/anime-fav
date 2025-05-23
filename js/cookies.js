// cookies.js
(function () {
    "use strict";

    window.Cookies = {
        get(name) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(c => c.startsWith(`${name}=`));

            if (cookie) {
                try {
                    return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                } catch (error) {
                    console.error(`❌ Erreur d'analyse JSON du cookie "${name}" : ${error.message}`);
                    return null;
                }
            }
            return null;
        },

        set(name, value, options = {}) {
            const defaultOptions = {
                days: 365,
                path: "/",
                domain: null,
                secure: window.location.protocol === "https:",
                sameSite: "Lax"
            };
            const opts = { ...defaultOptions, ...options };

            const expiresDate = new Date(Date.now() + opts.days * 864e5); // 864e5 = 24*60*60*1000
            let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}`;
            cookie += `; expires=${expiresDate.toUTCString()}`;
            cookie += `; path=${opts.path}`;
            cookie += `; sameSite=${opts.sameSite}`;

            if (opts.domain) cookie += `; domain=${opts.domain}`;
            if (opts.secure) cookie += `; secure`;

            document.cookie = cookie;
        },

        delete(name, options = {}) {
            this.set(name, "", { ...options, days: -1 });
        }
    };
})();
