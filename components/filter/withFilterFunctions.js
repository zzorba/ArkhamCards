import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { connectRealm } from 'react-native-realm';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation } from 'react-native-navigation';
import deepDiff from 'deep-diff';

import L from '../../app/i18n';
import { COLORS } from '../../styles/colors';
import FilterFooterComponent from './FilterFooterComponent';

export default function withFilterFunctions(WrappedComponent, clearTraits) {
  class WrappedFilterComponent extends React.Component {
    static propTypes = {
      componentId: PropTypes.string.isRequired,
      currentFilters: PropTypes.object.isRequired,
      defaultFilterState: PropTypes.object.isRequired,
      applyFilters: PropTypes.func.isRequired,
      modal: PropTypes.bool,
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
      this._syncState = this.syncState.bind(this);
      this._navEventListener = Navigation.events().bindComponent(this);

      this.syncState();
    }

    componentWillUnmount() {
      this._navEventListener.remove();
    }

    hasChanges() {
      const {
        defaultFilterState,
      } = this.props;
      const {
        filters,
      } = this.state;
      const differences = (clearTraits && clearTraits.length) ?
        deepDiff(pick(filters, clearTraits), pick(defaultFilterState, clearTraits)) :
        deepDiff(filters, defaultFilterState);
      return differences && differences.length;
    }

    syncState() {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: this.hasChanges() ?
            [{
              text: L('Clear'),
              id: 'clear',
              color: COLORS.navButton,
            }] : [],
        },
      });
    }

    navigationButtonPressed({ buttonId }) {
      const {
        defaultFilterState,
      } = this.props;
      if (buttonId === 'clear') {
        const filters = clearTraits && clearTraits.length ?
          Object.assign({}, this.state.filters, pick(defaultFilterState, clearTraits)) :
          defaultFilterState;
        this.setState({
          filters,
        }, this._syncState);
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
        modal,
      } = this.props;
      Navigation.push(componentId, {
        component: {
          name: screenName,
          passProps: {
            applyFilters: this._updateFilters,
            currentFilters: this.state.filters,
            defaultFilterState,
            baseQuery,
            modal,
          },
        },
      });
    }

    updateFilters(filters) {
      this.setState({
        filters,
      }, this._syncState);
    }

    onToggleChange(key) {
      this.setState(state => {
        return {
          filters: Object.assign({}, state.filters, { [key]: !state.filters[key] }),
        };
      }, this._syncState);
    }

    onFilterChange(key, selection) {
      this.setState(state => {
        return {
          filters: Object.assign({}, state.filters, { [key]: selection }),
        };
      }, this._syncState);
    }

    render() {
      const {
        cards,
        baseQuery,
        defaultFilterState,
        modal,
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
          <FilterFooterComponent
            baseQuery={baseQuery}
            filters={filters}
            modal={modal}
          />
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
