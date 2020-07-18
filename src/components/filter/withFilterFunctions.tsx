import React from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { pick } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Navigation, EventSubscription } from 'react-native-navigation';
import deepDiff from 'deep-diff';
import { Brackets } from 'typeorm/browser';
import { t, ngettext, msgid } from 'ttag';

import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { toggleFilter, updateFilter, clearFilters } from './actions';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import COLORS from '@styles/colors';
import FilterBuilder, { FilterState } from '@lib/filters';
import { NavigationProps } from '@components/nav/types';
import { getFilterState, getDefaultFilterState, AppState } from '@reducers';
import { combineQueriesOpt } from '@data/query';

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
  baseQuery?: Brackets;
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
    currentFilters?: FilterState;
    defaultFilterState?: FilterState;
  }

  interface ReduxActionProps {
    toggleFilter: (id: string, key: keyof FilterState, value: boolean) => void;
    updateFilter: (id: string, key: keyof FilterState, value: any) => void;
    clearFilters: (id: string, clearTraits?: string[]) => void;
  }

  type Props = NavigationProps & DimensionsProps & FilterFunctionProps & ReduxProps & ReduxActionProps & P;

  class WrappedFilterComponent extends React.Component<Props> {
    static contextType = DatabaseContext;
    context!: DatabaseContextType;
    _navEventListener?: EventSubscription;

    constructor(props: Props) {
      super(props);

      InteractionManager.runAfterInteractions(() => this.updateCount(this.context.db));
    }

    componentDidUpdate(prevProps: Props) {
      if (
        prevProps.currentFilters !== this.props.currentFilters ||
        prevProps.baseQuery !== this.props.baseQuery
      ) {
        this.updateCount(this.context.db);
      }
    }

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

    async updateCount(db: Database) {
      const {
        baseQuery,
        componentId,
        tabooSetId,
        currentFilters,
      } = this.props;
      const filterParts: Brackets | undefined =
        currentFilters && new FilterBuilder('filters').filterToQuery(currentFilters as FilterState);
      const count = await db.getCardCount(
        combineQueriesOpt(
          [
            ...(baseQuery ? [baseQuery as Brackets] : []),
            ...(filterParts ? [filterParts] : []),
          ],
          'and'
        ),
        tabooSetId
      );
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

    render() {
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
      if (!defaultFilterState) {
        return null;
      }
      return (
        <View style={styles.wrapper}>
          <WrappedComponent
            componentId={componentId}
            filters={(currentFilters || defaultFilterState) as FilterState}
            defaultFilterState={defaultFilterState as FilterState}
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
    backgroundColor: COLORS.background,
  },
});
