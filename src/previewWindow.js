const { BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

function createPreviewWindow(content) {
  const previewWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: "#0f172a", // Match --bg color
  });

  // Read the CSS files conten
  const cssPath = path.join(__dirname, "previewWindow.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Read the HTML template
  const htmlTemplatePath = path.join(__dirname, "previewWindow.html");
  let htmlContent = fs.readFileSync(htmlTemplatePath, "utf8");

  // Replace placeholders in the template
  htmlContent = htmlContent.replace(
    "</head>",
    `<style>${cssContent}</style></head>`
  );

  htmlContent = htmlContent.replace(
    "PREVIEW_CONTENT",
    content.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );

  // Load the HTML content
  previewWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  );
}

module.exports = createPreviewWindow;
