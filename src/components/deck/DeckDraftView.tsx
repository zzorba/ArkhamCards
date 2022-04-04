import React, { useCallback, useContext, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { NavigationProps } from '@components/nav/types';
import { CampaignId, DeckId } from '@actions/types';
import { useCampaignDeck } from '@data/hooks';
import { useDeckEdits, useParsedDeck } from './hooks';
import StyleContext from '@styles/StyleContext';
import DeckNavFooter from './DeckNavFooter';
import { Navigation } from 'react-native-navigation';
import { combineQueries, NO_CUSTOM_CARDS_QUERY, NO_DUPLICATES_QUERY, where } from '@data/sqlite/query';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { CardsMap } from '@data/types/Card';
import { forEach } from 'lodash';

export interface DeckDraftProps {
  id: DeckId;
  campaignId?: CampaignId;
}
export default function DeckDraftView({ componentId, id, campaignId }: DeckDraftProps & NavigationProps) {
  const deck = useCampaignDeck(id, campaignId);
  const parsedDeckObj = useParsedDeck(id, componentId);
  const investigatorBack = parsedDeckObj.parsedDeck?.investigatorBack;
  const meta = parsedDeckObj.deckEdits?.meta;
  const query = useMemo(() => {
    if (!investigatorBack || !meta) {
      return undefined;
    }
    return combineQueries(
      queryForInvestigator(investigatorBack, meta),
      [
        where('c.xp = 0 OR c.xp is null'),
        where('c.extra_xp is null OR c.extra_xp = 0'),
        NO_DUPLICATES_QUERY,
        NO_CUSTOM_CARDS_QUERY,
      ],
      'and'
    );
  }, [investigatorBack, meta]);
  const [playerCards, loading] = useCardsFromQuery({ query, tabooSetOverride: parsedDeckObj.tabooSetId, guaranteeResults: true });
  const cards = useMemo(() => {
    const r: CardsMap = {
      ...parsedDeckObj.cards,
    };
    forEach(playerCards, c => {
      r[c.code] = c;
    });
    return r;
  }, [parsedDeckObj.cards, playerCards]);

  const { backgroundStyle } = useContext(StyleContext);
  const backPressed = useCallback(() => Navigation.pop(componentId), [componentId]);
  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      { loading ? <LoadingSpinner large /> : (
        <ScrollView>
        </ScrollView>
      ) }

      <DeckNavFooter
        deckId={id}
        componentId={componentId}
        onPress={backPressed}
      />
    </View>
  );
}