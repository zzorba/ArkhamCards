import { keys, map } from 'lodash';
import { getAccessToken } from './auth';

export function decks(lastModified) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/decks?access_token=${accessToken}`;
    const options = { method: 'get', headers: {} };
    if (lastModified) {
      options.headers['If-Modified-Since'] = lastModified;
    } else {
      options.cache = { cache: 'no-cache' };
    }
    return fetch(uri, options).then(response => {
      if (response.status === 304) {
        return Promise.resolve({
          cacheHit: true,
        });
      }
      const lastModified = response.headers.get('Last-Modified');
      return response.json().then(json => {
        return {
          cacheHit: false,
          lastModified,
          decks: json,
        };
      });
    });
  });
}

export function loadDeck(id) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/load/${id}?access_token=${accessToken}`;
    return fetch(uri, {
      method: 'GET',
    }).then(response => {
      if (response.status === 500) {
        throw new Error('Not Found');
      }
      if (response.status !== 200) {
        throw new Error('Invalid Deck Status');
      }
      return response.json().then(deck => {
        if (deck && deck.id && deck.name && deck.slots) {
          return deck;
        }
        throw new Error('Invalid Deck Response');
      });
    });
  });
}

function encodeParams(params) {
  return map(keys(params), key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join('&');
}

export function newDeck(investigator, name) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/new?access_token=${accessToken}`;
    return fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: encodeParams({
        investigator: investigator,
        name: name,
      }),
    }).then(response => {
      return response.json().then(json => {
        if (!json.success) {
          throw new Error(json.msg);
        }
        return loadDeck(json.msg);
      });
    });
  });
}

export function saveDeck(id, name, slots, problem, spentXp) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/save/${id}?access_token=${accessToken}`;
    const body = encodeParams({
      name: name,
      slots: JSON.stringify(slots),
      problem: problem,
      xp_spent: spentXp,
    });
    return fetch(uri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(`Non-200 Status: ${response.status}`);
      }
      return response.json();
    }, err => {
      console.log(err.message || err);
      return {
        success: false,
        msg: err.message || err,
      };
    }).then(json => {
      if (!json.success) {
        throw new Error(json.msg);
      }
      return loadDeck(json.msg);
    });
  });
}

export function upgradeDeck(id, xp, exiles) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/upgrade/${id}?access_token=${accessToken}`;
    const params = {
      xp: xp,
    };
    if (exiles) {
      params.exiles = exiles;
    }

    const body = encodeParams(params);
    return fetch(uri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(`Non-200 Status: ${response.status}`);
      }
      return response.json();
    }, err => {
      console.log(err.message || err);
      return {
        success: false,
        msg: err.message || err,
      };
    }).then(json => {
      if (!json.success) {
        throw new Error(json.msg);
      }
      return Promise.all([loadDeck(id), loadDeck(json.msg)]).then(values => {
        return {
          deck: values[0],
          upgradedDeck: values[1],
        };
      });
    });
  });
}

export default {
  decks,
  loadDeck,
  saveDeck,
  upgradeDeck,
  newDeck,
};
