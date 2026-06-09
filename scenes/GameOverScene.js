class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data) {
    const W = this.scale.width;
    const H = this.scale.height;
    const score = data.score || 0;
    const level = data.level || 1;

    // Save hi-score
    const hi = parseInt(localStorage.getItem('pixelstrike_hi') || '0');
    const newHi = score > hi;
    if (newHi) localStorage.setItem('pixelstrike_hi', score);

    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Scanlines
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
    g.setDepth(100);

    this.add.text(W / 2, H * 0.20, 'GAME OVER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '36px',
      fill: '#ff2222',
      stroke: '#550000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.40, `SCORE: ${score}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      fill: '#ffcc00',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.52, `LEVEL REACHED: ${level}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#aaaaff',
    }).setOrigin(0.5);

    if (newHi) {
      const newHiText = this.add.text(W / 2, H * 0.62, 'NEW HI-SCORE!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        fill: '#00ffcc',
      }).setOrigin(0.5);
      this.tweens.add({
        targets: newHiText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 400,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.add.text(W / 2, H * 0.62, `HI-SCORE: ${hi}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        fill: '#888888',
      }).setOrigin(0.5);
    }

    // Restart prompt
    const restartText = this.add.text(W / 2, H * 0.78, 'CLICK TO RETRY', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0.1,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(W / 2, H * 0.88, 'PRESS M FOR MENU', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#666666',
    }).setOrigin(0.5);

    // Input
    this.time.delayedCall(500, () => {
      this.input.once('pointerdown', () => this._restart());
      this.input.keyboard.once('keydown-SPACE', () => this._restart());
      this.input.keyboard.once('keydown-ENTER', () => this._restart());
      this.input.keyboard.once('keydown-M', () => this._menu());
    });
  }

  _restart() {
    this.cameras.main.fadeOut(300, 0, 0, 0, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
  }

  _menu() {
    this.cameras.main.fadeOut(300, 0, 0, 0, () => {
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene');
    });
  }
}
