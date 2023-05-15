import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Options } from 'react-native-navigation';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import { t } from 'ttag';

import { TouchableOpacity } from '@components/core/Touchables';
import { iconsMap } from '@app/NavIcons';
import { Slots, SORT_BY_TYPE, SortType, DeckId, CampaignId, DEFAULT_SORT } from '@actions/types';
import { AppState, getDeckChecklist } from '@reducers';
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
  checklist: string[];
  pressCard: (code: string, card: Card) => void;
}) {
  const [count] = useDeckSlotCount(deckId, card.code);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: boolean) => {
    dispatch(setDeckChecklistCard(deckId, card.code, value));
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
        value: !!find(checklist, c => c === card.code),
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
  const { deckEdits } = useParsedDeck(id, componentId);
  const dispatch = useDispatch();
  const [sorts, setSorts] = useState<SortType[]>(DEFAULT_SORT);
  const checklistSelector = useCallback((state: AppState) => getDeckChecklist(state, id), [id]);
  const checklist = useSelector(checklistSelector);
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
          <TouchableOpacity onPress={clearChecklist} disabled={!checklist.length}>
            <Text style={[typography.text, checklist.length ? typography.light : { color: colors.L10 }]}>
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
        deckId={id}
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
