const { BrowserWindow, app } = require("electron");
const path = require("path");
const fs = require("fs");

function createPlayerSearchWindow(parentWindow) {
  const searchWindow = new BrowserWindow({
    width: 600,
    height: 800,
    autoHideMenuBar: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow loading local resources
    },
    backgroundColor: "#0f172a",
  });

  // Read the CSS files content
  const mainCssPath = path.join(__dirname, "index.css");
  const mainCssContent = fs.readFileSync(mainCssPath, "utf8");

  const cssPath = path.join(__dirname, "playerSearchWindow.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Read the HTML template
  const htmlTemplatePath = path.join(__dirname, "playerSearchWindow.html");
  let htmlContent = fs.readFileSync(htmlTemplatePath, "utf8");

  // Replace placeholders in the template
  htmlContent = htmlContent.replace(
    "</head>",
    `<style>${mainCssContent}</style><style>${cssContent}</style></head>`
  );

  htmlContent = htmlContent.replace(
    "BASE_PATH_PLACEHOLDER",
    path.join(__dirname, "playerImages").replace(/\\/g, "/")
  );

  htmlContent = htmlContent.replace(
    "USER_DATA_PATH_PLACEHOLDER",
    app.getPath("userData").replace(/\\/g, "/")
  );

  // Load the HTML content directly using data URI
  searchWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  );

  return searchWindow;
}

module.exports = createPlayerSearchWindow;
