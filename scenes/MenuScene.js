class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Generate all game textures once (idempotent — checks existence first)
    if (!this.textures.exists('player_walk_0')) {
      SpriteFactory.createAll(this);
    }

    // Starfield background
    this.add.image(W / 2, H / 2, 'starfield');

    // Scanline overlay
    this._addScanlines();

    // Title
    this.add.text(W / 2, H * 0.22, 'PIXEL\nSTRIKE', {
      fontFamily: '"Press Start 2P"',
      fontSize: '42px',
      fill: '#00ff88',
      align: 'center',
      stroke: '#003322',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(W / 2, H * 0.44, 'TOP-DOWN SHOOTER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      fill: '#aaffcc',
      align: 'center',
    }).setOrigin(0.5);

    // Blinking "PRESS START" text
    const startText = this.add.text(W / 2, H * 0.60, 'PRESS START', {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });

    // Instructions
    const instructions = [
      'MOVE    :  ARROW KEYS',
      'AIM     :  MOUSE',
      'SHOOT   :  LEFT CLICK',
    ];
    instructions.forEach((line, i) => {
      this.add.text(W / 2, H * 0.73 + i * 22, line, {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        fill: '#88aaff',
        align: 'center',
      }).setOrigin(0.5);
    });

    // Hi-score
    const hi = localStorage.getItem('pixelstrike_hi') || 0;
    this.add.text(W / 2, H * 0.91, `HI-SCORE: ${hi}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      fill: '#ffcc00',
      align: 'center',
    }).setOrigin(0.5);

    // Start on click or key
    this.input.once('pointerdown', () => this._startGame());
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
    this.input.keyboard.once('keydown-ENTER', () => this._startGame());
  }

  _startGame() {
    this.cameras.main.fadeOut(300, 0, 0, 0, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
  }

  _addScanlines() {
    const W = this.scale.width;
    const H = this.scale.height;
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    for (let y = 0; y < H; y += 3) {
      g.fillRect(0, y, W, 1);
    }
    g.setDepth(100);
  }
}
