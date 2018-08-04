import React from 'react';
import PropTypes from 'prop-types';

import { iconsMap } from '../app/NavIcons';
import { showDeckModal } from './navHelper';
import withLoginGate from './withLoginGate';
import withFetchCardsGate from './cards/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';

class MyDecksView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

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
        navigator.showModal({
          screen: 'Deck.New',
        });
      }
    }
  }

  deckNavClicked(deck, investigator) {
    showDeckModal(this.props.navigator, deck, investigator);
  }

  render() {
    return (
      <MyDecksComponent
        navigator={this.props.navigator}
        deckClicked={this._deckNavClicked}
      />
    );
  }
}

export default withFetchCardsGate(
  withLoginGate(
    MyDecksView,
    'This app will let you edit and upgrade decks stored on ArkhamDB.com\n\nPlease sign in with your account to enable this feature.'
  ),
  { promptForUpdate: false },
);
