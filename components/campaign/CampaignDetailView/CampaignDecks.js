import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, keys, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { parseDeck } from '../../parseDeck';
import listOfDecks from '../listOfDecks';
import { showDeckModal } from '../../navHelper';
import Button from '../../core/Button';
import EditTraumaComponent from '../EditTraumaComponent';
import deckRowWithDetails from '../deckRowWithDetails';
import DeckValidation from '../../../lib/DeckValidation';
import DeckProblemRow from '../../DeckProblemRow';
import typography from '../../../styles/typography';
import AppIcon from '../../../assets/AppIcon';

class CampaignDeckDetail extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    investigator: PropTypes.object,
    campaign: PropTypes.object.isRequired,
    showDeckUpgradeDialog: PropTypes.func.isRequired,
    // From the realm HOC
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._viewDeck = this.viewDeck.bind(this);
    this._upgradeDeckPressed = this.upgradeDeckPressed.bind(this);
  }

  viewDeck() {
    const {
      navigator,
      deck,
      investigator,
      campaign,
    } = this.props;
    showDeckModal(navigator, deck, investigator, campaign.id);
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
      deck,
      cards,
      previousDeck,
      investigator,
    } = this.props;
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
    const {
      slots,
    } = parsedDeck;

    const validator = new DeckValidation(investigator);
    const problemObj = validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      return map(range(0, slots[code]), () => card);
    }));
    return (
      <View style={styles.investigatorNotes}>
        { !!problemObj && (
          <View style={styles.section}>
            <DeckProblemRow problem={problemObj} color="#222" />
          </View>
        ) }
        <View style={styles.section}>
          <Button
            icon={<AppIcon name="deck" size={18} color="#222222" />}
            text={`${parsedDeck.normalCardCount} Cards (${parsedDeck.totalCardCount} Total)`}
            style={styles.button}
            size="small"
            align="left"
            color="white"
            onPress={this._viewDeck}
            grow
          />
        </View>
      </View>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class CampaignSubDeckDetail extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
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

    this._viewDeck = this.viewDeck.bind(this);
    this._upgradeDeckPressed = this.upgradeDeckPressed.bind(this);
  }

  viewDeck() {
    const {
      navigator,
      deck,
      investigator,
    } = this.props;
    showDeckModal(navigator, deck, investigator);
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
      cards,
      previousDeck,
      investigator,
      showTraumaDialog,
    } = this.props;
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
    return (
      <View style={styles.investigatorSubNotes}>
        <View style={styles.section}>
          <EditTraumaComponent
            investigator={investigator}
            investigatorData={investigatorData}
            showTraumaDialog={showTraumaDialog}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={typography.smallLabel}>
              EXPERIENCE
            </Text>
            <Text style={typography.text}>
              { (deck.xp > 0 || parsedDeck.spentXp > 0) ?
                `${deck.xp || 0} available${parsedDeck.spentXp > 0 ? ` (${parsedDeck.spentXp} spent)` : ''}` :
                `${parsedDeck.totalXp || 0} total`
              }
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Button
            icon={<MaterialCommunityIcons size={18} color="#222" name="arrow-up-bold" />}
            text="Upgrade Deck"
            style={styles.button}
            size="small"
            align="left"
            color="white"
            onPress={this._upgradeDeckPressed}
            grow
          />
        </View>
      </View>
    );
  }
}

export default listOfDecks(
  deckRowWithDetails(CampaignDeckDetail, CampaignSubDeckDetail, {
    compact: true,
    viewDeckButton: true,
  }), {
    deckLimit: null,
  });

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
    marginRight: 8,
    flexDirection: 'row',
  },
  investigatorNotes: {
    flex: 1,
    marginTop: 4,
  },
  investigatorSubNotes: {
    flex: 1,
    marginTop: 4,
    marginLeft: 8,
  },
  button: {
    marginLeft: 0,
  },
  column: {
    flexDirection: 'column',
  },
});
