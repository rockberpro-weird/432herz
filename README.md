<p align="center">
  <img src="128.png" alt="432Herz heart icon" width="128">
</p>

<h1 align="center">432Herz</h1>

<p align="center">Play your YouTube videos in 432Hz</p>

## What it does

432Herz is a Chrome extension that retunes audio on YouTube and YouTube Music from the standard A=440Hz to A=432Hz. It sets the page's `<video>` element to `playbackRate = 432 / 440` with `preservesPitch = false` (see `432hz.js`), which lowers the pitch accordingly. Switching back to 440Hz restores normal playback (`440hz.js`).

> Side effect: since pitch and speed are tied together, playback runs about 1.8% slower in 432Hz mode.

## Features

- One-click 432Hz / 440Hz toggle from the toolbar popup
- Per-tab setting, or an "All tabs" mode that applies to every YouTube tab, including ones opened later
- Waits for ads to finish before applying, and re-applies as you navigate between videos
- Settings reset when the browser restarts

## Installation (unpacked)

1. Clone this repository:
   ```sh
   git clone https://github.com/rockberpro-play/432herz.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned folder.

## Usage

1. Open a tab on `youtube.com` or `music.youtube.com`.
2. Click the heart icon in the toolbar.
3. Choose **432Hz** or **440Hz**.
4. Optionally check **All tabs** to apply the choice to every YouTube tab.

## Project structure

| File                                  | Purpose                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `manifest.json`                       | Extension manifest (Manifest V3)                                                         |
| `popup.html`, `popup.js`, `style.css` | Toolbar popup UI and logic                                                               |
| `background.js`                       | Service worker: applies global settings to loaded tabs, resets settings on browser start |
| `youtube_injector.js`                 | Content script: watches the page and keeps the selected mode applied                     |
| `432hz.js`, `440hz.js`                | Scripts that set the video's playback rate and pitch behavior                            |
| `16.png` … `256.png`                  | Extension icons                                                                          |

## Permissions

- `activeTab`, `scripting`: run the 432/440Hz scripts in YouTube tabs
- `storage`: remember your selected mode
- `tabs`: find open YouTube tabs and detect the current tab
- Host access is limited to `www.youtube.com` and `music.youtube.com`

## License

[MIT](LICENSE) © Rockberpro
