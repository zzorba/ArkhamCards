import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { traumaString, DEFAULT_TRAUMA_DATA } from '../trauma';
import { parseDeck } from '../../parseDeck';
import typography from '../../../styles/typography';
import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';

class CampaignDeckDetail extends React.Component {
  static propTypes = {
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    investigator: PropTypes.object,
    campaign: PropTypes.object.isRequired,
    // From the realm HOC
    cards: PropTypes.object.isRequired,
  };

  render() {
    const {
      campaign: {
        investigatorData = {},
      },
      deck,
      previousDeck,
      investigator,
      cards,
    } = this.props;
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
    const code = deck.investigator_code;
    const traumaData = investigatorData[code] || DEFAULT_TRAUMA_DATA;
    return (
      <View style={styles.investigatorNotes}>
        { (deck.xp > 0 || deck.spentXp > 0) && (
          <View style={styles.section}>
            <Text style={typography.small}>
              EXPERIENCE
            </Text>
            <Text style={typography.text}>
              { `${deck.xp || 0} available. ${parsedDeck.spentXP || 0} spent` }
            </Text>
          </View>
        ) }
        <View style={styles.section}>
          <Text style={typography.small}>
            TRAUMA
          </Text>
          <Text style={typography.text}>
            { traumaString(traumaData, investigator) }
          </Text>
        </View>
      </View>
    );
  }
}

export default listOfDecks(
  deckRowWithDetails(CampaignDeckDetail, {
    compact: true,
    viewDeckButton: true,
  }), {
    deckLimit: null,
  });

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  investigatorNotes: {
    flex: 1,
    marginTop: 4,
  },
});
