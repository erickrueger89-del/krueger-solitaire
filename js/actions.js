window.KID = window.KID || {};

window.KID.Actions = {
  validateState(state) {
    return Boolean(
      state &&
      Array.isArray(state.stock) &&
      Array.isArray(state.waste) &&
      Array.isArray(state.tableau) &&
      state.tableau.length === 7 &&
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

  getTableauColumn(state, columnIndex) {
    if (
      !this.validateState(state) ||
      !Number.isInteger(columnIndex) ||
      columnIndex < 0 ||
      columnIndex >= state.tableau.length
    ) {
      return null;
    }

    return state.tableau[columnIndex];
  },

  flipExposedCard(state, columnIndex) {
    const column =
      this.getTableauColumn(state, columnIndex);

    if (!column || column.length === 0) {
      return false;
    }

    const topCard =
      column[column.length - 1];

    if (topCard.faceUp) {
      return false;
    }

    topCard.faceUp = true;
    this.refreshRender(state);

    return true;
  },

  drawFromStock(state) {
    if (!this.validateState(state)) {
      throw new Error(
        "Cannot draw from an invalid game state."
      );
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
      throw new Error(
        "Cannot recycle an invalid game state."
      );
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

    return state.waste[
      state.waste.length - 1
    ];
  },

  moveWasteToFoundation(state) {
    if (!this.validateState(state)) {
      throw new Error(
        "Cannot move from an invalid game state."
      );
    }

    const card = this.getWasteTop(state);

    if (!card) {
      return false;
    }

    const foundation =
      state.foundations[card.suit];

    if (
      !window.KID.Moves
        .canMoveToFoundation(
          card,
          foundation
        )
    ) {
      return false;
    }

    foundation.push(
      state.waste.pop()
    );

    this.refreshRender(state);

    return true;
  },

  moveWasteToTableau(
    state,
    destinationColumnIndex
  ) {
    if (!this.validateState(state)) {
      throw new Error(
        "Cannot move from an invalid game state."
      );
    }

    const card = this.getWasteTop(state);
    const destinationColumn =
      this.getTableauColumn(
        state,
        destinationColumnIndex
      );

    if (!card || !destinationColumn) {
      return false;
    }

    const destinationTopCard =
      destinationColumn.length > 0
        ? destinationColumn[
            destinationColumn.length - 1
          ]
        : null;

    if (
      !window.KID.Moves
        .canMoveToTableau(
          card,
          destinationTopCard
        )
    ) {
      return false;
    }

    destinationColumn.push(
      state.waste.pop()
    );

    this.refreshRender(state);

    return true;
  },

  moveTableauToFoundation(
    state,
    sourceColumnIndex
  ) {
    if (!this.validateState(state)) {
      throw new Error(
        "Cannot move from an invalid game state."
      );
    }

    const sourceColumn =
      this.getTableauColumn(
        state,
        sourceColumnIndex
      );

    if (
      !sourceColumn ||
      sourceColumn.length === 0
    ) {
      return false;
    }

    const card =
      sourceColumn[
        sourceColumn.length - 1
      ];

    if (!card.faceUp) {
      return false;
    }

    const foundation =
      state.foundations[card.suit];

    if (
      !window.KID.Moves
        .canMoveToFoundation(
          card,
          foundation
        )
    ) {
      return false;
    }

    foundation.push(
      sourceColumn.pop()
    );

    this.flipExposedCard(
      state,
      sourceColumnIndex
    );

    this.refreshRender(state);

    return true;
  },

  moveTableauStack(
    state,
    sourceColumnIndex,
    sourceCardIndex,
    destinationColumnIndex
  ) {
    if (!this.validateState(state)) {
      throw new Error(
        "Cannot move from an invalid game state."
      );
    }

    if (
      sourceColumnIndex ===
      destinationColumnIndex
    ) {
      return false;
    }

    const sourceColumn =
      this.getTableauColumn(
        state,
        sourceColumnIndex
      );

    const destinationColumn =
      this.getTableauColumn(
        state,
        destinationColumnIndex
      );

    if (
      !sourceColumn ||
      !destinationColumn ||
      !Number.isInteger(sourceCardIndex) ||
      sourceCardIndex < 0 ||
      sourceCardIndex >=
        sourceColumn.length
    ) {
      return false;
    }

    const movingCards =
      sourceColumn.slice(
        sourceCardIndex
      );

    const destinationTopCard =
      destinationColumn.length > 0
        ? destinationColumn[
            destinationColumn.length - 1
          ]
        : null;

    const validMove =
      window.KID.Moves.validateMove({
        cards: movingCards,
        destinationType: "tableau",
        destinationCards:
          destinationColumn
      });

    if (!validMove) {
      return false;
    }

    sourceColumn.splice(
      sourceCardIndex
    );

    destinationColumn.push(
      ...movingCards
    );

    this.flipExposedCard(
      state,
      sourceColumnIndex
    );

    this.refreshRender(state);

    return true;
  },

  isWin(state) {
    if (!this.validateState(state)) {
      return false;
    }

    return Object.values(
      state.foundations
    ).every(
      (foundation) =>
        Array.isArray(foundation) &&
        foundation.length === 13
    );
  }
};

console.log(
  "Expanded Actions module loaded."
);