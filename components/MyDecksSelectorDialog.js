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

  render() {
    const {
      navigator,
      onDeckSelect,
      selectedDeckIds,
    } = this.props;
    return (
      <MyDecksComponent
        navigator={navigator}
        deckClicked={onDeckSelect}
        filterDeckIds={selectedDeckIds}
      />
    );
  }
}
