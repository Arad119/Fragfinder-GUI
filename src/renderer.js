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
  // Get Steam ID from input field
  const steamid = $("#steamid").val();
  // Send Steam ID to main process to begin demo processing
  window.electronAPI.processDemos(steamid);
});

// Display version number
document.getElementById(
  "version-label"
).textContent = `v${window.electronAPI.getVersion()}`;
