window.KID = window.KID || {};

window.KID.History = {
  undoStack: [],
  redoStack: [],
  maximumEntries: 100,

  cloneState(state) {
    if (!state) {
      return null;
    }

    if (window.KID.Storage?.clone) {
      return window.KID.Storage.clone(state);
    }

    return JSON.parse(
      JSON.stringify(state)
    );
  },

  isValidState(state) {
    return Boolean(
      state &&
      window.KID.Deal?.validateState(state) === true
    );
  },

  trimStack(stack) {
    while (
      stack.length >
      this.maximumEntries
    ) {
      stack.shift();
    }

    return stack;
  },

  reset(state = null) {
    this.undoStack = [];
    this.redoStack = [];

    if (
      state &&
      !this.isValidState(state)
    ) {
      console.warn(
        "KID history reset received an invalid state."
      );
    }

    console.log(
      "KID history reset."
    );

    return true;
  },

  checkpoint(state) {
    if (!this.isValidState(state)) {
      return false;
    }

    this.undoStack.push(
      this.cloneState(state)
    );

    this.trimStack(
      this.undoStack
    );

    this.redoStack = [];

    return true;
  },

  discardCheckpoint() {
    if (
      this.undoStack.length === 0
    ) {
      return false;
    }

    this.undoStack.pop();

    return true;
  },

  canUndo() {
    return (
      this.undoStack.length > 0
    );
  },

  canRedo() {
    return (
      this.redoStack.length > 0
    );
  },

  undo(currentState) {
    if (
      !this.isValidState(
        currentState
      ) ||
      !this.canUndo()
    ) {
      return null;
    }

    const previousState =
      this.undoStack.pop();

    this.redoStack.push(
      this.cloneState(
        currentState
      )
    );

    this.trimStack(
      this.redoStack
    );

    return this.cloneState(
      previousState
    );
  },

  redo(currentState) {
    if (
      !this.isValidState(
        currentState
      ) ||
      !this.canRedo()
    ) {
      return null;
    }

    const restoredState =
      this.redoStack.pop();

    this.undoStack.push(
      this.cloneState(
        currentState
      )
    );

    this.trimStack(
      this.undoStack
    );

    return this.cloneState(
      restoredState
    );
  },

  clearRedo() {
    this.redoStack = [];

    return true;
  },

  getStatus() {
    return {
      canUndo:
        this.canUndo(),

      canRedo:
        this.canRedo(),

      undoEntries:
        this.undoStack.length,

      redoEntries:
        this.redoStack.length,

      maximumEntries:
        this.maximumEntries
    };
  }
};

console.log(
  "Reliable History module loaded."
);