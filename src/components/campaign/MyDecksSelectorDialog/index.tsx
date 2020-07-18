import React from 'react';
import { concat, filter, flatMap, keys, throttle, uniqBy, uniq } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import TabView from '@components/core/TabView';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import InvestigatorSelectorTab from './InvestigatorSelectorTab';
import DeckSelectorTab from './DeckSelectorTab';
import { NewDeckProps } from '@components/deck/NewDeckView';
import Switch from '@components/core/Switch';
import { NavigationProps } from '@components/nav/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { Deck, DecksMap, Campaign, SortType, SORT_BY_PACK } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import Card from '@data/Card';
import { getAllDecks, getCampaign, getCampaigns, getLatestCampaignDeckIds, AppState } from '@reducers';
import COLORS from '@styles/colors';
import { s, xs } from '@styles/space';

export interface MyDecksSelectorProps {
  campaignId: number;
  onDeckSelect: (deck: Deck) => void;
  onInvestigatorSelect?: (card: Card) => void;

  singleInvestigator?: string;
  selectedDeckIds?: number[];
  selectedInvestigatorIds?: string[];

  onlyShowSelected?: boolean;
  simpleOptions?: boolean;
}

interface ReduxProps {
  campaignLatestDeckIds: number[];
  otherCampaignDeckIds: number[];
  decks: DecksMap;
  campaign?: Campaign;
}

type Props = NavigationProps & MyDecksSelectorProps & ReduxProps & PlayerCardProps & DimensionsProps;

interface State {
  hideOtherCampaignDecks: boolean;
  onlyShowPreviousCampaignMembers: boolean;
  hideEliminatedInvestigators: boolean;
  selectedTab: string;
  selectedSort: SortType;
}

class MyDecksSelectorDialog extends React.Component<Props, State> {
  static deckOptions(passProps: Props) {
    return {
      topBar: {
        title: {
          text: t`Choose an Investigator`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
          testID: t`Cancel`,
        }],
        rightButtons: passProps.onlyShowSelected ? [] : [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
          testID: t`New Deck`,
        }],
      },
    };
  }

  static investigatorOptions() {
    return {
      topBar: {
        title: {
          text: t`Choose an Investigator`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
          testID: t`Cancel`,
        }],
        rightButtons: [{
          icon: iconsMap['sort-by-alpha'],
          id: 'sort',
          color: COLORS.navButton,
          testID: t`Sort`,
        }],
      },
    };
  }
  static options(passProps: Props) {
    return MyDecksSelectorDialog.deckOptions(passProps);
  }
  _navEventListener: EventSubscription;
  _showNewDeckDialog!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      hideOtherCampaignDecks: true,
      onlyShowPreviousCampaignMembers: false,
      hideEliminatedInvestigators: true,
      selectedTab: 'decks',
      selectedSort: SORT_BY_PACK,
    };

    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  _sortChanged = (sort: SortType) => {
    this.setState({
      selectedSort: sort,
    });
  };

  _showSortDialog = () => {
    Keyboard.dismiss();
    Navigation.showOverlay({
      component: {
        name: 'Dialog.InvestigatorSort',
        passProps: {
          sortChanged: this._sortChanged,
          selectedSort: this.state.selectedSort,
        },
      },
    });
  };

  _toggleHideOtherCampaignInvestigators = () => {
    this.setState({
      hideOtherCampaignDecks: !this.state.hideOtherCampaignDecks,
    });
  };

  _toggleOnlyShowPreviousCampaignMembers = () => {
    this.setState({
      onlyShowPreviousCampaignMembers: !this.state.onlyShowPreviousCampaignMembers,
    });
  };

  _toggleHideEliminatedInvestigators = () => {
    this.setState({
      hideEliminatedInvestigators: !this.state.hideEliminatedInvestigators,
    });
  };

  showNewDeckDialog() {
    const {
      componentId,
      onDeckSelect,
    } = this.props;
    Navigation.push<NewDeckProps>(componentId, {
      component: {
        name: 'Deck.New',
        passProps: {
          onCreateDeck: onDeckSelect,
          filterInvestigators: this.filterInvestigators(),
          onlyInvestigators: this.onlyInvestigators(),
        },
      },
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    } else if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    }
  }

  renderCustomHeader(forDecks: boolean) {
    const {
      campaign,
      onlyShowSelected,
      singleInvestigator,
      simpleOptions,
    } = this.props;
    const {
      hideOtherCampaignDecks,
      hideEliminatedInvestigators,
      onlyShowPreviousCampaignMembers,
    } = this.state;
    if (onlyShowSelected) {
      return null;
    }
    return (
      <View>
        { forDecks && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { t`Hide Decks From Other Campaigns` }
            </Text>
            <Switch
              value={hideOtherCampaignDecks}
              onValueChange={this._toggleHideOtherCampaignInvestigators}
            />
          </View>
        ) }
        { !!campaign && !singleInvestigator && !simpleOptions && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { t`Hide Killed and Insane Investigators` }
            </Text>
            <Switch
              value={hideEliminatedInvestigators}
              onValueChange={this._toggleHideEliminatedInvestigators}
            />
          </View>
        ) }
        { !!campaign && !singleInvestigator && !simpleOptions && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { t`Only Show Previous Campaign Members` }
            </Text>
            <Switch
              value={onlyShowPreviousCampaignMembers}
              onValueChange={this._toggleOnlyShowPreviousCampaignMembers}
            />
          </View>
        ) }
      </View>
    );
  }

  filterInvestigators() {
    const {
      selectedInvestigatorIds,
      selectedDeckIds,
      decks,
      campaign,
      investigators,
      onlyShowSelected,
    } = this.props;
    const {
      hideEliminatedInvestigators,
    } = this.state;
    if (onlyShowSelected) {
      return [];
    }

    const eliminatedInvestigators: string[] = !campaign ? [] :
      filter(
        keys(campaign.investigatorData || {}),
        code => investigators[code].eliminated(campaign.investigatorData[code]));
    return uniq([
      ...(hideEliminatedInvestigators ? eliminatedInvestigators : []),
      ...flatMap(selectedDeckIds, deckId => {
        const deck = decks[deckId];
        if (deck) {
          return [deck.investigator_code];
        }
        return [];
      }),
      ...(selectedInvestigatorIds || []),
    ]);
  }

  onlyInvestigators() {
    const {
      singleInvestigator,
    } = this.props;
    if (singleInvestigator) {
      return [singleInvestigator];
    }
    return undefined;
  }

  onlyDeckIds() {
    const {
      selectedDeckIds,
      campaign,
      campaignLatestDeckIds,
      onlyShowSelected,
    } = this.props;
    const {
      onlyShowPreviousCampaignMembers,
    } = this.state;
    if (onlyShowSelected) {
      return selectedDeckIds;
    }
    if (onlyShowPreviousCampaignMembers && campaign) {
      return campaignLatestDeckIds;
    }
    return undefined;
  }

  filterDeckIds(): number[] {
    const {
      selectedDeckIds,
      otherCampaignDeckIds,
      onlyShowSelected,
    } = this.props;
    const {
      hideOtherCampaignDecks,
    } = this.state;
    if (onlyShowSelected) {
      return [];
    }
    if (hideOtherCampaignDecks) {
      return uniqBy(concat(otherCampaignDeckIds, selectedDeckIds || []), x => x);
    }
    return selectedDeckIds || [];
  }

  _onTabChange = (tab: string) => {
    const { componentId } = this.props;
    this.setState({
      selectedTab: tab,
    });
    Navigation.mergeOptions(
      componentId,
      tab === 'decks' ?
        MyDecksSelectorDialog.deckOptions(this.props) :
        MyDecksSelectorDialog.investigatorOptions()
    );
  };

  render() {
    const {
      componentId,
      onDeckSelect,
      onInvestigatorSelect,
      fontScale,
    } = this.props;
    const deckTab = (
      <DeckSelectorTab
        componentId={componentId}
        onDeckSelect={onDeckSelect}
        customHeader={this.renderCustomHeader(true)}
        filterDeckIds={this.filterDeckIds()}
        onlyDeckIds={this.onlyDeckIds()}
        filterInvestigators={this.filterInvestigators()}
        onlyInvestigators={this.onlyInvestigators()}
      />
    );
    if (onInvestigatorSelect) {
      const tabs = [
        {
          key: 'decks',
          title: t`Decks`,
          node: deckTab,
        },
        {
          key: 'investigators',
          title: t`Investigator`,
          node: (
            <InvestigatorSelectorTab
              componentId={componentId}
              sort={this.state.selectedSort}
              onInvestigatorSelect={onInvestigatorSelect}
              customHeader={this.renderCustomHeader(false)}
              filterDeckIds={this.filterDeckIds()}
              onlyDeckIds={this.onlyDeckIds()}
              filterInvestigators={this.filterInvestigators()}
            />
          ),
        },
      ];

      return (
        <TabView
          tabs={tabs}
          onTabChange={this._onTabChange}
          fontScale={fontScale}
        />
      );
    }
    return deckTab;
  }
}

function mapStateToPropsFix(
  state: AppState,
  props: NavigationProps & MyDecksSelectorProps
): ReduxProps {
  const otherCampaigns = filter(
    getCampaigns(state),
    campaign => campaign.id !== props.campaignId);
  const otherCampaignDeckIds = flatMap(otherCampaigns, c => getLatestCampaignDeckIds(state, c));
  const campaign = getCampaign(state, props.campaignId);
  return {
    campaign,
    campaignLatestDeckIds: getLatestCampaignDeckIds(state, campaign),
    otherCampaignDeckIds,
    decks: getAllDecks(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & MyDecksSelectorProps, AppState>(
  mapStateToPropsFix
)(
  withPlayerCards<NavigationProps & MyDecksSelectorProps & ReduxProps>(
    withDimensions(MyDecksSelectorDialog)
  )
);

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
    fontFamily: 'System',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 2,
  },
});
