import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import L from '../app/i18n';
import { iconsMap } from '../app/NavIcons';
import { showDeckModal } from './navHelper';
import withLoginGate from './withLoginGate';
import withFetchCardsGate from './cards/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';

class MyDecksView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
  };

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this._deckNavClicked = this.deckNavClicked.bind(this);

    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'add') {
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
  }

  deckNavClicked(deck, investigator) {
    showDeckModal(this.props.componentId, deck, investigator);
  }

  render() {
    return (
      <MyDecksComponent
        componentId={this.props.componentId}
        deckClicked={this._deckNavClicked}
      />
    );
  }
}

export default withFetchCardsGate(
  withLoginGate(
    MyDecksView,
    L('ArkhamDB is a popular deck building site where you can manage your decks and share them with others. If you have an account, you can use this app to create and manage your decks on the go.\n\nPlease sign in to enable this feature.')
  ),
  { promptForUpdate: false },
);
