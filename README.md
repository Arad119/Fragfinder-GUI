<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Downloads][downloads-shield]][downloads-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

---

## ⛔ THIS PROJECT IS NO LONGER IN ACTIVE DEVELOPMENT ⛔

Not really sure how much I'll be contibuting to this software in the future, as of now it works as intended with both CS2 and CSGO demos. ✌️

---

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Arad119/Fragfinder-GUI">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Fragfinder-GUI</h3>

  <p align="center">
    Built upon <a href="https://github.com/HenB13/frag-finder">henb13/frag-finder</a> with an added GUI, generate highlight timestamps and filter out specific player highlights. More to come!
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![FragFinder-GUI Screenshot][product-screenshot]

The project was made to skip the need to manually modify files and make the incredible [henb13/frag-finder](https://github.com/HenB13/frag-finder) even better with an added GUI. Uses JSON files created with CSGO Demo Manager to generate readable highlight timestamps, also able to filter out specific player highlights.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Electron](https://www.electronjs.org/)
- [JQuery](https://jquery.com)
- [frag-finder](https://github.com/HenB13/frag-finder)
- [cs-demo-analyzer](https://github.com/akiver/cs-demo-analyzer)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- OUTPUT EXAMPLE -->

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

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get the program up and running follow these simple steps.

### Installation

1. Download the latest "Fragfinder-Setup-x.x.x.exe" via [Fragfinder-GUI/releases](https://github.com/Arad119/Fragfinder-GUI/releases).
2. Run "Fragfinder Setup.exe".
3. Select your installation path.

### How To Use

1. Select the folder which your demo files are located.
2. **Optional: Specify a STEAMID64 to only export their highlights - If no STEAMID64 is specified, all highlights will be exported.**
3. Process Demos.
4. Let the program process all of the demos, length can vary depending on how many demos there are.
5. Specify a filepath for where the highlights.txt file should be saved.
6. Find your highlights.txt file at the filepath you decided to save it.

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

See the [open issues](https://github.com/Arad119/Fragfinder-GUI/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GPLv3 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

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
