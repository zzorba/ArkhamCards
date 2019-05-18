import React from 'react';
import { flatMap, keys, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import { t } from 'ttag';

import { Deck, InvestigatorData, Trauma } from '../../../actions/types';
import DeckValidation from '../../../lib/DeckValidation';
import Card from '../../../data/Card';
import typography from '../../../styles/typography';
import Button from '../../core/Button';
import { parseDeck, ParsedDeck } from '../../parseDeck';
import { showDeckModal } from '../../navHelper';
import listOfDecks from '../listOfDecks';
import { DEFAULT_TRAUMA_DATA, isEliminated } from '../trauma';
import deckRowWithDetails, { DeckRowDetailsProps } from '../deckRowWithDetails';

interface Props {
  campaignId: number;
  showDeckUpgradeDialog: (deck: Deck, investigator?: Card) => void;
  investigatorData: InvestigatorData;
  originalDeckIds: Set<number>;
}

class CampaignDeckDetail extends React.Component<Props & DeckRowDetailsProps> {
  _viewDeck = () => {
    const {
      componentId,
      deck,
      investigator,
      campaignId,
    } = this.props;
    showDeckModal(componentId, deck, investigator, campaignId);
  };

  _upgradeDeckPressed = () => {
    const {
      showDeckUpgradeDialog,
      deck,
      investigator,
    } = this.props;
    showDeckUpgradeDialog(deck, investigator);
  };

  experienceLine(deck: Deck, parsedDeck: ParsedDeck) {
    const xp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    if (xp > 0) {
      if ((parsedDeck.spentXp || 0) > 0) {
        return t`${xp} available (${parsedDeck.spentXp} spent)`;
      }
      return t`${xp} available`;
    }
    const totalXp = parsedDeck.experience || 0;
    return t`${totalXp} total`;
  }

  renderUpgradeButton(deck: Deck) {
    const {
      investigator,
      investigatorData,
      originalDeckIds,
      cards,
      previousDeck,
    } = this.props;
    const eliminated = isEliminated(
      investigatorData[investigator.code] || DEFAULT_TRAUMA_DATA,
      investigator);
    if (eliminated) {
      return null;
    }
    if (!originalDeckIds.has(deck.id)) {
      const parsedDeck = parseDeck(deck, deck.slots, deck.ignoreDeckLimitSlots || {}, cards, previousDeck);
      return (
        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={typography.bigLabel}>
              { t`Deck upgrade saved.` }
            </Text>
            <Text style={typography.smallLabel}>
              { t`EXPERIENCE` }
            </Text>
            <Text style={typography.text}>
              { this.experienceLine(parsedDeck.deck, parsedDeck) }
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Button
        icon={<MaterialCommunityIcons size={18 * DeviceInfo.getFontScale()} color="#222" name="arrow-up-bold" />}
        text={t`Upgrade deck`}
        style={styles.button}
        size="small"
        align="left"
        color="white"
        onPress={this._upgradeDeckPressed}
        grow
      />
    );
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
    const parsedDeck = parseDeck(deck, deck.slots, deck.ignoreDeckLimitSlots || {}, cards, previousDeck);
    const {
      slots,
      ignoreDeckLimitSlots,
    } = parsedDeck;

    const problemObj = new DeckValidation(investigator).getProblem(flatMap(keys(slots), code => {
      const card = cards[code];
      if (!card) {
        return [];
      }
      return map(
        range(0, slots[code] - (ignoreDeckLimitSlots[code] || 0)),
        () => card
      );
    }));
    return (
      <View style={styles.investigatorNotes}>
        <View style={styles.section}>
          { this.renderUpgradeButton(deck) }
        </View>
      </View>
    );
  }
}

const ComposedDeckRow = deckRowWithDetails<Props>(
  {
    compact: true,
    viewDeckButton: true,
  },
  CampaignDeckDetail,
);

// @ts-ignore
export default listOfDecks<Props>(ComposedDeckRow);

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
    marginRight: 8,
    flexDirection: 'row',
  },
  investigatorNotes: {
    flex: 1,
    marginTop: 4,
    flexDirection: 'column',
  },
  investigatorSubNotes: {
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
