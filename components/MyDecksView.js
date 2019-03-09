import React from 'react';
import PropTypes from 'prop-types';
import { find, filter, throttle } from 'lodash';
import { Button, Text, StyleSheet, Switch, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../app/i18n';
import { iconsMap } from '../app/NavIcons';
import { showDeckModal } from './navHelper';
import withFetchCardsGate from './cards/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import { getMyDecksState } from '../reducers';
import { COLORS } from '../styles/colors';

class MyDecksView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    myDecks: PropTypes.array,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Decks'),
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      localDecksOnly: false,
    };
    this._toggleLocalDecksOnly = this.toggleLocalDecksOnly.bind(this);
    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._deckNavClicked = this.deckNavClicked.bind(this);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  showNewDeckDialog() {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Deck.New',
          },
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    }
  }

  deckNavClicked(deck, investigator) {
    showDeckModal(this.props.componentId, deck, investigator);
  }

  toggleLocalDecksOnly() {
    this.setState({
      localDecksOnly: !this.state.localDecksOnly,
    });
  }

  renderCustomHeader() {
    const {
      myDecks,
    } = this.props;
    const {
      localDecksOnly,
    } = this.state;
    const hasLocalDeck = find(myDecks, deckId => deckId < 0) !== null;
    const hasOnlineDeck = find(myDecks, deckId => deckId > 0) !== null;
    if (!localDecksOnly && !(hasLocalDeck && hasOnlineDeck)) {
      // need to have both to show the toggle.
      return null;
    }
    return (
      <View style={styles.row}>
        <Text style={styles.searchOption}>
          { L('Hide ArkhamDB Decks') }
        </Text>
        <Switch
          value={localDecksOnly}
          onValueChange={this._toggleLocalDecksOnly}
          trackColor={COLORS.switchTrackColor}
        />
      </View>
    );
  }

  renderCustomFooter() {
    return (
      <Button title={L('New Deck')} onPress={this._showNewDeckDialog} />
    );
  }

  onlyDeckIds() {
    const {
      myDecks,
    } = this.props;
    if (this.state.localDecksOnly) {
      return filter(myDecks, deckId => parseInt(deckId, 10) < 0);
    }
    return null;
  }

  render() {
    return (
      <MyDecksComponent
        componentId={this.props.componentId}
        customHeader={this.renderCustomHeader()}
        customFooter={this.renderCustomFooter()}
        deckClicked={this._deckNavClicked}
        onlyDeckIds={this.onlyDeckIds()}
      />
    );
  }
}

function mapStateToProps(state) {
  return getMyDecksState(state);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default withFetchCardsGate(
  connect(mapStateToProps, mapDispatchToProps)(MyDecksView),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
});
