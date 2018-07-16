import React from 'react';
import PropTypes from 'prop-types';

import Button from './core/Button';

export default class AddDeckRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deckAdded: PropTypes.func.isRequired,
    selectedDeckIds: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this._showDeckSelector = this.showDeckSelector.bind(this);
  }

  showDeckSelector() {
    const {
      navigator,
      selectedDeckIds,
      deckAdded,
    } = this.props;
    navigator.showModal({
      screen: 'Dialog.DeckSelector',
      passProps: {
        onDeckSelect: deckAdded,
        selectedDeckIds: selectedDeckIds,
      },
    });
  }

  render() {
    return (
      <Button align="left" text="Add Deck" onPress={this._showDeckSelector} />
    );
  }
}
