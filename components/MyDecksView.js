import React from 'react';
import PropTypes from 'prop-types';

import L from '../app/i18n';
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
    L('ArkhamDB is a popular deck building site where you can manage your decks and share them with others. If you have an account, you can use this app to create and manage your decks on the go.\n\nPlease sign in to enable this feature.')
  ),
  { promptForUpdate: false },
);
