import { capitalize, flatMap, forEach, keys, map, range, sortBy } from 'lodash';

import { CUSTOM, campaignNames } from './constants';
import { traumaString, DEFAULT_TRAUMA_DATA } from './trauma';
import { CHAOS_TOKEN_ORDER } from '../../constants';

export function campaignToText(campaign, latestDeckIds, decks, investigators) {
  const lines = [];
  lines.push(campaign.name);
  lines.push('');
  if (campaign.cycleCode === CUSTOM) {
    lines.push('Custom Campaign');
  } else {
    lines.push(`Campaign: ${campaignNames()[campaign.cycleCode]}`);
    lines.push(`Difficulty: ${capitalize(campaign.difficulty)}`);
  }
  lines.push('');

  lines.push('Campaign Progress');
  forEach(campaign.scenarioResults, result => {
    lines.push(`${result.scenario}: ${result.resolution ? `${result.resolution}, ` : ''}XP: ${result.xp}`);
  });
  lines.push('');

  lines.push('Chaos Bag:');
  const tokens = sortBy(keys(campaign.chaosBag), token => CHAOS_TOKEN_ORDER[token]);
  const tokenParts = flatMap(tokens, token => map(range(0, campaign.chaosBag[token]), () => token));
  lines.push(tokenParts.join(', '));

  lines.push('');

  const {
    campaignNotes,
  } = campaign;

  const latestDecks = flatMap(latestDeckIds, deckId => decks[deckId]);
  lines.push('Investigators:');
  forEach(latestDecks, deck => {
    const investigator = investigators[deck.investigator_code];
    lines.push(`${investigator.name}:`);
    lines.push(`Deck: https://arkhamdb.com/deck/view/${deck.id}`);
    const traumaData = campaign.investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA;
    lines.push(`Trauma: ${traumaString(traumaData, investigator)}`);
    forEach(campaignNotes.investigatorNotes.sections || [], section => {
      lines.push(`${section.title}:`);
      const notes = section.notes[investigator.code] || [];
      if (notes.length > 0) {
        forEach(notes, note => lines.push(note));
      } else {
        lines.push('None');
      }
    });
    forEach(campaignNotes.investigatorNotes.counts || [], section => {
      lines.push(`${section.title}: ${section.counts[investigator.code] || 0}`);
    });
    lines.push('');
  });

  lines.push('');
  forEach(campaignNotes.sections || [], section => {
    lines.push(`${section.title}:`);
    if (section.notes.length > 0) {
      forEach(section.notes, note => lines.push(note));
    } else {
      lines.push('None');
    }
    lines.push('');
  });
  forEach(campaignNotes.counts || [], section => {
    lines.push(`${section.title}: ${section.count || 0}`);
  });

  return lines.join('\n');
}

export default {
  campaignToText,
};
