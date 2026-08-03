window.KID = window.KID || {};

window.KID.Deal = {
  create(deck) {
    if (!window.KID.Cards.validateDeck(deck)) {
      throw new Error("Cannot deal an invalid deck.");
    }

    const cards = deck.map((card) => ({
      ...card,
      faceUp: false
    }));

    const tableau = Array.from(
      { length: 7 },
      () => []
    );

    for (
      let columnIndex = 0;
      columnIndex < 7;
      columnIndex++
    ) {
      for (
        let rowIndex = 0;
        rowIndex <= columnIndex;
        rowIndex++
      ) {
        const card = cards.shift();

        tableau[columnIndex].push({
          ...card,
          faceUp:
            rowIndex === columnIndex
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
      },

      moves: 0,
      startedAt:
        new Date().toISOString()
    };

    if (!this.validateState(state)) {
      throw new Error(
        "Klondike deal validation failed."
      );
    }

    return state;
  },

  countCards(state) {
    if (!state) {
      return 0;
    }

    const tableauCount =
      Array.isArray(state.tableau)
        ? state.tableau.reduce(
            (total, column) =>
              total +
              (
                Array.isArray(column)
                  ? column.length
                  : 0
              ),
            0
          )
        : 0;

    const stockCount =
      Array.isArray(state.stock)
        ? state.stock.length
        : 0;

    const wasteCount =
      Array.isArray(state.waste)
        ? state.waste.length
        : 0;

    const foundationCount =
      state.foundations &&
      typeof state.foundations ===
        "object"
        ? Object.values(
            state.foundations
          ).reduce(
            (total, foundation) =>
              total +
              (
                Array.isArray(
                  foundation
                )
                  ? foundation.length
                  : 0
              ),
            0
          )
        : 0;

    return (
      tableauCount +
      stockCount +
      wasteCount +
      foundationCount
    );
  },

  validateCard(card) {
    if (
      !card ||
      typeof card !== "object"
    ) {
      return false;
    }

    const validSuit =
      window.KID.Cards.suits.includes(
        card.suit
      );

    const validRank =
      window.KID.Cards.ranks.includes(
        card.rank
      );

    const validColor =
      card.color === "red" ||
      card.color === "black";

    const expectedColor =
      card.suit === "♥" ||
      card.suit === "♦"
        ? "red"
        : "black";

    return (
      validSuit &&
      validRank &&
      validColor &&
      card.color === expectedColor &&
      typeof card.faceUp ===
        "boolean"
    );
  },

  getAllCards(state) {
    if (!state) {
      return [];
    }

    const tableauCards =
      Array.isArray(state.tableau)
        ? state.tableau.flat()
        : [];

    const stockCards =
      Array.isArray(state.stock)
        ? state.stock
        : [];

    const wasteCards =
      Array.isArray(state.waste)
        ? state.waste
        : [];

    const foundationCards =
      state.foundations
        ? Object.values(
            state.foundations
          ).flat()
        : [];

    return [
      ...tableauCards,
      ...stockCards,
      ...wasteCards,
      ...foundationCards
    ];
  },

  hasUniqueCards(state) {
    const allCards =
      this.getAllCards(state);

    if (allCards.length !== 52) {
      return false;
    }

    const identities =
      new Set(
        allCards.map(
          (card) =>
            `${card.rank}-${card.suit}`
        )
      );

    return identities.size === 52;
  },

  validateFoundations(
    foundations
  ) {
    if (
      !foundations ||
      typeof foundations !==
        "object"
    ) {
      return false;
    }

    const requiredSuits = [
      "♠",
      "♥",
      "♦",
      "♣"
    ];

    return requiredSuits.every(
      (suit) =>
        Array.isArray(
          foundations[suit]
        )
    );
  },

  validateTableau(tableau) {
    return (
      Array.isArray(tableau) &&
      tableau.length === 7 &&
      tableau.every(
        (column) =>
          Array.isArray(column)
      )
    );
  },

  validateState(state) {
    if (
      !state ||
      typeof state !== "object"
    ) {
      return false;
    }

    if (
      !this.validateTableau(
        state.tableau
      )
    ) {
      return false;
    }

    if (
      !Array.isArray(
        state.stock
      ) ||
      !Array.isArray(
        state.waste
      ) ||
      !this.validateFoundations(
        state.foundations
      )
    ) {
      return false;
    }

    if (
      this.countCards(state) !== 52
    ) {
      return false;
    }

    const allCards =
      this.getAllCards(state);

    if (
      !allCards.every(
        (card) =>
          this.validateCard(card)
      )
    ) {
      return false;
    }

    if (
      !this.hasUniqueCards(state)
    ) {
      return false;
    }

    return true;
  },

  validateInitialDeal(state) {
    if (
      !this.validateState(state)
    ) {
      return false;
    }

    const tableauCount =
      state.tableau.reduce(
        (total, column) =>
          total + column.length,
        0
      );

    const correctColumnSizes =
      state.tableau.every(
        (column, index) =>
          column.length ===
          index + 1
      );

    const correctFaceUpCards =
      state.tableau.every(
        (column) =>
          column.every(
            (card, index) =>
              card.faceUp ===
              (
                index ===
                column.length - 1
              )
          )
      );

    return (
      tableauCount === 28 &&
      state.stock.length === 24 &&
      state.waste.length === 0 &&
      correctColumnSizes &&
      correctFaceUpCards
    );
  }
};

console.log(
  "Flexible Deal validator loaded."
);