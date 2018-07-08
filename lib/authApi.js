import React from 'react';
import {
  Alert,
} from 'react-native';
import { keys, map } from 'lodash';
import { getAccessToken } from './auth';

export function decks() {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/decks?access_token=${accessToken}`;
    return fetch(uri, { method: 'GET' })
      .then(response => response.json());
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
    }).then(response => response.json(), err => console.log(err.message || err));
  });
}

function encodeParams(params) {
  return map(keys(params), key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join('&');
}

export function newDeck(investigator) {
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
      }),
    }).then(response => response.json())
      .then(json => {
        if (!json.success) {
          throw new Error(json.msg);
        }
        return loadDeck(json.msg);
      });
  });
}

export function saveDeck(id, name, slots, problem) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/save/${id}?access_token=${accessToken}`;
    const body = encodeParams({
      name: name,
      slots: JSON.stringify(slots),
      problem: problem,
      '_method': 'PUT',
    });
    return fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(`Non-200 Status: ${response.status}`);
      }
      return repsonse.json();
    }, err => {
      console.log(err.message || err);
    }).then(json => {
      if (!json.success) {
        throw new Error(json.msg);
      }
      return loadDeck(json.msg);
    });
  });
}

export default {
  decks,
  saveDeck,
};
