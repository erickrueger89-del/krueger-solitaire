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

    return JSON.parse(JSON.stringify(state));
  },

  isValidState(state) {
    return (
      state &&
      window.KID.Deal?.validateState(state) === true
    );
  },

  reset(state) {
    this.undoStack = [];
    this.redoStack = [];

    if (this.isValidState(state)) {
      this.undoStack.push(
        this.cloneState(state)
      );
    }

    console.log("KID history reset.");

    return true;
  },

  checkpoint(state) {
    if (!this.isValidState(state)) {
      return false;
    }

    this.undoStack.push(
      this.cloneState(state)
    );

    if (
      this.undoStack.length >
      this.maximumEntries
    ) {
      this.undoStack.shift();
    }

    this.redoStack = [];

    return true;
  },

  discardCheckpoint() {
    if (this.undoStack.length <= 1) {
      return false;
    }

    this.undoStack.pop();

    return true;
  },

  canUndo() {
    return this.undoStack.length > 1;
  },

  canRedo() {
    return this.redoStack.length > 0;
  },

  undo(currentState) {
    if (
      !this.isValidState(currentState) ||
      !this.canUndo()
    ) {
      return null;
    }

    const currentSnapshot =
      this.undoStack.pop();

    this.redoStack.push(
      this.cloneState(currentSnapshot)
    );

    const previousState =
      this.undoStack[
        this.undoStack.length - 1
      ];

    return this.cloneState(previousState);
  },

  redo(currentState) {
    if (
      !this.isValidState(currentState) ||
      !this.canRedo()
    ) {
      return null;
    }

    const restoredState =
      this.redoStack.pop();

    this.undoStack.push(
      this.cloneState(restoredState)
    );

    return this.cloneState(restoredState);
  },

  getStatus() {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoEntries: this.undoStack.length,
      redoEntries: this.redoStack.length
    };
  }
};

console.log("History module loaded.");