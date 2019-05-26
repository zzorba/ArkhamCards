import React, { ReactNode } from 'react';
import { map } from 'lodash';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { Deck } from '../../actions/types';
import { MyDecksSelectorProps } from '../campaign/MyDecksSelectorDialog';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';
import { CardsMap } from '../../data/Card';

export interface DeckListProps {
  componentId: string;
  campaignId: number;
  deckIds: number[];
  deckAdded: (deck: Deck) => void;
  renderDeck: (
    deckId: number,
    cards: CardsMap,
    investigators: CardsMap
  ) => ReactNode;
  otherProps: any;
}

class DeckList extends React.Component<DeckListProps & PlayerCardProps> {
  _showDeckSelector = () => {
    const {
      deckIds,
      deckAdded,
      campaignId,
    } = this.props;
    const passProps: MyDecksSelectorProps = {
      campaignId: campaignId,
      onDeckSelect: deckAdded,
      selectedDeckIds: deckIds,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
          },
        }],
      },
    });
  };

  render() {
    const {
      deckIds,
      deckAdded,
      cards,
      investigators,
      renderDeck,
    } = this.props;
    return (
      <View>
        { map(deckIds, deckId => (
          renderDeck(deckId, cards, investigators)
        )) }
        { !!deckAdded && (
          <View style={styles.button}>
            <Button title={t`Add Investigator`} onPress={this._showDeckSelector} />
          </View>
        ) }
      </View>
    );
  }
}

export default withPlayerCards(DeckList);

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
});
