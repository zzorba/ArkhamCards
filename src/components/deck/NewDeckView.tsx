import React, { useCallback, useContext } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { SortType , Deck, CampaignId } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import { NewDeckOptionsProps } from './NewDeckOptionsDialog';
import { getDeckOptions } from '@components/nav/helper';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestigatorSort } from '@reducers/index';
import { setInvestigatorSort } from './actions';

export interface NewDeckProps {
  campaignId: CampaignId | undefined;
  onCreateDeck: (deck: Deck) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
  includeParallel?: boolean;
}

type Props = NewDeckProps & NavigationProps;

function NewDeckView({ onCreateDeck, campaignId, filterInvestigators, onlyInvestigators, componentId, includeParallel }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const selectedSort = useSelector(getInvestigatorSort);
  const dispatch = useDispatch();
  const sortChanged = useCallback((sort: SortType[]) => {
    dispatch(setInvestigatorSort(sort[0]))
  }, [dispatch]);
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
          investigatorId: investigator.alternate_of_code ?? investigator.code,
          onCreateDeck,
          alternateInvestigatorId: investigator.alternate_of_code ? investigator.code : undefined,
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
          includeParallelInvestigators={includeParallel}
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
        icon: iconsMap.dismiss,
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
