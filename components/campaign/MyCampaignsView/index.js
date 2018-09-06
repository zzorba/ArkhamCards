import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, last } from 'lodash';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../../../app/i18n';
import CampaignItem from './CampaignItem';
import { CUSTOM, campaignNames } from '../constants';
import SearchBox from '../../SearchBox';
import withPlayerCards from '../../withPlayerCards';
import withLoginGate from '../../withLoginGate';
import { searchMatchesText } from '../../searchHelpers';
import withFetchCardsGate from '../../cards/withFetchCardsGate';
import { iconsMap } from '../../../app/NavIcons';
import { getAllDecks, getCampaigns } from '../../../reducers';

class MyCampaignsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaigns: PropTypes.array,
    decks: PropTypes.object,
    // From realm
    investigators: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this._onPress = this.onPress.bind(this);
    this._searchChanged = this.searchChanged.bind(this);
    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  searchChanged(text) {
    this.setState({
      search: text,
    });
  }

  onPress(id) {
    const {
      navigator,
    } = this.props;
    Keyboard.dismiss();
    navigator.push({
      screen: 'Campaign',
      passProps: {
        id,
      },
    });
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Campaign.New',
          backButtonTitle: L('Cancel'),
        });
      }
    }
  }

  renderItem(campaign) {
    const {
      decks,
      investigators,
    } = this.props;
    const latestScenario = last(campaign.scenarioResults);
    const deckIds = latestScenario ? latestScenario.deckIds : [];
    const scenarioDecks = [];
    forEach(deckIds, deckId => {
      const deck = decks[deckId];
      if (deck) {
        scenarioDecks.push(deck);
      }
    });

    return (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
        investigators={investigators}
        onPress={this._onPress}
      />
    );
  }

  filteredCampaigns() {
    const {
      campaigns,
    } = this.props;
    const {
      search,
    } = this.state;

    return filter(campaigns, campaign => {
      const parts = [campaign.name];
      if (campaign.cycleCode !== CUSTOM) {
        parts.push(campaignNames()[campaign.cycleCode]);
      }
      return searchMatchesText(search, parts);
    });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <SearchBox
          onChangeText={this._searchChanged}
          placeholder={L('Search campaigns')}
        />
        { map(this.filteredCampaigns(), campaign => this.renderItem(campaign)) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    campaigns: getCampaigns(state),
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default withFetchCardsGate(
  withLoginGate(
    connect(mapStateToProps, mapDispatchToProps)(
      withPlayerCards(MyCampaignsView)
    ),
    'You can use this app to keep track of campaigns, including investigator trauma, the chaos bag, basic weaknesses, campaign notes and the experience values for all of your ArkhamDB decks.\n\nPlease sign in to enable this feature.',
  ),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
