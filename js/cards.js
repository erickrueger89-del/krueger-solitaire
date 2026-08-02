window.KID = window.KID || {};

window.KID.Cards = {
  suits: ["S", "H", "D", "C"],

  ranks: [
    "A", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "J", "Q", "K"
  ],

  createDeck() {
    const deck = [];

    this.suits.forEach((suit) => {
      this.ranks.forEach((rank) => {
        deck.push({
          suit,
          rank
        });
      });
    });

    return deck;
  }
};

console.log(
  "Cards module loaded:",
  window.KID.Cards.createDeck().length,
  "cards"
);