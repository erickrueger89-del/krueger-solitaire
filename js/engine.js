window.KID = window.KID || {};

window.KID.version = "0.3.1";

window.KID.ready =
  Boolean(window.KID.Engine) &&
  typeof window.KID.Engine.start === "function";

console.log(
  `Krueger Solitaire ${window.KID.version} loaded successfully`
);

console.log(
  window.KID.ready
    ? "KID Engine connection verified"
    : "KID Engine connection failed"
);