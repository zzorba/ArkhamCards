import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, last } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import InvestigatorImage from '../core/InvestigatorImage';
import { getDecks } from '../../reducers';

class CampaignItem extends React.Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    latestScenario: PropTypes.object,
    decks: PropTypes.array,
    investigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      campaign,
      onPress,
    } = this.props;
    onPress(campaign.id);
  }

  render() {
    const {
      campaign,
      latestScenario,
      investigators,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.container}>
          <Text>{ campaign.name }</Text>
          { !!(latestScenario && latestScenario.scenario) && (
            <Text>{ `Last Scenario: ${latestScenario.scenario}` }</Text>
          ) }
          <View style={styles.row}>
            { map(investigators, card => (
              <InvestigatorImage key={card.code} card={card} />
            )) }
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state, props) {
  const latestScenario = last(props.campaign.scenarioResults);
  return {
    latestScenario,
    decks: getDecks(state, props.campaign.latestDeckIds),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(CampaignItem, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
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
    margin: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
