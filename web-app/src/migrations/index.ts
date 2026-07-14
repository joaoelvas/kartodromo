import * as migration_20260713_012836_initial from './20260713_012836_initial';
import * as migration_20260714_111051_invites from './20260714_111051_invites';

export const migrations = [
  {
    up: migration_20260713_012836_initial.up,
    down: migration_20260713_012836_initial.down,
    name: '20260713_012836_initial',
  },
  {
    up: migration_20260714_111051_invites.up,
    down: migration_20260714_111051_invites.down,
    name: '20260714_111051_invites'
  },
];
