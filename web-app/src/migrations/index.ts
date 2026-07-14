import * as migration_20260713_012836_initial from './20260713_012836_initial';
import * as migration_20260714_111051_invites from './20260714_111051_invites';
import * as migration_20260714_160102_lap_records from './20260714_160102_lap_records';

export const migrations = [
  {
    up: migration_20260713_012836_initial.up,
    down: migration_20260713_012836_initial.down,
    name: '20260713_012836_initial',
  },
  {
    up: migration_20260714_111051_invites.up,
    down: migration_20260714_111051_invites.down,
    name: '20260714_111051_invites',
  },
  {
    up: migration_20260714_160102_lap_records.up,
    down: migration_20260714_160102_lap_records.down,
    name: '20260714_160102_lap_records'
  },
];
