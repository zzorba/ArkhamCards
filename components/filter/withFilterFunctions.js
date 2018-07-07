import React from 'react';
import PropTypes from 'prop-types';
import { connectRealm } from 'react-native-realm';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import FilterFooterComponent from './FilterFooterComponent';
import DefaultFilterState from './DefaultFilterState';

export default function withFilterFunctions(WrappedComponent) {
  class WrappedFilterComponent extends React.Component {
    static propTypes = {
      navigator: PropTypes.object.isRequired,
      currentFilters: PropTypes.object.isRequired,
      applyFilters: PropTypes.func.isRequired,
      /* eslint-disable  react/no-unused-prop-types */
      baseQuery: PropTypes.string,
      cards: PropTypes.object,
    };

    constructor(props) {
      super(props);

      this.state = {
        filters: props.currentFilters,
      };

      this._pushFilterView = this.pushFilterView.bind(this);
      this._updateFilters = this.updateFilters.bind(this);
      this._onToggleChange = this.onToggleChange.bind(this);
      this._onFilterChange = this.onFilterChange.bind(this);
      props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
      if (event.type === 'NavBarButtonPress') {
        if (event.id === 'clear') {
          this.setState({
            filters: DefaultFilterState,
          });
        }
      }
      if (event.id === 'willDisappear') {
        this.props.applyFilters(this.state.filters);
      }
    }

    pushFilterView(screenName) {
      const {
        navigator,
        baseQuery,
      } = this.props;
      navigator.push({
        screen: screenName,
        passProps: {
          applyFilters: this._updateFilters,
          currentFilters: this.state.filters,
          baseQuery: baseQuery,
        },
      });
    }

    updateFilters(filters) {
      this.setState({
        filters,
      });
    }

    onToggleChange(key) {
      const {
        filters,
      } = this.state;
      this.setState({
        filters: Object.assign({}, filters, { [key]: !filters[key] }),
      });
    }

    onFilterChange(key, selection) {
      this.setState({
        filters: Object.assign({}, this.state.filters, { [key]: selection }),
      });
    }

    render() {
      const {
        cards,
        baseQuery,
        ...otherProps
      } = this.props;
      const {
        filters,
      } = this.state;
      return (
        <View style={styles.wrapper}>
          <WrappedComponent
            cards={cards}
            filters={filters}
            pushFilterView={this._pushFilterView}
            onToggleChange={this._onToggleChange}
            onFilterChange={this._onFilterChange}
            {...otherProps}
          />
          <FilterFooterComponent baseQuery={baseQuery} filters={filters} />
        </View>
      );
    }
  }

  const result = connectRealm(WrappedFilterComponent, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      return {
        cards: props.baseQuery ? results.cards.filtered(props.baseQuery) : results.cards,
      };
    },
  });

  hoistNonReactStatic(result, WrappedComponent);

  return result;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
