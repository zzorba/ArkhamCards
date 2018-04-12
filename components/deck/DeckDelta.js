import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import DeckViewCardItem from './DeckViewCardItem';

class DeckDelta extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    cards: PropTypes.object,
    changedCards: PropTypes.object.isRequired,
    exiledCards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._showCard = this.showCard.bind(this);
  }

  showCard(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  render() {
    const {
      cards,
      changedCards,
      exiledCards,
    } = this.props;
    if (!keys(changedCards).length && !keys(exiledCards)) {
      return null;
    }
    return (
      <View>
        { keys(changedCards).length && (
          <View>
            <Text style={styles.title}>Changes</Text>
            { map(keys(changedCards), code => (
              <DeckViewCardItem
                key={code}
                onPress={this._showCard}
                item={{ quantity: changedCards[code] }}
                card={cards[code]}
                deltaMode
              />
            )) }
          </View>
        ) }
        { keys(exiledCards).length && (
          <View>
            <Text style={styles.title}>Exiled Cards</Text>
            { map(keys(exiledCards), code => (
              <DeckViewCardItem
                key={code}
                onPress={this._showCard}
                item={{ quantity: exiledCards[code] }}
                card={cards[code]}
                deltaMode
              />
            )) }
          </View>
        ) }
      </View>
    );
  }
}

export default connectRealm(DeckDelta, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const cards = {};
    forEach(results.cards, card => {
      if (card.code in props.changedCards || card.code in props.exiledCards) {
        cards[card.code] = card;
      }
    });
    return {
      cards,
    };
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
});
