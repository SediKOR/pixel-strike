class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.score = data.score || 0;
    this._levelDone = false;
    this.totalToKill = 0;
    this.totalKilled = 0;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Ensure textures exist (in case scene was started directly)
    if (!this.textures.exists('player_walk_0')) {
      SpriteFactory.createAll(this);
    }

    // Background
    this.add.image(W / 2, H / 2, 'starfield');
    this._drawGrid();
    this._addScanlines();

    // Groups
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Player
    this.player = new Player(this, W / 2, H / 2);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.isMouseDown = false;
    this.input.on('pointerdown', () => { this.isMouseDown = true; });
    this.input.on('pointerup',   () => { this.isMouseDown = false; });

    // Collisions
    this.physics.add.overlap(
      this.bullets, this.enemies,
      this._onBulletHitEnemy, null, this
    );
    this.physics.add.overlap(
      this.player, this.enemies,
      this._onPlayerHitEnemy, null, this
    );

    // HUD
    this.scene.launch('HUDScene');
    this.hudScene = this.scene.get('HUDScene');

    // Spawn wave
    this._spawnLevel();

    this.cameras.main.fadeIn(300);
  }

  _drawGrid() {
    const W = this.scale.width;
    const H = this.scale.height;
    const g = this.add.graphics();
    g.lineStyle(1, 0x112233, 0.4);
    for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);
    g.setDepth(1);
  }

  _addScanlines() {
    const W = this.scale.width;
    const H = this.scale.height;
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.12);
    for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
    g.setDepth(200);
    g.setScrollFactor(0);
  }

  _spawnLevel() {
    const config = getLevelConfig(this.currentLevel);
    const spawnQueue = [];

    config.enemies.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) spawnQueue.push(type);
    });

    Phaser.Utils.Array.Shuffle(spawnQueue);
    this.totalToKill = spawnQueue.length;
    this.totalKilled = 0;

    spawnQueue.forEach((type, i) => {
      this.time.delayedCall(i * config.spawnDelay, () => {
        if (!this.player.isAlive || this._levelDone) return;
        this._spawnEnemy(type);
      });
    });
  }

  _spawnEnemy(type) {
    const W = this.scale.width;
    const H = this.scale.height;
    const side = Phaser.Math.Between(0, 3);
    let x, y;
    const m = 32;
    if (side === 0)      { x = Phaser.Math.Between(0, W); y = -m; }
    else if (side === 1) { x = W + m; y = Phaser.Math.Between(0, H); }
    else if (side === 2) { x = Phaser.Math.Between(0, W); y = H + m; }
    else                 { x = -m; y = Phaser.Math.Between(0, H); }

    const enemy = new Enemy(this, x, y, type);
    this.enemies.add(enemy);
  }

  _tryShoot(pointer) {
    if (!this.player.isAlive) return;
    if (!this.player.canShoot()) return;

    const { x, y, angle } = this.player.shoot(pointer);

    const bullet = this.physics.add.sprite(x, y, 'bullet');
    bullet.setDepth(5);
    bullet.setRotation(angle);
    this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 550, bullet.body.velocity);
    this.bullets.add(bullet);

    // Muzzle flash
    const flash = this.add.image(x, y, 'muzzle_flash').setDepth(9);
    this.time.delayedCall(60, () => { if (flash.active) flash.destroy(); });

    // Auto-destroy bullet after 1.5s or out of bounds
    this.time.delayedCall(1500, () => {
      if (bullet.active) bullet.destroy();
    });
  }

  _onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.destroy();

    const died = enemy.takeDamage(this);
    if (died) {
      this.score += enemy.scoreValue;
      this.totalKilled++;
      this._checkWaveClear();
    }
  }

  _onPlayerHitEnemy(player, enemy) {
    if (!player.isAlive || !enemy.active) return;
    player.takeDamage(this, 10);
    if (!player.isAlive) this._gameOver();
  }

  _checkWaveClear() {
    if (this._levelDone) return;
    if (this.totalKilled >= this.totalToKill) {
      this._levelClear();
    }
  }

  _levelClear() {
    if (this._levelDone) return;
    this._levelDone = true;

    this.cameras.main.flash(400, 0, 255, 100, false);

    this.time.delayedCall(800, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0, () => {
        this.scene.stop('HUDScene');
        this.scene.start('LevelScene', {
          level: this.currentLevel + 1,
          score: this.score,
        });
      });
    });
  }

  _gameOver() {
    this.time.delayedCall(600, () => {
      this.cameras.main.fadeOut(500, 100, 0, 0, () => {
        this.scene.stop('HUDScene');
        this.scene.start('GameOverScene', {
          score: this.score,
          level: this.currentLevel,
        });
      });
    });
  }

  update(time, delta) {
    if (!this.player.isAlive) return;

    this.player.update(this.cursors, this.input.activePointer, time, delta);

    // Continuous fire while mouse held
    if (this.isMouseDown && this.player.canShoot()) {
      this._tryShoot(this.input.activePointer);
    }

    // Update enemies
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active) enemy.update(this.player);
    });

    // Destroy bullets that leave the screen
    this.bullets.getChildren().forEach(b => {
      if (b.active && (b.x < -20 || b.x > 820 || b.y < -20 || b.y > 620)) {
        b.destroy();
      }
    });

    // Update HUD
    if (this.hudScene && this.hudScene.sys.isActive()) {
      const alive = this.enemies.getChildren().filter(e => e.active).length;
      this.hudScene.updateHUD({
        hp: this.player.hp,
        maxHp: this.player.maxHp,
        score: this.score,
        level: this.currentLevel,
        enemiesLeft: Math.max(0, this.totalToKill - this.totalKilled),
      });
    }
  }
}
