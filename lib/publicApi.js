import React from 'react';
import { forEach } from 'lodash';

import Card from '../data/Card';
import FaqEntry from '../data/FaqEntry';

export const syncCards = function(realm, packs) {
  const uri = 'https://arkhamdb.com/api/public/cards/?encounter=1';
  const packsByCode = {};
  const cycleNames = {};
  forEach(packs, pack => {
    packsByCode[pack.code] = pack;
    if (pack.position === 1) {
      cycleNames[pack.cycle_position] = pack.name;
    }
  });
  cycleNames[50] = 'Return to...';
  cycleNames[70] = 'Standalone Scenarios';
  cycleNames[80] = 'Books';
  return fetch(uri, { method: 'GET' })
    .then(response => response.json())
    .then(json => {
      realm.write(() => {
        forEach(json, cardJson => {
          try {
            realm.create('Card', Card.fromJson(cardJson, packsByCode, cycleNames), true);
          } catch (e) {
            console.log(e);
            console.log(cardJson);
          }
        });
      });
      return realm.objects('Card').length;
    }).catch(e => console.log(e));
};

export const getFaqEntry = function(realm, code) {
  const uri = `https://arkhamdb.com/api/public/faq/${code}.json`;
  return fetch(uri, { method: 'GET' })
    .then(response => response.json())
    .then(json => {
      if (json.length) {
        realm.write(() => {
          realm.create('FaqEntry', FaqEntry.fromJson(json[0]), true);
        });
        return true;
      }
      realm.write(() => {
        realm.create('FaqEntry', FaqEntry.empty(code), true);
      });
      return false;
    });
};

export default {
  syncCards,
  getFaqEntry,
};
