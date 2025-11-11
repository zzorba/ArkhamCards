import React, { useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';
import { useKeepAwake } from 'expo-keep-awake';

import { TouchableOpacity } from '@components/core/Touchables';
import { Slots, SortType, DeckId, CampaignId } from '@actions/types';
import { AppState, getCardSort } from '@reducers';
import { resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { useSortDialog } from '@components/cardlist/CardSortDialog';
import Card, { InvestigatorChoice } from '@data/types/Card';
import COLORS from '@styles/colors';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ParsedDeckResults, useParsedDeck } from '@components/deck/hooks';
import { useInvestigatorChoice } from '@components/card/useSingleCard';
import { useCampaignDeck } from '@data/hooks';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { updateCardSorts } from '@components/filter/actions';
import { find } from 'lodash';
import { DeckEditContext, ParsedDeckContextProvider, useChecklistCount, useDeckSlotCount } from '../DeckEditContext';
import { RootStackParamList } from '@navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import HeaderButton from '@components/core/HeaderButton';

export interface DeckChecklistProps {
  id: DeckId;
  slots: Slots;
  campaignId?: CampaignId;
  tabooSetOverride?: number;
}

function ChecklistCard({
  id,
  card,
  pressCard,
}: {
  id: string;
  card: Card;
  pressCard: (code: string, card: Card) => void;
}) {
  const { checklist, toggleValue } = useChecklistCount(card.code);
  const [count] = useDeckSlotCount(card.code);
  return (
    <CardSearchResult
      card={card}
      onPressId={pressCard}
      id={id}
      backgroundColor="transparent"
      control={{
        type: 'count_with_toggle',
        count,
        values: checklist,
        toggleValue,
      }}
    />
  );
}

function DeckChecklistView({
  id,
  parsedDeck,
  investigator,
}: { id: DeckId; parsedDeck: ParsedDeckResults; investigator: InvestigatorChoice | undefined }) {
  const navigation = useNavigation();
  const { backgroundStyle, colors, typography, fontScale, width } = useContext(StyleContext);
  const { checklist } = useContext(DeckEditContext);

  const dispatch = useDispatch();
  const sortSelector = useCallback((state: AppState) => getCardSort(state, 'checklist', false), []);
  const sorts = useSelector(sortSelector);
  const setSorts = useCallback((sorts: SortType[]) => {
    dispatch(updateCardSorts(sorts, 'checklist', false));
  }, [dispatch]);
  const hasCheckedItems = useMemo(() => {
    return !!checklist && !!find(Object.values(checklist), f => !!f?.length);
  }, [checklist]);
  const [sortDialog, showSortDialog] = useSortDialog(setSorts, sorts, false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="sort"
          color={COLORS.white}
          accessibilityLabel={t`Sort`}
          onPress={showSortDialog}
        />
      ),
    });
  }, [navigation, showSortDialog]);

  const renderCard = useCallback((card: Card, cardId: string, onPressId: (id: string, card: Card) => void) => {
    return (
      <ChecklistCard
        key={card.code}
        id={cardId}
        card={card}
        pressCard={onPressId}
      />
    );
  }, []);

  const clearChecklist = useCallback(() => {
    dispatch(resetDeckChecklist(id));
  }, [dispatch, id]);

  const [headerItems, headerHeight] = useMemo(() => {
    return [
      [(
        <View style={[space.paddingM, styles.headerRow, { width }]} key="header">
          <TouchableOpacity onPress={clearChecklist} disabled={!hasCheckedItems}>
            <Text style={[typography.text, hasCheckedItems ? typography.light : { color: colors.L10 }]}>
              { t`Clear` }
            </Text>
          </TouchableOpacity>
        </View>
      )],
      m * 2 + 22 * fontScale,
    ];
  }, [hasCheckedItems, typography, colors, fontScale, clearChecklist, width]);
  useKeepAwake();
  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <DbCardResultList
        deck={parsedDeck.deckT}
        filterId={id.uuid}
        investigator={investigator}
        sorts={sorts}
        headerItems={headerItems}
        headerHeight={headerHeight}
        renderCard={renderCard}
        noSearch
        specialMode="checklist"
        currentDeckOnly
        footerPadding={NOTCH_BOTTOM_PADDING}
      />
      { sortDialog }
    </View>
  );
}

function DeckChecklistViewWrapper() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.Checklist'>>();
  const { campaignId, id } = route.params;

  const deck = useCampaignDeck(id, campaignId);
  const parsedDeck = useParsedDeck(id);
  const deckEdits = parsedDeck?.deckEdits;
  const investigator = useInvestigatorChoice(deck?.investigator, deckEdits?.meta, deckEdits?.tabooSetChange || deck?.deck.taboo_id);

  return (
    <ParsedDeckContextProvider parsedDeckObj={parsedDeck}>
      <DeckChecklistView id={id} parsedDeck={parsedDeck} investigator={investigator} />
    </ParsedDeckContextProvider>
  );
}

export default DeckChecklistViewWrapper;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
