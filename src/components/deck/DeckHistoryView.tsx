import React from 'react';
import { map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import DeckProgressComponent from './DeckProgressComponent';
import { DeckDetailProps } from './DeckDetailView';
import { getDeckOptions } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { Deck, DeckMeta, DecksMap, ParsedDeck, Slots } from '@actions/types';
import { AppState, getAllDecks } from '@reducers';
import { parseDeck } from '@lib/parseDeck';
import COLORS from '@styles/colors';

export interface DeckHistoryProps {
  id: number;
  meta: DeckMeta;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  xpAdjustment: number;
}

interface ReduxProps {
  decks: DecksMap;
}

type Props = NavigationProps & DimensionsProps & DeckHistoryProps & PlayerCardProps & ReduxProps;

class DeckHistoryView extends React.Component<Props> {

  historicDecks(): ParsedDeck [] {
    const {
      id,
      decks,
      cards,
      slots,
      ignoreDeckLimitSlots,
      xpAdjustment,
      meta,
    } = this.props;
    const decksResult: ParsedDeck[] = [];
    let deck: Deck | undefined = decks[id];
    while (deck) {
      const currentDeck = deck.id === id;
      const previousDeck: Deck | undefined = (
        deck.previous_deck ? decks[deck.previous_deck] : undefined
      );
      const parsedDeck = parseDeck(
        deck,
        currentDeck ? meta : (deck.meta || {}),
        currentDeck ? slots : deck.slots,
        currentDeck ? ignoreDeckLimitSlots : deck.ignoreDeckLimitSlots,
        cards,
        previousDeck,
        currentDeck ? xpAdjustment : (deck.xp_adjustment || 0),
      );
      if (parsedDeck) {
        decksResult.push(parsedDeck);
      }
      deck = previousDeck;
    }
    return decksResult;
  }

  deckTitle(deck: ParsedDeck, versionNumber: number): string {
    if (!deck.changes) {
      return t`Original Deck`;
    }
    if (deck.deck.id === this.props.id) {
      if (deck.changes) {
        return t`Latest Deck: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
      }
      return t`Latest Deck: ${deck.availableExperience} XP`;
    }
    const humanVersionNumber = versionNumber - 1;
    if (deck.changes) {
      return t`Upgrade ${humanVersionNumber}: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
    }
    return t`Upgrade ${humanVersionNumber}: ${deck.availableExperience} XP`;
  }

  _onDeckPress = (parsedDeck: ParsedDeck) => {
    const {
      componentId,
    } = this.props;
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: parsedDeck.deck.id,
          isPrivate: true,
        },
        options: getDeckOptions(parsedDeck.investigator, false, parsedDeck.deck.name),
      },
    });
  };

  render() {
    const { componentId, cards } = this.props;
    const decks = this.historicDecks();

    return (
      <ScrollView contentContainerStyle={styles.wrapper}>
        { map(decks, (deck, idx) => (
          <DeckProgressComponent
            key={deck.deck.id}
            title={this.deckTitle(deck, decks.length - idx)}
            onTitlePress={this._onDeckPress}
            componentId={componentId}
            deck={deck.deck}
            parsedDeck={deck}
            cards={cards}
            editable={false}
            xpAdjustment={0}
            isPrivate
          />
        )) }
      </ScrollView>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  const decks = getAllDecks(state);
  return {
    decks,
  };
}

export default connect<ReduxProps, null, NavigationProps & DeckHistoryProps, AppState>(
  mapStateToProps
)(
  withPlayerCards<ReduxProps & NavigationProps & DeckHistoryProps>(
    withDimensions(DeckHistoryView)
  )
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
});
