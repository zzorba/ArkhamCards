import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import { parseDeck } from '../../parseDeck';
import listOfDecks from '../listOfDecks';
import LabeledTextBox from '../../core/LabeledTextBox';
import EditTraumaComponent from '../EditTraumaComponent';
import deckRowWithDetails from '../deckRowWithDetails';

class CampaignDeckDetail extends React.Component {
  static propTypes = {
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    investigator: PropTypes.object,
    campaign: PropTypes.object.isRequired,
    showTraumaDialog: PropTypes.func.isRequired,
    showDeckUpgradeDialog: PropTypes.func.isRequired,
    // From the realm HOC
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._upgradeDeckPressed = this.upgradeDeckPressed.bind(this);
  }

  upgradeDeckPressed() {
    const {
      showDeckUpgradeDialog,
      deck,
      investigator,
    } = this.props;

    showDeckUpgradeDialog(deck, investigator);
  }

  render() {
    const {
      campaign: {
        investigatorData = {},
      },
      deck,
      previousDeck,
      investigator,
      cards,
      showTraumaDialog,
    } = this.props;
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
    return (
      <View style={styles.investigatorNotes}>
        <View style={styles.section}>
          <LabeledTextBox
            column
            onPress={this._upgradeDeckPressed}
            label="Experience"
            value={
              (deck.xp > 0 || parsedDeck.spentXp > 0) ?
                `${deck.xp || 0} available${parsedDeck.spentXp > 0 ? ` (${parsedDeck.spentXp} spent)` : ''}` :
                `${parsedDeck.totalXp || 0} total`
            }
          />
        </View>
        <View style={styles.section}>
          <EditTraumaComponent
            investigator={investigator}
            investigatorData={investigatorData}
            showTraumaDialog={showTraumaDialog}
          />
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
    marginRight: 8,
  },
  investigatorNotes: {
    flex: 1,
    marginTop: 4,
  },
});
