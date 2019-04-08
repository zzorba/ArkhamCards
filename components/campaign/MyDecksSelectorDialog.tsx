import React from 'react';
import { concat, filter, flatMap, keys, throttle, uniqBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';

import L from '../../app/i18n';
import { Deck, Campaign } from '../../actions/types';
import { isEliminated } from './trauma';
import Switch from '../core/Switch';
import { iconsMap } from '../../app/NavIcons';
import MyDecksComponent from '../MyDecksComponent';
import { NavigationProps } from '../types';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { getAllDecks, getCampaign, getCampaigns, getLatestDeckIds, AppState } from '../../reducers';
import { COLORS } from '../../styles/colors';
import { NewDeckProps } from '../NewDeckView';

export interface MyDecksSelectorProps {
  campaignId: number;
  onDeckSelect: (deck: Deck) => void;
  selectedDeckIds: number[];
  showOnlySelectedDeckIds?: boolean;
}

interface ReduxProps {
  campaignLatestDeckIds: number[];
  otherCampaignDeckIds: number[];
  decks: { [id: number]: Deck };
  campaign?: Campaign;
}

type Props = NavigationProps & MyDecksSelectorProps & ReduxProps & PlayerCardProps;

interface State {
  hideOtherCampaignInvestigators: boolean;
  onlyShowPreviousCampaignMembers: boolean;
  hideEliminatedInvestigators: boolean;
}

class MyDecksSelectorDialog extends React.Component<Props, State> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: L('Choose a Deck'),
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
        }],
        rightButtons: passProps.showOnlySelectedDeckIds ? [] : [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
        }],
      },
    };
  }
  _navEventListener: EventSubscription;
  _showNewDeckDialog!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      hideOtherCampaignInvestigators: true,
      onlyShowPreviousCampaignMembers: false,
      hideEliminatedInvestigators: true,
    };

    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  _toggleHideOtherCampaignInvestigators = () => {
    this.setState({
      hideOtherCampaignInvestigators: !this.state.hideOtherCampaignInvestigators,
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
    }
  }

  _deckSelected = (deck: Deck) => {
    const {
      onDeckSelect,
      componentId,
    } = this.props;
    onDeckSelect(deck);
    Navigation.dismissModal(componentId);
  }

  renderCustomHeader() {
    const {
      campaign,
      showOnlySelectedDeckIds,
    } = this.props;
    const {
      hideOtherCampaignInvestigators,
      hideEliminatedInvestigators,
      onlyShowPreviousCampaignMembers,
    } = this.state;
    if (showOnlySelectedDeckIds) {
      return null;
    }
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.searchOption}>
            { L('Hide Decks From Other Campaigns') }
          </Text>
          <Switch
            value={hideOtherCampaignInvestigators}
            onValueChange={this._toggleHideOtherCampaignInvestigators}
          />
        </View>
        { !!campaign && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { L('Hide Killed and Insane Investigators') }
            </Text>
            <Switch
              value={hideEliminatedInvestigators}
              onValueChange={this._toggleHideEliminatedInvestigators}
            />
          </View>
        ) }
        { !!campaign && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { L('Only Show Previous Campaign Members') }
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
      selectedDeckIds,
      decks,
      campaign,
      investigators,
      showOnlySelectedDeckIds,
    } = this.props;
    const {
      hideEliminatedInvestigators,
    } = this.state;
    if (showOnlySelectedDeckIds) {
      return [];
    }

    const eliminatedInvestigators: string[] = !campaign ? [] :
      filter(
        keys(campaign.investigatorData || {}),
        code => isEliminated(campaign.investigatorData[code], investigators[code]));
    return uniqBy(
      [
        ...(hideEliminatedInvestigators ? eliminatedInvestigators : []),
        ...flatMap(selectedDeckIds, deckId => {
          const deck = decks[deckId];
          if (deck) {
            return [deck.investigator_code];
          }
          return [];
        }),
      ],
      x => x
    );
  }

  onlyDeckIds() {
    const {
      selectedDeckIds,
      campaign,
      campaignLatestDeckIds,
      showOnlySelectedDeckIds,
    } = this.props;
    const {
      onlyShowPreviousCampaignMembers,
    } = this.state;
    if (showOnlySelectedDeckIds) {
      return selectedDeckIds;
    }
    if (onlyShowPreviousCampaignMembers && campaign) {
      return campaignLatestDeckIds;
    }
    return undefined;
  }

  filterDeckIds() {
    const {
      selectedDeckIds,
      otherCampaignDeckIds,
      showOnlySelectedDeckIds,
    } = this.props;
    const {
      hideOtherCampaignInvestigators,
    } = this.state;
    if (showOnlySelectedDeckIds) {
      return [];
    }
    if (hideOtherCampaignInvestigators) {
      return uniqBy(concat(otherCampaignDeckIds, selectedDeckIds), x => x);
    }
    return selectedDeckIds;
  }

  render() {
    const {
      componentId,
    } = this.props;

    return (
      <MyDecksComponent
        componentId={componentId}
        customHeader={this.renderCustomHeader()}
        deckClicked={this._deckSelected}
        onlyDeckIds={this.onlyDeckIds()}
        filterDeckIds={this.filterDeckIds()}
        filterInvestigators={this.filterInvestigators()}
      />
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & MyDecksSelectorProps
): ReduxProps {
  const otherCampaigns = filter(
    getCampaigns(state),
    campaign => campaign.id !== props.campaignId);
  const otherCampaignDeckIds = flatMap(otherCampaigns, c => getLatestDeckIds(state, c));
  const campaign = getCampaign(state, props.campaignId) || undefined;
  return {
    campaign,
    campaignLatestDeckIds: campaign ? getLatestDeckIds(state, campaign) : [],
    otherCampaignDeckIds,
    decks: getAllDecks(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & MyDecksSelectorProps, AppState>(mapStateToProps)(
  withPlayerCards<NavigationProps & MyDecksSelectorProps & ReduxProps>(MyDecksSelectorDialog)
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  searchOption: {
    fontFamily: 'System',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 2,
  },
});
