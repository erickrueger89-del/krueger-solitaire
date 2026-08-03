window.KID = window.KID || {};

window.KID.Render = {
  draw(state) {
    if (!state || !Array.isArray(state.tableau)) {
      console.error("Render failed: invalid game state.");
      return false;
    }

    const summary = {
      tableauColumns: state.tableau.length,
      stockCards: state.stock.length,
      wasteCards: state.waste.length
    };

    console.log("Render state verified:", summary);

    return true;
  }
};