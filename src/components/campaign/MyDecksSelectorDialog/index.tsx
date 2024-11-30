import React, { useCallback, useContext, useMemo, useState } from 'react';
import { filter, flatMap, find, flatten, keys, uniq, throttle } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { useInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import useTabView from '@components/core/useTabView';
import InvestigatorSelectorTab from './InvestigatorSelectorTab';
import DeckSelectorTab from './DeckSelectorTab';
import { NewDeckProps } from '@components/deck/NewDeckView';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { NavigationProps } from '@components/nav/types';
import { CampaignId, Deck, SortType, SORT_BY_PACK, SORT_BY_CARD_ID } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import Card from '@data/types/Card';
import COLORS from '@styles/colors';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { useFlag, useInvestigators, useNavigationButtonPressed } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import ArkhamButton from '@components/core/ArkhamButton';

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

type Props = NavigationProps & MyDecksSelectorProps;

function deckOptions(passProps: Props): Options {
  return {
    topBar: {
      title: {
        text: passProps.singleInvestigator ? t`Select Deck` : t`Choose an Investigator`,
      },
      leftButtons: [{
        icon: iconsMap.dismiss,
        id: 'close',
        color: COLORS.M,
        accessibilityLabel: t`Cancel`,
      }],
      rightButtons: passProps.onlyShowSelected ? [] : [{
        icon: iconsMap['plus-button'],
        id: 'add',
        color: COLORS.M,
        accessibilityLabel: t`New Deck`,
      }],
    },
  };
}

function investigatorOptions(): Options {
  return {
    topBar: {
      title: {
        text: t`Choose an Investigator`,
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
}

function MyDecksSelectorDialog(props: Props) {
  const { fontScale, typography, width } = useContext(StyleContext);
  const { 
    componentId, campaignId, onDeckSelect, onInvestigatorSelect, 
    singleInvestigator, selectedDecks, selectedInvestigatorIds, 
    onlyShowSelected, simpleOptions, includeParallel, 
  } = props;

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

  const showNewDeckDialog = useMemo(() => {
    return throttle(() => {
      Navigation.push<NewDeckProps>(componentId, {
        component: {
          name: 'Deck.New',
          passProps: {
            campaignId,
            onCreateDeck: onDeckSelect,
            filterInvestigators,
            onlyInvestigators,
          },
        },
      });
    }, 200);
  }, [componentId, campaignId, onDeckSelect, filterInvestigators, onlyInvestigators]);
  const [investigatorSortDialog, showInvestigatorSortDialog] = useInvestigatorSortDialog(selectedSort, setSelectedSort);
  const showSortDialog = useCallback(() => {
    Keyboard.dismiss();
    showInvestigatorSortDialog();
  }, [showInvestigatorSortDialog]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'add') {
      showNewDeckDialog();
    } else if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      showSortDialog();
    }
  }, componentId, [componentId, showNewDeckDialog, showSortDialog]);

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
  const onTabChange = useCallback((tab: string) => {
    Navigation.mergeOptions(
      componentId,
      tab === 'decks' ? deckOptions(props) : investigatorOptions()
    );
  }, [componentId, props]);

  const filterDeck = useCallback((deck: MiniDeckT): string | undefined => {
    if (singleInvestigator && deck.investigator !== singleInvestigator) {
      return 'wrong_investigator';
    }
    if (selectedInvestigatorIds && find(selectedInvestigatorIds, i => i === deck.investigator)) {
      return 'selected_investtigator';
    }
    if (onlyShowSelected) {
      return undefined;
    }
    if (find(filterInvestigators, deck.investigator)) {
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
      componentId={componentId}
      onDeckSelect={onDeckSelect}
      searchOptions={searchOptions(true)}
      onlyDecks={onlyDecks}
      filterDeck={filterDeck}
      renderExpandButton={renderExpandButton}
    />
  ), [componentId, onDeckSelect, searchOptions, filterDeck, renderExpandButton, onlyDecks]);
  const investigatorTab = useMemo(() => {
    if (!onInvestigatorSelect) {
      return null;
    }
    return (
      <InvestigatorSelectorTab
        componentId={componentId}
        sort={selectedSort}
        onInvestigatorSelect={onInvestigatorSelect}
        searchOptions={searchOptions(false)}
        filterInvestigators={filterInvestigators}
        includeParallel={includeParallel}
      />
    );
  }, [componentId, selectedSort, onInvestigatorSelect, searchOptions, filterInvestigators, includeParallel]);
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
MyDecksSelectorDialog.options = (passProps: Props) => {
  return deckOptions(passProps);
};
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
