# Fragfinder Assets

This repository contains static assets used by the Fragfinder application.

## Requirements

### Player Eligibility

Players must meet the following criteria to be added to the database:

- Must have an active HLTV profile
- Must have a Liquipedia page with verified Steam ID
- Must be a current or former professional CS:GO/CS2 player

These requirements ensure:

1. Accurate player information verification
2. Legitimate Steam ID confirmation
3. Consistent image quality standards
4. Professional player database integrity

Players without both HLTV and Liquipedia presence cannot be added to maintain data reliability.

## Data Sources

### Player Data

The player data includes information about professional CS:GO/CS2 players:

- Player nicknames
- Real names
- Steam IDs
- Player images

### Attribution

- Player images are sourced from [HLTV.org](https://www.hltv.org)
- Steam IDs are collected from [Liquipedia](https://liquipedia.net/counterstrike/)

## Cache Policy

The Fragfinder application uses two levels of caching:

1. **Player Data**:

   - Cached locally for 12 hours
   - Located in user's app data directory
   - Reduces API calls to the CDN

2. **Player Images**:
   - Served through jsDelivr CDN
   - Global CDN distribution with automatic caching
   - Cache duration: 7 days

This dual caching strategy ensures fast loading times and reduced bandwidth usage while keeping player data up to date.

## Contributing

To add or update player data:

1. Fork this repository
2. Create a new branch: `git checkout -b add-player-[playername]`
3. Add the following files:
   - Player image to `assets/playerImages/[playername].png`
   - Update `assets/data/players.json` with the player's information:
     ```json
     {
       "name": "playername",
       "realName": "Player Full Name",
       "steamId": "765xxxxxxxxxx",
       "image": "playername.png"
     }
     ```
4. Create a pull request with:
   - Title: `Add player: [playername]`
   - Description: Include the player's:
     - HLTV profile link (source of image)
     - Liquipedia page (source of Steam ID)

Please ensure images are:

- Unmodified from the original source
- In a .png file format
- Named exactly as referenced in players.json

## Validation

Before submitting a pull request, validate your JSON changes using the included validator script:

### Prerequisites

- Node.js installed on your system
- Access to the terminal/command prompt

### Steps

1. Open your terminal/command prompt
2. Navigate to the repository root directory
3. Run the validator script:

```bash
node jsonValidator.js
```

4. Check the output:

- If valid, you'll see:

The validator checks for:

- Valid JSON structure
- Duplicate player names
- Duplicate Steam IDs
- Valid Steam ID format (must be a 17-digit number)

Example validation output if no errors:

```json
{
  "valid": true,
  "message": "JSON is valid with no duplicates or invalid SteamIDs."
}
```

If validation fails, you'll receive detailed error information:

```json
{
  "valid": false,
  "message": "Validation errors found.",
  "duplicates": {
    "names": [],
    "steamIds": []
  },
  "invalidSteamIds": [
    {
      "player": {
        "name": "example",
        "steamId": "invalid"
      },
      "reason": "Invalid SteamID64 format."
    }
  ]
}
```

Fix any validation errors before submitting your pull request.

## License

- Player images are property of HLTV.org
- Player data (names, Steam IDs) are factual information not subject to copyright
- Data compilation format and validation code are licensed under GPL-3.0
