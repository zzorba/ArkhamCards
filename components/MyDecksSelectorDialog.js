import React from 'react';
import PropTypes from 'prop-types';

import { iconsMap } from '../app/NavIcons';

import MyDecksComponent from './MyDecksComponent';

export default class MyDecksSelectorDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    onDeckSelect: PropTypes.func.isRequired,
    selectedDeckIds: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.props.navigator.setTitle({
      title: 'Choose a Deck',
    });
    props.navigator.setButtons({
      leftButtons: [
        {
          icon: iconsMap.close,
          id: 'close',
        },
      ],
      rightButtons: [
        {
          icon: iconsMap.add,
          id: 'add',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._deckSelected = this.deckSelected.bind(this);
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      onDeckSelect,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        navigator.push({
          screen: 'Deck.New',
          passProps: {
            onCreateDeck: onDeckSelect,
          },
        });
      } else if (event.id === 'close') {
        navigator.dismissModal();
      }
    }
  }

  deckSelected(id) {
    const {
      onDeckSelect,
      navigator,
    } = this.props;
    onDeckSelect(id);
    navigator.dismissModal();
  }

  render() {
    const {
      navigator,
      selectedDeckIds,
    } = this.props;
    return (
      <MyDecksComponent
        navigator={navigator}
        deckClicked={this._deckSelected}
        filterDeckIds={selectedDeckIds}
      />
    );
  }
}
