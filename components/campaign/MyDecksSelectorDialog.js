import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, keys, throttle, uniqBy } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { isEliminated } from './trauma';
import Switch from '../core/Switch';
import { iconsMap } from '../../app/NavIcons';
import MyDecksComponent from '../MyDecksComponent';
import withPlayerCards from '../withPlayerCards';
import { getAllDecks, getCampaign, getCampaigns, getLatestDeckIds } from '../../reducers';

class MyDecksSelectorDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    campaignId: PropTypes.number.isRequired,
    onDeckSelect: PropTypes.func.isRequired,
    selectedDeckIds: PropTypes.array,
    showOnlySelectedDeckIds: PropTypes.bool,
    //  From redux
    campaignLatestDeckIds: PropTypes.array,
    otherCampaignDeckIds: PropTypes.array,
    decks: PropTypes.object,
    campaign: PropTypes.object,
    // From realm
    investigators: PropTypes.object,
  };

  static options(passProps) {
    return {
      topBar: {
        title: {
          text: L('Choose a Deck'),
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
        }],
        rightButtons: passProps.showOnlySelectedDeckIds ? [] : [{
          icon: iconsMap.add,
          id: 'add',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      hideOtherCampaignInvestigators: true,
      onlyShowPreviousCampaignMembers: false,
      hideEliminatedInvestigators: true,
    };

    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._deckSelected = this.deckSelected.bind(this);
    this._toggleHideOtherCampaignInvestigators =
      this.toggleValue.bind(this, 'hideOtherCampaignInvestigators');
    this._toggleOnlyShowPreviousCampaignMembers =
      this.toggleValue.bind(this, 'onlyShowPreviousCampaignMembers');
    this._toggleHideEliminatedInvestigators =
      this.toggleValue.bind(this, 'hideEliminatedInvestigators');

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  toggleValue(key) {
    this.setState({
      [key]: !this.state[key],
    });
  }

  showNewDeckDialog() {
    const {
      componentId,
      onDeckSelect,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Deck.New',
        passProps: {
          onCreateDeck: onDeckSelect,
          filterInvestigators: this.filterInvestigators(),
        },
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    } else if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    }
  }

  deckSelected(deck) {
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
            { 'Hide Decks From Other Campaigns' }
          </Text>
          <Switch
            value={hideOtherCampaignInvestigators}
            onValueChange={this._toggleHideOtherCampaignInvestigators}
          />
        </View>
        { !!campaign && (
          <View style={styles.row}>
            <Text style={styles.searchOption}>
              { 'Hide Killed and Insane Investigators' }
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
              { 'Only Show Previous Campaign Members' }
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

    const eliminatedInvestigators = !campaign ? [] :
      filter(
        keys(campaign.investigatorData || {}),
        code => isEliminated(campaign.investigatorData[code], investigators[code]));
    return uniqBy(concat(
      hideEliminatedInvestigators ? eliminatedInvestigators : [],
      flatMap(selectedDeckIds, deckId => {
        const deck = decks[deckId];
        if (deck) {
          return deck.investigator_code;
        }
        return null;
      })
    ));
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
    return null;
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
      return uniqBy(concat(otherCampaignDeckIds, selectedDeckIds));
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

function mapStateToProps(state, props) {
  const otherCampaigns = filter(
    getCampaigns(state),
    campaign => campaign.id !== props.campaignId);
  const otherCampaignDeckIds = flatMap(otherCampaigns, c => getLatestDeckIds(c, state));
  const campaign = getCampaign(state, props.campaignId);
  return {
    campaign,
    campaignLatestDeckIds: getLatestDeckIds(campaign, state),
    otherCampaignDeckIds,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withPlayerCards(MyDecksSelectorDialog));

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
});
