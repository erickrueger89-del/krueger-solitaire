window.KID = window.KID || {};

window.KID.Cards = {
    suits: ["♠", "♥", "♦", "♣"],
    ranks: [
        "A","2","3","4","5","6","7",
        "8","9","10","J","Q","K"
    ],

    createDeck() {
        const deck = [];

        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
                deck.push({
                    suit,
                    rank,
                    color:
                        (suit === "♥" || suit === "♦")
                            ? "red"
                            : "black"
                });
            });
        });

        return deck;
    }
};

console.log(
    "Cards loaded:",
    window.KID.Cards.createDeck().length
);