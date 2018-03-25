import Realm from 'realm';

import Card from './Card';
import CardRequirement from './CardRequirement';
import DeckRequirement from './DeckRequirement';
import RandomRequirement from './RandomRequirement';
import DeckAtLeastOption from './DeckAtLeastOption';
import DeckOption from './DeckOption';
import DeckOptionLevel from './DeckOptionLevel';

// If we have to migrate, see https://realm.io/docs/javascript/latest#migrations
export function open() {
  return Realm.open({
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
}

export function write(doWrite) {
  return open().then(realm => {
    return realm.write(() => {
      doWrite(realm);
    });
  }).catch(err => console.log(err));
}

export function read(doRead) {
  return open().then(realm => doRead(realm)).catch(err => console.log(err));
}

export function clearAll() {
  return write(realm => {
    realm.delete(realm.objects('Card'));
  });
}
