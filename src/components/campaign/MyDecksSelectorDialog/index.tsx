import React, { useCallback, useContext, useMemo, useState } from 'react';
import { concat, filter, flatMap, flatten, keys, uniqBy, uniq, throttle } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { showInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import useTabView from '@components/core/useTabView';
import InvestigatorSelectorTab from './InvestigatorSelectorTab';
import DeckSelectorTab from './DeckSelectorTab';
import { NewDeckProps } from '@components/deck/NewDeckView';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { NavigationProps } from '@components/nav/types';
import { CampaignId, Deck, DeckId, SortType, SORT_BY_PACK } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import Card from '@data/types/Card';
import { getAllDecks, makeLatestCampaignDeckIdsSelector, AppState, getDeck, makeOtherCampiagnDeckIdsSelector } from '@reducers';
import COLORS from '@styles/colors';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { useFlag, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';

export interface MyDecksSelectorProps {
  campaignId: CampaignId;
  onDeckSelect: (deck: Deck) => void;
  onInvestigatorSelect?: (card: Card) => void;

  singleInvestigator?: string;
  selectedDeckIds?: DeckId[];
  selectedInvestigatorIds?: string[];

  onlyShowSelected?: boolean;
  simpleOptions?: boolean;
}

type Props = NavigationProps & MyDecksSelectorProps;

function deckOptions(passProps: Props): Options {
  return {
    topBar: {
      title: {
        text: passProps.singleInvestigator ? t`Select Deck` : t`Choose an Investigator`,
      },
      leftButtons: [{
        icon: iconsMap.close,
        id: 'close',
        color: COLORS.M,
        accessibilityLabel: t`Cancel`,
      }],
      rightButtons: passProps.onlyShowSelected ? [] : [{
        icon: iconsMap.add,
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
}

function MyDecksSelectorDialog(props: Props) {
  const { fontScale, typography } = useContext(StyleContext);
  const { componentId, campaignId, onDeckSelect, onInvestigatorSelect, singleInvestigator, selectedDeckIds, selectedInvestigatorIds, onlyShowSelected, simpleOptions } = props;

  const campaign = useCampaign(campaignId);
  const otherCampaignsDeckIdsSelector = useMemo(() => makeOtherCampiagnDeckIdsSelector(), []);
  const otherCampaignDeckIds = useSelector((state: AppState) => otherCampaignsDeckIdsSelector(state, campaign));
  const getLatestCampaignDeckIds = useMemo(makeLatestCampaignDeckIdsSelector, []);
  const campaignLatestDeckIds = useSelector((state: AppState) => getLatestCampaignDeckIds(state, campaign));
  const decks = useSelector(getAllDecks);

  const [hideOtherCampaignDecks, toggleHideOtherCampaignDecks] = useFlag(true);
  const [onlyShowPreviousCampaignMembers, toggleOnlyShowPreviousCampaignMembers] = useFlag(false);
  const [hideEliminatedInvestigators, toggleHideEliminatedInvestigators] = useFlag(true);
  const [selectedSort, setSelectedSort] = useState<SortType>(SORT_BY_PACK);
  const investigators = useInvestigatorCards();
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
      ...flatMap(selectedDeckIds, deckId => {
        const deck = getDeck(decks, deckId);
        if (deck) {
          return [deck.investigator_code];
        }
        return [];
      }),
      ...(selectedInvestigatorIds || []),
    ]);
  }, [hideEliminatedInvestigators, selectedInvestigatorIds, selectedDeckIds, decks, campaign, investigators, onlyShowSelected]);
  const onlyInvestigators = useMemo(() => {
    if (singleInvestigator) {
      return [singleInvestigator];
    }
    return undefined;
  }, [singleInvestigator]);

  const showNewDeckDialog = useMemo(() => throttle(() => {
    Navigation.push<NewDeckProps>(componentId, {
      component: {
        name: 'Deck.New',
        passProps: {
          onCreateDeck: onDeckSelect,
          filterInvestigators,
          onlyInvestigators,
        },
      },
    });
  }, 200), [componentId, onDeckSelect, filterInvestigators, onlyInvestigators]);

  const showSortDialog = useCallback(() => {
    Keyboard.dismiss();
    showInvestigatorSortDialog(setSelectedSort);
  }, [setSelectedSort]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'add') {
      showNewDeckDialog();
    } else if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      showSortDialog();
    }
  }, componentId, [componentId, showNewDeckDialog, showSortDialog]);

  const onlyDeckIds = useMemo(() => {
    if (onlyShowSelected) {
      return selectedDeckIds;
    }
    if (onlyShowPreviousCampaignMembers && campaign) {
      return campaignLatestDeckIds;
    }
    return undefined;
  }, [selectedDeckIds, campaign, campaignLatestDeckIds, onlyShowSelected, onlyShowPreviousCampaignMembers]);

  const filterDeckIds: DeckId[] = useMemo(() => {
    if (onlyShowSelected) {
      return [];
    }
    if (hideOtherCampaignDecks) {
      return uniqBy(concat(otherCampaignDeckIds, selectedDeckIds || []), x => x.uuid);
    }
    return selectedDeckIds || [];
  }, [selectedDeckIds, otherCampaignDeckIds, onlyShowSelected, hideOtherCampaignDecks]);

  const searchOptions = useCallback((forDecks: boolean): SearchOptions | undefined => {
    if (onlyShowSelected) {
      return undefined;
    }
    const elements = flatten([
      forDecks ? [(
        <View style={styles.row} key={0}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Hide Decks From Other Campaigns` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
            value={hideOtherCampaignDecks}
            onValueChange={toggleHideOtherCampaignDecks}
          />
        </View>
      )] : [],
      (!!campaign && !singleInvestigator && !simpleOptions) ? [(
        <View style={styles.row} key={1}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Hide Killed and Insane Investigators` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
            value={hideEliminatedInvestigators}
            onValueChange={toggleHideEliminatedInvestigators}
          />
        </View>
      )] : [],
      (!!campaign && !singleInvestigator && !simpleOptions) ? [(
        <View style={styles.row} key={2}>
          <Text style={[typography.small, styles.searchOption]}>
            { t`Only Show Previous Campaign Members` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
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

  const deckTab = useMemo(() => (
    <DeckSelectorTab
      componentId={componentId}
      onDeckSelect={onDeckSelect}
      searchOptions={searchOptions(true)}
      filterDeckIds={filterDeckIds}
      onlyDeckIds={onlyDeckIds}
      filterInvestigators={filterInvestigators}
      onlyInvestigators={onlyInvestigators}
    />
  ), [componentId, onDeckSelect, searchOptions, filterDeckIds, onlyDeckIds, filterInvestigators, onlyInvestigators]);
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
        filterDeckIds={filterDeckIds}
        onlyDeckIds={onlyDeckIds}
        filterInvestigators={filterInvestigators}
      />
    );
  }, [componentId, selectedSort, onInvestigatorSelect, searchOptions, filterDeckIds, onlyDeckIds, filterInvestigators]);
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
    return tabView;
  }
  return deckTab;
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
