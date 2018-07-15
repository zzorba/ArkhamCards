import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, keys, map, range } from 'lodash';
import {
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { upgradeDeck } from '../../lib/authApi';
import * as Actions from '../../actions';
import Button from '../core/Button';
import PlusMinusButtons from '../core/PlusMinusButtons';
import { getDeck } from '../../reducers';
import typography from '../../styles/typography';
import ExileRow from './ExileRow';

class DeckUpgradeDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    exileCards: PropTypes.object,
    setNewDeck: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      xp: 0,
      exileCounts: {},
    };

    this._onXpChange = this.onXpChange.bind(this);
    this._onCardPress = this.onCardPress.bind(this);
    this._onExileChange = this.onExileChange.bind(this);
    this._saveUpgrade = this.saveUpgrade.bind(this);
  }

  saveUpgrade() {
    const {
      navigator,
      deck: {
        id,
      },
      setNewDeck,
      updateDeck,
    } = this.props;
    const {
      xp,
      exileCounts,
    } = this.state;
    const exileParts = [];
    forEach(keys(exileCounts), code => {
      const count = exileCounts[code];
      if (count > 0) {
        forEach(range(0, count), () => exileParts.push(code));
      }
    });
    const exiles = exileParts.join(',');
    upgradeDeck(id, xp, exiles).then(decks => {
      const {
        deck,
        upgradedDeck,
      } = decks;
      updateDeck(deck.id, deck, false);
      setNewDeck(upgradedDeck.id, upgradedDeck);
      navigator.showModal({
        screen: 'Deck',
        passProps: {
          id: upgradedDeck.id,
          isPrivate: true,
          modal: true,
        },
      });
    }, err => {
      Alert.alert(err.message || err);
    });
  }

  onCardPress(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  onExileChange(card, count) {
    const {
      exileCounts,
    } = this.state;
    this.setState({
      exileCounts: Object.assign(
        {},
        exileCounts,
        { [card.code]: count },
      ),
    });
  }

  onXpChange(xp) {
    this.setState({
      xp: xp,
    });
  }

  render() {
    const {
      deck,
      exileCards,
    } = this.props;
    const {
      xp,
    } = this.state;
    if (!deck) {
      return null;
    }
    const matchingExileCards = filter(exileCards, card => deck.slots[card.code]);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={typography.text}>
            { `XP: ${xp}` }
          </Text>
          <PlusMinusButtons
            count={xp}
            onChange={this._onXpChange}
          />
        </View>
        { (matchingExileCards.length > 0) && (
          <View style={styles.exileBlock}>
            <Text style={[typography.text, styles.exileText]}>
              Select Cards to Exile:
            </Text>
            { map(matchingExileCards, card => (
              <ExileRow
                key={card.code}
                card={card}
                onPress={this._onCardPress}
                onChange={this._onExileChange}
                limit={deck.slots[card.code]}
              />
            )) }
          </View>
        ) }
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            color="green"
            text="Save"
            onPress={this._saveUpgrade}
          />
        </View>
      </ScrollView>
    );
  }
}


function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(DeckUpgradeDialog, {
    schemas: ['Card'],
    mapToProps(results) {
      const exileCards = {};
      forEach(results.cards.filtered('exile == true').sorted('name'), card => {
        exileCards[card.code] = card;
      });
      return {
        exileCards,
      };
    },
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  exileBlock: {
    flex: 1,
    paddingTop: 8,
  },
  exileText: {
    paddingLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    marginRight: 8,
  },
});
