# Fragfinder Assets

This repository contains static assets used by the Fragfinder application.

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
The Fragfinder application caches player data for 12 hours to reduce API calls and improve performance.

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
- Named exactly as referenced in players.json

## License
- Player images are property of HLTV.org
- Player data compilation is licensed under MIT
