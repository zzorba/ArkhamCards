import { capitalize, flatMap, forEach, keys, map, range, sortBy, values } from 'lodash';

import { CUSTOM, Campaign, DecksMap } from 'actions/types';
import { campaignNames } from './constants';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from 'constants';
import { CardsMap } from 'data/Card';

export function campaignToText(
  campaign: Campaign,
  latestDeckIds: number[],
  decks: DecksMap,
  investigators: CardsMap) {
  const lines: string[] = [];
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
  const unsortedTokens: ChaosTokenType[] = keys(campaign.chaosBag) as ChaosTokenType[];
  const tokens: ChaosTokenType[] = sortBy<ChaosTokenType>(
    unsortedTokens,
    token => CHAOS_TOKEN_ORDER[token]);
  const tokenParts = flatMap(tokens,
    token => map(range(0, campaign.chaosBag[token]), () => token));
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
    lines.push(`Trauma: ${investigator.traumaString(campaign.investigatorData[investigator.code])}`);
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

export function flattenChaosBag(chaosBag: ChaosBag): ChaosTokenType[] {
  const list = keys(chaosBag);
  const weight = values(chaosBag);
  const weightedList: ChaosTokenType[] = [];
  for (let i = 0; i < weight.length; i++) {
    const multiples = weight[i];
    if (multiples) {
      for (let j = 0; j < multiples; j++) {
        weightedList.push(list[i] as ChaosTokenType);
      }
    }
  }
  return weightedList;
}

export default {
  campaignToText,
  flattenChaosBag,
};
