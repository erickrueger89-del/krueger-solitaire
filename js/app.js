window.KID = window.KID || {};

window.KID.version = "0.4.3";

window.KID.App = {
  diagnostics: null,
  ready: false,

  saveAfterAction(result) {
    if (
      result === false ||
      result === null
    ) {
      return result;
    }

    window.KID.Engine
      .recordMove();

    window.KID.Engine
      .render();

    window.KID.Engine
      .save();

    return result;
  },

  runDiagnostics() {
    const state =
      window.KID.Engine?.state;

    const renderSnapshot =
      window.KID.Engine
        ?.lastRender;

    this.diagnostics = {
      version:
        window.KID.version,

      modules: {
        cards:
          typeof window.KID.Cards
            ?.createDeck ===
            "function" &&
          typeof window.KID.Cards
            ?.validateDeck ===
            "function",

        shuffle:
          typeof window.KID.Shuffle
            ?.shuffle ===
            "function",

        deal:
          typeof window.KID.Deal
            ?.create ===
            "function" &&
          typeof window.KID.Deal
            ?.validateState ===
            "function" &&
          typeof window.KID.Deal
            ?.validateInitialDeal ===
            "function",

        moves:
          typeof window.KID.Moves
            ?.validateMove ===
            "function",

        render:
          typeof window.KID.Render
            ?.draw ===
            "function",

        actions:
          typeof window.KID.Actions
            ?.drawFromStock ===
            "function" &&
          typeof window.KID.Actions
            ?.moveTableauStack ===
            "function",

        storage:
          typeof window.KID.Storage
            ?.saveGame ===
            "function" &&
          typeof window.KID.Storage
            ?.loadGame ===
            "function",

        engine:
          typeof window.KID.Engine
            ?.start ===
            "function" &&
          typeof window.KID.Engine
            ?.newGame ===
            "function" &&
          typeof window.KID.Engine
            ?.save ===
            "function"
      },

      state: {
        valid:
          window.KID.Deal
            ?.validateState(
              state
            ) === true,

        totalCards:
          window.KID.Deal
            ?.countCards(
              state
            ) ?? 0,

        tableauColumns:
          state?.tableau
            ?.length ?? 0,

        stockCards:
          state?.stock
            ?.length ?? 0,

        wasteCards:
          state?.waste
            ?.length ?? 0,

        moves:
          state?.moves ?? 0
      },

      render: {
        available:
          Boolean(
            renderSnapshot
          )
      },

      storage: {
        available:
          window.KID.Storage
            ?.isAvailable() ===
            true,

        hasSavedGame:
          window.KID.Storage
            ?.hasSavedGame() ===
            true
      },

      resumedFromSave:
        window.KID.Engine
          ?.resumedFromSave ===
          true
    };

    this.ready =
      Object.values(
        this.diagnostics.modules
      ).every(Boolean) &&
      this.diagnostics
        .state.valid &&
      this.diagnostics
        .state.totalCards === 52 &&
      this.diagnostics
        .state.tableauColumns === 7 &&
      this.diagnostics
        .render.available &&
      this.diagnostics
        .storage.available;

    console.log(
      this.ready
        ? "KID v0.4.3 system ready."
        : "KID system check failed.",
      this.diagnostics
    );

    return this.ready;
  },

  startNewGame() {
    const state =
      window.KID.Engine
        .newGame();

    this.runDiagnostics();

    return state;
  },

  continueGame() {
    const savedState =
      window.KID.Storage
        .loadGame();

    if (!savedState) {
      return this.startNewGame();
    }

    const state =
      window.KID.Engine
        .replaceState(
          savedState
        );

    this.runDiagnostics();

    return state;
  },

  drawStock() {
    const state =
      window.KID.Engine.state;

    const stockBefore =
      state.stock.length;

    const wasteBefore =
      state.waste.length;

    window.KID.Actions
      .drawFromStock(state);

    const changed =
      state.stock.length !==
        stockBefore ||
      state.waste.length !==
        wasteBefore;

    if (changed) {
      this.saveAfterAction(
        true
      );
    }

    return state;
  },

  moveWasteToFoundation() {
    const moved =
      window.KID.Actions
        .moveWasteToFoundation(
          window.KID.Engine
            .state
        );

    return this.saveAfterAction(
      moved
    );
  },

  moveWasteToTableau(
    destinationColumnIndex
  ) {
    const moved =
      window.KID.Actions
        .moveWasteToTableau(
          window.KID.Engine
            .state,
          destinationColumnIndex
        );

    return this.saveAfterAction(
      moved
    );
  },

  moveTableauToFoundation(
    sourceColumnIndex
  ) {
    const moved =
      window.KID.Actions
        .moveTableauToFoundation(
          window.KID.Engine
            .state,
          sourceColumnIndex
        );

    return this.saveAfterAction(
      moved
    );
  },

  moveTableauStack(
    sourceColumnIndex,
    sourceCardIndex,
    destinationColumnIndex
  ) {
    const moved =
      window.KID.Actions
        .moveTableauStack(
          window.KID.Engine
            .state,
          sourceColumnIndex,
          sourceCardIndex,
          destinationColumnIndex
        );

    return this.saveAfterAction(
      moved
    );
  },

  isWin() {
    return window.KID.Actions
      .isWin(
        window.KID.Engine
          .state
      );
  },

  reset() {
    return this.startNewGame();
  },

  clearSavedGame() {
    return window.KID.Engine
      .clearSavedGame();
  }
};

window.KID.App
  .runDiagnostics();