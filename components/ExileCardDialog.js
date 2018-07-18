import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { getDeck } from '../reducers';
import * as Actions from '../actions';
import ExileCardSelectorComponent from './ExileCardSelectorComponent';

export default class ExileCardDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    updateExiles: PropTypes.func.isRequired,
    exiles: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      exileCounts: props.exiles,
    };

    props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._onExileCountsChange = this.onExileCountsChange.bind(this);
  }

  onNavigatorEvent(event) {
    const {
      updateExiles,
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        updateExiles(this.state.exileCounts);
        navigator.pop();
      }
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
      navigator,
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
