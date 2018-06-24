import React from 'react';
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

export function saveDeck(id, name, slots) {
  return getAccessToken().then(accessToken => {
    if (!accessToken) {
      throw new Error('badAccessToken');
    }
    const uri = `https://arkhamdb.com/api/oauth2/deck/save/${id}?access_token=${accessToken}`;
    return fetch(uri, {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        slots: slots,
      }),
    }).then(response => {
      const json = response.json();
      console.log(JSON.stringify(json));
      return json;
    }, err => {
      console.log(err);
    });
  });
}

export default {
  decks,
  saveDeck,
};
