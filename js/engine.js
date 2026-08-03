window.KID = window.KID || {};

window.KID.version = "0.3.1";

window.KID.Engine = {
  state: null,

  start() {
    const deck = window.KID.Cards.createDeck();
    const shuffledDeck = window.KID.Shuffle.shuffle(deck);

    this.state = window.KID.Deal.create(shuffledDeck);

    console.log("KID Engine started.");
    console.log(
      "Tableau columns:",
      this.state.tableau.length,
      "Stock cards:",
      this.state.stock.length
    );
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