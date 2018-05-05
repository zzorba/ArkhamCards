import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { getAllDecks, getCampaigns } from '../../reducers';
import { iconsMap } from '../../app/NavIcons';
import CampaignItem from './CampaignItem';

class MyCampaignsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaigns: PropTypes.array,
    decks: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
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

  onPress(id) {
    const {
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign',
      title: 'Campaign',
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
          backButtonTitle: 'Cancel',
        });
      }
    }
  }

  renderItem(campaign) {
    const {
      decks,
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
        onPress={this._onPress}
      />
    );
  }

  render() {
    const {
      campaigns,
    } = this.props;
    return (
      <ScrollView>
        { map(campaigns, campaign => this.renderItem(campaign)) }
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
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCampaignsView);
