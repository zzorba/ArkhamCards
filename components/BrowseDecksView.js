import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import FetchCardsGate from './FetchCardsGate';
import { iconsMap } from '../app/NavIcons';
import DeckListComponent from './DeckListComponent';

export default class BrowseDecksView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      deckIds: [
        5168,
        5167,
        4922,
        4946,
        4950,
        4519,
        101,
        381,
        180,
        530,
        2932,
        294,
        1179,
        2381,
        132081,
        137338,
      ],
    };

    this._deckNavClicked = this.deckNavClicked.bind(this);
    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Deck.New',
        });
      }
    }
  }

  deckNavClicked(id) {
    this.props.navigator.push({
      screen: 'Deck',
      passProps: {
        id: id,
      },
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  render() {
    const {
      navigator,
    } = this.props;
    const {
      deckIds,
    } = this.state;

    return (
      <FetchCardsGate navigator={navigator}>
        <DeckListComponent
          navigator={navigator}
          deckIds={deckIds}
          deckClicked={this._deckNavClicked}
        />
      </FetchCardsGate>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
