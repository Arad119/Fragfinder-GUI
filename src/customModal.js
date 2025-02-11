const { BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

function createCustomModal(options) {
  const modalWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 400,
    height: 250,
    modal: true,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: "#0f172a",
    center: true,
  });

  // Read the CSS file content
  const cssPath = path.join(__dirname, "index.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Create HTML content for the modal window
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
        <style>
          ${cssContent}
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          .modal-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1.5rem;
            text-align: center;
            box-sizing: border-box;
          }
          .modal-title {
            color: var(--text);
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .modal-message {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            word-break: break-word;
          }
          .modal-buttons {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="modal-container">
            <h2 class="modal-title">${options.title}</h2>
            <p class="modal-message">${options.message}</p>
            ${
              options.buttons
                ? `
              <div class="modal-buttons">
                ${options.buttons
                  .map(
                    (button) => `
                  <button onclick="window.close()">${button}</button>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
        </div>
      </body>
    </html>
  `;

  // Load the HTML content
  modalWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  );

  return modalWindow;
}

module.exports = createCustomModal;
