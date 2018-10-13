import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';

import L from '../app/i18n';
import ExileCardSelectorComponent from './ExileCardSelectorComponent';

export default class ExileCardDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    updateExiles: PropTypes.func.isRequired,
    exiles: PropTypes.object.isRequired,
  };

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          text: L('Save'),
          id: 'save',
          showAsAction: 'ifRoom',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      exileCounts: props.exiles,
    };

    this._onExileCountsChange = this.onExileCountsChange.bind(this);

    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }) {
    const {
      updateExiles,
      componentId,
    } = this.props;
    if (buttonId === 'save') {
      updateExiles(this.state.exileCounts);
      Navigation.pop(componentId);
    }
  }

  onExileCountsChange(exileCounts) {
    this.setState({
      exileCounts,
    });
  }

  backPressed() {
    this.props.updateExiles(this.state.deckCardCounts);
  }

  render() {
    const {
      id,
    } = this.props;

    const {
      exileCounts,
    } = this.state;

    return (
      <ExileCardSelectorComponent
        id={id}
        exileCounts={exileCounts}
        updateExileCounts={this._onExileCountsChange}
      />
    );
  }
}
