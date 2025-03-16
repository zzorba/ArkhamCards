import React, { useCallback, useContext, useMemo, useState } from 'react';
import { flatMap, forEach } from 'lodash';
import { t } from 'ttag';

import CardSectionHeader from '@components/core/CardSectionHeader';
import { scenarioRewards } from '@components/campaign/constants';
import { Slots } from '@actions/types';
import Card from '@data/types/Card';
import { PLAYER_CARDS_QUERY, combineQueries, MYTHOS_CARDS_QUERY } from '@data/sqlite/query';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import { useSlots } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { QuerySort } from '@data/sqlite/types';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ActivityIndicator } from 'react-native';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  componentId: string;
  investigator: CampaignInvestigator;
  deck: LatestDeckT;
  encounterCodes: string[];
  scenarioName?: string;
  updateStoryCounts: (exileCounts: Slots) => void;
}

const QUERY = combineQueries(MYTHOS_CARDS_QUERY, [PLAYER_CARDS_QUERY], 'and');
const SORT: QuerySort[] = [
  { s: 'c.renderName', direction: 'ASC' },
  { s: 'c.xp', direction: 'ASC' },
];

export default function StoryCardSelectorComponent({
  componentId,
  investigator,
  deck,
  encounterCodes,
  scenarioName,
  updateStoryCounts,
}: Props) {
  const { colors } = useContext(StyleContext);
  const [initialized, setInitialized] = useState(false);
  const [storyCounts, setStoryCounts] = useSlots({}, updateStoryCounts, true);
  const tabooSetId = deck.deck.taboo_id || 0;
  const updateCount = useCallback((card: Card, count: number) => {
    setStoryCounts({ type: 'set-slot', code: card.code, value: count });
  }, [setStoryCounts]);
  const [allStoryCards, loading] = useCardsFromQuery({
    query: QUERY,
    sort: SORT,
    tabooSetOverride: tabooSetId,
  });
  const encounterCodesSet = useMemo(() => {
    return new Set(flatMap(encounterCodes, encounterCode => {
      return [
        encounterCode,
        ...scenarioRewards(encounterCode),
      ];
    }));
  }, [encounterCodes]);
  const [storyCards, deckStoryCards] = useMemo(() => {
    if (!allStoryCards.length) {
      return [[], []];
    }
    const deckStorySlots: Slots = {};
    const storyCards: Card[] = [];
    const deckStoryCards: Card[] = [];
    forEach(allStoryCards, card => {
      if (deck && card.code && deck.deck.slots && (deck.deck.slots?.[card.code] || 0) > 0) {
        deckStoryCards.push(card);
        deckStorySlots[card.code] = deck.deck.slots[card.code];
      } else if (card.encounter_code && encounterCodesSet.has(card.encounter_code)) {
        storyCards.push(card);
      }
    });
    if (!initialized) {
      setInitialized(true);
      setStoryCounts({ type: 'sync', slots: deckStorySlots });
    }
    return [storyCards, deckStoryCards];
  }, [allStoryCards, deck, encounterCodesSet, initialized, setStoryCounts, setInitialized]);
  const storyCardsSection = useMemo(() => {
    if (!storyCards.length) {
      return null;
    }
    const header = (
      <CardSectionHeader
        investigator={investigator.card}
        section={{ superTitle: scenarioName ? t`Story cards to add - ${scenarioName}` : t`Story cards to add` }}
      />
    );
    const slots: Slots = {};
    forEach(storyCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={storyCounts}
        updateCount={updateCount}
        header={header}
      />
    );
  }, [componentId, scenarioName, investigator, storyCards, storyCounts, updateCount]);

  const deckStoryCardsSection = useMemo(() => {
    if (!deckStoryCards.length) {
      return null;
    }

    const header = (
      <CardSectionHeader
        investigator={investigator.card}
        section={{ superTitle: t`Story Cards - Existing` }}
      />
    );
    const slots: Slots = {};
    forEach(deckStoryCards, card => {
      if (card.code && card.deck_limit) {
        slots[card.code] = card.deck_limit;
      }
    });
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={storyCounts}
        updateCount={updateCount}
        header={header}
      />
    );
  }, [deckStoryCards, componentId, investigator, storyCounts, updateCount]);

  if (loading) {
    return (
      <ActivityIndicator
        style={space.paddingM}
        color={colors.lightText}
        size="large"
        animating
      />
    );
  }
  return (
    <>
      { storyCardsSection }
      { deckStoryCardsSection }
    </>
  );
}
