import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, keys, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import L from '../../../app/i18n';
import { parseDeck } from '../../parseDeck';
import listOfDecks from '../listOfDecks';
import { DEFAULT_TRAUMA_DATA, isEliminated } from '../trauma';
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
    campaignId: PropTypes.number.isRequired,
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
      campaignId,
    } = this.props;
    showDeckModal(navigator, deck, investigator, campaignId);
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
    if (!deck) {
      return null;
    }
    const parsedDeck = parseDeck(deck, deck.slots, cards, previousDeck);
    const {
      slots,
    } = parsedDeck;

    const validator = new DeckValidation(investigator);
    const problemObj = validator.getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      if (!card) {
        return [];
      }
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
            text={L('{{normalCount}} Cards ({{totalCount}} Total)', {
              normalCount: parsedDeck.normalCardCount,
              totalCount: parsedDeck.totalCardCount,
            })}
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
    investigatorData: PropTypes.object.isRequired,
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

  experienceLine(deck, parsedDeck) {
    if (deck.xp > 0) {
      if (parsedDeck.spentXp > 0) {
        return L('{{xpCount}} available ({{spentXp}} spent)', {
          xpCount: deck.xp || 0,
          spentXp: parsedDeck.spentXp,
        });
      }
      return L('{{xpCount}} available', { xpCount: deck.xp || 0 });
    }
    return L('{{totalXp}} total', { totalXp: parsedDeck.totalXp || 0 });
  }

  render() {
    const {
      investigatorData = {},
      deck,
      cards,
      previousDeck,
      investigator,
      showTraumaDialog,
    } = this.props;
    if (!deck) {
      return null;
    }
    const eliminated = isEliminated(
      investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA,
      investigator);
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
        { !eliminated && (
          <View style={styles.section}>
            <View style={styles.column}>
              <Text style={typography.smallLabel}>
                { L('EXPERIENCE') }
              </Text>
              <Text style={typography.text}>
                { this.experienceLine(parsedDeck.deck, parsedDeck) }
              </Text>
            </View>
          </View>
        ) }
        { !eliminated && (
          <View style={styles.section}>
            <Button
              icon={<MaterialCommunityIcons size={18} color="#222" name="arrow-up-bold" />}
              text={L('Upgrade Deck')}
              style={styles.button}
              size="small"
              align="left"
              color="white"
              onPress={this._upgradeDeckPressed}
              grow
            />
          </View>
        ) }
      </View>
    );
  }
}

export default listOfDecks(
  deckRowWithDetails(CampaignDeckDetail, CampaignSubDeckDetail, {
    compact: true,
    viewDeckButton: true,
  })
);

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
