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

## License
- Player images are property of HLTV.org
- Player data compilation is licensed under MIT
