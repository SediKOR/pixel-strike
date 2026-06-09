const LEVELS = [
  {
    level: 1,
    enemies: [{ type: 'basic', count: 8 }],
    spawnDelay: 600,
  },
  {
    level: 2,
    enemies: [{ type: 'basic', count: 10 }, { type: 'fast', count: 4 }],
    spawnDelay: 550,
  },
  {
    level: 3,
    enemies: [{ type: 'basic', count: 10 }, { type: 'fast', count: 6 }, { type: 'tank', count: 2 }],
    spawnDelay: 500,
  },
  {
    level: 4,
    enemies: [{ type: 'fast', count: 12 }, { type: 'tank', count: 4 }],
    spawnDelay: 450,
  },
  {
    level: 5,
    enemies: [{ type: 'basic', count: 8 }, { type: 'fast', count: 10 }, { type: 'tank', count: 6 }],
    spawnDelay: 400,
  },
];

function getLevelConfig(level) {
  if (level <= LEVELS.length) {
    return LEVELS[level - 1];
  }
  // Scale infinitely beyond defined levels
  const base = LEVELS[LEVELS.length - 1];
  const extra = level - LEVELS.length;
  return {
    level,
    enemies: [
      { type: 'basic', count: 8 + extra * 2 },
      { type: 'fast', count: 10 + extra * 3 },
      { type: 'tank', count: 6 + extra * 2 },
    ],
    spawnDelay: Math.max(250, 400 - extra * 20),
  };
}
