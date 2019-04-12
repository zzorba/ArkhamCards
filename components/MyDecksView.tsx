import React from 'react';
import { find, filter, throttle } from 'lodash';
import { Button, Text, StyleSheet, Switch, View } from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { connect } from 'react-redux';

import { t } from 'ttag';
import { Deck } from '../actions/types';
import Card from '../data/Card';
import { iconsMap } from '../app/NavIcons';
import { showDeckModal } from './navHelper';
import withFetchCardsGate from './cards/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import { getMyDecksState, AppState } from '../reducers';
import { COLORS } from '../styles/colors';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  myDecks: number[];
}

type Props = OwnProps & ReduxProps;

interface State {
  localDecksOnly: boolean;
}

class MyDecksView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Decks`,
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;

  _showNewDeckDialog!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      localDecksOnly: false,
    };
    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
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

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    }
  }

  _deckNavClicked = (deck: Deck, investigator?: Card) => {
    showDeckModal(this.props.componentId, deck, investigator);
  };

  _toggleLocalDecksOnly = () => {
    this.setState({
      localDecksOnly: !this.state.localDecksOnly,
    });
  };

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
          { t`Hide ArkhamDB Decks` }
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
      <View style={styles.buttonRow}>
        <Button title={t`New Deck`} onPress={this._showNewDeckDialog} />
      </View>
    );
  }

  onlyDeckIds() {
    const {
      myDecks,
    } = this.props;
    if (this.state.localDecksOnly) {
      // @ts-ignore
      return filter(myDecks, deckId => parseInt(deckId, 10) < 0);
    }
    return undefined;
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

function mapStateToProps(state: AppState): ReduxProps {
  return getMyDecksState(state);
}

export default withFetchCardsGate(
  connect<ReduxProps, {}, OwnProps, AppState>(mapStateToProps)(MyDecksView),
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOption: {
    fontFamily: 'System',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 2,
  },
});
