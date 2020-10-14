import React from 'react';
import { concat, filter, flatMap, flatten, keys, throttle, uniqBy, uniq } from 'lodash';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { showInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import TabView from '@components/core/TabView';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import InvestigatorSelectorTab from './InvestigatorSelectorTab';
import DeckSelectorTab from './DeckSelectorTab';
import { NewDeckProps } from '@components/deck/NewDeckView';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { NavigationProps } from '@components/nav/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { Deck, DecksMap, Campaign, SortType, SORT_BY_PACK } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import Card from '@data/Card';
import { getAllDecks, getCampaign, getCampaigns, getLatestCampaignDeckIds, AppState } from '@reducers';
import COLORS from '@styles/colors';
import { s, xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';

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
  static contextType = StyleContext;
  context!: StyleContextType;

  static deckOptions(passProps: Props): Options {
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
        rightButtons: passProps.onlyShowSelected ? [] : [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.M,
          accessibilityLabel: t`New Deck`,
        }],
      },
    };
  }

  static investigatorOptions(): Options {
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
    showInvestigatorSortDialog(this._sortChanged);
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

  searchOptions(forDecks: boolean): SearchOptions | undefined {
    const {
      campaign,
      onlyShowSelected,
      singleInvestigator,
      simpleOptions,
    } = this.props;
    const { typography, fontScale } = this.context;
    const {
      hideOtherCampaignDecks,
      hideEliminatedInvestigators,
      onlyShowPreviousCampaignMembers,
    } = this.state;
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
            onValueChange={this._toggleHideOtherCampaignInvestigators}
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
            onValueChange={this._toggleHideEliminatedInvestigators}
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
            onValueChange={this._toggleOnlyShowPreviousCampaignMembers}
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
        code => {
          const card = investigators[code];
          return !!card && card.eliminated(campaign.investigatorData[code]);
        });
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
    } = this.props;
    const deckTab = (
      <DeckSelectorTab
        componentId={componentId}
        onDeckSelect={onDeckSelect}
        searchOptions={this.searchOptions(true)}
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
              searchOptions={this.searchOptions(false)}
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

export default connect<ReduxProps, unknown, NavigationProps & MyDecksSelectorProps, AppState>(
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
    marginRight: 2,
  },
  searchOptions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
});
