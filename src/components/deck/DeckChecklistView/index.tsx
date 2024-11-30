import React, { useCallback, useContext, useMemo } from 'react';
import { Options } from 'react-native-navigation';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import { iconsMap } from '@app/NavIcons';
import { Slots, SortType, DeckId, CampaignId, ChecklistSlots } from '@actions/types';
import { AppState, getCardSort, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { useSortDialog } from '@components/cardlist/CardSortDialog';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeckSlotCount, useParsedDeck } from '@components/deck/hooks';
import { useNavigationButtonPressed } from '@components/core/hooks';
import useSingleCard from '@components/card/useSingleCard';
import { useCampaignDeck } from '@data/hooks';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import KeepAwake from 'react-native-keep-awake';
import { updateCardSorts } from '@components/filter/actions';
import { find } from 'lodash';

export interface DeckChecklistProps {
  id: DeckId;
  slots: Slots;
  campaignId?: CampaignId;
  tabooSetOverride?: number;
}

type Props = DeckChecklistProps & NavigationProps;

function ChecklistCard({
  deckId,
  id,
  card,
  checklist,
  pressCard,
}: {
  deckId: DeckId;
  id: string;
  card: Card;
  checklist: ChecklistSlots;
  pressCard: (code: string, card: Card) => void;
}) {
  const [count] = useDeckSlotCount(deckId, card.code);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: number, toggle: boolean) => {
    dispatch(setDeckChecklistCard(deckId, card.code, value, toggle));
  }, [dispatch, deckId, card.code]);
  return (
    <CardSearchResult
      card={card}
      onPressId={pressCard}
      id={id}
      backgroundColor="transparent"
      control={{
        type: 'count_with_toggle',
        count,
        values: checklist[card.code] ?? [],
        toggleValue,
      }}
    />
  );
}

function DeckChecklistView({
  componentId,
  id,
  campaignId,
}: Props) {
  const { backgroundStyle, colors, typography, fontScale, width } = useContext(StyleContext);
  const deck = useCampaignDeck(id, campaignId);
  const parsedDeck = useParsedDeck(id, componentId);
  const deckEdits = parsedDeck.deckEdits;
  const dispatch = useDispatch();
  const sortSelector = useCallback((state: AppState) => getCardSort(state, 'checklist', false), []);
  const sorts = useSelector(sortSelector);
  const setSorts = useCallback((sorts: SortType[]) => {
    dispatch(updateCardSorts(sorts, 'checklist', false));
  }, [dispatch]);

  const checklistSelector = useCallback((state: AppState) => getDeckChecklist(state, id), [id]);
  const checklist = useSelector(checklistSelector);
  const hasChecklist = useMemo(() => {
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
        deckId={id}
        id={cardId}
        card={card}
        pressCard={onPressId}
        checklist={checklist}
      />
    );
  }, [id, checklist]);

  const clearChecklist = useCallback(() => {
    dispatch(resetDeckChecklist(id));
  }, [dispatch, id]);

  const [headerItems, headerHeight] = useMemo(() => {
    return [
      [(
        <View style={[space.paddingM, styles.headerRow, { width }]} key="header">
          <TouchableOpacity onPress={clearChecklist} disabled={!hasChecklist}>
            <Text style={[typography.text, hasChecklist ? typography.light : { color: colors.L10 }]}>
              { t`Clear` }
            </Text>
          </TouchableOpacity>
        </View>
      )],
      m * 2 + 22 * fontScale,
    ];
  }, [checklist, typography, colors, fontScale, clearChecklist, width]);
  const [investigator] = useSingleCard(deckEdits?.meta.alternate_back || deck?.investigator, 'player', deckEdits?.tabooSetChange || deck?.deck.taboo_id);

  if (!deckEdits) {
    return null;
  }

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      <KeepAwake />
      <DbCardResultList
        componentId={componentId}
        parsedDeck={parsedDeck}
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

DeckChecklistView.options = (): Options => {
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
export default DeckChecklistView;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
