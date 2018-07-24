import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getAllDecks, getCampaigns } from '../../../reducers';
import { iconsMap } from '../../../app/NavIcons';
import withPlayerCards from '../../withPlayerCards';
import CampaignItem from './CampaignItem';

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

    this._onCreateCampaign = this.onCreateCampaign.bind(this);
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
          passProps: {
            onCreateCampaign: this._onCreateCampaign,
          },
        });
      }
    }
  }

  onCreateCampaign(id) {
    const {
      navigator,
    } = this.props;
    navigator.pop();
    this.onPress(id);
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
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withPlayerCards(MyCampaignsView)
);
