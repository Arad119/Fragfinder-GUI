const fs = require("fs");
const path = require("path");

function isValidSteamId(steamId) {
  return /^[0-9]{17}$/.test(steamId);
}

function validateJson(jsonData) {
  if (!jsonData || !jsonData.players || !Array.isArray(jsonData.players)) {
    return { valid: false, message: "Invalid JSON structure." };
  }

  const nameRealNameMap = new Map();
  const steamIdMap = new Map();
  const imageBaseNameMap = new Map();
  const duplicates = { namesAndRealNames: [], steamIds: [], images: [] };
  const invalidSteamIds = [];
  const invalidImageNames = [];

  // First pass: collect all base image names and their versions
  for (const player of jsonData.players) {
    const baseImageName = player.name;
    const imageLowerCase = player.image.toLowerCase();

    if (!imageBaseNameMap.has(baseImageName.toLowerCase())) {
      imageBaseNameMap.set(baseImageName.toLowerCase(), []);
    }
    imageBaseNameMap.get(baseImageName.toLowerCase()).push({
      image: player.image,
      player,
    });
  }

  // Second pass: validate everything
  for (const player of jsonData.players) {
    const nameRealNameKey = `${player.name}-${player.realName}`;
    const imageLowerCase = player.image.toLowerCase();
    const baseImageName = player.name;

    // Validate image name format
    const validImageFormat = new RegExp(
      `^${baseImageName}(?:_v\\d+)?\\.png$`,
      "i"
    );
    if (!validImageFormat.test(player.image)) {
      // Only add to invalidImageNames if it's not a versioning issue
      // (which would be caught by the duplicate check later)
      const existingVersions = imageBaseNameMap.get(
        baseImageName.toLowerCase()
      );
      if (existingVersions.length <= 1) {
        invalidImageNames.push({
          player,
          reason: `Invalid image name format. Should be '${player.name}.png'`,
          suggestedName: `${player.name}.png`,
        });
      }
    }

    // Check for duplicate name-realName combinations
    if (nameRealNameMap.has(nameRealNameKey)) {
      duplicates.namesAndRealNames.push({
        name: player.name,
        realName: player.realName,
        existing: nameRealNameMap.get(nameRealNameKey),
        duplicate: player,
      });
    } else {
      nameRealNameMap.set(nameRealNameKey, player);
    }

    // Check for duplicate Steam IDs
    if (steamIdMap.has(player.steamId)) {
      duplicates.steamIds.push({
        steamId: player.steamId,
        existing: steamIdMap.get(player.steamId),
        duplicate: player,
      });
    } else {
      steamIdMap.set(player.steamId, player);
    }

    // Check for case-insensitive image name duplicates
    if (imageBaseNameMap.get(baseImageName.toLowerCase()).length > 1) {
      const existingVersions = imageBaseNameMap.get(
        baseImageName.toLowerCase()
      );
      const currentIndex = existingVersions.findIndex(
        (v) => v.player === player
      );

      if (currentIndex > 0) {
        const expectedVersion = currentIndex + 1;
        const expectedName = `${player.name}_v${expectedVersion}.png`;

        if (player.image.toLowerCase() !== expectedName.toLowerCase()) {
          duplicates.images.push({
            image: player.image,
            existing: existingVersions[0].player,
            duplicate: player,
            suggestedName: expectedName,
          });
        }
      }
    }

    // Validate Steam ID format
    if (!isValidSteamId(player.steamId)) {
      invalidSteamIds.push({ player, reason: "Invalid SteamID64 format." });
    }
  }

  if (
    duplicates.namesAndRealNames.length > 0 ||
    duplicates.steamIds.length > 0 ||
    duplicates.images.length > 0 ||
    invalidSteamIds.length > 0 ||
    invalidImageNames.length > 0
  ) {
    return {
      valid: false,
      message: "Validation errors found.",
      duplicates,
      invalidSteamIds,
      invalidImageNames,
    };
  }

  return {
    valid: true,
    message:
      "JSON is valid with no duplicates, invalid SteamIDs nor any wrong image paths.",
  };
}

// Load and validate the JSON file
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
