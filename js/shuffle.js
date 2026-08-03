window.KID = window.KID || {};

window.KID.Shuffle = {
    shuffle(deck) {
        const cards = [...deck];

        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        return cards;
    }
};

const deck = window.KID.Cards.createDeck();
const shuffled = window.KID.Shuffle.shuffle(deck);

console.log(
    "Shuffled deck:",
    shuffled.length,
    "cards"
);