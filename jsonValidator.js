const fs = require("fs");
const path = require("path");

function isValidSteamId(steamId) {
  return /^[0-9]{17}$/.test(steamId);
}

function validateJson(jsonData) {
  if (!jsonData || !jsonData.players || !Array.isArray(jsonData.players)) {
    return { valid: false, message: "Invalid JSON structure." };
  }

  const nameMap = new Map();
  const steamIdMap = new Map();
  const duplicates = { names: [], steamIds: [] };
  const invalidSteamIds = [];

  for (const player of jsonData.players) {
    if (nameMap.has(player.name)) {
      duplicates.names.push({
        name: player.name,
        existing: nameMap.get(player.name),
        duplicate: player,
      });
    } else {
      nameMap.set(player.name, player);
    }

    if (steamIdMap.has(player.steamId)) {
      duplicates.steamIds.push({
        steamId: player.steamId,
        existing: steamIdMap.get(player.steamId),
        duplicate: player,
      });
    } else {
      steamIdMap.set(player.steamId, player);
    }

    if (!isValidSteamId(player.steamId)) {
      invalidSteamIds.push({ player, reason: "Invalid SteamID64 format." });
    }
  }

  if (
    duplicates.names.length > 0 ||
    duplicates.steamIds.length > 0 ||
    invalidSteamIds.length > 0
  ) {
    return {
      valid: false,
      message: "Validation errors found.",
      duplicates,
      invalidSteamIds,
    };
  }

  return {
    valid: true,
    message: "JSON is valid with no duplicates or invalid SteamIDs.",
  };
}

// Load JSON data from file
const filePath = path.join(__dirname, "assets", "data", "players.json");
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    console.log(JSON.stringify(validateJson(jsonData), null, 2));
  } catch (error) {
    console.error("Invalid JSON format:", error);
  }
});
