import Realm from 'realm';

import Card from './Card';
import CardRequirement from './CardRequirement';
import DeckRequirement from './DeckRequirement';
import RandomRequirement from './RandomRequirement';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOption from './DeckOption';
import DeckOptionLevel from './DeckOptionLevel';

export default new Realm({
  schema: [
    Card,
    CardRequirement,
    DeckRequirement,
    RandomRequirement,
    DeckAtLeastOption,
    DeckOption,
    DeckOptionLevel,
  ],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
  },
});
