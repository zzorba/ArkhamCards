import React, { useCallback, useContext, useLayoutEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

import { t } from 'ttag';

import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { SortType , Deck, CampaignId } from '@actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { useDispatch, useSelector } from 'react-redux';
import { getInvestigatorSort } from '@reducers/index';
import { setInvestigatorSort } from './actions';
import HeaderButton from '@components/core/HeaderButton';

export interface NewDeckProps {
  campaignId?: CampaignId;
  onCreateDeck?: (deck: Deck) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
  includeParallel?: boolean;
}

function NewDeckView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.New'>>();
  const navigation = useNavigation();
  const { campaignId, onCreateDeck, filterInvestigators, onlyInvestigators, includeParallel } = route.params ?? {};
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
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          iconName="dismiss"
          onPress={goBack}
          color={colors.M}
          accessibilityLabel={t`Cancel`}
        />
      ),
      headerRight: () => (
        <HeaderButton
          iconName="sort"
          onPress={showSortDialog}
          color={colors.M}
          accessibilityLabel={t`Sort`}
        />
      ),
    });
  }, [navigation, colors.M, showSortDialog, goBack]);

  const onPress = useCallback((investigator: Card) => {
    navigation.navigate('Deck.NewOptions', {
      campaignId,
      investigatorId: investigator.alternate_of_code ?? investigator.code,
      onCreateDeck,
      alternateInvestigatorId: investigator.alternate_of_code ? investigator.code : undefined,
      headerBackgroundColor: colors.faction[investigator.factionCode()].background,
    });
  }, [navigation, onCreateDeck, campaignId, colors]);

  return (
    <>
      <View style={[styles.container, backgroundStyle]}>
        <InvestigatorsListComponent
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

export default NewDeckView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
