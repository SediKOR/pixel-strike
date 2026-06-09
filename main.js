const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0a0a1a',
  pixelArt: true,
  antialias: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MenuScene, GameScene, HUDScene, LevelScene, GameOverScene],
};

const game = new Phaser.Game(config);
