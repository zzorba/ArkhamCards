import React from 'react';
import PropTypes from 'prop-types';
import { delay, forEach, keys } from 'lodash';
const {
  StyleSheet,
  Text,
  View,
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Actions from '../../actions';
import { COLORS } from '../../styles/colors';
import { parseDeck } from './parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckChartsTab from './DeckChartsTab';
import DeckEditTab from './DeckEditTab';
import DeckNavHeader from './DeckNavHeader';
import CardDrawSimulator from './CardDrawSimulator';

class DeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    cards: PropTypes.object,
    getDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      slots: props.deck ? props.deck.slots : {},
      saving: false,
    };

    this._slotChanged = this.slotChanged.bind(this);
    this._saveEdits = this.saveEdits.bind(this);
    this._clearEdits = this.clearEdits.bind(this);
  }

  saveEdits() {
    this.setState({
      saving: true,
    });
    delay(() => this.props.navigator.pop(), 3000);
  }

  clearEdits() {
    this.setState({
      slots: this.props.deck ? this.props.deck.slots : {},
    });
  }

  hasPendingEdits() {
    const {
      deck,
    } = this.props;

    const {
      slots,
    } = this.state;

    const removals = {};
    forEach(keys(deck.slots), code => {
      const currentDeckCount = slots[code] || 0;
      if (deck.slots[code] > currentDeckCount) {
        removals[code] = deck.slots[code] - currentDeckCount;
      }
    });
    const additions = {};
    forEach(keys(slots), code => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < slots[code]) {
        removals[code] = slots[code] - ogDeckCount;
      }
    });

    return (keys(removals).length > 0 || keys(additions).length > 0);
  }

  slotChanged(code, count) {
    const newSlots = Object.assign(
      {},
      this.state.slots,
      { [code]: count },
    );
    if (count === 0) {
      delete newSlots[code];
    }
    this.setState({
      slots: newSlots,
    });
  }

  componentDidMount() {
    this.props.getDeck(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deck !== this.props.deck) {
      this.setState({
        slots: nextProps.deck.slots,
      });
    }
  }

  render() {
    const {
      deck,
      cards,
      navigator,
    } = this.props;

    if (!deck) {
      return (
        <View>
          <Text>Loading: { this.props.id }</Text>
        </View>
      );
    }

    const {
      slots,
      saving,
    } = this.state;

    const pDeck = parseDeck(deck, slots, cards);

    return (
      <View style={styles.container}>
        <DeckNavHeader
          navigator={navigator}
          saving={saving}
          hasEdits={this.hasPendingEdits()}
          clearEdits={this._clearEdits}
          saveEdits={this._saveEdits}
        />
        <ScrollableTabView
          tabBarActiveTextColor={COLORS.darkBlue}
          tabBarInactiveTextColor={COLORS.lightBlue}
          tabBarUnderlineStyle={{ backgroundColor: COLORS.darkBlue }}
        >
          <DeckViewTab
            tabLabel="Deck"
            parsedDeck={pDeck}
            navigator={navigator} />
          <CardDrawSimulator
            tabLabel="Draw"
            parsedDeck={pDeck}
            cards={cards} />
          <DeckChartsTab
            tabLabel="Charts"
            parsedDeck={pDeck} />
          <DeckEditTab
            tabLabel="Edit"
            investigator={pDeck.investigator}
            slots={pDeck.slots}
            cards={cards}
            navigator={navigator}
            slotChanged={this._slotChanged}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
      cards: state.cards.all,
    };
  }
  return {
    deck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckView);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});
