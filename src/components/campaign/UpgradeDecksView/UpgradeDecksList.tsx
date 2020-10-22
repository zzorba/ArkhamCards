import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, filter, map } from 'lodash';
import { t } from 'ttag';

import NonDeckDetailsButton from './NonDeckDetailsButton';
import UpgradeDeckButton from './UpgradeDeckButton';
import { Deck, InvestigatorData, ParsedDeck } from '@actions/types';
import InvestigatorRow from '@components/core/InvestigatorRow';
import Card, { CardsMap } from '@data/Card';
import { parseBasicDeck } from '@lib/parseDeck';
import { showDeckModal } from '@components/nav/helper';
import DeckRow from '../DeckRow';
import { s } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  campaignId: number;
  lang: string;
  showDeckUpgradeDialog: (deck: Deck, investigator?: Card) => void;
  updateInvestigatorXp: (investigator: Card, xp: number) => void;
  investigatorData: InvestigatorData;
  originalDeckIds: Set<number>;
  componentId: string;
  decks: Deck[];
  allInvestigators: Card[];
}

interface State {
  saved: {
    [investigator: string]: boolean;
  };
}

export default class UpgradeDecksList extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  state: State = {
    saved: {},
  };

  viewDeck(deck: Deck, investigator: Card) {
    const {
      componentId,
      campaignId,
    } = this.props;
    const { colors } = this.context;
    showDeckModal(componentId, deck, colors, investigator, campaignId);
  }

  _upgradeDeckPressed = (deck: Deck, investigator: Card) => {
    const {
      showDeckUpgradeDialog,
    } = this.props;
    showDeckUpgradeDialog(deck, investigator);
  };

  experienceLine(deck: Deck, parsedDeck: ParsedDeck) {
    const xp = (deck.xp || 0) + (deck.xp_adjustment || 0);
    if (xp > 0) {
      if (parsedDeck.changes && parsedDeck.changes.spentXp > 0) {
        return t`${xp} available experience, (${parsedDeck.changes.spentXp} spent)`;
      }
      return t`${xp} available experience`;
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
    } = this.props;
    const { typography } = this.context;
    const eliminated = investigator.eliminated(investigatorData[investigator.code]);
    if (eliminated) {
      return null;
    }
    if (!originalDeckIds.has(deck.id)) {
      const parsedDeck = parseBasicDeck(deck, cards, previousDeck);
      if (!parsedDeck) {
        return null;
      }
      return (
        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={typography.text}>
              { this.experienceLine(parsedDeck.deck, parsedDeck) }
            </Text>
          </View>
        </View>
      );
    }

    return (
      <UpgradeDeckButton
        deck={deck}
        investigator={investigator}
        onPress={this._upgradeDeckPressed}
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
    return this.renderUpgradeButton(deck, cards, investigator, previousDeck);
  };

  _renderDeck = (deckId: number) => {
    const {
      componentId,
      lang,
    } = this.props;

    return (
      <DeckRow
        key={deckId}
        lang={lang}
        componentId={componentId}
        id={deckId}
        renderDetails={this._renderDetails}
        otherProps={this.props}
        compact
        viewDeckButton
      />
    );
  };

  _saveXp = (investigator: Card, xp: number) => {
    const { updateInvestigatorXp } = this.props;
    updateInvestigatorXp(investigator, xp);
    this.setState({
      saved: {
        ...this.state.saved,
        [investigator.code]: true,
      },
    });
  }

  render() {
    const {
      decks,
      investigatorData,
      allInvestigators,
    } = this.props;
    const { saved } = this.state;
    const investigators = filter(
      allInvestigators,
      investigator => !investigator.eliminated(investigatorData[investigator.code] || {})
    );

    return (
      <>
        { map(investigators, investigator => {
          const deck = find(decks, deck => deck.investigator_code === investigator.code);
          if (deck) {
            return this._renderDeck(deck.id);
          }
          return (
            <InvestigatorRow
              key={investigator.code}
              investigator={investigator}
            >
              <NonDeckDetailsButton
                investigator={investigator}
                saved={saved[investigator.code] || false}
                saveXp={this._saveXp}
              />
            </InvestigatorRow>
          );
        }) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    marginBottom: s,
    marginRight: s,
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});
