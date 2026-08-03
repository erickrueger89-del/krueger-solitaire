window.KID = window.KID || {};

window.KID.version = "0.3.1";

window.KID.Engine = {
  state: null,
  lastRender: null,

  createState() {
    const deck = window.KID.Cards.createDeck();

    if (!window.KID.Cards.validateDeck(deck)) {
      throw new Error("KID deck validation failed.");
    }

    const shuffledDeck = window.KID.Shuffle.shuffle(deck);
    const state = window.KID.Deal.create(shuffledDeck);

    if (!window.KID.Deal.validateState(state)) {
      throw new Error("KID game-state validation failed.");
    }

    return state;
  },

  start() {
    this.state = this.createState();
    this.lastRender = window.KID.Render.draw(this.state);

    if (!this.lastRender) {
      throw new Error("KID render failed during startup.");
    }

    console.log("KID Engine started.");
    console.log(
      "Tableau columns:",
      this.state.tableau.length,
      "Stock cards:",
      this.state.stock.length
    );

    return this.state;
  },

  newGame() {
    this.state = this.createState();
    this.lastRender = window.KID.Render.draw(this.state);

    if (!this.lastRender) {
      throw new Error("KID render failed during new game.");
    }

    return this.state;
  },

  about() {
    return {
      name: "Krueger Solitaire",
      developer: "Krueger Interactive Developments",
      version: window.KID.version
    };
  }
};

window.KID.Engine.start();