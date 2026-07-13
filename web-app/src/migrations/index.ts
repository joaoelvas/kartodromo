import * as migration_20260713_012836_initial from './20260713_012836_initial';

export const migrations = [
  {
    up: migration_20260713_012836_initial.up,
    down: migration_20260713_012836_initial.down,
    name: '20260713_012836_initial'
  },
];
