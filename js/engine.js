window.KID = window.KID || {};

window.KID.version = "0.4.3";

window.KID.Engine = {
  state: null,
  lastRender: null,
  resumedFromSave: false,

  createState() {
    const deck =
      window.KID.Cards.createDeck();

    if (
      !window.KID.Cards.validateDeck(deck)
    ) {
      throw new Error(
        "KID deck validation failed."
      );
    }

    const shuffledDeck =
      window.KID.Shuffle.shuffle(deck);

    const state =
      window.KID.Deal.create(
        shuffledDeck
      );

    if (
      !window.KID.Deal
        .validateInitialDeal(state)
    ) {
      throw new Error(
        "KID initial deal validation failed."
      );
    }

    return state;
  },

  render() {
    if (
      !this.state ||
      !window.KID.Deal
        .validateState(this.state)
    ) {
      throw new Error(
        "Cannot render an invalid KID game state."
      );
    }

    this.lastRender =
      window.KID.Render.draw(
        this.state
      );

    if (!this.lastRender) {
      throw new Error(
        "KID render failed."
      );
    }

    return this.lastRender;
  },

  save() {
    if (
      !this.state ||
      !window.KID.Storage
    ) {
      return false;
    }

    return window.KID.Storage
      .saveGame(this.state);
  },

  loadSavedGame() {
    if (
      !window.KID.Storage
        ?.hasSavedGame()
    ) {
      return null;
    }

    const savedState =
      window.KID.Storage
        .loadGame();

    if (
      !savedState ||
      !window.KID.Deal
        .validateState(savedState)
    ) {
      return null;
    }

    return savedState;
  },

  start({
    resume = true
  } = {}) {
    const savedState =
      resume
        ? this.loadSavedGame()
        : null;

    if (savedState) {
      this.state = savedState;
      this.resumedFromSave = true;

      console.log(
        "KID Engine resumed a saved game."
      );
    } else {
      this.state =
        this.createState();

      this.resumedFromSave = false;

      this.save();

      console.log(
        "KID Engine started a new game."
      );
    }

    this.render();

    return this.state;
  },

  newGame() {
    this.state =
      this.createState();

    this.resumedFromSave = false;

    this.render();
    this.save();

    return this.state;
  },

  replaceState(state) {
    if (
      !window.KID.Deal
        .validateState(state)
    ) {
      throw new Error(
        "Cannot install an invalid KID game state."
      );
    }

    this.state =
      window.KID.Storage.clone(
        state
      );

    this.render();
    this.save();

    return this.state;
  },

  recordMove() {
    if (!this.state) {
      return 0;
    }

    this.state.moves =
      Number(
        this.state.moves || 0
      ) + 1;

    this.save();

    return this.state.moves;
  },

  clearSavedGame() {
    return window.KID.Storage
      ?.clearGame() ?? false;
  },

  about() {
    return {
      name:
        "Krueger Solitaire",

      developer:
        "Krueger Interactive Developments",

      version:
        window.KID.version,

      resumedFromSave:
        this.resumedFromSave
    };
  }
};

window.KID.Engine.start();