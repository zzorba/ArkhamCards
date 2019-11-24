import React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { getDeckOptions } from '../navHelper';
import { DeckDetailProps } from '../DeckDetailView';
import { ParsedDeck } from '../../actions/types';
import { s } from '../../styles/space';

interface Props {
  componentId: string;
  parsedDeck: ParsedDeck;
  xpAdjustment: number;
  showXpAdjustment: () => void;
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
    const spentXp = changes ? changes.spentXp : 0;
    const adjustedExperience = (xp || 0) + (xpAdjustment || 0);
    return t`Available Experience: ${adjustedExperience} (${spentXp} Spent)`;
  }

  render() {
    const {
      parsedDeck: {
        deck,
      },
      showXpAdjustment,
    } = this.props;
    return (
      <React.Fragment>
        { !!deck.previous_deck && (
          <View style={styles.button}>
            <Button title={this.xpString()} onPress={showXpAdjustment} />
          </View>
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
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: s,
    marginRight: s,
  },
  button: {
    margin: 8,
  },
});
