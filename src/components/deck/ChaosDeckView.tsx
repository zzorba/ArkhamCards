import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { t } from 'ttag';

import { DeckMeta, Slots } from '@actions/types';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import useSingleCard from '@components/card/useSingleCard';
import ArkhamButton from '@components/core/ArkhamButton';
import { combineQueries, NO_CUSTOM_CARDS_QUERY, where } from '@data/sqlite/query';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import randomDeck from '@lib/randomDeck';
import { forEach, map } from 'lodash';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useParsedDeck } from './hooks';
import { CardsMap } from '@data/types/Card';
import { parseDeck } from '@lib/parseDeck';
import useParsedDeckComponent from './useParsedDeckComponent';
import { NavigationProps } from '@components/nav/types';
import space from '@styles/space';

export interface ChaosDeckProps {
  investigatorCode: string;
  meta: DeckMeta;
}

export default function ChaosDeckView({ investigatorCode, meta, componentId }: ChaosDeckProps & NavigationProps) {
  const [investigator] = useSingleCard(investigatorCode, 'player');
  const [investigatorBack] = useSingleCard(meta.alternate_back || investigatorCode, 'player');
  const query = useMemo(() => {
    if (!investigator) {
      return undefined;
    }

    return combineQueries(
      queryForInvestigator(investigator),
      [where('c.xp = 0 OR c.xp is null'), NO_CUSTOM_CARDS_QUERY],
      'and'
    );
  }, [investigator]);
  const [playerCards, loading] = useCardsFromQuery({ query });
  const cards = useMemo(() => {
    const cards: CardsMap = {};
    if (investigator) {
      cards[investigator.code] = investigator;
    }
    forEach(playerCards, c => {
      cards[c.code] = c;
    });
    return cards;
  }, [playerCards, investigator]);
  const [slots, setSlots] = useState<Slots | undefined>();
  const progress = useSharedValue(0);
  const onPress = useCallback(() => {
    if (investigatorBack && playerCards.length) {
      setSlots(randomDeck(investigatorCode, investigatorBack, meta, playerCards, cards, progress));
    }
  }, [investigator, playerCards, meta, progress, investigatorBack, investigatorCode]);
  const parsedDeck = useMemo(() => {
    return investigator && slots && parseDeck(investigator.code, meta, slots, {}, {}, cards);
  }, [investigator, meta, slots, cards]);
  const [parsedDeckComponent] = useParsedDeckComponent({
    componentId,
    meta,
    parsedDeck,
    mode: 'view',
    cards,
    tabooSetId: 0,
    visible: true,
  });
  if (loading) {
    return <LoadingSpinner large />;
  }
  return (
    <ScrollView>
      <ArkhamButton icon="xp" title={t`Generate Ultimatium of Chaos Deck`} onPress={onPress} />
      { !!parsedDeck && (
        <View style={space.paddingSideS}>
          { parsedDeckComponent }
        </View>
      ) }
    </ScrollView>
  );
}