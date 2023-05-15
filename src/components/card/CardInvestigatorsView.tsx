
import React, { useCallback, useContext, useState } from 'react';
import { Keyboard } from 'react-native';
import { t } from 'ttag';

import COLORS from '@styles/colors';
import { useNavigationButtonPressed } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import DeckValidation from '@lib/DeckValidation';
import StyleContext from '@styles/StyleContext';
import useSingleCard from './useSingleCard';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import { NavigationProps } from '@components/nav/types';
import { SortType, SORT_BY_FACTION } from '@actions/types';
import Card from '@data/types/Card';
import { showCard } from '@components/nav/helper';
import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { iconsMap } from '@app/NavIcons';

export interface CardInvestigatorProps {
  code: string;
}

function CardInvestigatorsView({ code, componentId }: CardInvestigatorProps & NavigationProps) {
  const { colors } = useContext(StyleContext);
  const [card, loading] = useSingleCard(code, 'player');
  const [selectedSort, sortChanged] = useState<SortType>(SORT_BY_FACTION);
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
    const validation = new DeckValidation(investigator, {}, undefined, { all_options: true, all_customizations: true });
    return validation.canIncludeCard(card, false);
  }, [card]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'sort') {
      showSortDialog();
    }
  }, componentId, [componentId, showSortDialog]);


  const onPress = useCallback((investigator: Card) => {
    showCard(componentId, investigator.code, investigator, colors, { showSpoilers: false });
  }, [componentId, colors]);

  if (loading || !card) {
    return <LoadingSpinner large />;
  }

  return (
    <>
      <InvestigatorsListComponent
        componentId={componentId}
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