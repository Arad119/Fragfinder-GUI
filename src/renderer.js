// Add click event listener to the folder selection button
document.getElementById("dirs").addEventListener("click", (evt) => {
  evt.preventDefault();
  // Send message to main process to open folder selection dialog
  window.postMessage({
    type: "select-dirs",
  });
});

// Update the folder path input field when receiving path from main process
window.electronAPI.filePathInput((event, value) => {
  $("#folder-path").val(value);
});

// Get reference to the "Process Demos" button
const setButton = $("#btn")[0];

// Add click handler to process demos with provided Steam ID
setButton.addEventListener("click", () => {
  const folderPath = $("#folder-path").val();

  // Check if folder path is empty
  if (!folderPath) {
    window.electronAPI.showErrorModal({
      title: "Missing Folder Path",
      message:
        "Please select a folder containing demo files before processing.",
      buttons: ["Ok"],
    });
    return;
  }

  // Get Steam ID from input field
  const steamid = $("#steamid").val();
  const previewMode = $("#preview-mode").prop("checked");
  // Send Steam ID to main process to begin demo processing
  window.electronAPI.processDemos({ steamid, previewMode });
});

// Display version number
document.getElementById(
  "version-label"
).textContent = `v${window.electronAPI.getVersion()}`;

// Add this after the existing event listeners
document.getElementById("search-player").addEventListener("click", () => {
  window.electronAPI.openPlayerSearch();
});

// Add handler for player selection
window.electronAPI.onPlayerSelected((event, steamId) => {
  $("#steamid").val(steamId);
});

// Add near the top of the file, after getting references to elements
const previewModeCheckbox = document.getElementById("preview-mode");

// Load saved settings when the page loads
window.electronAPI.loadSettings().then((settings) => {
  previewModeCheckbox.checked = settings.previewMode;
});

// Save settings when checkbox changes
previewModeCheckbox.addEventListener("change", (e) => {
  window.electronAPI.saveSettings({
    previewMode: e.target.checked,
  });
});
