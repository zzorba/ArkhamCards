import React from 'react';
import { pick } from 'lodash';
import Realm, { Results } from 'realm';
import { connectRealm, CardResults } from 'react-native-realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation, EventSubscription } from 'react-native-navigation';
import deepDiff from 'deep-diff';
import { t, ngettext, msgid } from 'ttag';

import { toggleFilter, updateFilter, clearFilters } from './actions';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import Card from 'data/Card';
import { COLORS } from 'styles/colors';
import { filterToQuery, FilterState } from 'lib/filters';
import { NavigationProps } from 'components/nav/types';
import { getFilterState, getDefaultFilterState, AppState } from 'reducers';

export interface FilterProps {
  componentId: string;
  cards: Results<Card>;
  filters: FilterState;
  defaultFilterState: FilterState;
  width: number;
  fontScale: number;
  pushFilterView: (screen: string) => void;
  onToggleChange: (setting: string, value: boolean) => void;
  onFilterChange: (setting: string, value: any) => void;
}

export interface CardFilterProps {
  filterId: string;
  tabooSetId?: number;
  modal?: boolean;
  baseQuery?: string;
}

export default function withFilterFunctions<P>(
  WrappedComponent: React.ComponentType<P & FilterProps>,
  title: string,
  clearTraits?: string[]
): React.ComponentType<NavigationProps & CardFilterProps & P> {
  interface RealmProps {
    cards: Results<Card>;
  }

  interface ReduxProps {
    currentFilters: FilterState;
    defaultFilterState: FilterState;
  }

  interface ReduxActionProps {
    toggleFilter: (id: string, key: keyof FilterState, value: boolean) => void;
    updateFilter: (id: string, key: keyof FilterState, value: any) => void;
    clearFilters: (id: string, clearTraits?: string[]) => void;
  }

  type Props = NavigationProps & DimensionsProps & CardFilterProps & RealmProps & ReduxProps & ReduxActionProps & P;

  class WrappedFilterComponent extends React.Component<Props> {
    _navEventListener?: EventSubscription;

    componentDidMount() {
      this._syncState();
      this._navEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
      this._navEventListener && this._navEventListener.remove();
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.currentFilters !== this.props.currentFilters) {
        this._syncState();
      }
    }

    hasChanges() {
      const {
        defaultFilterState,
        currentFilters,
      } = this.props;
      const differences = (clearTraits && clearTraits.length) ?
        deepDiff(
          pick(currentFilters, clearTraits),
          pick(defaultFilterState, clearTraits)
        ) :
        deepDiff(currentFilters, defaultFilterState);
      return differences && differences.length;
    }

    cardCount() {
      const {
        cards,
        currentFilters,
      } = this.props;
      const query = filterToQuery(currentFilters).join(' and ');
      if (query) {
        return cards.filtered(query).length;
      }
      return cards.length;
    }

    _syncState = () => {
      const count = this.cardCount();
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: this.hasChanges() ?
            [{
              text: t`Clear`,
              id: 'clear',
              color: COLORS.navButton,
              testID: t`Clear`,
            }] : [],
          subtitle: {
            text: ngettext(
              msgid`${count} Card`,
              `${count} Cards`,
              count
            ),
            color: COLORS.navButton,
          },
        },
      });
    };

    navigationButtonPressed({ buttonId }: { buttonId: string }) {
      const {
        clearFilters,
        filterId,
      } = this.props;
      if (buttonId === 'clear') {
        clearFilters(filterId, clearTraits);
      } else if (buttonId === 'apply') {
        Navigation.pop(this.props.componentId);
      }
    }

    _pushFilterView = (screenName: string) => {
      const {
        componentId,
        filterId,
        tabooSetId,
        baseQuery,
        modal,
      } = this.props;
      Navigation.push<CardFilterProps>(componentId, {
        component: {
          name: screenName,
          passProps: {
            filterId,
            tabooSetId,
            baseQuery,
            modal,
          },
        },
      });
    };

    _onToggleChange = (key: string, value: boolean) => {
      const {
        filterId,
        toggleFilter,
      } = this.props;
      toggleFilter(filterId, key, value);
    };

    _onFilterChange = (key: string, selection: any) => {
      const {
        filterId,
        updateFilter,
      } = this.props;
      updateFilter(filterId, key, selection);
    };

    render() {
      const {
        componentId,
        cards,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        baseQuery,
        defaultFilterState,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        modal,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        filterId,
        width,
        fontScale,
        currentFilters,
        ...otherProps
      } = this.props;
      if (!currentFilters) {
        return null;
      }
      return (
        <View style={styles.wrapper}>
          <WrappedComponent
            componentId={componentId}
            cards={cards}
            filters={currentFilters}
            defaultFilterState={defaultFilterState}
            width={width}
            fontScale={fontScale}
            pushFilterView={this._pushFilterView}
            onToggleChange={this._onToggleChange}
            onFilterChange={this._onFilterChange}
            {...otherProps as P}
          />
        </View>
      );
    }
  }

  const mapStateToProps = (
    state: AppState,
    props: NavigationProps & CardFilterProps & P
  ): ReduxProps => {
    return {
      currentFilters: getFilterState(state, props.filterId),
      defaultFilterState: getDefaultFilterState(state, props.filterId),
    };
  };

  const mapDispatchToProps = (
    dispatch: Dispatch<Action>
  ): ReduxActionProps => {
    return bindActionCreators({
      toggleFilter,
      updateFilter,
      clearFilters,
    }, dispatch);
  };

  const result = connect<ReduxProps, {}, NavigationProps & CardFilterProps & P, AppState>(
    mapStateToProps,
    mapDispatchToProps,
  )(
    // @ts-ignore TS2345
    connectRealm<NavigationProps & CardFilterProps & P & ReduxProps & ReduxActionProps, RealmProps, Card>(
      withDimensions(WrappedFilterComponent), {
        schemas: ['Card'],
        mapToProps(
          results: CardResults<Card>,
          realm: Realm,
          props: NavigationProps & CardFilterProps & P & ReduxProps
        ): RealmProps {
          return {
            cards: props.baseQuery ?
              results.cards.filtered(`((${props.baseQuery}) and (${Card.tabooSetQuery(props.tabooSetId)}))`) :
              results.cards.filtered(Card.tabooSetQuery(props.tabooSetId)),
          };
        },
      })
  );

  hoistNonReactStatic(result, WrappedComponent);

  return result as React.ComponentType<NavigationProps & CardFilterProps & P>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
