window.KID = window.KID || {};

window.KID.version = "0.3.1";

const state = window.KID.Engine?.state;

window.KID.diagnostics = {
  modules: {
    cards: typeof window.KID.Cards?.createDeck === "function",
    shuffle: typeof window.KID.Shuffle?.shuffle === "function",
    deal: typeof window.KID.Deal?.create === "function",
    render: typeof window.KID.Render?.draw === "function",
    engine: Boolean(window.KID.Engine)
  },

  state: {
    tableauColumns: state?.tableau?.length ?? 0,
    stockCards: state?.stock?.length ?? 0,
    wasteCards: state?.waste?.length ?? 0
  }
};

window.KID.ready =
  Object.values(window.KID.diagnostics.modules).every(Boolean) &&
  window.KID.diagnostics.state.tableauColumns === 7 &&
  window.KID.diagnostics.state.stockCards === 24;

console.log(
  window.KID.ready
    ? "KID system ready."
    : "KID system check failed.",
  window.KID.diagnostics
);