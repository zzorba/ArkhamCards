import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import deepDiff from 'deep-diff';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import {
  SORT_BY_ENCOUNTER_SET,
  SortType,
  Slots,
} from 'actions/types';
import CardSearchBox from './CardSearchBox';
import CardResultList from './CardResultList';
import Switch from 'components/core/Switch';
import FilterBuilder, { FilterState } from 'lib/filters';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY, where, combineQueries } from 'data/query';
import Card from 'data/Card';
import typography from 'styles/typography';
import space from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  componentId: string;
  fontScale: number;
  baseQuery?: Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  selectedSort?: SortType;
  filters?: FilterState;
  mythosMode?: boolean;
  visible: boolean;
  toggleMythosMode: () => void;
  clearSearchFilters: () => void;
  tabooSetOverride?: number;

  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  storyOnly?: boolean;

  initialSort?: SortType;
}

interface State {
  headerVisible: boolean;
  searchText: boolean;
  searchFlavor: boolean;
  searchBack: boolean;
  searchTerm: string;
  termQuery: Brackets | undefined;

  baseQuery?: Brackets;
  filters?: FilterState;
  query: Brackets;
  filterQuery: Brackets | undefined;
}

export default class CardSearchResultsComponent extends React.Component<Props, State> {
  static filterBuilder = new FilterBuilder('filters');

  static query({
    baseQuery,
    mythosToggle,
    selectedSort,
    mythosMode,
  }: Props): Brackets {
    const queryParts: Brackets[] = [];
    if (mythosToggle) {
      if (mythosMode) {
        queryParts.push(MYTHOS_CARDS_QUERY);
      } else {
        queryParts.push(PLAYER_CARDS_QUERY);
      }
    }
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    if (selectedSort === SORT_BY_ENCOUNTER_SET) {
      queryParts.push(where(`c.encounter_code is not null OR linked_card.encounter_code is not null`));
    }
    return combineQueries(
      where('c.altArtInvestigator != true AND c.back_linked is null'),
      queryParts,
      'and'
    );
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const {
      baseQuery,
      filters,
    } = props;
    const updatedState: Partial<State> = {};
    if (baseQuery !== state.baseQuery) {
      console.log('RERENDER: baseQuery changed');
      updatedState.baseQuery = baseQuery;
      updatedState.query = CardSearchResultsComponent.query(props);
    }
    if (filters && filters !== state.filters && !!deepDiff(filters, state.filters)) {
      console.log(`RERENDER: filters changed: ${JSON.stringify(state.filters)} vs ${JSON.stringify(filters)}`);
      updatedState.filters = filters;
      updatedState.filterQuery = filters && CardSearchResultsComponent.filterBuilder.filterToQuery(filters);
    }
    return updatedState;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      headerVisible: true,
      searchText: false,
      searchFlavor: false,
      searchBack: false,
      searchTerm: '',
      termQuery: undefined,
      baseQuery: props.baseQuery,
      query: CardSearchResultsComponent.query(props),
      filters: props.filters,
      filterQuery: props.filters && CardSearchResultsComponent.filterBuilder.filterToQuery(props.filters),
    };
  }

  _showHeader = () => {
    if (!this.state.headerVisible) {
      this.setState({
        headerVisible: true,
      });
    }
  };

  _hideHeader = () => {
    const {
      headerVisible,
      searchTerm,
    } = this.state;
    if (headerVisible && searchTerm === '') {
      this.setState({
        headerVisible: false,
      });
    }
  }

  _toggleSearchText = () => {
    this.setState({
      searchText: !this.state.searchText,
    }, this._updateTermQuery);
  };

  _toggleSearchFlavor = () => {
    this.setState({
      searchFlavor: !this.state.searchFlavor,
    }, this._updateTermQuery);
  };

  _toggleSearchBack = () => {
    this.setState({
      searchBack: !this.state.searchBack,
    }, this._updateTermQuery);
  };

  _searchUpdated = (text: string) => {
    this.setState({
      searchTerm: text,
    }, this._updateTermQuery);
  };

  _clearSearchTerm = () => {
    this._searchUpdated('');
  };

  _updateTermQuery = () => {
    const {
      searchTerm,
      searchText,
      searchFlavor,
      searchBack,
    } = this.state;

    if (searchTerm === '') {
      return undefined;
    }
    const parts = searchBack ? [
      'c.name LIKE :searchTerm',
      'linked_card.name LIKE :searchTerm',
      'c.back_name LIKE :searchTerm',
      'linked_card.back_name LIKE :searchTerm',
      'c.subname LIKE :searchTerm',
      'linked_card.subname LIKE :searchTerm',
    ] : [
      'c.renderName LIKE :searchTerm',
      'c.renderSubname LIKE :searchTerm',
    ];
    if (searchText) {
      parts.push('c.real_text LIKE :searchTerm');
      parts.push('linked_card.real_text LIKE :searchTerm');
      parts.push('c.traits LIKE :searchTerm');
      parts.push('linked_card.traits LIKE :searchTerm');
      if (searchBack) {
        parts.push('c.back_text LIKE :searchTerm');
        parts.push('linked_card.back_text LIKE :searchTerm');
      }
    }

    if (searchFlavor) {
      parts.push('c.flavor LIKE :searchTerm');
      parts.push('linked_card.flavor LIKE :searchTerm');
      if (searchBack) {
        parts.push('c.back_flavor LIKE :searchTerm');
        parts.push('linked_card.back_flavor LIKE :searchTerm');
      }
    }
    const lang = 'en';
    this.setState({
      termQuery: where(
        parts.join(' OR '),
        {
          searchTerm: `%${searchTerm
            .replace(/[\u2018\u2019]/g, '\'')
            .replace(/[\u201C\u201D]/g, '"')
            .toLocaleUpperCase(lang)}%`,
        },
      ),
    });
  };

  renderHeader() {
    const {
      searchText,
      searchFlavor,
      searchBack,
      searchTerm,
    } = this.state;
    return (
      <CardSearchBox
        value={searchTerm}
        visible={this.state.headerVisible}
        onChangeText={this._searchUpdated}
        searchText={searchText}
        searchFlavor={searchFlavor}
        searchBack={searchBack}
        toggleSearchText={this._toggleSearchText}
        toggleSearchFlavor={this._toggleSearchFlavor}
        toggleSearchBack={this._toggleSearchBack}
      />
    );
  }

  renderExpandModesButtons() {
    const {
      mythosToggle,
      toggleMythosMode,
      clearSearchFilters,
      mythosMode,
    } = this.props;
    const hasFilters = !!this.state.filterQuery;
    if (!mythosToggle && !hasFilters) {
      return null;
    }
    return (
      <View>
        { !!mythosToggle && (
          <BasicButton
            onPress={toggleMythosMode}
            title={mythosMode ? t`Search Player Cards` : t`Search Encounter Cards`}
          />
        ) }
        { !!hasFilters && (
          <BasicButton
            onPress={clearSearchFilters}
            title={t`Clear Search Filters`}
          />
        ) }
      </View>
    );
  }

  renderExpandSearchButtons() {
    const {
      searchTerm,
      searchText,
      searchBack,
    } = this.state;
    if (!searchTerm) {
      return this.renderExpandModesButtons();
    }
    return (
      <View>
        { !!searchTerm && (
          <BasicButton
            onPress={this._clearSearchTerm}
            title={t`Clear "${searchTerm}" search`}
          />
        ) }
        { !searchText && (
          <View style={[styles.toggle, space.marginS]}>
            <Text style={[typography.text, styles.toggleText]}>
              { t`Search Game Text` }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchText} />
          </View>
        ) }
        { !searchBack && (
          <View style={[styles.toggle, space.marginS]}>
            <Text style={[typography.text, styles.toggleText]}>
              { t`Search Card Backs` }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchBack} />
          </View>
        ) }
        { this.renderExpandModesButtons() }
      </View>
    );
  }

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      renderFooter,
      showNonCollection,
      selectedSort,
      visible,
      tabooSetOverride,
      investigator,
      storyOnly,
      fontScale,
      initialSort,
      mythosToggle,
    } = this.props;
    const {
      searchTerm,
      query,
      filterQuery,
      termQuery,
    } = this.state;
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <View style={styles.container}>
          <CardResultList
            componentId={componentId}
            fontScale={fontScale}
            tabooSetOverride={tabooSetOverride}
            query={query}
            filterQuery={filterQuery}
            termQuery={termQuery}
            searchTerm={searchTerm}
            sort={selectedSort}
            investigator={investigator}
            originalDeckSlots={originalDeckSlots}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={onDeckCountChange}
            limits={limits}
            showHeader={this._showHeader}
            hideHeader={this._hideHeader}
            expandSearchControls={this.renderExpandSearchButtons()}
            visible={visible}
            renderFooter={renderFooter}
            showNonCollection={showNonCollection}
            storyOnly={storyOnly}
            mythosToggle={mythosToggle}
            initialSort={initialSort}
          />
        </View>
        { !!renderFooter && <View style={[
          styles.footer,
        ]}>{ renderFooter() }</View> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: COLORS.backgroundColor,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    minWidth: '60%',
  },
});
