import { capitalize, head, findIndex, flatMap, forEach, keys, map, range, sortBy } from 'lodash';

import { CUSTOM, Campaign, DecksMap } from '@actions/types';
import { campaignNames } from './constants';
import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType, isSpecialToken } from '@app_constants';
import { CardsMap } from '@data/types/Card';
import { Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';

export function campaignToText(
  campaign: Campaign,
  latestDeckIds: number[],
  decks: DecksMap,
  investigators: CardsMap,
  listSeperator: string
) {
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
    token => map(range(0, campaign.chaosBag?.[token] || 0), () => token));
  lines.push(tokenParts.join(listSeperator));

  lines.push('');

  const {
    campaignNotes,
  } = campaign;

  const latestDecks = flatMap(latestDeckIds, deckId => decks[deckId]);
  lines.push('Investigators:');
  forEach(latestDecks, deck => {
    const investigator = investigators[deck.investigator_code];
    if (!investigator) {
      return;
    }
    lines.push(`${investigator.name}:`);
    if (deck.local) {
      lines.push(`Deck: ${deck.name}`);
    } else {
      lines.push(`Deck: https://arkhamdb.com/deck/view/${deck.id}`);
    }
    lines.push(`Trauma: ${investigator.traumaString(listSeperator, campaign.investigatorData?.[investigator.code])}`);
    forEach(campaignNotes?.investigatorNotes?.sections || [], section => {
      lines.push(`${section.title}:`);
      const notes = section.notes[investigator.code] || [];
      if (notes.length > 0) {
        forEach(notes, note => lines.push(note));
      } else {
        lines.push('None');
      }
    });
    forEach(campaignNotes?.investigatorNotes?.counts || [], section => {
      lines.push(`${section.title}: ${section.counts[investigator.code] || 0}`);
    });
    lines.push('');
  });

  lines.push('');
  forEach(campaignNotes?.sections || [], section => {
    lines.push(`${section.title}:`);
    if (section.notes.length > 0) {
      forEach(section.notes, note => lines.push(note));
    } else {
      lines.push('None');
    }
    lines.push('');
  });
  forEach(campaignNotes?.counts || [], section => {
    lines.push(`${section.title}: ${section.count || 0}`);
  });

  return lines.join('\n');
}

export function flattenChaosBag(chaosBag: ChaosBag, tarot: Chaos_Bag_Tarot_Mode_Enum | undefined): ChaosTokenType[] {
  const weightedList: ChaosTokenType[] = [];
  forEach(chaosBag, (multiples, token) => {
    if (multiples) {
      forEach(range(0, multiples), () => {
        weightedList.push(token as ChaosTokenType);
      });
    }
  });
  if (!tarot || !weightedList.length) {
    return weightedList;
  }
  switch (tarot) {
    case Chaos_Bag_Tarot_Mode_Enum.Judgement: {
      const firstSkull = findIndex(weightedList, x => x === 'skull');
      if (firstSkull === -1) {
        return weightedList;
      }
      weightedList[firstSkull] = '0';
      return sortBy(weightedList, x => CHAOS_TOKEN_ORDER[x]);
    }
    case Chaos_Bag_Tarot_Mode_Enum.JudgementInverted: {
      const highestToken = head(sortBy(weightedList, x => CHAOS_TOKEN_ORDER[x]));
      if (!highestToken || isSpecialToken(highestToken)) {
        return weightedList;
      }
      const firstToken = findIndex(weightedList, x => x === highestToken);
      if (firstToken === -1) {
        return weightedList;
      }
      weightedList[firstToken] = 'skull';
      return sortBy(weightedList, x => CHAOS_TOKEN_ORDER[x]);
    }
  }
}

export default {
  campaignToText,
  flattenChaosBag,
};
