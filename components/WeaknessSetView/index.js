import React from 'react';
import PropTypes from 'prop-types';
import { filter, flatMap, forEach, keys, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';

import { BASIC_WEAKNESS_QUERY } from '../../data/query';
import * as Actions from '../../actions';
import CardSearchResult from '../CardSearchResult';
import ChooserButton from '../core/ChooserButton';

class WeaknessSetView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    set: PropTypes.object,
    cards: PropTypes.object, // Realm array
    cardsMap: PropTypes.object,
    deleteWeaknessSet: PropTypes.func.isRequired,
    editWeaknessSet: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTraits: [],
    };

    this._onCountChange = this.onCountChange.bind(this);
    this._onDeletePress = this.onDeletePress.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._onTraitsChange = this.onTraitsChange.bind(this);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.set.name,
    });
  }

  onCountChange(code, count) {
    const {
      set,
      editWeaknessSet,
      cardsMap,
    } = this.props;
    const assignedCards = Object.assign(
      {},
      set.assignedCards,
      { [code]: (cardsMap[code].quantity || 1) - count });
    editWeaknessSet(set.id, set.name, set.packCodes, assignedCards);
  }

  onDeletePress() {
    const {
      navigator,
      set,
      deleteWeaknessSet,
    } = this.props;
    deleteWeaknessSet(set.id);
    navigator.pop();
  }

  cardPressed(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
        showSpoilers: true,
        backButtonTitle: 'Back',
      },
    });
  }

  onTraitsChange(values) {
    this.setState({
      selectedTraits: values,
    });
  }

  render() {
    const {
      navigator,
      set,
      cards,
    } = this.props;
    const {
      selectedTraits,
    } = this.state;
    if (!set) {
      return null;
    }
    const traitsMap = {};
    forEach(cards, card => {
      if (card.traits) {
        forEach(
          filter(map(card.traits.split('.'), t => t.trim()), t => t),
          t => {
            traitsMap[t] = 1;
          });
      }
    });
    const allTraits = keys(traitsMap).sort();
    const packCodes = new Set(set.packCodes);
    return (
      <ScrollView>
        <ChooserButton
          navigator={navigator}
          title="Traits"
          values={allTraits}
          selection={selectedTraits}
          onChange={this._onTraitsChange}
        />
        <Text>Available Weaknesses</Text>
        { flatMap(cards, card => {
          if (!packCodes.has(card.pack_code)) {
            return null;
          }
          return (
            <CardSearchResult
              key={card.code}
              card={card}
              count={card.quantity - (set.assignedCards[card.code] || 0)}
              onPress={this._cardPressed}
              limit={card.quantity}
              onDeckCountChange={this._onCountChange}
            />
          );
        })
        }
        <Button text="Delete Set" onPress={this._onDeletePress} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    set: state.weaknesses.all[props.id],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(WeaknessSetView, {
    schemas: ['Card'],
    mapToProps(results) {
      const cards = results.cards
        .filtered(BASIC_WEAKNESS_QUERY)
        .sorted([['name', false]]);
      const cardsMap = {};
      forEach(cards, card => {
        cardsMap[card.code] = card;
      });
      return {
        cards,
        cardsMap,
      };
    },
  })
);

const styles = StyleSheet.create({

});
