window.KID = window.KID || {};

window.KID.Moves = {
  rankValues: {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13
  },

  getRankValue(card) {
    if (!card || !this.rankValues[card.rank]) {
      return null;
    }

    return this.rankValues[card.rank];
  },

  isRed(card) {
    return card?.color === "red";
  },

  isBlack(card) {
    return card?.color === "black";
  },

  areOppositeColors(firstCard, secondCard) {
    if (!firstCard || !secondCard) {
      return false;
    }

    return (
      (this.isRed(firstCard) && this.isBlack(secondCard)) ||
      (this.isBlack(firstCard) && this.isRed(secondCard))
    );
  },

  canMoveToTableau(card, destinationTopCard = null) {
    if (!card || card.faceUp === false) {
      return false;
    }

    const cardRank = this.getRankValue(card);

    if (cardRank === null) {
      return false;
    }

    if (!destinationTopCard) {
      return cardRank === 13;
    }

    if (destinationTopCard.faceUp === false) {
      return false;
    }

    const destinationRank = this.getRankValue(destinationTopCard);

    return (
      destinationRank === cardRank + 1 &&
      this.areOppositeColors(card, destinationTopCard)
    );
  },

  canMoveToFoundation(card, foundation = []) {
    if (!card || card.faceUp === false || !Array.isArray(foundation)) {
      return false;
    }

    const cardRank = this.getRankValue(card);

    if (cardRank === null) {
      return false;
    }

    if (foundation.length === 0) {
      return cardRank === 1;
    }

    const foundationTopCard =
      foundation[foundation.length - 1];

    const foundationRank =
      this.getRankValue(foundationTopCard);

    return (
      foundationTopCard.suit === card.suit &&
      cardRank === foundationRank + 1
    );
  },

  isValidTableauSequence(cards) {
    if (!Array.isArray(cards) || cards.length === 0) {
      return false;
    }

    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];

      if (!card || card.faceUp === false) {
        return false;
      }

      if (index === cards.length - 1) {
        continue;
      }

      const currentCard = cards[index];
      const nextCard = cards[index + 1];

      const currentRank = this.getRankValue(currentCard);
      const nextRank = this.getRankValue(nextCard);

      if (
        currentRank !== nextRank + 1 ||
        !this.areOppositeColors(currentCard, nextCard)
      ) {
        return false;
      }
    }

    return true;
  },

  validateMove({
    cards,
    destinationType,
    destinationCards = []
  }) {
    if (!Array.isArray(cards) || cards.length === 0) {
      return false;
    }

    if (destinationType === "tableau") {
      if (!this.isValidTableauSequence(cards)) {
        return false;
      }

      const movingCard = cards[0];
      const destinationTopCard =
        destinationCards.length > 0
          ? destinationCards[destinationCards.length - 1]
          : null;

      return this.canMoveToTableau(
        movingCard,
        destinationTopCard
      );
    }

    if (destinationType === "foundation") {
      if (cards.length !== 1) {
        return false;
      }

      return this.canMoveToFoundation(
        cards[0],
        destinationCards
      );
    }

    return false;
  }
};

console.log("Moves module loaded.");