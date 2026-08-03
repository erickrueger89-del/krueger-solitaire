window.KID = window.KID || {};

window.KID.Shuffle = {
  shuffle(deck) {
    if (!window.KID.Cards.validateDeck(deck)) {
      throw new Error("Cannot shuffle an invalid deck.");
    }

    const cards = [...deck];

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    if (!window.KID.Cards.validateDeck(cards)) {
      throw new Error("Shuffled deck validation failed.");
    }

    return cards;
  }
};