// Bullet is created directly as an arcade sprite (no group pool).
// GameScene creates these via this.physics.add.sprite and adds to this.bullets group.
// This avoids double-add conflicts from scene.add.existing + group management.
