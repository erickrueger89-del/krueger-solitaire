window.KID = window.KID || {};

window.KID.version = "0.4.2";

window.KID.App = {
  diagnostics: null,
  ruleTests: null,
  actionTests: null,
  ready: false,

  createTestCard(
    rank,
    suit,
    color,
    faceUp = true
  ) {
    return {
      rank,
      suit,
      color,
      faceUp
    };
  },

  runRuleTests() {
    const blackKing =
      this.createTestCard(
        "K",
        "♠",
        "black"
      );

    const redQueen =
      this.createTestCard(
        "Q",
        "♥",
        "red"
      );

    const blackJack =
      this.createTestCard(
        "J",
        "♣",
        "black"
      );

    const aceHearts =
      this.createTestCard(
        "A",
        "♥",
        "red"
      );

    const twoHearts =
      this.createTestCard(
        "2",
        "♥",
        "red"
      );

    const twoDiamonds =
      this.createTestCard(
        "2",
        "♦",
        "red"
      );

    const hiddenTen =
      this.createTestCard(
        "10",
        "♠",
        "black",
        false
      );

    this.ruleTests = {
      kingToEmptyTableau:
        window.KID.Moves
          .canMoveToTableau(
            blackKing,
            null
          ) === true,

      queenToKing:
        window.KID.Moves
          .canMoveToTableau(
            redQueen,
            blackKing
          ) === true,

      jackToQueen:
        window.KID.Moves
          .canMoveToTableau(
            blackJack,
            redQueen
          ) === true,

      aceToEmptyFoundation:
        window.KID.Moves
          .canMoveToFoundation(
            aceHearts,
            []
          ) === true,

      twoToMatchingFoundation:
        window.KID.Moves
          .canMoveToFoundation(
            twoHearts,
            [aceHearts]
          ) === true,

      wrongSuitRejected:
        window.KID.Moves
          .canMoveToFoundation(
            twoDiamonds,
            [aceHearts]
          ) === false,

      hiddenCardRejected:
        window.KID.Moves
          .canMoveToTableau(
            hiddenTen,
            redQueen
          ) === false,

      validTableauSequence:
        window.KID.Moves
          .isValidTableauSequence([
            blackKing,
            redQueen,
            blackJack
          ]) === true
    };

    return Object.values(
      this.ruleTests
    ).every(Boolean);
  },

  runActionTests() {
    const stockState =
      window.KID.Engine
        .createState();

    const startingStock =
      stockState.stock.length;

    window.KID.Actions
      .drawFromStock(stockState);

    const wasteTop =
      window.KID.Actions
        .getWasteTop(stockState);

    const tableauState = {
      stock: [],
      waste: [],
      foundations: {
        "♠": [],
        "♥": [],
        "♦": [],
        "♣": []
      },
      tableau: [
        [
          this.createTestCard(
            "K",
            "♠",
            "black"
          )
        ],
        [
          this.createTestCard(
            "Q",
            "♥",
            "red"
          ),
          this.createTestCard(
            "J",
            "♣",
            "black"
          )
        ],
        [],
        [],
        [],
        [],
        []
      ]
    };

    const movedStack =
      window.KID.Actions
        .moveTableauStack(
          tableauState,
          1,
          0,
          0
        );

    const foundationState = {
      stock: [],
      waste: [],
      foundations: {
        "♠": [],
        "♥": [],
        "♦": [],
        "♣": []
      },
      tableau: [
        [
          this.createTestCard(
            "A",
            "♥",
            "red"
          )
        ],
        [],
        [],
        [],
        [],
        [],
        []
      ]
    };

    const movedToFoundation =
      window.KID.Actions
        .moveTableauToFoundation(
          foundationState,
          0
        );

    const winningState = {
      stock: [],
      waste: [],
      tableau: [
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ],
      foundations: {
        "♠": Array(13).fill({}),
        "♥": Array(13).fill({}),
        "♦": Array(13).fill({}),
        "♣": Array(13).fill({})
      }
    };

    this.actionTests = {
      stockStartedWith24:
        startingStock === 24,

      stockReducedAfterDraw:
        stockState.stock.length === 23,

      wasteIncreasedAfterDraw:
        stockState.waste.length === 1,

      wasteTopAvailable:
        Boolean(wasteTop),

      wasteTopFaceUp:
        wasteTop?.faceUp === true,

      tableauStackMoved:
        movedStack === true,

      destinationReceivedStack:
        tableauState
          .tableau[0]
          .length === 3,

      sourceColumnEmptied:
        tableauState
          .tableau[1]
          .length === 0,

      aceMovedToFoundation:
        movedToFoundation === true,

      foundationContainsAce:
        foundationState
          .foundations["♥"]
          .length === 1,

      winDetected:
        window.KID.Actions
          .isWin(winningState) === true
    };

    return Object.values(
      this.actionTests
    ).every(Boolean);
  },

  runDiagnostics() {
    const state =
      window.KID.Engine?.state;

    const renderSnapshot =
      window.KID.Engine
        ?.lastRender;

    const rulesValid =
      this.runRuleTests();

    const actionsValid =
      this.runActionTests();

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
            "function" &&
          typeof window.KID.Moves
            ?.canMoveToTableau ===
            "function" &&
          typeof window.KID.Moves
            ?.canMoveToFoundation ===
            "function",

        render:
          typeof window.KID.Render
            ?.draw ===
            "function",

        engine:
          typeof window.KID.Engine
            ?.createState ===
            "function" &&
          typeof window.KID.Engine
            ?.newGame ===
            "function",

        actions:
          typeof window.KID.Actions
            ?.drawFromStock ===
            "function" &&
          typeof window.KID.Actions
            ?.moveTableauStack ===
            "function" &&
          typeof window.KID.Actions
            ?.moveTableauToFoundation ===
            "function" &&
          typeof window.KID.Actions
            ?.isWin ===
            "function"
      },

      state: {
        valid:
          window.KID.Deal
            ?.validateState(
              state
            ) === true,

        tableauColumns:
          state?.tableau
            ?.length ?? 0,

        stockCards:
          state?.stock
            ?.length ?? 0,

        wasteCards:
          state?.waste
            ?.length ?? 0
      },

      render: {
        available:
          Boolean(
            renderSnapshot
          ),

        stockCount:
          renderSnapshot
            ?.stockCount ?? 0
      },

      rules: {
        valid:
          rulesValid,

        tests:
          this.ruleTests
      },

      actions: {
        valid:
          actionsValid,

        tests:
          this.actionTests
      }
    };

    this.ready =
      Object.values(
        this.diagnostics
          .modules
      ).every(Boolean) &&
      this.diagnostics
        .state.valid &&
      this.diagnostics
        .state
        .tableauColumns === 7 &&
      this.diagnostics
        .state
        .stockCards === 24 &&
      this.diagnostics
        .render.available &&
      rulesValid &&
      actionsValid;

    console.log(
      this.ready
        ? "KID v0.4.2 system ready."
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

  drawStock() {
    const state =
      window.KID.Engine
        .state;

    window.KID.Actions
      .drawFromStock(
        state
      );

    return state;
  },

  moveWasteToFoundation() {
    return window.KID.Actions
      .moveWasteToFoundation(
        window.KID.Engine
          .state
      );
  },

  moveWasteToTableau(
    destinationColumnIndex
  ) {
    return window.KID.Actions
      .moveWasteToTableau(
        window.KID.Engine
          .state,
        destinationColumnIndex
      );
  },

  moveTableauToFoundation(
    sourceColumnIndex
  ) {
    return window.KID.Actions
      .moveTableauToFoundation(
        window.KID.Engine
          .state,
        sourceColumnIndex
      );
  },

  moveTableauStack(
    sourceColumnIndex,
    sourceCardIndex,
    destinationColumnIndex
  ) {
    return window.KID.Actions
      .moveTableauStack(
        window.KID.Engine
          .state,
        sourceColumnIndex,
        sourceCardIndex,
        destinationColumnIndex
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

window.KID.App
  .runDiagnostics();