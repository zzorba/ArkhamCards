import React from 'react';
import PropTypes from 'prop-types';
import { connectRealm } from 'react-native-realm';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation } from 'react-native-navigation';

import FilterFooterComponent from './FilterFooterComponent';

export default function withFilterFunctions(WrappedComponent) {
  class WrappedFilterComponent extends React.Component {
    static propTypes = {
      componentId: PropTypes.string.isRequired,
      currentFilters: PropTypes.object.isRequired,
      defaultFilterState: PropTypes.object.isRequired,
      applyFilters: PropTypes.func.isRequired,
      /* eslint-disable  react/no-unused-prop-types */
      baseQuery: PropTypes.string,
      cards: PropTypes.object,
    };

    constructor(props) {
      super(props);

      const {
        width,
      } = Dimensions.get('window');

      this.state = {
        width,
        filters: props.currentFilters,
      };

      this._pushFilterView = this.pushFilterView.bind(this);
      this._updateFilters = this.updateFilters.bind(this);
      this._onToggleChange = this.onToggleChange.bind(this);
      this._onFilterChange = this.onFilterChange.bind(this);

      this._navEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
      this._navEventListener.remove();
    }

    navigationButtonPressed({ buttonId }) {
      if (buttonId === 'clear') {
        this.setState({
          filters: this.props.defaultFilterState,
        });
      } else if (buttonId === 'apply') {
        Navigation.pop(this.props.componentId);
      }
    }

    componentDidDisappear() {
      // NOTE: this might apply on push as well as pop, but probably okay.
      this.props.applyFilters(this.state.filters);
    }

    pushFilterView(screenName) {
      const {
        componentId,
        baseQuery,
        defaultFilterState,
      } = this.props;
      Navigation.push(componentId, {
        component: {
          name: screenName,
          passProps: {
            applyFilters: this._updateFilters,
            currentFilters: this.state.filters,
            defaultFilterState,
            baseQuery,
          },
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
        defaultFilterState,
        ...otherProps
      } = this.props;
      const {
        filters,
        width,
      } = this.state;
      return (
        <View style={styles.wrapper}>
          <WrappedComponent
            cards={cards}
            filters={filters}
            defaultFilterState={defaultFilterState}
            width={width}
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
