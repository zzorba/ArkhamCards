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

export default {
  decks,
};
