import React from 'react';
import PropTypes from 'prop-types';
const {
  StyleSheet,
  Text,
  View,
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Actions from '../../actions';
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
    };

    this._slotChanged = this.slotChanged.bind(this);
  }

  slotChanged(code, count) {
    this.setState({
      slots: Object.assign(
        {},
        this.state.slots,
        { [code] : count },
      ),
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
    } = this.state;

    const pDeck = parseDeck(deck, slots, cards);

    return (
      <View style={styles.container}>
        <DeckNavHeader navigator={navigator} />
        <ScrollableTabView>
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
