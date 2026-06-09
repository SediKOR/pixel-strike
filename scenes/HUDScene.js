class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  create(data) {
    this.W = this.scale.width;
    this.H = this.scale.height;

    // Health bar background + fill
    this.add.image(104, 22, 'healthbar_bg').setOrigin(0.5);
    this.healthFill = this.add.image(4, 22, 'healthbar_fill').setOrigin(0, 0.5);
    this.healthFill.setDisplaySize(200, 18);

    this.add.text(4, 6, 'HP', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#ffffff',
    });

    // Score
    this.scoreText = this.add.text(this.W - 10, 10, 'SCORE: 0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      fill: '#ffcc00',
      align: 'right',
    }).setOrigin(1, 0);

    // Level
    this.levelText = this.add.text(this.W / 2, 10, 'LVL 1', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      fill: '#00ffcc',
      align: 'center',
    }).setOrigin(0.5, 0);

    // Enemy count
    this.enemyText = this.add.text(this.W / 2, 24, 'ENEMIES: 0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#ff6666',
      align: 'center',
    }).setOrigin(0.5, 0);
  }

  updateHUD({ hp, maxHp, score, level, enemiesLeft }) {
    const ratio = Math.max(0, hp / maxHp);
    this.healthFill.setDisplaySize(200 * ratio, 18);
    // Color shift: green → yellow → red
    if (ratio > 0.5) {
      this.healthFill.setTint(0x22cc44);
    } else if (ratio > 0.25) {
      this.healthFill.setTint(0xffcc00);
    } else {
      this.healthFill.setTint(0xee2222);
    }
    this.scoreText.setText(`SCORE: ${score}`);
    this.levelText.setText(`LVL ${level}`);
    this.enemyText.setText(`ENEMIES: ${enemiesLeft}`);
  }
}
