window.KID = window.KID || {};

window.KID.Render = {
  lastSnapshot: null,

  validateState(state) {
    return Boolean(
      state &&
      Array.isArray(state.tableau) &&
      state.tableau.length === 7 &&
      Array.isArray(state.stock) &&
      Array.isArray(state.waste) &&
      state.foundations
    );
  },

  createSnapshot(state) {
    if (!this.validateState(state)) {
      throw new Error("Render failed: invalid game state.");
    }

    return {
      tableau: state.tableau.map((column) =>
        column.map((card) => ({
          suit: card.suit,
          rank: card.rank,
          color: card.color,
          faceUp: Boolean(card.faceUp)
        }))
      ),

      stockCount: state.stock.length,

      wasteTop:
        state.waste.length > 0
          ? state.waste[state.waste.length - 1]
          : null,

      foundationCounts: Object.fromEntries(
        Object.entries(state.foundations).map(
          ([suit, cards]) => [suit, cards.length]
        )
      )
    };
  },

  draw(state) {
    this.lastSnapshot = this.createSnapshot(state);

    console.log("KID render snapshot:", this.lastSnapshot);

    return this.lastSnapshot;
  }
};

console.log("Render module loaded.");