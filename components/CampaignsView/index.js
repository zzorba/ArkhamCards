import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last, sortBy, values } from 'lodash';
import {
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { iconsMap } from '../../app/NavIcons';
import CampaignItem from './CampaignItem';

class CampaignsView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaigns: PropTypes.array,
    decks: PropTypes.object,
  };

  constructor(props) {
    super(props);

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

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Campaign.New',
        });
      }
    }
  }

  renderItem(campaign) {
    const {
      decks,
    } = this.props;
    const latestMission = last(campaign.missionResults);
    const deckIds = latestMission ? latestMission.deckIds : [];
    const missionDecks = [];
    forEach(deckIds, deckId => {
      const deck = decks[deckId];
      if (deck) {
        missionDecks.push(deck);
      }
    });

    return (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
      />
    );
  }

  render() {
    const {
      campaigns,
      decks,
    } = this.props;
    return (
      <ScrollView>
        { map(campaigns, campaign => this.renderItem(campaign)) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  const campaigns = sortBy(
    values(state.campaigns.all),
    campaign => campaign.lastModified);
  return {
    campaigns,
    decks: state.decks.all,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignsView);
