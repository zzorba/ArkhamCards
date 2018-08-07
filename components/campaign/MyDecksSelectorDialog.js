import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, keys, uniqBy } from 'lodash';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEliminated } from './trauma';
import { iconsMap } from '../../app/NavIcons';
import MyDecksComponent from '../MyDecksComponent';
import withPlayerCards from '../withPlayerCards';
import { getAllDecks, getCampaign, getCampaigns, getLatestDeckIds } from '../../reducers';

class MyDecksSelectorDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
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

  constructor(props) {
    super(props);

    this.state = {
      hideOtherCampaignInvestigators: true,
      onlyShowPreviousCampaignMembers: false,
      hideEliminatedInvestigators: true,
    };

    this.props.navigator.setTitle({
      title: 'Choose a Deck',
    });
    props.navigator.setButtons({
      leftButtons: [
        {
          icon: iconsMap.close,
          id: 'close',
        },
      ],
      rightButtons: props.showOnlySelectedDeckIds ? [] : [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._deckSelected = this.deckSelected.bind(this);
    this._toggleHideOtherCampaignInvestigators =
      this.toggleValue.bind(this, 'hideOtherCampaignInvestigators');
    this._toggleOnlyShowPreviousCampaignMembers =
      this.toggleValue.bind(this, 'onlyShowPreviousCampaignMembers');
    this._toggleHideEliminatedInvestigators =
      this.toggleValue.bind(this, 'hideEliminatedInvestigators');
  }

  toggleValue(key) {
    this.setState({
      [key]: !this.state[key],
    });
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      onDeckSelect,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Deck.New',
          passProps: {
            onCreateDeck: onDeckSelect,
            filterInvestigators: this.filterInvestigators(),
          },
        });
      } else if (event.id === 'close') {
        navigator.dismissModal();
      }
    }
  }

  deckSelected(deck) {
    const {
      onDeckSelect,
      navigator,
    } = this.props;
    onDeckSelect(deck.id);
    navigator.dismissModal();
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
            onTintColor="#222222"
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
              onTintColor="#222222"
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
              onTintColor="#222222"
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
      navigator,
    } = this.props;

    return (
      <MyDecksComponent
        navigator={navigator}
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
