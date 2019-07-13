import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { getDeckOptions } from '../navHelper';
import { ParsedDeck } from '../parseDeck';
import { DeckDetailProps } from '../DeckDetailView';
import typography from '../../styles/typography';
import { s } from '../../styles/space';

interface Props {
  componentId: string;
  parsedDeck: ParsedDeck;
  xpAdjustment: number;
}

export default class DeckDelta extends React.Component<Props> {
  _showPreviousDeck = () => {
    const {
      componentId,
      parsedDeck: {
        deck,
        investigator,
      },
    } = this.props;
    if (!deck.previous_deck) {
      return;
    }
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          title: investigator.name,
          id: deck.previous_deck,
          isPrivate: true,
        },
        options: getDeckOptions(investigator),
      },
    });
  };

  _showNextDeck = () => {
    const {
      componentId,
      parsedDeck: {
        deck,
        investigator,
      },
    } = this.props;
    if (!deck.next_deck) {
      return;
    }
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: deck.next_deck,
          isPrivate: true,
        },
        options: getDeckOptions(investigator),
      },
    });
  };

  xpString() {
    const {
      parsedDeck: {
        deck: {
          xp,
        },
        changes,
      },
      xpAdjustment,
    } = this.props;
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    return t`Available experience: ${adjustedExperience}\nSpent experience: ${changes ? changes.spentXp : 0}`;
  }

  render() {
    const {
      parsedDeck: {
        deck,
      },
    } = this.props;
    return (
      <React.Fragment>
        { !!deck.previous_deck && (
          <Text style={[typography.text, styles.text]}>
            { this.xpString() }
          </Text>
        ) }
        <View style={styles.buttonContainer}>
          { !!deck.previous_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showPreviousDeck}
                title={t`View Previous Deck`}
              />
            </View>
          ) }
          { !!deck.next_deck && (
            <View style={styles.button}>
              <Button
                onPress={this._showNextDeck}
                title={t`View Next Deck`}
              />
            </View>
          ) }
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    margin: s,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: s,
    marginRight: s,
  },
  button: {
    margin: 8,
  },
});
