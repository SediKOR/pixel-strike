class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(6);
    this.hp = 100;
    this.maxHp = 100;
    this.shootCooldown = 0;
    this.damageCooldown = 0;
    this.isAlive = true;
    this.play('player-idle');
  }

  update(cursors, pointer, time, delta) {
    if (!this.isAlive) return;

    this.shootCooldown -= delta;
    this.damageCooldown -= delta;

    // Movement
    const speed = 180;
    let vx = 0, vy = 0;
    if (cursors.left.isDown)  vx = -speed;
    if (cursors.right.isDown) vx = speed;
    if (cursors.up.isDown)    vy = -speed;
    if (cursors.down.isDown)  vy = speed;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'player-walk') {
        this.play('player-walk');
      }
    } else {
      if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'player-idle') {
        this.play('player-idle');
      }
    }

    // Aim toward mouse
    const worldX = pointer.worldX ?? pointer.x;
    const worldY = pointer.worldY ?? pointer.y;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldX, worldY);
    this.setRotation(angle + Math.PI / 2);
  }

  canShoot() {
    return this.shootCooldown <= 0 && this.isAlive;
  }

  shoot(pointer) {
    this.shootCooldown = 180;
    const worldX = pointer.worldX ?? pointer.x;
    const worldY = pointer.worldY ?? pointer.y;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldX, worldY);
    // Gun tip offset (front of sprite at rotation)
    const tipDist = 20;
    const bx = this.x + Math.cos(angle) * tipDist;
    const by = this.y + Math.sin(angle) * tipDist;
    return { x: bx, y: by, angle };
  }

  takeDamage(scene, amount) {
    if (this.damageCooldown > 0) return;
    this.damageCooldown = 600;
    this.hp -= amount;
    // Red flash
    this.setTint(0xff0000);
    scene.time.delayedCall(150, () => {
      if (this.active) this.clearTint();
    });
    // Screen shake
    scene.cameras.main.shake(150, 0.012);
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }
  }
}
