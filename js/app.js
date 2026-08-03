window.KID = window.KID || {};

window.KID.version = "0.4.0";

window.KID.App = {
  diagnostics: null,
  ruleTests: null,
  ready: false,

  runRuleTests() {
    const cards = {
      blackKing: {
        rank: "K",
        suit: "♠",
        color: "black",
        faceUp: true
      },

      redQueen: {
        rank: "Q",
        suit: "♥",
        color: "red",
        faceUp: true
      },

      blackJack: {
        rank: "J",
        suit: "♣",
        color: "black",
        faceUp: true
      },

      aceHearts: {
        rank: "A",
        suit: "♥",
        color: "red",
        faceUp: true
      },

      twoHearts: {
        rank: "2",
        suit: "♥",
        color: "red",
        faceUp: true
      },

      twoDiamonds: {
        rank: "2",
        suit: "♦",
        color: "red",
        faceUp: true
      },

      hiddenCard: {
        rank: "10",
        suit: "♠",
        color: "black",
        faceUp: false
      }
    };

    this.ruleTests = {
      kingToEmptyTableau:
        window.KID.Moves.canMoveToTableau(
          cards.blackKing,
          null
        ) === true,

      queenToKing:
        window.KID.Moves.canMoveToTableau(
          cards.redQueen,
          cards.blackKing
        ) === true,

      jackToQueen:
        window.KID.Moves.canMoveToTableau(
          cards.blackJack,
          cards.redQueen
        ) === true,

      aceToEmptyFoundation:
        window.KID.Moves.canMoveToFoundation(
          cards.aceHearts,
          []
        ) === true,

      twoToMatchingFoundation:
        window.KID.Moves.canMoveToFoundation(
          cards.twoHearts,
          [cards.aceHearts]
        ) === true,

      wrongSuitRejected:
        window.KID.Moves.canMoveToFoundation(
          cards.twoDiamonds,
          [cards.aceHearts]
        ) === false,

      hiddenCardRejected:
        window.KID.Moves.canMoveToTableau(
          cards.hiddenCard,
          cards.redQueen
        ) === false,

      validTableauSequence:
        window.KID.Moves.isValidTableauSequence([
          cards.blackKing,
          cards.redQueen,
          cards.blackJack
        ]) === true
    };

    return Object.values(this.ruleTests).every(Boolean);
  },

  runDiagnostics() {
    const state = window.KID.Engine?.state;
    const renderSnapshot = window.KID.Engine?.lastRender;
    const rulesValid = this.runRuleTests();

    this.diagnostics = {
      version: window.KID.version,

      modules: {
        cards:
          typeof window.KID.Cards?.createDeck === "function" &&
          typeof window.KID.Cards?.validateDeck === "function",

        shuffle:
          typeof window.KID.Shuffle?.shuffle === "function",

        deal:
          typeof window.KID.Deal?.create === "function" &&
          typeof window.KID.Deal?.validateState === "function",

        moves:
          typeof window.KID.Moves?.validateMove === "function" &&
          typeof window.KID.Moves?.canMoveToTableau === "function" &&
          typeof window.KID.Moves?.canMoveToFoundation === "function",

        render:
          typeof window.KID.Render?.draw === "function" &&
          typeof window.KID.Render?.createSnapshot === "function",

        engine:
          typeof window.KID.Engine?.start === "function" &&
          typeof window.KID.Engine?.newGame === "function"
      },

      state: {
        valid:
          window.KID.Deal?.validateState(state) === true,

        tableauColumns:
          state?.tableau?.length ?? 0,

        stockCards:
          state?.stock?.length ?? 0,

        wasteCards:
          state?.waste?.length ?? 0
      },

      render: {
        available:
          Boolean(renderSnapshot),

        stockCount:
          renderSnapshot?.stockCount ?? 0,

        foundationCount:
          Object.keys(
            renderSnapshot?.foundationCounts || {}
          ).length
      },

      rules: {
        valid: rulesValid,
        tests: this.ruleTests
      }
    };

    this.ready =
      Object.values(
        this.diagnostics.modules
      ).every(Boolean) &&
      this.diagnostics.state.valid &&
      this.diagnostics.state.tableauColumns === 7 &&
      this.diagnostics.state.stockCards === 24 &&
      this.diagnostics.render.available &&
      this.diagnostics.rules.valid;

    console.log(
      this.ready
        ? "KID v0.4.0 system ready."
        : "KID system check failed.",
      this.diagnostics
    );

    return this.ready;
  },

  startNewGame() {
    const state =
      window.KID.Engine.newGame();

    this.runDiagnostics();

    return state;
  },

  reset() {
    const state =
      this.startNewGame();

    console.log(
      "KID game reset complete.",
      {
        tableauColumns:
          state.tableau.length,

        stockCards:
          state.stock.length
      }
    );

    return state;
  }
};

window.KID.App.runDiagnostics();