import Realm from 'realm';

import Card from './Card';
import CardRequirement from './CardRequirement';
import CardRestrictions from './CardRestrictions';
import DeckRequirement from './DeckRequirement';
import RandomRequirement from './RandomRequirement';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOption from './DeckOption';
import DeckOptionLevel from './DeckOptionLevel';
import FaqEntry from './FaqEntry';

export default new Realm({
  schema: [
    Card,
    CardRequirement,
    CardRestrictions,
    DeckRequirement,
    RandomRequirement,
    DeckAtLeastOption,
    DeckOption,
    DeckOptionLevel,
    FaqEntry,
  ],
  schemaVersion: 10,
  /* eslint-disable no-unused-vars */
  migration: (oldRealm, newRealm) => {
  },
});
