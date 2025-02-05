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
  processDemos: (steamid) => ipcRenderer.send("setSteamId", steamid),
  getVersion: () => version,
});
