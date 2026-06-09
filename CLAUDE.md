# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pixel Strike** is a retro 2D top-down browser-based shooter game built with Phaser 3 (via CDN) and vanilla JavaScript. No build step, no bundler — just static files served locally.

**GitHub:** https://github.com/SediKOR/pixel-strike

## Architecture

### Scene-Based Flow
The game uses Phaser's scene system to manage state transitions:
- **MenuScene** → title, start button, hi-score display
- **GameScene** → core gameplay loop with player, enemies, bullets, and collision
- **HUDScene** → runs in parallel with GameScene; displays health, score, level, enemy count
- **LevelScene** → brief transition screen between waves
- **GameOverScene** → final score, hi-score check, restart options

Scenes are registered in `main.js` and transition via `this.scene.start()` or `this.scene.stop()`.

### Sprite Generation
All textures (player, enemies, bullets, particles) are generated **at runtime** in `SpriteFactory.js` using Phaser's Graphics API. No external image files. This happens once in `MenuScene.create()` and is idempotent (checks texture existence before creating).

Animations are defined once per texture type (e.g., `player-walk`, `enemy-basic-walk`) and can be reused across instances.

### Entity Classes
- **Player** (`entities/Player.js`) — moves via arrow keys, rotates toward mouse, shoots on click. Tracks HP (100), cooldown, and alive state.
- **Enemy** (`entities/Enemy.js`) — three types (basic, fast, tank) with varying speed and health. Auto-chases player, draws HP bar above sprite, emits particles on death.
- **Bullet** (`entities/Bullet.js`) — created directly as arcade sprites (not pooled). Travels toward aim vector, destroyed after 1.5s or off-screen.

### Game Progression
**LevelConfig.js** defines enemy waves per level. Levels 1–5 are hardcoded; beyond that, scaling is procedural (more enemies, less spawn delay). Each level tracks `totalToKill` and `totalKilled` to detect wave clear and trigger the next level.

### Retro Style
- 800×600 canvas, pixel-perfect rendering (`pixelArt: true`)
- Color palette: dark background (#0a0a1a), neon accents (red/orange/purple enemies, yellow bullets, green player)
- Scanline overlay effect (semi-transparent horizontal lines)
- "Press Start 2P" font via Google Fonts CDN
- Screen shake on player damage

## Development

### Running Locally

From the `/game/` directory:

```bash
# Start HTTP server (runs on port 8787)
python3 -m http.server 8787

# In another terminal, open the game
open http://localhost:8787/
```

Server stays running; changes to `.js` files are live on page refresh (no build step).

### File Organization

```
game/
  index.html          ← loads Phaser 3 CDN, Google Fonts, wires up scenes
  main.js             ← Phaser game config, scene registry
  scenes/             ← scene classes
  entities/           ← Player, Enemy, Bullet classes
  utils/              ← SpriteFactory (texture generation), LevelConfig
```

### Making Changes

**Add a new scene:** Create `scenes/NewScene.js`, extend `Phaser.Scene`, register in `main.js` scene array.

**Add a sprite type:** Draw it in `SpriteFactory.createAll()` using `scene.add.graphics()`, call `generateTexture()`, register the anim in the same method.

**Adjust difficulty:** Edit `LevelConfig.js` — enemy counts, spawn delays, or add new levels.

**Change colors/style:** Sprite colors are hardcoded in `SpriteFactory.js`; update hex values there. Game background is in `main.js` config.

### Git & GitHub

All commits should reference the changes clearly. Use descriptive commit messages.

```bash
# Make changes
git add <files>
git commit -m "message"
git push origin main
```

Use feature branches for experimental work:
```bash
git checkout -b feature/new-enemy-type
# ... work ...
git push origin feature/new-enemy-type
```

Then create a pull request on GitHub to merge back to main.

## Testing

There is no automated test suite. Verify changes by:
1. Running the game locally (`python3 -m http.server 8787`)
2. Opening http://localhost:8787/ in a browser
3. Testing the specific feature (movement, shooting, enemy spawn, wave clear, etc.)
4. Checking browser console (F12) for errors

## Dependencies

- **Phaser 3.60.0** — loaded from CDN (`https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js`)
- **Press Start 2P font** — loaded from Google Fonts CDN
- **No npm packages, no build tools**

## Common Edits

| Goal | Files |
|---|---|
| Tweak player speed/damage | `entities/Player.js` |
| Change enemy behavior | `entities/Enemy.js` |
| Adjust bullet speed/lifetime | `entities/Bullet.js` |
| Add/edit levels | `utils/LevelConfig.js` |
| Modify sprite designs | `utils/SpriteFactory.js` |
| Change game colors/style | `main.js`, `SpriteFactory.js` |
| Adjust HUD layout | `scenes/HUDScene.js` |
| Tweak game loop logic | `scenes/GameScene.js` |
