import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { filter, flatMap, find, flatten, keys, uniq, throttle } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { t } from 'ttag';

import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import useTabView from '@components/core/useTabView';
import InvestigatorSelectorTab from './InvestigatorSelectorTab';
import DeckSelectorTab from './DeckSelectorTab';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { CampaignId, Deck, SortType, SORT_BY_PACK, SORT_BY_CARD_ID } from '@actions/types';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { useFlag, useInvestigators } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import ArkhamButton from '@components/core/ArkhamButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export interface MyDecksSelectorProps {
  campaignId: CampaignId;
  onDeckSelect: (deck: Deck) => Promise<void>;
  onInvestigatorSelect?: (card: Card) => void;

  singleInvestigator?: string;
  selectedDecks?: LatestDeckT[];
  selectedInvestigatorIds?: string[];

  onlyShowSelected?: boolean;
  simpleOptions?: boolean;
  includeParallel?: boolean;
}

function MyDecksSelectorDialog() {
  const route = useRoute<RouteProp<RootStackParamList, 'Dialog.DeckSelector'>>();
  const {
    campaignId, onDeckSelect, onInvestigatorSelect,
    singleInvestigator, selectedDecks, selectedInvestigatorIds,
    onlyShowSelected, simpleOptions, includeParallel,
  } = route.params;
  const navigation = useNavigation();
  const { fontScale, typography, width } = useContext(StyleContext);

  const campaign = useCampaign(campaignId);

  const [hideOtherCampaignDecks, toggleHideOtherCampaignDecks] = useFlag(true);
  const [onlyShowPreviousCampaignMembers, toggleOnlyShowPreviousCampaignMembers] = useFlag(false);
  const [hideEliminatedInvestigators, toggleHideEliminatedInvestigators] = useFlag(true);
  const [selectedSort, setSelectedSort] = useState<SortType[]>([SORT_BY_PACK, SORT_BY_CARD_ID]);
  const campaignInvestigators = useMemo(() => onlyShowSelected ? [] : keys(campaign?.investigatorData || {}), [campaign?.investigatorData, onlyShowSelected]);
  const investigators = useInvestigators(campaignInvestigators);
  const filterInvestigators = useMemo(() => {
    if (onlyShowSelected) {
      return [];
    }
    const eliminatedInvestigators: string[] = !campaign ? [] :
      filter(
        keys(campaign.investigatorData || {}),
        code => {
          const card = investigators && investigators[code];
          return !!card && card.eliminated(campaign.investigatorData?.[code]);
        });
    return uniq([
      ...(hideEliminatedInvestigators ? eliminatedInvestigators : []),
      ...flatMap(selectedDecks, deck => {
        if (deck) {
          return [deck.investigator];
        }
        return [];
      }),
      ...(selectedInvestigatorIds || []),
    ]);
  }, [hideEliminatedInvestigators, selectedInvestigatorIds, selectedDecks, campaign, investigators, onlyShowSelected]);
  const onlyInvestigators = useMemo(() => {
    if (singleInvestigator) {
      return [singleInvestigator];
    }
    return undefined;
  }, [singleInvestigator]);
  console.log('includeParallel', includeParallel)
  const showNewDeckDialog = useMemo(() => {
    return throttle(() => {
      navigation.navigate('Deck.New', {
        campaignId,
        onCreateDeck: onDeckSelect,
        filterInvestigators,
        onlyInvestigators,
        includeParallel,
      });
    }, 200);
  }, [navigation, campaignId, onDeckSelect, filterInvestigators, onlyInvestigators, includeParallel]);
  const [investigatorSortDialog, showInvestigatorSortDialog] = useInvestigatorSortDialog(selectedSort, setSelectedSort);
  const showSortDialog = useCallback(() => {
    Keyboard.dismiss();
    showInvestigatorSortDialog();
  }, [showInvestigatorSortDialog]);
  const [selectedTab, onTabChange] = useState<string>('decks');

  useLayoutEffect(() => {
    switch (selectedTab) {
      case 'decks':
        navigation.setOptions({
          title: singleInvestigator ? t`Select Deck` : t`Choose an Investigator`,
          headerRight: () => (
            <HeaderButton
              iconName="plus-button"
              color={COLORS.M}
              accessibilityLabel={t`New Deck`}
              onPress={showNewDeckDialog}
            />
          ),
        });
        break;
      case 'investigators':
        navigation.setOptions({
          title: t`Choose an Investigator`,
          headerRight: () => (
            <HeaderButton
              iconName="sort"
              color={COLORS.M}
              accessibilityLabel={t`Sort`}
              onPress={showSortDialog}
            />
          ),
        });
        break;
    }
  }, [navigation, selectedTab, singleInvestigator, showSortDialog, showNewDeckDialog]);

  const onlyDecks = useMemo(() => {
    if (onlyShowSelected) {
      return selectedDecks;
    }
    if (onlyShowPreviousCampaignMembers && campaign) {
      return campaign.latestDecks();
    }
    return undefined;
  }, [selectedDecks, campaign, onlyShowSelected, onlyShowPreviousCampaignMembers]);

  const searchOptions = useCallback((forDecks: boolean): SearchOptions | undefined => {
    if (onlyShowSelected) {
      return undefined;
    }
    const elements = flatten([
      forDecks ? [(
        <View style={styles.row} key={0}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Hide decks from other campaigns` }
          </Text>
          <ArkhamSwitch
            value={hideOtherCampaignDecks}
            onValueChange={toggleHideOtherCampaignDecks}
          />
        </View>
      )] : [],
      (!!campaign && !singleInvestigator && !simpleOptions) ? [(
        <View style={styles.row} key={1}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Hide killed and insane investigators` }
          </Text>
          <ArkhamSwitch
            value={hideEliminatedInvestigators}
            onValueChange={toggleHideEliminatedInvestigators}
          />
        </View>
      )] : [],
      (!!campaign && !singleInvestigator && !simpleOptions) ? [(
        <View style={styles.row} key={2}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Only show previous campaign members` }
          </Text>
          <ArkhamSwitch
            value={onlyShowPreviousCampaignMembers}
            onValueChange={toggleOnlyShowPreviousCampaignMembers}
          />
        </View>
      )] : [],
    ]);
    if (!elements.length) {
      return undefined;
    }
    return {
      controls: <View style={styles.searchOptions}>{ elements }</View>,
      height: 20 + elements.length * (fontScale * 20 + 8) + 12,
    };
  }, [campaign, onlyShowSelected, singleInvestigator, simpleOptions, typography, fontScale,
    hideOtherCampaignDecks, hideEliminatedInvestigators, onlyShowPreviousCampaignMembers,
    toggleHideOtherCampaignDecks, toggleHideEliminatedInvestigators, toggleOnlyShowPreviousCampaignMembers]);

  const filterDeck = useCallback((deck: MiniDeckT): string | undefined => {
    if (singleInvestigator && deck.investigator !== singleInvestigator && deck.alternate_investigator !== singleInvestigator) {
      return 'wrong_investigator';
    }
    if (selectedInvestigatorIds && find(selectedInvestigatorIds, i => i === deck.investigator || i === deck.alternate_investigator)) {
      return 'selected_investigator';
    }
    if (onlyShowSelected) {
      return undefined;
    }
    if (find(filterInvestigators, deck.investigator) || (deck.alternate_investigator && find(filterInvestigators, deck.alternate_investigator))) {
      return 'filtered_investigator';
    }
    if (hideOtherCampaignDecks && deck.campaign_id) {
      return 'other_campaign';
    }
    return undefined;
  }, [singleInvestigator, selectedInvestigatorIds, onlyShowSelected, filterInvestigators, hideOtherCampaignDecks]);
  const renderExpandButton = useCallback((reason: string) => {
    switch (reason) {
      case 'other_campaign':
        return (
          <View style={[space.paddingSideS, { width }]} key="other_campaign">
            <ArkhamButton
              icon="show"
              title={t`Show decks from other campaigns`}
              onPress={toggleHideOtherCampaignDecks}
              grow
            />
          </View>
        );
      default:
        return null;
    }
  }, [toggleHideOtherCampaignDecks, width]);
  const deckTab = useMemo(() => (
    <DeckSelectorTab
      onDeckSelect={onDeckSelect}
      searchOptions={searchOptions(true)}
      onlyDecks={onlyDecks}
      filterDeck={filterDeck}
      renderExpandButton={renderExpandButton}
    />
  ), [onDeckSelect, searchOptions, filterDeck, renderExpandButton, onlyDecks]);
  const investigatorTab = useMemo(() => {
    if (!onInvestigatorSelect) {
      return null;
    }
    return (
      <InvestigatorSelectorTab
        sort={selectedSort}
        onInvestigatorSelect={onInvestigatorSelect}
        searchOptions={searchOptions(false)}
        filterInvestigators={filterInvestigators}
        includeParallel={includeParallel}
      />
    );
  }, [selectedSort, onInvestigatorSelect, searchOptions, filterInvestigators, includeParallel]);
  const tabs = useMemo(() => {
    return investigatorTab ? [
      {
        key: 'decks',
        title: t`Decks`,
        node: deckTab,
      },
      {
        key: 'investigators',
        title: t`Investigator`,
        node: investigatorTab,
      },
    ] : null;
  }, [deckTab, investigatorTab]);
  const [tabView] = useTabView({ tabs: tabs || [], onTabChange });
  if (tabs) {
    return (
      <>
        {tabView}
        {investigatorSortDialog}
      </>
    );
  }
  return (
    <>
      {deckTab}
      {investigatorSortDialog}
    </>
  );
}

function options<T extends RootStackParamList>({ route }: { route: RouteProp<T, 'Dialog.DeckSelector'> }): NativeStackNavigationOptions {
  return {
    title: route.params?.singleInvestigator ? t`Select Deck` : t`Choose an Investigator`,
    headerBackTitle: t`Cancel`,
  };
};
MyDecksSelectorDialog.options = options;

export default MyDecksSelectorDialog;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
  },
  searchOption: {
    marginRight: 2,
  },
  searchOptions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
});
