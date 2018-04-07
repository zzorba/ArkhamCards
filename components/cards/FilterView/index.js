import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import { applyFilters } from '../../../lib/filters';
import { iconsMap } from '../../../app/NavIcons';
import FactionChooser from './FactionChooser';
import TypeChooser from './TypeChooser';
import XpChooser from './XpChooser';
import DefaultFilterState from './DefaultFilterState';

class FilterView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    cards: PropTypes.object,
    factions: PropTypes.array.isRequired,
    applyFilters: PropTypes.func.isRequired,
    currentFilters: PropTypes.object.isRequired,
    baseQuery: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      filters: props.currentFilters,
    };

    this._onFactionChange = this.onFactionChange.bind(this);
    this._onTypeChange = this.onTypeChange.bind(this);
    this._applyFilters = this.applyFilters.bind(this);

    props.navigator.setTitle({
      title: 'Filter',
    });
    props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Clear',
          id: 'clear',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  applyFilters() {
    this.props.applyFilters(this.state.filters);
  }

  onNavigatorEvent(event) {
    const {
      applyFilters,
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'clear') {
        this.setState({
          filters: DefaultFilterState,
        }, this._applyFilters);
      }
    }
  }

  onFactionChange(selection) {
    this.setState({
      filters: Object.assign({}, this.state.filters, { factions: selection }),
    }, this._applyFilters);
  }

  onTypeChange(selection) {
    this.setState({
      filters: Object.assign({}, this.state.filters, { types: selection }),
    }, this._applyFilters);
  }

  cardCount() {
    const {
      cards,
    } = this.props;
    const query = applyFilters(this.state.filters).join(' and ');
    if (query) {
      return cards.filtered(query).length;
    }
    return cards.length;
  }

  render() {
    const {
      filters: {
        factions,
        types,
      },
    } = this.state;

    return (
      <View>
        <FactionChooser
          factions={this.props.factions}
          selection={factions}
          onChange={this._onFactionChange}
        />
        <TypeChooser
          onChange={this._onTypeChange}
          selection={types}
        />
        <Text>{ this.cardCount() } Cards Matched</Text>
      </View>
    );
  }
}

export default connectRealm(FilterView, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
      cards: props.baseQuery ? results.cards.filtered(props.baseQuery) : results.cards,
    };
  },
});
