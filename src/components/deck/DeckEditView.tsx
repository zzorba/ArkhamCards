import React, { useContext, useMemo, useState, useLayoutEffect } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { getDeckScreenOptions } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import { t } from 'ttag';

import { VERSATILE_CODE } from '@app_constants';
import CardSearchComponent from '@components/cardlist/CardSearchComponent';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import { FilterState } from '@lib/filters';
import { STORY_CARDS_QUERY, where, combineQueries, DECK_BUILDING_OPTION_CARDS_QUERY } from '@data/sqlite/query';
import { useDeck } from '@data/hooks';
import { DeckId, Slots } from '@actions/types';
import { useInvestigatorChoice } from '@components/card/useSingleCard';
import { forEach, map, range } from 'lodash';
import Card from '@data/types/Card';
import { useCardMapFromQuery } from '@components/card/useCardList';
import { DeckEditContext, SimpleDeckEditContextProvider } from './DeckEditContext';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export interface EditDeckProps {
  id: DeckId;
  deckType?: 'side' | 'extra';
  storyOnly?: boolean;
  weaknessOnly?: boolean;
  title?: string;
  headerBackgroundColor?: string;
}

export default function DeckEditViewWrapper() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.EditAddCards'>>();
  const navigation = useNavigation();
  const { id, deckType, storyOnly, weaknessOnly } = route.params;
  const deck = useDeck(id);
  const { colors } = useContext(StyleContext);

  // Get the actual investigator Card object
  const tabooSetId = deck?.deck.taboo_id || 0;
  const investigator = useInvestigatorChoice(deck?.deck.investigator_code, undefined, tabooSetId);

  // Set screen options with proper styling
  useLayoutEffect(() => {
    if (investigator) {
      let title = t`Edit Deck`;
      if (storyOnly) {
        title = t`Edit Story Cards`;
      } else if (weaknessOnly) {
        title = t`Edit Weakness Cards`;
      }

      const screenOptions = getDeckScreenOptions(
        colors,
        { title },
        investigator.front
      );
      navigation.setOptions(screenOptions);
    }
  }, [navigation, colors, investigator, storyOnly, weaknessOnly]);

  return (
    <SimpleDeckEditContextProvider deckId={id} investigator={deck?.investigator}>
      <DeckEditView
        id={id}
        deck={deck}
        deckType={deckType}
        storyOnly={storyOnly}
        weaknessOnly={weaknessOnly}
      />
    </SimpleDeckEditContextProvider>
  );
}

function DeckEditView({
  id,
  deckType,
  storyOnly,
  weaknessOnly,
  deck,
}: EditDeckProps & { deck: LatestDeckT | undefined }) {
  const { deckEdits, deckBuildingMeta } = useContext(DeckEditContext);
  const tabooSetId = (deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : deck?.deck.taboo_id) || 0;
  const [hideVersatile, setHideVersatile] = useState(false);
  const [hideSplash, setHideSplash] = useState(false);
  const investigator = useInvestigatorChoice(deck?.deck.investigator_code, deckEdits?.meta, tabooSetId);
  const [specialCards] = useCardMapFromQuery(DECK_BUILDING_OPTION_CARDS_QUERY);
  const hasVersatile = deckType !== 'extra' && (deckEdits && deckEdits.slots[VERSATILE_CODE] > 0);
  const isUpgrade = !!deck?.previousDeck;
  const queryOpt = useMemo(() => {
    if (weaknessOnly) {
      return () => combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is not null AND c.encounter_code is null`)],
        'and'
      );
    }
    if (storyOnly) {
      return () => combineQueries(
        STORY_CARDS_QUERY,
        [where(`c.subtype_code is null OR c.subtype_code != 'basicweakness'`)],
        'and'
      );
    }
    if (!investigator) {
      return undefined;
    }
    return (filters: FilterState | undefined, slots: Slots | undefined) => {
      const specialDeckCards: Card[] = [];
      forEach(slots, (count, code) => {
        const card = specialCards[code];
        if (card && count > 0) {
          specialDeckCards.push(...map(range(0, count), () => card));
        }
      });
      const investigatorPart = queryForInvestigator(
        investigator,
        // Special deck building won't apply to extra decks, for now...
        deckType === 'extra' ? {} : slots,
        deckBuildingMeta,
        specialDeckCards,
        {
          filters,
          isUpgrade,
          hideSplash,
          extraDeck: deckType === 'extra',
          side: deckType === 'side',
          hideVersatile,
          includeStory: true,
        },
      );
      return investigatorPart;
    }
  }, [specialCards, deckBuildingMeta, deckType, isUpgrade, hideSplash, storyOnly, weaknessOnly, investigator, hideVersatile]);

  const mode = useMemo(() => {
    if (storyOnly || weaknessOnly) {
      return 'story';
    }
    if (deckType) {
      return deckType;
    }
    return undefined;
  }, [storyOnly, weaknessOnly, deckType]);

  if (!investigator || !queryOpt || !deck || !deckEdits) {
    return null;
  }
  const hasSplash = !!investigator.back.deck_options?.find(option => option.limit);

  return (
    <CardSearchComponent
      deckId={id}
      baseQuery={queryOpt}
      investigator={investigator}
      hideVersatile={hideVersatile}
      setHideVersatile={mode !== 'story' && hasVersatile ? setHideVersatile : undefined}
      hideSplash={hideSplash}
      setHideSplash={mode !== 'story' && hasSplash ? setHideSplash : undefined}
      mode={mode}
      screenType="deck"
    />
  );
}

function options<T extends RootStackParamList>({ route }: { route: RouteProp<T, 'Deck.EditAddCards'> }): NativeStackNavigationOptions {
  return {
    title: route.params?.title ?? t`Edit Deck`,
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    headerStyle: route.params?.headerBackgroundColor ? {
      backgroundColor: route.params.headerBackgroundColor,
    } : undefined,
  };
};

DeckEditViewWrapper.options = options;

