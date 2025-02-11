// Import required Electron modules
const { contextBridge, ipcRenderer } = require("electron");
const { version } = require("../package.json");

// Set up message handling once the process is loaded
process.once("loaded", () => {
  // Listen for messages from renderer process
  window.addEventListener("message", (evt) => {
    // Handle folder selection request
    if (evt.data.type === "select-dirs") {
      ipcRenderer.send("select-dirs");
    }
  });
});

// Expose safe APIs to renderer process through contextBridge
contextBridge.exposeInMainWorld("electronAPI", {
  // Allow renderer to receive folder path updates
  filePathInput: (callback) => ipcRenderer.on("updatefileLoc", callback),
  // Allow renderer to trigger demo processing with Steam ID
  processDemos: (data) => ipcRenderer.send("setSteamId", data),
  getVersion: () => version,
  openPlayerSearch: () => ipcRenderer.send("open-player-search"),
  onPlayerSelected: (callback) => ipcRenderer.on("player-selected", callback),
  showErrorModal: (options) => ipcRenderer.send("show-error-modal", options),
  // Add new functions for settings
  saveSettings: (settings) => ipcRenderer.send("save-settings", settings),
  loadSettings: () => ipcRenderer.invoke("load-settings"),
});
