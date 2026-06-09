const ENEMY_DEFS = {
  basic: { speed: 80, hp: 2, anim: 'enemy-basic-walk', texture: 'enemy_basic_0', score: 10, tint: 0xffffff, size: 28 },
  fast:  { speed: 150, hp: 1, anim: 'enemy-fast-walk',  texture: 'enemy_fast_0',  score: 20, tint: 0xffffff, size: 24 },
  tank:  { speed: 50,  hp: 5, anim: 'enemy-tank-walk',  texture: 'enemy_tank_0',  score: 50, tint: 0xffffff, size: 36 },
};

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const def = ENEMY_DEFS[type];
    super(scene, x, y, def.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.def = def;
    this.hp = def.hp;
    this.maxHp = def.hp;
    this.scoreValue = def.score;
    this.setDepth(4);
    this.setCollideWorldBounds(true);
    this.play(def.anim);

    // HP bar (shown above enemy)
    this.hpBar = scene.add.graphics();
    this.hpBar.setDepth(10);
    this._drawHpBar();
  }

  _drawHpBar() {
    this.hpBar.clear();
    if (this.hp === this.maxHp) return; // Don't show at full health
    const w = this.def.size;
    const ratio = this.hp / this.maxHp;
    this.hpBar.fillStyle(0x000000, 0.7);
    this.hpBar.fillRect(this.x - w / 2, this.y - this.def.size / 2 - 8, w, 4);
    this.hpBar.fillStyle(0x00ff44);
    this.hpBar.fillRect(this.x - w / 2, this.y - this.def.size / 2 - 8, w * ratio, 4);
  }

  takeDamage(scene) {
    this.hp--;
    this._drawHpBar();
    // Flash white on hit
    this.setTint(0xffffff);
    scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
    });
    if (this.hp <= 0) {
      this.die(scene);
      return true;
    }
    return false;
  }

  die(scene) {
    this.hpBar.destroy();
    // Particle burst
    const colors = { basic: 0xff4444, fast: 0xff8800, tank: 0x9944ee };
    const color = colors[this.type];
    for (let i = 0; i < 8; i++) {
      const p = scene.add.image(this.x, this.y, 'particle');
      p.setTint(color);
      p.setDepth(8);
      const angle = (i / 8) * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 130);
      scene.tweens.add({
        targets: p,
        x: p.x + Math.cos(angle) * speed,
        y: p.y + Math.sin(angle) * speed,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 400,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
    this.destroy();
  }

  update(player) {
    if (!this.active) return;
    // Chase player
    this.scene.physics.moveToObject(this, player, this.def.speed);
    // Face movement direction
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.setRotation(angle + Math.PI / 2);
    this._drawHpBar();
  }

  destroy(fromScene) {
    if (this.hpBar && this.hpBar.active) this.hpBar.destroy();
    super.destroy(fromScene);
  }
}
