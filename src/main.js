const { app, BrowserWindow, dialog, ipcMain, globalShortcut  } = require('electron');
const electron = require('electron');
const path = require('path');

var ipc = require('electron').ipcMain;

ipc.on('close-main-window', function() {
    app.quit();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
let paths = null
let folderPath

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js",
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
    }
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  // Register a shortcut listener for Ctrl + Shift + I
  globalShortcut.register('Control+Shift+I', () => {
      // When the user presses Ctrl + Shift + I, this function will get called
      // You can modify this function to do other things, but if you just want
      // to disable the shortcut, you can just return false
      return false;
  });
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on('select-dirs', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })


const fs = require("fs").promises;
const path = require("path");
const CSGO_ROUND_LENGTH = 115;


async function getFrags(
  pathToJsonFiles,
  playerChosen = false
) {
  const demosHighlights = [];
  const files = await fs.readdir(pathToJsonFiles);
  const demoFiles = files.filter(
    file => path.extname(file).toLowerCase() === ".json"
  );

  for (let i = 0; i < demoFiles.length; i++) {
    const data = await fs.readFile(`${pathToJsonFiles}/${demoFiles[i]}`);
    const matchData = await JSON.parse(data);
    console.log("analyzing", matchData.name);

    demosHighlights.push({
      demoName: matchData.name.replace(".dem", ""),
      map: matchData.map_name.replace("de_", ""),
      roundsWithHighlights: [],
    });

    if (demoIsBroken(matchData)) {
      demosHighlights[
        i
      ].breakMsg = `Can't extract highlights from this demo - there's only ${matchData.rounds.length} rounds in the JSON file. The demo is probably partially corrupted, but looking through it manually in-game might work. You could also try to analyze it again in CS:GO Demos Manager, export a new JSON file and try again.`;
      continue;
    }
    const allNotableClutchesInMatch = matchData.players
      .filter(player =>
        player.clutches.some(
          clutch => clutch.has_won && clutch.opponent_count >= 3
        )
      )
      .map(player => {
        return player.clutches
          .filter(clutch => clutch.has_won && clutch.opponent_count >= 3)
          .map(({ opponent_count, round_number }) => ({
            player: player.name,
            opponentCount: opponent_count,
            roundNumber: round_number,
          }));
      })
      .flat();

    matchData.rounds.forEach((currentRound, roundIndex) => {
      demosHighlights[i].roundsWithHighlights.push({
        roundNumber: currentRound.number,
        frags: [],
      });

      let roundkillsPerPlayer = currentRound.kills.reduce((acc, kill) => {
        if (acc[kill.killer_name]) {
          acc[kill.killer_name].kills.push(kill);
        } else {
          acc[kill.killer_name] = {
            kills: [kill],
            steamId: kill.killer_steamid,
          };
        }
        return acc;
      }, {});

      if (playerChosen) {
        // Filter out all players except chosen user
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
          ({ roundNumber, player }) =>
            roundNumber === currentRound.number && player === player
        );

        const fragType = getFragtype(kills, clutch);

        if (kills.length >= 3 || fragType.includes("deagle")) {
          const team = kills[0].killer_team
            ? kills[0].killer_team.includes("]")
              ? kills[0].killer_team.split("]")[1].trim()
              : kills[0].killer_team.trim()
            : "not found";

          demosHighlights[i].roundsWithHighlights[roundIndex].frags.push({
            player,
            steamId,
            team,
            fragType,
            ...(clutch ? { clutchOpponents: clutch.opponentCount } : {}),
            antieco: isAntieco(kills, matchData, currentRound),
            killAmount: kills.length,
            tick: tickFirstKill,
            individualKills: kills.map(({ time_death_seconds, weapon }) => ({
              timestamp: time_death_seconds,
              weapon: weapon.weapon_name,
              weaponType: weapon.type,
            })),
          });
        }
      }
    });
  }
  return demosHighlights;
};

function demoIsBroken(matchData) {
  return matchData.rounds.length <= 15;
}

function getFragtype(kills, clutch) {
  if (kills.length >= 3) {
    return clutch ? "clutch" : `${kills.length}k`;
  }
  if (hasNotableDeagleFrags(kills)) {
    const deagleKills = kills.filter(
      kill => kill.weapon.weapon_name === "Desert Eagle"
    );

    return `deagle${deagleKills.length}k`;
  }
  return `${kills.length}k`;
}

//1k with hs or 2k where one is hs. Could pick up potentially great onedeags.
function hasNotableDeagleFrags(kills) {
  return kills.some(
    ({ weapon, is_headshot }) =>
      weapon.weapon_name === "Desert Eagle" && is_headshot
  );
}

function isAntieco(playerKills, matchData, roundNr) {
  const killedSteamIds = playerKills.map(kill => kill.killed_steamid);
  const enemyPlayers = matchData.players.filter(player =>
    killedSteamIds.includes(player.steamid)
  );

  return (
    enemyPlayers.every(
      player => player.equipement_value_rounds[roundNr] < 1000
    ) && ![1, 16].includes(roundNr)
  );
}

const camelizeIsh = function (text) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return text;
};






async function createFiles(data) {
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

          //i.e. 1v3-4k vs just 4k
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
              !fragType.includes("deagle") ? "-" + weaponsUsed + fragSpeed : ""
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
        //Regular indented
        if (!matchText.includes("\n         ----3k's:\n")) {
          matchText.push("\n         ----3k's:\n");
        }

        //Extra indented for 3k's
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
        match.breakMsg ? `\n\n    ${match.breakMsg}\n` : "   no frags found. \n"
      );
    }

    if (matchFragFormat[0]) {
      // matchText[0] += `@${matchFragFormat[0].tick}\n\n`;
      matchText[0] += `\n\n`;
    }

    await fs.appendFile(
      "highlights.txt",
      matchText.join("") + "\n\n\n"
    );   

  }




};

function getWeaponsUsed(kills) {
  let weaponsUsed = kills
    .map(kill => [kill.weapon, kill.weaponType])
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

async function runFragFinder(folderPath) {
  try {
    const highlights = await getFrags(folderPath, "");
    await createFiles(highlights);
    console.log("files created!");
  } catch (e) {
    console.log("something went wrong:", e.message);
  }
}

folderPath = result.filePaths[0]


runFragFinder(folderPath);


  //console.log('directories selected', result.filePaths[0])
})







