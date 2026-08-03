window.KID = window.KID || {};

window.KID.Deal = {
  create(deck) {
    const cards = [...deck];
    const tableau = Array.from({ length: 7 }, () => []);

    for (let column = 0; column < 7; column++) {
      for (let row = 0; row <= column; row++) {
        const card = cards.shift();

        tableau[column].push({
          ...card,
          faceUp: row === column
        });
      }
    }

    return {
      tableau,
      stock: cards,
      waste: [],
      foundations: {
        "♠": [],
        "♥": [],
        "♦": [],
        "♣": []
      }
    };
  }
};

console.log("Deal module loaded.");