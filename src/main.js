/* Importing required modules. */
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  globalShortcut,
  nativeTheme,
} = require("electron");

nativeTheme.themeSource = "dark";

const path = require("path");
const ProgressBar = require("electron-progressbar");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const {
  analyzeDemo,
  DemoSource,
  ExportFormat,
} = require("@akiver/cs-demo-analyzer");
const analyzeBinaryPath = isDev
  ? undefined // Use default path in dev mode
  : path.join(process.resourcesPath, "csda.exe");
const os = require("os");
const tmpdir = os.tmpdir();
const createPreviewWindow = require("./previewWindow");
const createCustomModal = require("./customModal");
const createPlayerSearchWindow = require("./playerSearchWindow");
const fs = require("fs").promises;
const settingsPath = path.join(app.getPath("userData"), "settings.json");

/* Importing the ipcMain module from the electron module. */
var ipc = require("electron").ipcMain;

/* Close app when main window is closed. */
ipc.on("close-main-window", function () {
  app.quit();
});

/* Creating variables called mainWindow, folderPath, and matchContent. */
let mainWindow;
let folderPath;
let matchContent = "";
let playerSearchWindow = null;

/**
 * Create a new BrowserWindow and defining settings for
 * these properties: autoHideMenuBar, width, height,
 * webPreferences, and load the index.html file.
 */
const createWindow = () => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: __dirname + "/preload.js",
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  /* Loading the index.html file into the mainWindow. */
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  /* Open the DevTools. */
  //mainWindow.webContents.openDevTools();

  /* Checking for updates if non developer mode. */
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
};

/* Creating app window. */
app.on("ready", createWindow);

/* Quit when all windows are closed, except on macOS. */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/* Disable devtools shortcut. */
app.on("ready", () => {
  globalShortcut.register("Control+Shift+I", () => {
    return false;
  });
});

/* Re-create a window when the app is activated. */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* Listening for a message from the renderer process. When it receives the message, it opens a dialog
 * box to select a folder. It then sends the folder path back to the renderer process. */
ipcMain.on("select-dirs", async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    filters: [{ name: "Demo Files", extensions: ["dem"] }],
  });

  folderPath = result.filePaths[0];
  mainWindow.webContents.send("updatefileLoc", folderPath);
});

/* Set steamid64 to the steamid that the user inputs.
 * Processes highlights data and exports them. */
ipcMain.on("setSteamId", (event, { steamid, previewMode }) => {
  const fs = require("fs").promises;
  const path = require("path");
  const CSGO_ROUND_LENGTH = 115;
  var msgBox;

  /* Analyzing demo file and returning JSON path */
  async function analyzeDemoFile(demoPath) {
    const tempOutputPath = path.join(tmpdir, "fragfinder-temp");
    await fs.mkdir(tempOutputPath, { recursive: true });

    await analyzeDemo({
      demoPath: demoPath,
      outputFolderPath: tempOutputPath,
      format: ExportFormat.JSON,
      source: DemoSource.Valve,
      analyzePositions: false,
      minify: false,
      onStderr: console.error,
      onStdout: console.log,
      executablePath: analyzeBinaryPath,
    });

    const jsonFileName = path.basename(demoPath, ".dem") + ".json";
    const jsonPath = path.join(tempOutputPath, jsonFileName);

    // Read the raw JSON file
    const rawJson = await fs.readFile(jsonPath, "utf8");

    // Fix all variations of steamID fields before they get parsed
    const fixedJson = rawJson.replace(
      /("(?:steamId|killerSteamId|victimSteamId|clutcherSteamId|assistSteamId)"):\s*(\d{17})/g,
      (match, field, steamId) => `${field}:"${steamId}"`
    );

    // Write the fixed JSON back to the file
    await fs.writeFile(jsonPath, fixedJson);

    return jsonPath;
  }

  /* Modified getFrags function */
  async function getFrags(pathToDemoFiles, playerChosen = false) {
    const demosHighlights = [];
    const files = await fs.readdir(pathToDemoFiles);
    const demoFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".dem"
    );

    // Convert playerChosen to string if it exists
    if (playerChosen) {
      playerChosen = String(playerChosen);
      console.log(`Filtering for player with steamID: ${playerChosen}`);
    }

    if (demoFiles.length === 0) {
      msgBox = `There are no ".dem" files to process!`;
      createCustomModal({
        title: "File creation",
        message: msgBox,
        buttons: ["Ok"],
      });
      return;
    }

    var progressBar = new ProgressBar({
      indeterminate: false,
      text: "Preparing frags...",
      detail: "Processing demos...",
      maxValue: demoFiles.length,
      customHTML: `
        <div style="font-family: 'Inter', sans-serif; background: #0f172a; position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 2rem;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h3 style="color: #f8fafc; font-size: 1.25rem; font-weight: 600; margin: 0;">Preparing frags...</h3>
            <p style="color: #94a3b8; font-size: 0.875rem; margin: 0.5rem 0 0 0;" id="progress-detail">Processing demos...</p>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 0.5rem; padding: 0.25rem; margin-top: 1rem;">
            <div id="progress-bar" style="background: #6366f1; width: 0%; height: 0.5rem; border-radius: 0.25rem; transition: width 0.3s ease;"></div>
          </div>
          <script>
            const progressBar = document.getElementById('progress-bar');
            const progressDetail = document.getElementById('progress-detail');
            const { ipcRenderer } = require('electron');
            
            window.setProgressValue = function(value) {
              const percentage = (value / ${demoFiles.length}) * 100;
              progressBar.style.width = percentage + '%';
              progressDetail.textContent = 'Demo ' + value + ' out of ${demoFiles.length}...';
            };
          </script>
        </div>
      `,
    });

    /* Setting up event handlers for the progress bar. */
    progressBar
      .on("completed", function () {
        console.info(`completed...`);
        progressBar.detail = "Task completed. Exiting...";
      })
      .on("aborted", function (value) {
        console.info(`aborted... ${value}`);
      })
      .on("progress", function (value) {
        progressBar.detail = `Demo ${value} out of ${
          progressBar.getOptions().maxValue
        }...`;
        progressBar._window.webContents.executeJavaScript(
          `window.setProgressValue(${value})`
        );
      });

    /* Analyze each demo. */
    for (let i = 0; i < demoFiles.length; i++) {
      const demoPath = path.join(pathToDemoFiles, demoFiles[i]);
      console.log("analyzing", demoFiles[i]);

      try {
        // Analyze demo and get JSON path
        const jsonPath = await analyzeDemoFile(demoPath);
        const data = await fs.readFile(jsonPath);
        // Use the same reviver function here
        const matchData = JSON.parse(data, (key, value) => {
          if (typeof value === "number" && value > Number.MAX_SAFE_INTEGER) {
            return value.toString();
          }
          return value;
        });

        // Ensure all steamIDs in kills are strings
        matchData.kills = matchData.kills.map((kill) => ({
          ...kill,
          killerSteamId: String(kill.killerSteamId),
          victimSteamId: String(kill.victimSteamId),
        }));

        if (!matchData.rounds || !matchData.kills || !matchData.clutches) {
          console.error(`Demo ${demoFiles[i]} has missing required data`);
          continue;
        }

        progressBar.value += 1;

        demosHighlights.push({
          demoName: matchData.name
            ? matchData.name.replace(".dem", "")
            : path.basename(demoPath, ".dem"),
          map: matchData.mapName ? matchData.mapName.replace("de_", "") : "",
          roundsWithHighlights: [],
        });

        if (demoIsBroken(matchData)) {
          demosHighlights[
            i
          ].breakMsg = `Can't extract highlights from this demo - there's only ${matchData.rounds.length} rounds in the JSON file. The demo is probably partially corrupted, but looking through it manually in-game might work. You could also try to analyze it again in CS:GO Demos Manager, export a new JSON file and try again.`;
          continue;
        }

        const allNotableClutchesInMatch = matchData.clutches
          .filter((clutch) => clutch.won && clutch.opponentCount >= 3)
          .map((clutch) => ({
            player: clutch.clutcherName,
            opponentCount: clutch.opponentCount,
            roundNumber: clutch.roundNumber,
          }));

        matchData.rounds.forEach((currentRound, roundIndex) => {
          demosHighlights[i].roundsWithHighlights.push({
            roundNumber: currentRound.number,
            frags: [],
          });

          // Filter kills for current round
          const roundKills = matchData.kills.filter(
            (kill) =>
              kill.roundNumber === currentRound.number &&
              !(
                kill.weaponName === "World" &&
                kill.killerName === kill.victimName
              )
          );

          // Group kills by player for current round
          let roundkillsPerPlayer = roundKills.reduce((acc, kill) => {
            if (acc[kill.killerName]) {
              acc[kill.killerName].kills.push(kill);
            } else {
              acc[kill.killerName] = {
                kills: [kill],
                steamId: String(kill.killerSteamId), // Ensure steamId is a string
              };
            }
            return acc;
          }, {});

          if (playerChosen) {
            roundkillsPerPlayer = Object.fromEntries(
              Object.entries(roundkillsPerPlayer).filter(
                ([_, val]) => val.steamId === playerChosen
              )
            );
          }

          for (const player in roundkillsPerPlayer) {
            const { kills, steamId } = roundkillsPerPlayer[player];
            const tickFirstKill = kills[0].tick - 200;
            const clutch = allNotableClutchesInMatch.find(
              ({ roundNumber, player: clutchPlayer }) =>
                roundNumber === currentRound.number && clutchPlayer === player
            );

            const fragType = getFragtype(kills, clutch);

            if (kills.length >= 3 || fragType.includes("deagle")) {
              const team = kills[0].killerTeamName;

              demosHighlights[i].roundsWithHighlights[roundIndex].frags.push({
                player,
                steamId,
                team,
                fragType,
                ...(clutch ? { clutchOpponents: clutch.opponentCount } : {}),
                antieco: isAntieco(kills, matchData, currentRound),
                killAmount: kills.length,
                tick: tickFirstKill,
                individualKills: kills.map((kill) => {
                  // Get the current round's freezetimeEndTick
                  const currentRoundData = matchData.rounds.find(
                    (r) => r.number === currentRound.number
                  );
                  const freezetimeEndTick = currentRoundData.freezeTimeEndTick;

                  // Debug logging
                  // console.log(`Round Number: ${currentRound.number}`);
                  // console.log(`Kill Tick: ${kill.tick}`);
                  // console.log(`Freezetime End Tick: ${freezetimeEndTick}`);

                  // Calculate seconds since round started
                  const secondsSinceRoundStart =
                    (kill.tick - freezetimeEndTick) / matchData.tickrate;

                  return {
                    timestamp: secondsSinceRoundStart,
                    weapon: kill.weaponName,
                    weaponType: kill.weaponType,
                  };
                }),
              });
            }
          }
        });

        // Clean up temp JSON file
        await fs.unlink(jsonPath);
      } catch (error) {
        console.error(`Error processing demo ${demoFiles[i]}:`, error);
        continue;
      }
    }
    return demosHighlights;
  }

  /* If demo is broken. */
  function demoIsBroken(matchData) {
    // CS2 demos typically have at least 12 rounds in a normal match
    return matchData.rounds.length <= 12;
  }

  /* Misc fragtypes. */
  function getFragtype(kills, clutch) {
    if (kills.length >= 3) {
      return clutch ? "clutch" : `${kills.length}k`;
    }
    if (hasNotableDeagleFrags(kills)) {
      const deagleKills = kills.filter(
        (kill) => kill.weaponName === "Desert Eagle"
      );

      return `deagle${deagleKills.length}k`;
    }
    return `${kills.length}k`;
  }

  /* 1k with hs or 2k where one is hs - Only with deagle kills. */
  function hasNotableDeagleFrags(kills) {
    return kills.some(
      ({ weaponName, isHeadshot }) =>
        weaponName === "Desert Eagle" && isHeadshot
    );
  }

  /* If AntiEco. */
  function isAntieco(kills, matchData, currentRound) {
    const victimTeam = kills[0].victimTeamName;
    const teamData =
      victimTeam === matchData.teamA.name ? matchData.teamA : matchData.teamB;

    // CS2 doesn't have detailed economy data in the current format
    // We'll have to use a simpler check based on round type
    return (
      currentRound.teamAEconomyType === "eco" ||
      currentRound.teamBEconomyType === "eco"
    );
  }

  /* Text camelization. */
  const camelizeIsh = function (text) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text;
  };

  /* Process highlights data and export. */
  async function createFiles(data, previewMode) {
    for (const match of data) {
      const matchText = [`**playdemo ${match.demoName}.dem`];
      const matchFragFormat = [];
      let fragsFound = false;

      match.roundsWithHighlights.forEach(({ roundNumber, frags }) => {
        const roundNumberStr =
          roundNumber.toString().length == 1 ? "0" + roundNumber : roundNumber;

        frags.forEach(
          ({
            killAmount,
            fragType,
            clutchOpponents,
            individualKills,
            team,
            antieco,
            player,
            tick,
            steamId,
          }) => {
            const playerCamelized = camelizeIsh(player);

            /* 1v3-4k vs just 4k. */
            const fragTypeDetails =
              fragType === "clutch"
                ? clutchOpponents === killAmount
                  ? `1v${clutchOpponents}`
                  : `1v${clutchOpponents}-${
                      killAmount == 5 ? "ACE" : killAmount + "k"
                    }`
                : fragType === "5k"
                ? "ACE"
                : fragType.includes("deagle")
                ? fragType.match(/[0-9]+/g)[0] == killAmount
                  ? fragType
                  : `${fragType}-${killAmount}k`
                : fragType;

            const firstKillTimestamp =
              CSGO_ROUND_LENGTH - individualKills[0].timestamp + 1;

            const lastKillTimestamp =
              CSGO_ROUND_LENGTH - individualKills[killAmount - 1].timestamp + 1;

            const firstKillTimeStr =
              firstKillTimestamp - 60 > 0
                ? `1:${Math.trunc(firstKillTimestamp - 60)
                    .toString()
                    .padStart(2, "0")}`
                : Math.trunc(firstKillTimestamp).toString().padStart(4, "0:");

            const fragSpeed =
              firstKillTimestamp - lastKillTimestamp < 6
                ? "-fast"
                : individualKills.filter((kill, i) => {
                    if (i + 1 != killAmount) {
                      return (
                        individualKills[i + 1].timestamp - kill.timestamp > 15
                      );
                    }
                  }).length >= 2
                ? "-spread"
                : "";

            const weaponsUsed = getWeaponsUsed(individualKills);

            const teamCamelized = camelizeIsh(team);

            matchFragFormat.push({
              fragType,
              steamId,
              tick,
              fragFormat: `x._${playerCamelized}_${fragTypeDetails}${
                !fragType.includes("deagle")
                  ? "-" + weaponsUsed + fragSpeed
                  : ""
              }_${match.map}_team-${teamCamelized}_r${roundNumberStr}${
                antieco ? "_#ANTIECO" : ""
              } ${firstKillTimeStr} (demo_gototick ${tick})`,
            });
          }
        );

        fragsFound = true;
      });

      matchFragFormat.sort((a, b) => {
        if (a.fragType === "3k" && b.fragType != "3k") return 1;
        if (a.fragType === "3k" && b.fragType === "3k") return 0;
        if (a.fragType !== "3k" && b.fragType === "3k") return -1;
      });

      matchFragFormat.forEach(({ fragType, fragFormat }) => {
        if (fragType === "3k") {
          /* Regular indented. */
          if (!matchText.includes("\n         ----3k's:\n")) {
            matchText.push("\n         ----3k's:\n");
          }

          /* Extra indented for 3k's. */
          matchText.push(`               ${fragFormat}\n`);
        } else {
          if (!fragType.includes("deagle")) {
            matchText.push(`   ${fragFormat}\n`);
          }
        }
      });

      if (!fragsFound) {
        matchText.splice(
          1,
          0,
          match.breakMsg
            ? `\n\n    ${match.breakMsg}\n`
            : "   no frags found. \n"
        );
      }

      if (matchFragFormat[0]) {
        // matchText[0] += `@${matchFragFormat[0].tick}\n\n`;
        matchText[0] += `\n\n`;
      }

      matchContent += matchText.join("") + "\n\n\n";
    }

    if (previewMode) {
      createPreviewWindow(matchContent);
    } else {
      // Existing file save code
      const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: "highlights.txt",
        filters: [{ name: "Text File", extensions: ["txt"] }],
      });

      if (filePath && !canceled) {
        msgBox = "File has been created!";

        fs.writeFile(filePath, matchContent, (err) => {
          if (err) throw err;
        });
      } else {
        msgBox = "File creation cancelled!";
      }
    }
  }

  /* Gathers info about weapon usage from throughout the game. */
  function getWeaponsUsed(kills) {
    let weaponsUsed = kills
      .map((kill) => [kill.weapon, kill.weaponType])
      .reduce((acc, curr) => {
        switch (curr[0]) {
          case "AK-47":
          case "M4A4":
          case "M4A1-S":
          case "CZ75-Auto": {
            const shortVersion = curr[0].substr(0, 2);
            acc[shortVersion] = acc[shortVersion] + 1 || 1;
            return acc;
          }

          case "Desert Eagle":
            acc["deagle"] = acc["deagle"] + 1 || 1;
            return acc;

          case "Galil AR":
            acc["Galil"] = acc["Galil"] + 1 || 1;
            return acc;

          case "Scar-20":
            acc["Autosniper"] = acc["Autosniper"] + 1 || 1;
            return acc;

          case "Incendiary":
            acc["molotov"] = acc["molotov"] + 1 || 1;
            return acc;

          case "SSG 08":
            acc["scout"] = acc["scout"] + 1 || 1;
            return acc;

          case "SG 553":
            acc["krieg"] = acc["krieg"] + 1 || 1;
            return acc;

          case "UMP-45":
            acc["UMP"] = acc["UMP"] + 1 || 1;
            return acc;

          case "MP5-SD":
            acc["mp5"] = acc["mp5"] + 1 || 1;
            return acc;

          case "USP-S":
          case "USP":
            acc["USP"] = acc["USP"] + 1 || 1;
            return acc;

          default:
            if (curr[1] === 1) {
              acc["pistol"] = acc["pistol"] + 1 || 1;
              return acc;
            } else if (curr[0] === "HE Grenade") {
              acc["HE"] = acc["HE"] + 1 || 1;
              return acc;
            } else if (curr[1] === 5) {
              acc["shotgun"] = acc["shotgun"] + 1 || 1;
              return acc;
            } else {
              acc[curr[0]] = acc[curr[0]] + 1 || 1;
              return acc;
            }
        }
      }, {});

    const keys = Object.keys(weaponsUsed);

    weaponsUsed =
      keys.length === 1
        ? keys[0]
        : keys
            .map(
              (weapon, i) =>
                `${i === 0 ? "" : "-"}${weapon}(${weaponsUsed[weapon]})`
            )
            .join("");

    return weaponsUsed;
  }

  /**
   * Takes a folder path, gets the highlights from the folder, creates a textfile with
   * data from each highlight, and displays a message box with results
   * @param folderPath - The path to the folder where the demo files are located.
   */
  async function runFragFinder(folderPath) {
    matchContent = "";

    try {
      const highlights = await getFrags(folderPath, steamid);
      await createFiles(highlights, previewMode);
      console.log("highlights processed!");

      if (!previewMode) {
        createCustomModal({
          title: "File creation",
          message: msgBox,
          buttons: ["Ok"],
        });
      }
    } catch (e) {
      console.log("something went wrong:", e.message);
    }
  }

  /* Run the runFragFinder function with the folderPath as the argument. */
  runFragFinder(folderPath);
});

/* Showing dialog box when an update is available. */
autoUpdater.on("update-available", () => {
  createCustomModal({
    title: "Application Update",
    message:
      "A new version is being downloaded in the background and will automatically close the app when it's done.",
    buttons: ["Ok"],
  });
});

/* Showing dialog box upon update error. */
autoUpdater.on("error", (err) => {
  createCustomModal({
    title: "Error when auto-updating",
    message: err,
    buttons: ["Ok"],
  });
});

/* Autoquit app on update completion. */
autoUpdater.on("update-downloaded", (info) => {
  autoUpdater.quitAndInstall();
});

/* Add these IPC handlers after the existing ones */
ipcMain.on("open-player-search", () => {
  if (playerSearchWindow) {
    // If window exists, focus it instead of creating a new one
    playerSearchWindow.focus();
    return;
  }
  playerSearchWindow = createPlayerSearchWindow(mainWindow);

  // Clear the reference when window is closed
  playerSearchWindow.on("closed", () => {
    playerSearchWindow = null;
  });
});

ipcMain.on("player-selected", (event, steamId) => {
  mainWindow.webContents.send("player-selected", steamId);
  BrowserWindow.getFocusedWindow().close();
});

// Add this with the other IPC handlers
ipcMain.on("show-error-modal", (event, options) => {
  createCustomModal(options);
});

// Add these IPC handlers
ipcMain.on("save-settings", async (event, settings) => {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
});

ipcMain.handle("load-settings", async () => {
  try {
    const data = await fs.readFile(settingsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Return default settings if file doesn't exist
    return { previewMode: false };
  }
});
