window.KID = window.KID || {};

window.KID.version = "0.5.0";

window.KID.App = {
  diagnostics: null,
  ready: false,

  initializeHistory() {
    const state =
      window.KID.Engine?.state;

    if (
      state &&
      window.KID.Deal
        .validateState(state)
    ) {
      window.KID.History
        .reset(state);

      return true;
    }

    return false;
  },

  prepareAction() {
    const state =
      window.KID.Engine.state;

    return window.KID.History
      .checkpoint(state);
  },

  finishAction(result) {
    if (
      result === false ||
      result === null
    ) {
      window.KID.History
        .discardCheckpoint();

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

  runAction(action) {
    if (typeof action !== "function") {
      return false;
    }

    this.prepareAction();

    try {
      const result = action();

      return this.finishAction(
        result
      );
    } catch (error) {
      window.KID.History
        .discardCheckpoint();

      console.error(
        "KID action failed:",
        error
      );

      return false;
    }
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

        history:
          typeof window.KID.History
            ?.checkpoint ===
            "function" &&
          typeof window.KID.History
            ?.undo ===
            "function" &&
          typeof window.KID.History
            ?.redo ===
            "function",

        engine:
          typeof window.KID.Engine
            ?.start ===
            "function" &&
          typeof window.KID.Engine
            ?.newGame ===
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

      history:
        window.KID.History
          ?.getStatus() || null
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
        ? "KID v0.5.0 system ready."
        : "KID system check failed.",
      this.diagnostics
    );

    return this.ready;
  },

  startNewGame() {
    const state =
      window.KID.Engine
        .newGame();

    window.KID.History
      .reset(state);

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

    window.KID.History
      .reset(state);

    this.runDiagnostics();

    return state;
  },

  drawStock() {
    return this.runAction(
      () => {
        const state =
          window.KID.Engine.state;

        const stockBefore =
          state.stock.length;

        const wasteBefore =
          state.waste.length;

        window.KID.Actions
          .drawFromStock(state);

        return (
          state.stock.length !==
            stockBefore ||
          state.waste.length !==
            wasteBefore
        );
      }
    );
  },

  moveWasteToFoundation() {
    return this.runAction(
      () =>
        window.KID.Actions
          .moveWasteToFoundation(
            window.KID.Engine
              .state
          )
    );
  },

  moveWasteToTableau(
    destinationColumnIndex
  ) {
    return this.runAction(
      () =>
        window.KID.Actions
          .moveWasteToTableau(
            window.KID.Engine
              .state,
            destinationColumnIndex
          )
    );
  },

  moveTableauToFoundation(
    sourceColumnIndex
  ) {
    return this.runAction(
      () =>
        window.KID.Actions
          .moveTableauToFoundation(
            window.KID.Engine
              .state,
            sourceColumnIndex
          )
    );
  },

  moveTableauStack(
    sourceColumnIndex,
    sourceCardIndex,
    destinationColumnIndex
  ) {
    return this.runAction(
      () =>
        window.KID.Actions
          .moveTableauStack(
            window.KID.Engine
              .state,
            sourceColumnIndex,
            sourceCardIndex,
            destinationColumnIndex
          )
    );
  },

  undo() {
    const previousState =
      window.KID.History
        .undo(
          window.KID.Engine
            .state
        );

    if (!previousState) {
      return false;
    }

    window.KID.Engine
      .replaceState(
        previousState
      );

    console.log(
      "KID move undone."
    );

    return true;
  },

  redo() {
    const restoredState =
      window.KID.History
        .redo(
          window.KID.Engine
            .state
        );

    if (!restoredState) {
      return false;
    }

    window.KID.Engine
      .replaceState(
        restoredState
      );

    console.log(
      "KID move restored."
    );

    return true;
  },

  getHistoryStatus() {
    return window.KID.History
      .getStatus();
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
  .initializeHistory();

window.KID.App
  .runDiagnostics();