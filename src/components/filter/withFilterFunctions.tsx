import React from 'react';
import { InteractionManager } from 'react-native';
import { forEach, pick } from 'lodash';
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

import DbRender from 'components/data/DbRender';
import Database from 'data/Database';
import { toggleFilter, updateFilter, clearFilters } from './actions';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import Card from 'data/Card';
import COLORS from 'styles/colors';
import { filterToQuery, FilterState } from 'lib/filters';
import { NavigationProps } from 'components/nav/types';
import { getFilterState, getDefaultFilterState, AppState } from 'reducers';

export interface FilterProps {
  componentId: string;
  filters: FilterState;
  defaultFilterState: FilterState;
  width: number;
  fontScale: number;
  pushFilterView: (screen: string) => void;
  onToggleChange: (setting: string, value: boolean) => void;
  onFilterChange: (setting: string, value: any) => void;
}

export interface FilterFunctionProps {
  filterId: string;
  tabooSetId?: number;
  modal?: boolean;
  baseQuery?: string;
}

interface Options {
  title: string;
  clearTraits?: string[];
}

export default function withFilterFunctions<P>(
  WrappedComponent: React.ComponentType<P & FilterProps>,
  {
    title,
    clearTraits,
  }: Options
): React.ComponentType<NavigationProps & FilterFunctionProps & P> {
  interface ReduxProps {
    currentFilters: FilterState;
    defaultFilterState: FilterState;
  }

  interface ReduxActionProps {
    toggleFilter: (id: string, key: keyof FilterState, value: boolean) => void;
    updateFilter: (id: string, key: keyof FilterState, value: any) => void;
    clearFilters: (id: string, clearTraits?: string[]) => void;
  }

  type Props = NavigationProps & DimensionsProps & FilterFunctionProps & ReduxProps & ReduxActionProps & P;

  class WrappedFilterComponent extends React.Component<Props> {
    _navEventListener?: EventSubscription;

    componentDidMount() {
      this._navEventListener = Navigation.events().bindComponent(this);
    }

    componentWillUnmount() {
      this._navEventListener && this._navEventListener.remove();
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
      Navigation.push<FilterFunctionProps>(componentId, {
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

    dataId() {
      const {
        baseQuery,
        tabooSetId,
        currentFilters,
      } = this.props;
      return JSON.stringify({
        baseQuery,
        tabooSetId,
        currentFilters,
      });
    }

    async updateCount(db: Database) {
      const {
        baseQuery,
        componentId,
        tabooSetId,
        currentFilters,
      } = this.props;
      let cardsQuery = await db.cardsQuery();
      cardsQuery = cardsQuery
        .where(Card.tabooSetQuery(tabooSetId));
      if (baseQuery) {
        cardsQuery = cardsQuery.andWhere(`(${baseQuery})`);
      }
      const filterParts = filterToQuery(currentFilters);
      if (filterParts.length) {
        forEach(filterToQuery(currentFilters), ({ query, params }) => {
          cardsQuery = cardsQuery.andWhere(query, params);
        });
      }
      const count = await cardsQuery.getCount();
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: this.hasChanges() ?
            [{
              text: t`Clear`,
              id: 'clear',
              color: COLORS.navButton,
              testID: t`Clear`,
            }] : [],
          title: {
            text: title,
            color: COLORS.navButton,
          },
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
    }

    _getData = async (db: Database): Promise<void> => {
      InteractionManager.runAfterInteractions(() => this.updateCount(db));
    };

    _renderData = () => {
      const {
        componentId,
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
    };

    render() {
      return (
        <DbRender getData={this._getData} id={this.dataId()}>
          { this._renderData }
        </DbRender>
      );
    }
  }

  const mapStateToProps = (
    state: AppState,
    props: NavigationProps & FilterFunctionProps & P
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

  const result = connect<ReduxProps, ReduxActionProps, NavigationProps & FilterFunctionProps & P, AppState>(
    mapStateToProps,
    mapDispatchToProps,
  )(
    // @ts-ignore
    withDimensions(WrappedFilterComponent)
  );
  hoistNonReactStatic(result, WrappedComponent);

  return result as React.ComponentType<NavigationProps & FilterFunctionProps & P>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
});
