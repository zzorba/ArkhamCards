import { forEach, groupBy, head, sortBy } from 'lodash';
import Realm from 'realm';
import { Alert } from 'react-native';

import { t } from 'ttag';
import { CardCache, TabooCache, Pack } from '../actions/types';
import Card from '../data/Card';
import TabooSet from '../data/TabooSet';
import FaqEntry from '../data/FaqEntry';

export const syncTaboos = function(
  realm: Realm,
  lang?: string,
  cache?: TabooCache
): Promise<TabooCache | null> {
  const langPrefix = lang && lang !== 'en' ? `${lang}.` : '';
  const uri = `https://${langPrefix}arkhamdb.com/api/public/taboos/`;
  const headers = new Headers();
  if (cache &&
    cache.lastModified &&
    cache.tabooCount > 0 &&
    realm.objects('Card').filtered('taboo_set_id > 0').length === cache.tabooCount
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
        forEach(json, tabooJson => {
          const cards = JSON.parse(tabooJson.cards);
          try {
            realm.create(
              'TabooSet',
              TabooSet.fromJson(tabooJson, cards.length),
              true
            );
          } catch (e) {
            Alert.alert(`${e}`);
            console.log(e);
          }
          forEach(cards, cardJson => {
            const code: string = cardJson.code;
            const card = head(realm.objects<Card>('Card').filtered(`code == '${code}' and (taboo_set_id == null || taboo_set_id == 0)`));
            if (card) {
              try {
                card.taboo_set_id = 0;
                // Mark the original card as the 'vanilla' version.
                realm.create(
                  'Card',
                  Card.fromTabooCardJson(tabooJson.id, cardJson, card),
                  true
                );
              } catch (e) {
                Alert.alert(`${e}`);
                console.log(e);
              }
            }
          });
        });
      });
      return {
        tabooCount: realm.objects('Card').filtered('taboo_set_id > 0').length,
        lastModified,
      };
    });
  });
};

export const syncCards = function(
  realm: Realm,
  packs: Pack[],
  lang?: string,
  cache?: CardCache
): Promise<CardCache | null> {
  const langPrefix = lang && lang !== 'en' ? `${lang}.` : '';
  const uri = `https://${langPrefix}arkhamdb.com/api/public/cards/?encounter=1`;
  const packsByCode: { [code: string]: Pack } = {};
  const cycleNames: { [cycle_position: number]: string } = {};
  forEach(packs, pack => {
    packsByCode[pack.code] = pack;
    if (pack.position === 1) {
      cycleNames[pack.cycle_position] = pack.name;
    }
  });
  cycleNames[50] = t`Return to...`;
  cycleNames[70] = t`Standalone Scenarios`;
  cycleNames[80] = t`Books`;
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
            Alert.alert(`${e}`);
            console.log(e);
            console.log(cardJson);
          }
        });
        forEach(
          groupBy(
            realm.objects<Card>('Card')
              .filtered(`deck_limit > 0 && spoiler != true && (taboo_set_id == null || taboo_set_id == 0)`),
            card => card.name
          ), (cards) => {
            if (cards.length > 1) {
              const maxXpCard = head(sortBy(cards, card => -(card.xp || 0)));
              forEach(cards, card => {
                if (maxXpCard && card.code !== maxXpCard.code) {
                  card.has_upgrades = true;
                }
              });
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
  const faqEntry: FaqEntry | undefined = head(
    realm.objects<FaqEntry>('FaqEntry').filtered(`code == '${code}'`)
  );
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
