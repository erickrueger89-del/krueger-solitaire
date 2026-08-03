window.KID = window.KID || {};

window.KID.AutoComplete = {
  running: false,
  delay: 180,
  maximumMoves: 52,

  wait(milliseconds = this.delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  },

  validateState(state) {
    return Boolean(
      state &&
      window.KID.Deal?.validateState(state) === true
    );
  },

  allTableauCardsFaceUp(state) {
    if (!this.validateState(state)) {
      return false;
    }

    return state.tableau.every((column) =>
      column.every((card) => card.faceUp === true)
    );
  },

  canStart(state) {
    return (
      this.validateState(state) &&
      this.allTableauCardsFaceUp(state) &&
      this.hasFoundationMove(state)
    );
  },

  hasFoundationMove(state) {
    if (!this.validateState(state)) {
      return false;
    }

    const wasteCard =
      window.KID.Actions.getWasteTop(state);

    if (wasteCard) {
      const wasteFoundation =
        state.foundations[wasteCard.suit];

      if (
        window.KID.Moves.canMoveToFoundation(
          wasteCard,
          wasteFoundation
        )
      ) {
        return true;
      }
    }

    return state.tableau.some((column) => {
      if (!column.length) {
        return false;
      }

      const card = column[column.length - 1];
      const foundation = state.foundations[card.suit];

      return window.KID.Moves.canMoveToFoundation(
        card,
        foundation
      );
    });
  },

  moveOneCard(state) {
    const wasteCard =
      window.KID.Actions.getWasteTop(state);

    if (wasteCard) {
      const wasteFoundation =
        state.foundations[wasteCard.suit];

      if (
        window.KID.Moves.canMoveToFoundation(
          wasteCard,
          wasteFoundation
        )
      ) {
        return window.KID.Actions
          .moveWasteToFoundation(state);
      }
    }

    for (
      let columnIndex = 0;
      columnIndex < state.tableau.length;
      columnIndex++
    ) {
      const column = state.tableau[columnIndex];

      if (!column.length) {
        continue;
      }

      const card = column[column.length - 1];
      const foundation = state.foundations[card.suit];

      if (
        window.KID.Moves.canMoveToFoundation(
          card,
          foundation
        )
      ) {
        return window.KID.Actions
          .moveTableauToFoundation(
            state,
            columnIndex
          );
      }
    }

    return false;
  },

  async run(state = window.KID.Engine?.state) {
    if (this.running) {
      return false;
    }

    if (!this.canStart(state)) {
      return false;
    }

    this.running = true;
    let movesCompleted = 0;

    try {
      while (
        movesCompleted < this.maximumMoves &&
        this.hasFoundationMove(state)
      ) {
        const moved = this.moveOneCard(state);

        if (!moved) {
          break;
        }

        movesCompleted++;

        if (window.KID.Engine?.recordMove) {
          window.KID.Engine.recordMove();
        }

        if (window.KID.Engine?.save) {
          window.KID.Engine.save();
        }

        await this.wait();
      }

      if (window.KID.Actions.isWin(state)) {
        console.log(
          "KID Auto Complete finished the game."
        );

        return true;
      }

      console.log(
        "KID Auto Complete stopped.",
        {
          movesCompleted,
          reason:
            this.hasFoundationMove(state)
              ? "Maximum move limit reached."
              : "No legal foundation move available."
        }
      );

      return false;
    } finally {
      this.running = false;
    }
  },

  stop() {
    this.running = false;
    return true;
  }
};

console.log("Auto Complete module loaded.");