import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Options } from 'react-native-navigation';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { Slots, SORT_BY_TYPE, SortType } from '@actions/types';
import { AppState, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { showCard } from '@components/nav/helper';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { showSortDialog } from '@components/cardlist/CardSortDialog';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface DeckChecklistProps {
  id: number;
  slots: Slots;
  tabooSetOverride?: number;
}

type Props = DeckChecklistProps & NavigationProps;

function DeckChecklistView({
  componentId,
  id,
  slots,
  tabooSetOverride,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const checklist = useSelector((state: AppState) => getDeckChecklist(state, id));
  const dispatch = useDispatch();
  const [sort, setSort] = useState<SortType>(SORT_BY_TYPE);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'sort') {
      showSortDialog(
        setSort,
        sort,
        false
      );
    }
  }, componentId, [sort, setSort]);
  const toggleCard = useCallback((card: Card, value: boolean) => {
    dispatch(setDeckChecklistCard(id, card.code, value));
  }, [dispatch, id]);

  const pressCard = useCallback((card: Card) => {
    showCard(
      componentId,
      card.code,
      card,
      colors,
      true,
      tabooSetOverride
    );
  }, [tabooSetOverride, componentId, colors]);

  const renderCard = useCallback((card: Card) => {
    return (
      <CardSearchResult
        card={card}
        count={slots[card.code]}
        onToggleChange={toggleCard}
        onPress={pressCard}
        toggleValue={checklist.has(card.code)}
        backgroundColor="transparent"
      />
    );
  }, [slots, checklist, toggleCard, pressCard]);

  const clearChecklist = useCallback(() => {
    dispatch(resetDeckChecklist(id));
  }, [dispatch, id]);

  const header = useMemo(() => {
    return (
      <View style={[space.paddingM, space.marginRightXs, styles.headerRow]}>
        <TouchableOpacity onPress={clearChecklist} disabled={!checklist.size}>
          <Text style={[typography.text, checklist.size ? typography.light : { color: colors.L10 }]}>
            { t`Clear` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [checklist, typography, colors, clearChecklist]);

  return (
    <DbCardResultList
      componentId={componentId}
      deckCardCounts={slots}
      originalDeckSlots={slots}
      sort={sort}
      header={header}
      renderCard={renderCard}
      noSearch
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
