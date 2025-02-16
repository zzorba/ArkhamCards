import React, { useCallback, useContext, useMemo } from 'react';
import { Options } from 'react-native-navigation';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import { iconsMap } from '@app/NavIcons';
import { Slots, SortType, DeckId, CampaignId } from '@actions/types';
import { AppState, getCardSort } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { useSortDialog } from '@components/cardlist/CardSortDialog';
import Card, { InvestigatorChoice } from '@data/types/Card';
import COLORS from '@styles/colors';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ParsedDeckResults, useParsedDeck } from '@components/deck/hooks';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { useInvestigatorChoice } from '@components/card/useSingleCard';
import { useCampaignDeck } from '@data/hooks';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import KeepAwake from 'react-native-keep-awake';
import { updateCardSorts } from '@components/filter/actions';
import { find } from 'lodash';
import { DeckEditContext, ParsedDeckContextProvider, useChecklistCount, useDeckSlotCount } from '../DeckEditContext';

export interface DeckChecklistProps {
  id: DeckId;
  slots: Slots;
  campaignId?: CampaignId;
  tabooSetOverride?: number;
}

type Props = DeckChecklistProps & NavigationProps;

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
  componentId,
  id,
  parsedDeck,
  investigator,
}: { id: DeckId; parsedDeck: ParsedDeckResults; investigator: InvestigatorChoice | undefined } & NavigationProps) {
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
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'sort') {
      showSortDialog();
    }
  }, componentId, [sorts, setSorts]);

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

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <KeepAwake />
      <DbCardResultList
        componentId={componentId}
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

function DeckChecklistViewWrapper({ campaignId, id, componentId }: Props) {
  const deck = useCampaignDeck(id, campaignId);
  const parsedDeck = useParsedDeck(id, componentId);
  const deckEdits = parsedDeck?.deckEdits;
  const investigator = useInvestigatorChoice(deck?.investigator, deckEdits?.meta, deckEdits?.tabooSetChange || deck?.deck.taboo_id);

  return (
    <ParsedDeckContextProvider parsedDeckObj={parsedDeck}>
      <DeckChecklistView id={id} componentId={componentId} parsedDeck={parsedDeck} investigator={investigator} />
    </ParsedDeckContextProvider>
  );
}

DeckChecklistViewWrapper.options = (): Options => {
  return {
    topBar: {
      title: {
        text: t`Checklist`,
        color: COLORS.white,
      },
      rightButtons: [
        {
          icon: iconsMap.sort,
          id: 'sort',
          color: COLORS.white,
          accessibilityLabel: t`Sort`,
        },
      ],
    },
  };
};
export default DeckChecklistViewWrapper;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
