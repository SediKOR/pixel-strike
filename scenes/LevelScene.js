class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  create(data) {
    const W = this.scale.width;
    const H = this.scale.height;
    const level = data.level;
    const score = data.score;

    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Scanlines
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
    g.setDepth(100);

    // Level complete text
    this.add.text(W / 2, H * 0.30, 'WAVE CLEAR!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      fill: '#00ff88',
      stroke: '#003322',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);

    const levelText = this.add.text(W / 2, H * 0.50, `LEVEL ${level}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      fill: '#ffcc00',
      stroke: '#553300',
      strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.add.text(W / 2, H * 0.68, `SCORE: ${score}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '13px',
      fill: '#aaaaff',
    }).setOrigin(0.5).setAlpha(0);

    const readyText = this.add.text(W / 2, H * 0.80, 'GET READY...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#ffffff',
    }).setOrigin(0.5).setAlpha(0);

    // Animate all in sequence then go to game
    this.tweens.add({
      targets: this.children.list.filter(c => c.type === 'Text'),
      alpha: 1,
      duration: 400,
      ease: 'Power2',
    });

    this.time.delayedCall(2200, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0, () => {
        this.scene.stop('HUDScene');
        this.scene.start('GameScene', { level, score });
      });
    });
  }
}
