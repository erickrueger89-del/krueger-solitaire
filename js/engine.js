window.KID = window.KID || {};

window.KID.version = "0.3.1";

window.KID.Engine = {
    start() {
        console.log("KID Engine started.");
    },

    about() {
        return {
            name: "Krueger Solitaire",
            developer: "Krueger Interactive Developments",
            version: window.KID.version
        };
    }
};

window.KID.Engine.start();