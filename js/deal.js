window.KID = window.KID || {};

window.KID.Deal = {

    create(deck) {

        if (!window.KID.Cards.validateDeck(deck)) {
            throw new Error("Cannot deal an invalid deck.");
        }

        const cards = [...deck];
        const tableau = Array.from({ length: 7 }, () => []);

        for (let column = 0; column < 7; column++) {
            for (let row = 0; row <= column; row++) {

                const card = cards.shift();

                tableau[column].push({
                    ...card,
                    faceUp: row === column
                });
            }
        }

        const state = {
            tableau,
            stock: cards,
            waste: [],
            foundations: {
                "♠": [],
                "♥": [],
                "♦": [],
                "♣": []
            }
        };

        if (!this.validateState(state)) {
            throw new Error("Klondike deal validation failed.");
        }

        return state;
    },

    validateState(state) {

        if (!state || !Array.isArray(state.tableau)) {
            return false;
        }

        const tableauCardCount = state.tableau.reduce(
            (total, column) => total + column.length,
            0
        );

        return (
            state.tableau.length === 7 &&
            tableauCardCount === 28 &&
            Array.isArray(state.stock) &&
            state.stock.length === 24 &&
            Array.isArray(state.waste) &&
            state.foundations &&
            Object.keys(state.foundations).length === 4
        );
    }

};

console.log("Deal module loaded.");