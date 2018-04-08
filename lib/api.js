import React from 'react';
import { forEach } from 'lodash';

import Card from '../data/Card';
import FaqEntry from '../data/FaqEntry';

export const syncCards = function(realm) {
  const uri = 'https://arkhamdb.com/api/public/cards/?encounter=1';
  return fetch(uri, { method: 'GET' })
    .then(response => response.json())
    .then(json => {
      realm.write(() => {
        forEach(json, card => {
          try {
            realm.create('Card', Card.fromJson(card), true);
          } catch (e) {
            console.log(e);
            console.log(card);
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
          realm.create('FaqEntry', FaqEntry.fromJson(json[0]));
        });
        return true;
      }
      return false;
    });
};

export default {
  syncCards,
  getFaqEntry,
};
