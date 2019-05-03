import React from 'react';
import { pick } from 'lodash';
import Realm, { Results } from 'realm';
import { connectRealm, CardResults } from 'react-native-realm';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation, EventSubscription } from 'react-native-navigation';
import deepDiff from 'deep-diff';

import { t } from 'ttag';
import Card from '../../data/Card';
import { COLORS } from '../../styles/colors';
import { FilterState } from '../../lib/filters';
import { NavigationProps } from '../types';
import FilterFooterComponent from './FilterFooterComponent';

export interface FilterProps {
  componentId: string;
  cards: Results<Card>;
  filters: FilterState;
  defaultFilterState: FilterState;
  width: number;
  pushFilterView: (screen: string) => void;
  onToggleChange: (setting: string) => void;
  onFilterChange: (setting: string, value: any) => void;
}

export interface CardFilterProps {
  currentFilters: FilterState;
  applyFilters: (filters: FilterState) => void;
  defaultFilterState: FilterState;
  modal?: boolean;
  baseQuery?: string;
}

export default function withFilterFunctions<P>(
  WrappedComponent: React.ComponentType<P & FilterProps>,
  clearTraits?: string[]
): React.ComponentType<NavigationProps & CardFilterProps & P> {
  interface RealmProps {
    cards: Results<Card>;
  }
  interface State {
    filters: FilterState;
  }
  type Props = NavigationProps & CardFilterProps & RealmProps & P;
  class WrappedFilterComponent extends React.Component<Props, State> {
    _navEventListener: EventSubscription;
    constructor(props: Props) {
      super(props);

      this.state = {
        filters: props.currentFilters,
      };

      this._navEventListener = Navigation.events().bindComponent(this);

      this._syncState();
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
        deepDiff(
          pick(filters, clearTraits),
          pick(defaultFilterState, clearTraits)
        ) :
        deepDiff(filters, defaultFilterState);
      return differences && differences.length;
    }

    _syncState = () => {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: this.hasChanges() ?
            [{
              text: t`Clear`,
              id: 'clear',
              color: COLORS.navButton,
            }] : [],
        },
      });
    };

    navigationButtonPressed({ buttonId }: { buttonId: string }) {
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

    _pushFilterView = (screenName: string) => {
      const {
        componentId,
        baseQuery,
        defaultFilterState,
        modal,
      } = this.props;
      Navigation.push<CardFilterProps>(componentId, {
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
    };

    _updateFilters = (filters: FilterState) => {
      this.setState({
        filters,
      }, this._syncState);
    };

    _onToggleChange = (key: string) => {
      this.setState(state => {
        return {
          filters: Object.assign({}, state.filters, { [key]: !state.filters[key] }),
        };
      }, this._syncState);
    };

    _onFilterChange = (key: string, selection: any) => {
      this.setState(state => {
        return {
          filters: Object.assign({}, state.filters, { [key]: selection }),
        };
      }, this._syncState);
    };

    render() {
      const {
        componentId,
        cards,
        baseQuery,
        defaultFilterState,
        modal,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        applyFilters,
        ...otherProps
      } = this.props;
      const {
        filters,
      } = this.state;

      const {
        width,
      } = Dimensions.get('window');
      return (
        <View style={styles.wrapper}>
          <WrappedComponent
            componentId={componentId}
            cards={cards}
            filters={filters}
            defaultFilterState={defaultFilterState}
            width={width}
            pushFilterView={this._pushFilterView}
            onToggleChange={this._onToggleChange}
            onFilterChange={this._onFilterChange}
            {...otherProps as P}
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

  const result = connectRealm<NavigationProps & CardFilterProps & P, RealmProps, Card>(
    WrappedFilterComponent, {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: NavigationProps & CardFilterProps
      ): RealmProps {
        return {
          cards: props.baseQuery ?
            results.cards.filtered(props.baseQuery) :
            results.cards,
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
