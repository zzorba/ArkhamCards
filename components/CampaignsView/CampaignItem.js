import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import InvestigatorImage from '../core/InvestigatorImage';

class CampaignItem extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    latestMission: PropTypes.object,
    decks: PropTypes.array,
    investigators: PropTypes.array,
  };

  render() {
    const {
      campaign,
      latestMission,
      investigators,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text>{ campaign.name }</Text>
        <Text>{ `Missions Completed: ${campaign.missionResults.length}` }</Text>
        { !!latestMission && <Text>{ latestMission.name }</Text> }
        <View style={styles.row}>
          { map(investigators, card => (
            <InvestigatorImage key={card.id} card={card} />
          )) }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const decks = [];
  const latestMission = last(props.campaign.missionResults);
  const deckIds = latestMission ? latestMission.deckIds : [];
  forEach(deckIds, deckId => {
    const deck = state.decks.all[deckId];
    if (deck) {
      decks.push(deck);
    }
  });

  return {
    latestMission,
    decks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(CampaignItem, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      console.log('Doing realm mapping');
      const decks = props.decks || [];
      const query = map(decks,
        deck => `code == '${deck.investigator_code}'`).join(' or ');
      const investigatorsMap = {};
      if (query) {
        forEach(results.cards.filtered(query), card => {
          investigatorsMap[card.code] = card;
        });
      }
      const investigators = [];
      forEach(decks, deck => {
        const card = investigatorsMap[deck.investigator_code];
        if (card) {
          investigators.push(card);
        }
      });
      return {
        investigators,
      };
    },
  })
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
