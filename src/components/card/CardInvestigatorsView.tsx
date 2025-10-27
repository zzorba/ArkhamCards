
import React, { useCallback, useState, useLayoutEffect, useContext } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { Keyboard, TouchableOpacity, Text } from 'react-native';
import { t } from 'ttag';

import COLORS from '@styles/colors';
import LoadingSpinner from '@components/core/LoadingSpinner';
import DeckValidation from '@lib/DeckValidation';
import useSingleCard from './useSingleCard';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import { SortType, SORT_BY_FACTION, SORT_BY_TITLE } from '@actions/types';
import Card from '@data/types/Card';
import { showCard } from '@components/nav/helper';
import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { iconsMap } from '@app/NavIcons';
import StyleContext from '@styles/StyleContext';

export interface CardInvestigatorProps {
  code: string;
}

function CardInvestigatorsView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Card.Investigators'>>();
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const { code } = route.params;
  const [card, loading] = useSingleCard(code, 'player');
  const [selectedSort, sortChanged] = useState<SortType[]>([SORT_BY_FACTION, SORT_BY_TITLE]);
  const [sortDialog, showInvestigatorSortDialog] = useInvestigatorSortDialog(selectedSort, sortChanged);
  const showSortDialog = useCallback(() => {
    Keyboard.dismiss();
    showInvestigatorSortDialog();
  }, [showInvestigatorSortDialog]);

  const filterInvestigator = useCallback((investigator: Card) => {
    if (
      investigator.duplicate_of_code ||
      (investigator.altArtInvestigator && !investigator.alternate_of_code) ||
      !card
    ) {
      return false;
    }
    const validation = new DeckValidation({ main: investigator, front: investigator, back: investigator }, {}, undefined, { all_options: true, all_customizations: true });
    return validation.canIncludeCard(card, false, []);
  }, [card]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={showSortDialog}>
          <Text style={{ color: COLORS.M, fontSize: 16 }}>{t`Sort`}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, showSortDialog]);


  const onPress = useCallback((investigator: Card) => {
    showCard(navigation, investigator.code, investigator, colors, { showSpoilers: false });
  }, [navigation, colors]);

  if (loading || !card) {
    return <LoadingSpinner large />;
  }

  return (
    <>
      <InvestigatorsListComponent
        hideDeckbuildingRules
        sort={selectedSort}
        onPress={onPress}
        filterInvestigator={filterInvestigator}
        includeParallelInvestigators
      />
      { sortDialog }
    </>
  );
}

CardInvestigatorsView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Investigators`,
      },
      rightButtons: [{
        icon: iconsMap.sort,
        id: 'sort',
        color: COLORS.M,
        accessibilityLabel: t`Sort`,
      }],
    },
  };
};

export default CardInvestigatorsView;