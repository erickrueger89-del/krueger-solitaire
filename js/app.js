window.KID = window.KID || {};

window.KID.version = "0.3.1";

const state = window.KID.Engine?.state;

window.KID.ready =
  Boolean(state) &&
  state.tableau?.length === 7 &&
  state.stock?.length === 24;

console.log(
  window.KID.ready
    ? "KID Engine verified: 7 tableau columns and 24 stock cards."
    : "KID Engine verification failed."
);