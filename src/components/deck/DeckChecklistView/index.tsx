import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Options } from 'react-native-navigation';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { Slots, SORT_BY_TYPE, SortType, DeckId } from '@actions/types';
import { AppState, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { showCard } from '@components/nav/helper';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { showSortDialog } from '@components/cardlist/CardSortDialog';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeckEdits, useDeckSlotCount } from '@components/deck/hooks';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface DeckChecklistProps {
  id: DeckId;
  slots: Slots;
  tabooSetOverride?: number;
}

type Props = DeckChecklistProps & NavigationProps;

function ChecklistCard({
  id,
  card,
  checklist,
  pressCard,
}: {
  id: DeckId,
  card: Card;
  checklist: string[];
  pressCard: (card: Card) => void;
}) {
  const count = useDeckSlotCount(id, card.code);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: boolean) => {
    dispatch(setDeckChecklistCard(id, card.code, value));
  }, [dispatch, id, card.code]);
  return (
    <CardSearchResult
      card={card}
      onPress={pressCard}
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
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [deckEdits, deckEditsRef] = useDeckEdits(id);
  const dispatch = useDispatch();
  const [sort, setSort] = useState<SortType>(SORT_BY_TYPE);
  const checklistSelector = useCallback((state: AppState) => getDeckChecklist(state, id), [id]);
  const checklist = useSelector(checklistSelector);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'sort') {
      showSortDialog(
        setSort,
        sort,
        false
      );
    }
  }, componentId, [sort, setSort]);

  const pressCard = useCallback((card: Card) => {
    if (!deckEditsRef.current) {
      return;
    }
    showCard(
      componentId,
      card.code,
      card,
      colors,
      true,
      deckEditsRef.current.tabooSetChange
    );
  }, [deckEditsRef, componentId, colors]);

  const renderCard = useCallback((card: Card) => {
    return (
      <ChecklistCard
        key={card.code}
        id={id}
        card={card}
        pressCard={pressCard}
        checklist={checklist}
      />
    );
  }, [id, pressCard, checklist]);

  const clearChecklist = useCallback(() => {
    dispatch(resetDeckChecklist(id));
  }, [dispatch, id]);

  const header = useMemo(() => {
    return (
      <View style={[space.paddingM, space.marginRightXs, styles.headerRow]}>
        <TouchableOpacity onPress={clearChecklist} disabled={!checklist.length}>
          <Text style={[typography.text, checklist.length ? typography.light : { color: colors.L10 }]}>
            { t`Clear` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [checklist, typography, colors, clearChecklist]);

  if (!deckEdits) {
    return null;
  }

  return (
    <DbCardResultList
      componentId={componentId}
      deckId={id}
      sort={sort}
      header={header}
      renderCard={renderCard}
      noSearch
      currentDeckOnly
    />
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
