// Generates all game textures programmatically — no external image files needed.
class SpriteFactory {
  static createAll(scene) {
    SpriteFactory.createPlayer(scene);
    SpriteFactory.createEnemies(scene);
    SpriteFactory.createBullet(scene);
    SpriteFactory.createParticle(scene);
    SpriteFactory.createMuzzleFlash(scene);
    SpriteFactory.createHealthBar(scene);
    SpriteFactory.createStars(scene);
  }

  static createPlayer(scene) {
    const frames = [];

    // Walk cycle: 4 frames, player faces RIGHT (rotation handles direction)
    for (let f = 0; f < 4; f++) {
      const key = `player_walk_${f}`;
      const g = scene.add.graphics();
      const cx = 16, cy = 16;

      // Body (green)
      g.fillStyle(0x22cc44);
      g.fillRect(cx - 6, cy - 8, 12, 14);

      // Head
      g.fillStyle(0x88ddaa);
      g.fillRect(cx - 5, cy - 16, 10, 10);

      // Eyes
      g.fillStyle(0x001100);
      g.fillRect(cx - 3, cy - 14, 2, 2);
      g.fillRect(cx + 1, cy - 14, 2, 2);

      // Arms
      g.fillStyle(0x22cc44);
      g.fillRect(cx - 10, cy - 7, 4, 8);
      g.fillRect(cx + 6, cy - 7, 4, 8);

      // Legs — animate by shifting
      const legOffset = [0, 3, 0, -3][f];
      g.fillStyle(0x116622);
      g.fillRect(cx - 5, cy + 6, 4, 8 + legOffset);
      g.fillRect(cx + 1, cy + 6, 4, 8 - legOffset);

      // Gun (right side)
      g.fillStyle(0x888888);
      g.fillRect(cx + 6, cy - 4, 10, 4);
      g.fillStyle(0x555555);
      g.fillRect(cx + 14, cy - 5, 3, 6);

      g.generateTexture(key, 32, 32);
      g.destroy();
      frames.push(key);
    }

    // Idle: 2 frames (subtle bob)
    for (let f = 0; f < 2; f++) {
      const key = `player_idle_${f}`;
      const g = scene.add.graphics();
      const cx = 16, cy = 16 + (f === 1 ? 1 : 0);

      g.fillStyle(0x22cc44);
      g.fillRect(cx - 6, cy - 8, 12, 14);
      g.fillStyle(0x88ddaa);
      g.fillRect(cx - 5, cy - 16, 10, 10);
      g.fillStyle(0x001100);
      g.fillRect(cx - 3, cy - 14, 2, 2);
      g.fillRect(cx + 1, cy - 14, 2, 2);
      g.fillStyle(0x22cc44);
      g.fillRect(cx - 10, cy - 7, 4, 8);
      g.fillRect(cx + 6, cy - 7, 4, 8);
      g.fillStyle(0x116622);
      g.fillRect(cx - 5, cy + 6, 4, 8);
      g.fillRect(cx + 1, cy + 6, 4, 8);
      g.fillStyle(0x888888);
      g.fillRect(cx + 6, cy - 4, 10, 4);
      g.fillStyle(0x555555);
      g.fillRect(cx + 14, cy - 5, 3, 6);

      g.generateTexture(key, 32, 32);
      g.destroy();
    }

    scene.anims.create({
      key: 'player-walk',
      frames: [
        { key: 'player_walk_0' },
        { key: 'player_walk_1' },
        { key: 'player_walk_2' },
        { key: 'player_walk_3' },
      ],
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'player-idle',
      frames: [{ key: 'player_idle_0' }, { key: 'player_idle_1' }],
      frameRate: 3,
      repeat: -1,
    });
  }

  static createEnemies(scene) {
    // Basic enemy — red, spiky
    for (let f = 0; f < 3; f++) {
      const key = `enemy_basic_${f}`;
      const g = scene.add.graphics();
      const cx = 14, cy = 14;
      const legOff = [0, 3, -3][f];

      g.fillStyle(0xdd2222);
      g.fillRect(cx - 7, cy - 7, 14, 12);
      g.fillStyle(0xff4444);
      g.fillRect(cx - 5, cy - 11, 10, 6);
      // Spikes
      g.fillStyle(0xff6666);
      g.fillTriangle(cx - 6, cy - 11, cx - 3, cy - 15, cx, cy - 11);
      g.fillTriangle(cx, cy - 11, cx + 3, cy - 15, cx + 6, cy - 11);
      // Eyes
      g.fillStyle(0xffff00);
      g.fillRect(cx - 4, cy - 9, 3, 3);
      g.fillRect(cx + 1, cy - 9, 3, 3);
      g.fillStyle(0x000000);
      g.fillRect(cx - 3, cy - 8, 2, 2);
      g.fillRect(cx + 2, cy - 8, 2, 2);
      // Legs
      g.fillStyle(0xaa1111);
      g.fillRect(cx - 6, cy + 5, 4, 6 + legOff);
      g.fillRect(cx + 2, cy + 5, 4, 6 - legOff);

      g.generateTexture(key, 28, 28);
      g.destroy();
    }

    scene.anims.create({
      key: 'enemy-basic-walk',
      frames: [
        { key: 'enemy_basic_0' },
        { key: 'enemy_basic_1' },
        { key: 'enemy_basic_2' },
        { key: 'enemy_basic_1' },
      ],
      frameRate: 8,
      repeat: -1,
    });

    // Fast enemy — orange, slim
    for (let f = 0; f < 3; f++) {
      const key = `enemy_fast_${f}`;
      const g = scene.add.graphics();
      const cx = 12, cy = 12;
      const legOff = [0, 4, -4][f];

      g.fillStyle(0xff8800);
      g.fillRect(cx - 5, cy - 6, 10, 10);
      g.fillStyle(0xffaa33);
      g.fillRect(cx - 4, cy - 10, 8, 5);
      g.fillStyle(0x000000);
      g.fillRect(cx - 3, cy - 9, 2, 2);
      g.fillRect(cx + 1, cy - 9, 2, 2);
      // Pointy top
      g.fillStyle(0xff6600);
      g.fillTriangle(cx - 4, cy - 10, cx, cy - 14, cx + 4, cy - 10);
      // Legs
      g.fillStyle(0xcc6600);
      g.fillRect(cx - 4, cy + 4, 3, 5 + legOff);
      g.fillRect(cx + 1, cy + 4, 3, 5 - legOff);

      g.generateTexture(key, 24, 24);
      g.destroy();
    }

    scene.anims.create({
      key: 'enemy-fast-walk',
      frames: [
        { key: 'enemy_fast_0' },
        { key: 'enemy_fast_1' },
        { key: 'enemy_fast_2' },
        { key: 'enemy_fast_1' },
      ],
      frameRate: 14,
      repeat: -1,
    });

    // Tank enemy — purple, big, chunky
    for (let f = 0; f < 2; f++) {
      const key = `enemy_tank_${f}`;
      const g = scene.add.graphics();
      const cx = 18, cy = 18;
      const legOff = [0, 2][f];

      g.fillStyle(0x7722cc);
      g.fillRect(cx - 10, cy - 10, 20, 16);
      g.fillStyle(0x9944ee);
      g.fillRect(cx - 8, cy - 16, 16, 8);
      // Armor plates
      g.fillStyle(0x5500aa);
      g.fillRect(cx - 12, cy - 8, 4, 12);
      g.fillRect(cx + 8, cy - 8, 4, 12);
      // Eyes — mean
      g.fillStyle(0xff0000);
      g.fillRect(cx - 6, cy - 13, 4, 3);
      g.fillRect(cx + 2, cy - 13, 4, 3);
      g.fillStyle(0xffff00);
      g.fillRect(cx - 5, cy - 12, 2, 2);
      g.fillRect(cx + 3, cy - 12, 2, 2);
      // Legs
      g.fillStyle(0x440088);
      g.fillRect(cx - 8, cy + 6, 6, 8 + legOff);
      g.fillRect(cx + 2, cy + 6, 6, 8 - legOff);

      g.generateTexture(key, 36, 36);
      g.destroy();
    }

    scene.anims.create({
      key: 'enemy-tank-walk',
      frames: [{ key: 'enemy_tank_0' }, { key: 'enemy_tank_1' }],
      frameRate: 4,
      repeat: -1,
    });
  }

  static createBullet(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xffff00);
    g.fillRect(0, 1, 8, 4);
    g.fillStyle(0xffffff);
    g.fillRect(0, 2, 3, 2);
    g.generateTexture('bullet', 8, 6);
    g.destroy();
  }

  static createParticle(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture('particle', 4, 4);
    g.destroy();
  }

  static createMuzzleFlash(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xffff88, 0.9);
    g.fillCircle(6, 6, 6);
    g.fillStyle(0xffffff);
    g.fillCircle(6, 6, 3);
    g.generateTexture('muzzle_flash', 12, 12);
    g.destroy();
  }

  static createHealthBar(scene) {
    // Background
    const bg = scene.add.graphics();
    bg.fillStyle(0x333333);
    bg.fillRect(0, 0, 200, 18);
    bg.generateTexture('healthbar_bg', 200, 18);
    bg.destroy();
    // Fill
    const fill = scene.add.graphics();
    fill.fillStyle(0xee2222);
    fill.fillRect(0, 0, 200, 18);
    fill.generateTexture('healthbar_fill', 200, 18);
    fill.destroy();
  }

  static createStars(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x0a0a1a);
    g.fillRect(0, 0, 800, 600);
    // Random stars
    const rng = new Phaser.Math.RandomDataGenerator(['retro-stars']);
    g.fillStyle(0xffffff);
    for (let i = 0; i < 120; i++) {
      const x = rng.integerInRange(0, 799);
      const y = rng.integerInRange(0, 599);
      const size = rng.pick([1, 1, 1, 2]);
      g.fillRect(x, y, size, size);
    }
    g.generateTexture('starfield', 800, 600);
    g.destroy();
  }
}
