window.KID = window.KID || {};

window.KID.Actions = {
  validateState(state) {
    return Boolean(
      state &&
      Array.isArray(state.stock) &&
      Array.isArray(state.waste) &&
      Array.isArray(state.tableau) &&
      state.foundations
    );
  },

  refreshRender(state) {
    if (window.KID.Render?.draw) {
      window.KID.Engine.lastRender =
        window.KID.Render.draw(state);
    }

    return state;
  },

  drawFromStock(state) {
    if (!this.validateState(state)) {
      throw new Error("Cannot draw from an invalid game state.");
    }

    if (state.stock.length === 0) {
      return this.recycleWaste(state);
    }

    const card = state.stock.pop();

    state.waste.push({
      ...card,
      faceUp: true
    });

    return this.refreshRender(state);
  },

  recycleWaste(state) {
    if (!this.validateState(state)) {
      throw new Error("Cannot recycle an invalid game state.");
    }

    if (
      state.stock.length > 0 ||
      state.waste.length === 0
    ) {
      return this.refreshRender(state);
    }

    state.stock = state.waste
      .reverse()
      .map((card) => ({
        ...card,
        faceUp: false
      }));

    state.waste = [];

    return this.refreshRender(state);
  },

  getWasteTop(state) {
    if (
      !this.validateState(state) ||
      state.waste.length === 0
    ) {
      return null;
    }

    return state.waste[state.waste.length - 1];
  },

  moveWasteToFoundation(state) {
    if (!this.validateState(state)) {
      throw new Error("Cannot move from an invalid game state.");
    }

    const card = this.getWasteTop(state);

    if (!card) {
      return false;
    }

    const foundation = state.foundations[card.suit];

    if (
      !window.KID.Moves.canMoveToFoundation(
        card,
        foundation
      )
    ) {
      return false;
    }

    foundation.push(state.waste.pop());
    this.refreshRender(state);

    return true;
  }
};

console.log("Actions module loaded.");