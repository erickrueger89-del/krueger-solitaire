window.KID = window.KID || {};

window.KID.Storage = {
  gameKey: "kids-solitaire-game-v1",
  settingsKey: "kids-solitaire-settings-v1",
  statsKey: "kids-solitaire-stats-v1",

  clone(value) {
    return JSON.parse(
      JSON.stringify(value)
    );
  },

  isAvailable() {
    try {
      const testKey =
        "__kid_storage_test__";

      localStorage.setItem(
        testKey,
        "working"
      );

      localStorage.removeItem(
        testKey
      );

      return true;
    } catch (error) {
      console.error(
        "KID storage unavailable:",
        error
      );

      return false;
    }
  },

  saveGame(state) {
    if (!this.isAvailable()) {
      return false;
    }

    if (
      !window.KID.Deal
        .validateState(state)
    ) {
      console.error(
        "Cannot save invalid KID game state."
      );

      return false;
    }

    const payload = {
      version:
        window.KID.version,

      savedAt:
        new Date().toISOString(),

      state:
        this.clone(state)
    };

    localStorage.setItem(
      this.gameKey,
      JSON.stringify(payload)
    );

    console.log(
      "KID game saved.",
      payload.savedAt
    );

    return true;
  },

  loadGame() {
    if (!this.isAvailable()) {
      return null;
    }

    const savedValue =
      localStorage.getItem(
        this.gameKey
      );

    if (!savedValue) {
      return null;
    }

    try {
      const payload =
        JSON.parse(savedValue);

      if (
        !payload ||
        !window.KID.Deal
          .validateState(
            payload.state
          )
      ) {
        throw new Error(
          "Stored game state is invalid."
        );
      }

      console.log(
        "KID game loaded.",
        payload.savedAt
      );

      return this.clone(
        payload.state
      );
    } catch (error) {
      console.error(
        "KID saved game could not be loaded:",
        error
      );

      this.clearGame();

      return null;
    }
  },

  clearGame() {
    if (!this.isAvailable()) {
      return false;
    }

    localStorage.removeItem(
      this.gameKey
    );

    console.log(
      "KID saved game cleared."
    );

    return true;
  },

  hasSavedGame() {
    if (!this.isAvailable()) {
      return false;
    }

    return Boolean(
      localStorage.getItem(
        this.gameKey
      )
    );
  },

  saveSettings(settings) {
    if (
      !this.isAvailable() ||
      !settings ||
      typeof settings !== "object"
    ) {
      return false;
    }

    localStorage.setItem(
      this.settingsKey,
      JSON.stringify(
        this.clone(settings)
      )
    );

    return true;
  },

  loadSettings(defaultSettings = {}) {
    if (!this.isAvailable()) {
      return this.clone(
        defaultSettings
      );
    }

    const savedValue =
      localStorage.getItem(
        this.settingsKey
      );

    if (!savedValue) {
      return this.clone(
        defaultSettings
      );
    }

    try {
      return {
        ...this.clone(
          defaultSettings
        ),
        ...JSON.parse(
          savedValue
        )
      };
    } catch (error) {
      console.error(
        "KID settings could not be loaded:",
        error
      );

      return this.clone(
        defaultSettings
      );
    }
  },

  createDefaultStats() {
    return {
      gamesStarted: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalMoves: 0,
      lastPlayedAt: null
    };
  },

  saveStats(stats) {
    if (
      !this.isAvailable() ||
      !stats ||
      typeof stats !== "object"
    ) {
      return false;
    }

    localStorage.setItem(
      this.statsKey,
      JSON.stringify(
        this.clone(stats)
      )
    );

    return true;
  },

  loadStats() {
    const defaults =
      this.createDefaultStats();

    if (!this.isAvailable()) {
      return defaults;
    }

    const savedValue =
      localStorage.getItem(
        this.statsKey
      );

    if (!savedValue) {
      return defaults;
    }

    try {
      return {
        ...defaults,
        ...JSON.parse(
          savedValue
        )
      };
    } catch (error) {
      console.error(
        "KID statistics could not be loaded:",
        error
      );

      return defaults;
    }
  },

  clearAll() {
    if (!this.isAvailable()) {
      return false;
    }

    localStorage.removeItem(
      this.gameKey
    );

    localStorage.removeItem(
      this.settingsKey
    );

    localStorage.removeItem(
      this.statsKey
    );

    console.log(
      "All KID local data cleared."
    );

    return true;
  }
};

console.log(
  "Storage module loaded."
);