import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { t } from 'ttag';

import { Deck, InvestigatorData, ParsedDeck } from '../../../actions/types';
import Card, { CardsMap } from '../../../data/Card';
import { parseDeck } from '../../../lib/parseDeck';
import typography from '../../../styles/typography';
import Button from '../../core/Button';
import { showDeckModal } from '../../navHelper';
import { DEFAULT_TRAUMA_DATA, isEliminated } from '../trauma';
import DeckList, { DeckListProps } from '../DeckList';
import DeckRow from '../DeckRow';

interface Props extends DeckListProps {
  campaignId: number;
  showDeckUpgradeDialog: (deck: Deck, investigator?: Card) => void;
  investigatorData: InvestigatorData;
  originalDeckIds: Set<number>;
}

export default class UpgradeDecksList extends React.Component<Props> {
  viewDeck(deck: Deck, investigator: Card) {
    const {
      componentId,
      campaignId,
    } = this.props;
    showDeckModal(componentId, deck, investigator, campaignId);
  }

  upgradeDeckPressed(deck: Deck, investigator: Card) {
    const {
      showDeckUpgradeDialog,
    } = this.props;
    showDeckUpgradeDialog(deck, investigator);
  }

  experienceLine(deck: Deck, parsedDeck: ParsedDeck) {
    const xp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    if (xp > 0) {
      if (parsedDeck.changes && parsedDeck.changes.spentXp > 0) {
        return t`${xp} available (${parsedDeck.changes.spentXp} spent)`;
      }
      return t`${xp} available`;
    }
    const totalXp = parsedDeck.experience || 0;
    return t`${totalXp} total`;
  }

  renderUpgradeButton(
    deck: Deck,
    cards: CardsMap,
    investigator: Card,
    previousDeck?: Deck
  ) {
    const {
      investigatorData,
      originalDeckIds,
      fontScale,
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
        icon={<MaterialCommunityIcons size={18 * fontScale} color="#222" name="arrow-up-bold" />}
        text={t`Upgrade deck`}
        style={styles.button}
        size="small"
        align="left"
        color="white"
        onPress={() => this.upgradeDeckPressed(deck, investigator)}
        grow
      />
    );
  }

  _renderDetails = (
    deck: Deck,
    cards: CardsMap,
    investigator: Card,
    previousDeck?: Deck
  ) => {
    if (!deck) {
      return null;
    }
    return (
      <View style={styles.investigatorNotes}>
        <View style={styles.section}>
          { this.renderUpgradeButton(deck, cards, investigator, previousDeck) }
        </View>
      </View>
    );
  };

  _renderDeck = (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => {
    const {
      componentId,
      fontScale,
    } = this.props;
    return (
      <DeckRow
        key={deckId}
        fontScale={fontScale}
        componentId={componentId}
        id={deckId}
        cards={cards}
        investigators={investigators}
        renderDetails={this._renderDetails}
        otherProps={this.props}
        compact
        viewDeckButton
      />
    );
  };

  render() {
    const {
      componentId,
      deckIds,
      deckAdded,
      campaignId,
      fontScale,
    } = this.props;
    return (
      <DeckList
        fontScale={fontScale}
        renderDeck={this._renderDeck}
        componentId={componentId}
        campaignId={campaignId}
        deckIds={deckIds}
        deckAdded={deckAdded}
        otherProps={this.props}
      />
    );
  }
}

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
  button: {
    marginLeft: 0,
  },
  column: {
    flexDirection: 'column',
  },
});
