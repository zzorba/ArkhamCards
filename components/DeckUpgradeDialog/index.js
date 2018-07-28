import React from 'react';
import PropTypes from 'prop-types';
import { forEach, head, keys, range } from 'lodash';
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

import { showDeckModal } from '../navHelper';
import ExileCardSelectorComponent from '../ExileCardSelectorComponent';
import { upgradeDeck } from '../../lib/authApi';
import * as Actions from '../../actions';
import Button from '../core/Button';
import PlusMinusButtons from '../core/PlusMinusButtons';
import { getDeck } from '../../reducers';
import typography from '../../styles/typography';

class DeckUpgradeDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    setNewDeck: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
    investigator: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      xp: 0,
      exileCounts: {},
    };

    this._onXpChange = this.onXpChange.bind(this);
    this._onExileCountsChange = this.onExileCountsChange.bind(this);
    this._saveUpgrade = this.saveUpgrade.bind(this);
  }

  saveUpgrade() {
    const {
      navigator,
      investigator,
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
      showDeckModal(navigator, upgradedDeck, investigator);
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

  onExileCountsChange(exileCounts) {
    this.setState({
      exileCounts,
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
    } = this.props;
    const {
      xp,
      exileCounts,
    } = this.state;
    if (!deck) {
      return null;
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={typography.text}>
            { `XP: ${xp}` }
          </Text>
          <PlusMinusButtons
            count={xp}
            onChange={this._onXpChange}
            dark
          />
        </View>
        <ExileCardSelectorComponent
          id={deck.id}
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
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
    mapToProps(results, realm, props) {
      return {
        investigator: head(results.cards.filtered(`code == '${props.deck.investigator_code}'`)),
      };
    },
  })
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
  buttonRow: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    marginRight: 8,
  },
});
