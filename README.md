<div id="top"></div>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Downloads][downloads-shield]][downloads-url]
[![Issues][issues-shield]][issues-url]
[![GPL-3.0 License][license-shield]][license-url]

---

The project is feature complete and works as intended with both CS2 and CSGO demos. Feel free to use it, but as of now, no new features will be added. ✌️

---

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Arad119/Fragfinder-GUI">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Fragfinder-GUI</h3>

  <p align="center">
    A modern GUI application for analyzing CS2 and CSGO demo files to generate highlight timestamps. Built upon <a href="https://github.com/HenB13/frag-finder">henb13/frag-finder</a>.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#example-output-with-explanation">Example Output With Explanation</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#how-to-use">How To Use</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![FragFinder-GUI Screenshot][product-screenshot]

Fragfinder-GUI is a modern desktop application that analyzes CS2 and CSGO demo files to automatically generate highlight timestamps. It features a modern interface for processing demos and filtering highlights by specific players.

![Pro Player Search][player-search-screenshot]

The built-in pro player search feature allows you to easily find and select professional players' Steam IDs without having to look them up manually.

### Built With

- [Electron](https://www.electronjs.org/)
- [frag-finder](https://github.com/HenB13/frag-finder)
- [cs-demo-analyzer](https://github.com/akiver/cs-demo-analyzer)

### Features

- 🎮 Support for both CS2 and CSGO demos
- 🔍 Built-in pro player search with Steam ID lookup
- 🎯 Filter highlights by specific player using Steam ID
- 👀 Preview mode to view the results in a window instead of saving to a text file
- 🔄 Automatic updates
- 🎨 Modern dark theme UI
- 📁 File saving selection

### Example Output With Explanation

```
**playdemo astralis-vs-g2-m1-dust2_62005.dem

   x._NiKo_4k-AK_dust2_team-G2Esports_r09 1:39 (demo_gototick 181732)
   x._NiKo_4k-AK_dust2_team-G2Esports_r10 0:28 (demo_gototick 216370)
   x._device_4k-pistol_dust2_team-Astralis_r16 1:17 (demo_gototick 335540)
   x._nexa_4k-M4(3)-AK(1)_dust2_team-G2Esports_r21 1:43 (demo_gototick 407064)

         ----3k's:
               x._device_3k-scout-fast_dust2_team-Astralis_r02 0:26 (demo_gototick 73469)
               x._gla1ve_3k-deagle_dust2_team-Astralis_r06 1:12 (demo_gototick 142265)
               x._kennyS_3k-AWP_dust2_team-G2Esports_r08 0:58 (demo_gototick 174142)
               x._dupreeh_3k-AUG_dust2_team-Astralis_r10 0:43 (demo_gototick 214436)
               x._huNter_3k-AK-spread_dust2_team-G2Esports_r11 1:42 (demo_gototick 223858)
               x._NiKo_3k-G3SG1(1)-AK(2)-spread_dust2_team-G2Esports_r15 1:52 (demo_gototick 288958)
               x._dupreeh_3k-Galil_dust2_team-Astralis_r17 1:33 (demo_gototick 343701)
               x._NiKo_3k-M4_dust2_team-G2Esports_r19 1:29 (demo_gototick 374217)
               x._huNter_3k-AK_dust2_team-G2Esports_r22 0:59 (demo_gototick 432460)
               x._Magisk_3k-AK-fast_dust2_team-Astralis_r29 1:16 (demo_gototick 558995)
               x._kennyS_3k-AWP_dust2_team-G2Esports_r30 1:06 (demo_gototick 571872)
```

- <b>spread</b> (as in the frags being "spread out") is labelled for any 3k, 4k or ace where at least 15 seconds elapsed between two or more of the kills.
- <b>fast</b> is labelled for any frag where all the kills happen within six seconds.
- The <b>timestamp</b> listed at the end of each frag represents the time shown on the ingame clock when the first kill of the highlight occures.
- The <b>tick</b> listed at the end of each frag is the very end of the round prior (1000 ticks before the start of the target round to be precise). This is to prevent potential player model lags that can occur when using the "start of the round" button. Taking you to right before the round starts allows you to use the "next round" button instead, potentially preventing such lag. Including "demo_gototick" is meant for easier copy/paste to the ingame console.
- The <b>round number</b> is shown at the end of each highlight string, for example <i>r25</i> for round 25.
- the <b>x.\_</b> preceding every highlight is meant to be replaced by a number when you have recorded the frag, making the whole line appropriate as a filename for your video file. The information provided in the filename will then be easily searchable in your editing software, serving as helpful tags.

Explanation taken from [henb13/frag-finder](https://github.com/HenB13/frag-finder).

## Getting Started

### Installation

1. Download the latest "Fragfinder-Setup-x.x.x.exe" from [Releases](https://github.com/Arad119/Fragfinder-GUI/releases)
2. Run the installer
3. Choose your installation location

### How To Use

1. Select your demos folder
2. Optional: Use the pro player search or enter a Steam ID to filter highlights for a specific player
3. Optional: Enable "Preview highlights" checkbox to view the results in a window instead of saving to a text file
4. Click "Process Demos"
5. Wait for processing to complete
6. Based on your choice in step 3:
   - If preview mode is off: Choose where to save your highlights.txt file
   - If preview mode is on: View your highlights in a preview window

## Contributing

The player database used for the pro player search feature is maintained in a separate branch (`gh-pages`) that serves as a CDN for the application. To contribute new players:

#### Player Eligibility

Players must meet ALL of the following criteria:

- Have an active HLTV profile
- Have a Liquipedia page with verified Steam ID
- Be a current or former professional CS:GO/CS2 player

These requirements ensure data reliability and verification of player information.

#### How to Contribute

1. Fork the repository
2. Switch to the `gh-pages` branch
3. Create a new branch: `git checkout -b add-player-[playername]`
4. Add required files:
   - Player image: `assets/playerImages/[playername].png`
   - Update `assets/data/players.json`:
     ```json
     {
       "name": "playername",
       "realName": "Player Full Name",
       "steamId": "765xxxxxxxxxx",
       "image": "playername.png"
     }
     ```
5. Create a pull request with:
   - Title: `Add player: [playername]`
   - Description including:
     - HLTV profile link (source of image)
     - Liquipedia page (source of Steam ID)

#### Image Requirements

- Must be unmodified from HLTV source
- Must be converted to a .png format
- Named exactly as referenced in players.json

#### Data Sources & Attribution

- Player images are sourced from [HLTV.org](https://www.hltv.org)
- Steam IDs are verified through [Liquipedia](https://liquipedia.net/counterstrike/)

For more detailed contribution guidelines, please visit the [gh-pages branch](https://github.com/Arad119/Fragfinder-GUI/tree/gh-pages).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Add SteamID filtering
- [x] Add Startmenu Shortcut & Installation Path Selection
- [x] See progress of demo processing
- [x] Auto-updater/Update notification
- [x] Better UI
- [x] Create highlights file without prerequisites - Skip the need for CSGO Demos Manager
- [x] Support for both CS2 and CSGO demos

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GPL-3.0 License. See `LICENSE.txt` for more information.

Player images are property of [HLTV.org](https://www.hltv.org)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/Arad119/Fragfinder-GUI.svg?style=for-the-badge
[contributors-url]: https://github.com/Arad119/Fragfinder-GUI/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Arad119/Fragfinder-GUI.svg?style=for-the-badge
[forks-url]: https://github.com/Arad119/Fragfinder-GUI/network/members
[stars-shield]: https://img.shields.io/github/stars/Arad119/Fragfinder-GUI.svg?style=for-the-badge
[stars-url]: https://github.com/Arad119/Fragfinder-GUI/stargazers
[downloads-shield]: https://img.shields.io/github/downloads/Arad119/Fragfinder-GUI/total.svg?style=for-the-badge&color=purple
[downloads-url]: https://github.com/Arad119/Fragfinder-GUI/releases
[issues-shield]: https://img.shields.io/github/issues/Arad119/Fragfinder-GUI.svg?style=for-the-badge
[issues-url]: https://github.com/Arad119/Fragfinder-GUI/issues
[license-shield]: https://img.shields.io/github/license/Arad119/Fragfinder-GUI.svg?style=for-the-badge
[license-url]: https://github.com/Arad119/Fragfinder-GUI/blob/master/LICENSE.txt
[product-screenshot]: images/Program.png
[player-search-screenshot]: images/Player-Search.png
