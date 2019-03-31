import { forEach, head } from 'lodash';
import Realm from 'realm';
import { Alert } from 'react-native';

import L from '../app/i18n';
import { CardCache, Pack } from '../actions/types';
import Card from '../data/Card';
import FaqEntry from '../data/FaqEntry';
import { AppState } from '../reducers';

export const syncCards = function(
  realm: Realm,
  packs: Pack[],
  lang?: string,
  cache?: CardCache
): Promise<CardCache | null> {
  const langPrefix = lang ? `${lang}.` : '';
  const uri = `https://${langPrefix}arkhamdb.com/api/public/cards/?encounter=1`;
  const packsByCode: { [code: string]: Pack } = {};
  const cycleNames: { [cycle_position: number]: string } = {};
  forEach(packs, pack => {
    packsByCode[pack.code] = pack;
    if (pack.position === 1) {
      cycleNames[pack.cycle_position] = pack.name;
    }
  });
  cycleNames[50] = L('Return to...');
  cycleNames[70] = L('Standalone Scenarios');
  cycleNames[80] = L('Books');
  const headers = new Headers();
  if (cache &&
    cache.lastModified &&
    cache.cardCount > 0 &&
    realm.objects('Card').length === cache.cardCount
  ) {
    headers.append('If-Modified-Since', cache.lastModified);
  }
  return fetch(uri, {
    method: 'GET',
    headers,
  }).then(response => {
    if (response.status === 304 && cache) {
      return Promise.resolve(cache);
    }
    const lastModified = response.headers.get('Last-Modified') || undefined;
    return response.json().then(json => {
      realm.write(() => {
        forEach(json, cardJson => {
          try {
            realm.create(
              'Card',
              Card.fromJson(cardJson, packsByCode, cycleNames, lang || 'en'),
              true
            );
          } catch (e) {
            Alert.alert(e);
            console.log(e);
            console.log(cardJson);
          }
        });
      });
      return {
        cardCount: realm.objects('Card').length,
        lastModified,
      };
    });
  }).catch(e => {
    console.log(e);
    return Promise.resolve(null);
  });
};

export const getFaqEntry = function(realm: Realm, code: string) {
  const faqEntry: FaqEntry = <FaqEntry> (head(
    realm.objects('FaqEntry').filtered(`code == '${code}'`)
  ) as unknown);
  const headers = new Headers();
  if (faqEntry && faqEntry.lastModified) {
    headers.append('If-Modified-Since', faqEntry.lastModified);
  }
  const uri = `https://arkhamdb.com/api/public/faq/${code}.json`;
  return fetch(uri, {
    method: 'GET',
    headers: headers,
  }).then(response => {
    if (response.status === 304) {
      return Promise.resolve(true);
    }
    const lastModified = response.headers.get('Last-Modified') || undefined;
    return response.json().then(json => {
      if (json.length) {
        realm.write(() => {
          realm.create('FaqEntry', FaqEntry.fromJson(json[0], lastModified), true);
        });
        return true;
      }
      realm.write(() => {
        realm.create('FaqEntry', FaqEntry.empty(code, lastModified), true);
      });
      return false;
    });
  });
};

export default {
  syncCards,
  getFaqEntry,
};
