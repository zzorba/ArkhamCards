import React, { useCallback, useContext, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { SORT_BY_PACK, SortType , Deck, CampaignId } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import { NewDeckOptionsProps } from './NewDeckOptionsDialog';
import { getDeckOptions } from '@components/nav/helper';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useNavigationButtonPressed } from '@components/core/hooks';

export interface NewDeckProps {
  campaignId: CampaignId | undefined;
  onCreateDeck: (deck: Deck) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
}

type Props = NewDeckProps & NavigationProps;

function NewDeckView({ onCreateDeck, campaignId, filterInvestigators, onlyInvestigators, componentId }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const [selectedSort, sortChanged] = useState<SortType>(SORT_BY_PACK);
  const [sortDialog, showInvestigatorSortDialog] = useInvestigatorSortDialog(selectedSort, sortChanged);
  const showSortDialog = useCallback(() => {
    Keyboard.dismiss();
    showInvestigatorSortDialog();
  }, [showInvestigatorSortDialog]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      showSortDialog();
    }
  }, componentId, [componentId, showSortDialog]);

  const onPress = useCallback((investigator: Card) => {
    Navigation.push<NewDeckOptionsProps>(componentId, {
      component: {
        name: 'Deck.NewOptions',
        passProps: {
          campaignId,
          investigatorId: investigator.code,
          onCreateDeck,
        },
        options: {
          ...getDeckOptions(colors, { title: t`New Deck` }, investigator),
          bottomTabs: {},
        },
      },
    });
  }, [componentId, onCreateDeck, campaignId, colors]);

  return (
    <>
      <View style={[styles.container, backgroundStyle]}>
        <InvestigatorsListComponent
          componentId={componentId}
          filterInvestigators={filterInvestigators}
          onlyInvestigators={onlyInvestigators}
          sort={selectedSort}
          onPress={onPress}
        />
      </View>
      { sortDialog}
    </>
  );
}

NewDeckView.options = () => {
  return {
    topBar: {
      title: {
        text: t`New Deck`,
      },
      leftButtons: [{
        icon: iconsMap.close,
        id: 'close',
        color: COLORS.M,
        accessibilityLabel: t`Cancel`,
      }],
      rightButtons: [{
        icon: iconsMap.sort,
        id: 'sort',
        color: COLORS.M,
        accessibilityLabel: t`Sort`,
      }],
    },
  };
};
export default NewDeckView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
