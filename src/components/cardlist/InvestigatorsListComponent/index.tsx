import React from 'react';
import { filter, forEach, map, sortBy } from 'lodash';
import {
  Keyboard,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import BasicButton from '@components/core/BasicButton';
import InvestigatorRow from '@components/core/InvestigatorRow';
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK, SortType } from '@actions/types';
import Card from '@data/Card';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { searchMatchesText } from '@components/core/searchHelpers';
import ShowNonCollectionFooter, { rowNonCollectionHeight } from '@components/cardlist/CardSearchResultsComponent/ShowNonCollectionFooter';
import { getTabooSet, getPacksInCollection, AppState } from '@reducers';
import typography from '@styles/typography';
import space from '@styles/space';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import SearchResultButton from '../SearchResultButton';

interface OwnProps {
  componentId: string;
  hideDeckbuildingRules?: boolean;
  sort: SortType;
  onPress: (investigator: Card) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
}

interface ReduxProps {
  in_collection: { [code: string]: boolean };
  tabooSetId?: number;
}

type Props = OwnProps & ReduxProps & PlayerCardProps & DimensionsProps;

interface State {
  showNonCollection: { [key: string]: boolean };
  headerVisible: boolean;
  searchTerm: string;
}

interface Section extends SectionListData<Card> {
  title: string;
  id: string;
  data: Card[];
  nonCollectionCount: number;
}

class InvestigatorsListComponent extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      showNonCollection: {},
      headerVisible: true,
      searchTerm: '',
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  _handleScrollBeginDrag = () => {
    Keyboard.dismiss();
  };

  _searchUpdated = (text: string) => {
    this.setState({
      searchTerm: text,
    });
  };

  _onPress = (investigator: Card) => {
    this.props.onPress(investigator);
  };

  _editCollection = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  };

  _showNonCollectionCards = (id: string) => {
    Keyboard.dismiss();
    this.setState({
      showNonCollection: {
        ...this.state.showNonCollection,
        [id]: true,
      },
    });
  };

  deckbuildingDetails(investigator: Card) {
    const { cards, hideDeckbuildingRules } = this.props;
    if (hideDeckbuildingRules || !investigator.deck_requirements) {
      return null;
    }
    return (
      <>
        <Text style={typography.text}>
          { t`${investigator.deck_requirements.size} Cards` }
        </Text>
        { map(investigator.deck_requirements.card, req => {
          const card = req.code && cards[req.code];
          if (!card) {
            return (
              <Text key={req.code} style={typography.small}>
                { t`Unknown card: ${req.code}` }
              </Text>
            );
          }
          return (
            <Text key={req.code} style={typography.small}>
              { card.quantity }x { card.name }
            </Text>
          );
        }) }
      </>
    );
  }

  _renderItem = ({ item }: SectionListRenderItemInfo<Card>) => {
    const { hideDeckbuildingRules } = this.props;
    return (
      <InvestigatorRow
        key={item.code}
        investigator={item}
        onPress={this._onPress}
        button={this.deckbuildingDetails(item)}
        bigImage={!hideDeckbuildingRules}
      />
    );
  };

  static headerForInvestigator(
    sort: SortType,
    investigator?: Card
  ): string {
    if (!investigator) {
      return t`N/A`;
    }
    switch (sort) {
      case SORT_BY_FACTION:
        return investigator.faction_name || t`N/A`;
      case SORT_BY_TITLE:
        return t`All Investigators`;
      case SORT_BY_PACK:
        return investigator.pack_name || t`N/A`;
      default:
        return t`N/A`;
    }
  }

  groupedInvestigators(): Section[] {
    const {
      investigators,
      in_collection,
      filterInvestigators = [],
      onlyInvestigators,
      sort,
    } = this.props;
    const {
      showNonCollection,
      searchTerm,
    } = this.state;
    const onlyInvestigatorsSet = onlyInvestigators ? new Set(onlyInvestigators) : undefined;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const allInvestigators = sortBy(
      filter(
        investigators,
        i => {
          if (!i) {
            return false;
          }
          if (i.altArtInvestigator || i.spoiler) {
            return false;
          }
          if (filterInvestigatorsSet.has(i.code)) {
            return false;
          }
          if (onlyInvestigatorsSet && !onlyInvestigatorsSet.has(i.code)) {
            return false;
          }
          return searchMatchesText(
            searchTerm,
            [i.name, i.faction_name || '', i.traits || '']
          );
        }),
      investigator => {
        if (!investigator) {
          return '';
        }
        switch (sort) {
          case SORT_BY_FACTION:
            return investigator.factionCode();
          case SORT_BY_TITLE:
            return investigator.name;
          case SORT_BY_PACK:
          default:
            return investigator.code;
        }
      });

    const results: Section[] = [];
    let nonCollectionCards: Card[] = [];
    let currentBucket: Section | undefined = undefined;
    forEach(allInvestigators, i => {
      const header = InvestigatorsListComponent.headerForInvestigator(sort, i);
      if (!currentBucket || currentBucket.title !== header) {
        if (currentBucket && nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, c => {
              currentBucket && currentBucket.data.push(c);
            });
          }
          currentBucket.nonCollectionCount = nonCollectionCards.length;
          nonCollectionCards = [];
        }
        currentBucket = {
          title: header,
          id: `${sort}-${results.length}`,
          data: [],
          nonCollectionCount: 0,
        };
        results.push(currentBucket);
      }
      if (i) {
        if (i.pack_code && (
          i.pack_code === 'core' || in_collection[i.pack_code])
        ) {
          currentBucket.data.push(i);
        } else {
          nonCollectionCards.push(i);
        }
      }
    });

    // One last snap of the non-collection cards
    if (currentBucket) {
      if (nonCollectionCards.length > 0) {
        // @ts-ignore
        if (showNonCollection[currentBucket.id]) {
          forEach(nonCollectionCards, c => {
            currentBucket && currentBucket.data.push(c);
          });
        }
        // @ts-ignore
        currentBucket.nonCollectionCount = nonCollectionCards.length;
        nonCollectionCards = [];
      }
    }
    return results;
  }

  _renderSectionHeader = ({ section }: { section: SectionListData<Card> }) => {
    return <CardSectionHeader section={{ title: section.title }} />;
  };

  _renderSectionFooter = ({ section }: { section: SectionListData<Card> }) => {
    const { fontScale } = this.context;
    const {
      showNonCollection,
    } = this.state;
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <SearchResultButton
          icon="edit"
          title={t`Edit Collection`}
          onPress={this._editCollection}
        />
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        title={ngettext(
          msgid`Show ${section.nonCollectionCount} non-collection investigator`,
          `Show ${section.nonCollectionCount} non-collection investigators`,
          section.nonCollectionCount
        )}
        onPress={this._showNonCollectionCards}
      />
    );
  };

  _investigatorToCode = (investigator: Card) => {
    return investigator.code;
  };

  showHeader() {
    if (!this.state.headerVisible) {
      this.setState({
        headerVisible: true,
      });
    }
  }

  hideHeader() {
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

  _renderFooter = () => {
    const {
      customFooter,
    } = this.props;
    const {
      searchTerm,
    } = this.state;
    if (searchTerm && this.groupedInvestigators().length === 0) {
      return (
        <>
          { !!customFooter && customFooter }
          <View style={[space.marginS, styles.footer]}>
            <Text style={[typography.text, typography.center]}>
              { t`No matching investigators for "${searchTerm}".` }
            </Text>
          </View>
        </>
      );
    }
    return (
      <>
        { !!customFooter && customFooter }
        <View style={styles.footer} />
      </>
    );
  };

  _renderCustomHeader = (): React.ReactElement | null => {
    const { customHeader } = this.props;
    if (!customHeader) {
      return null;
    }
    return (
      <>
        { customHeader }
      </>
    );
  };

  render() {
    const {
      searchTerm,
    } = this.state;
    return (
      <CollapsibleSearchBox
        prompt={t`Search`}
        searchTerm={searchTerm}
        onSearchChange={this._searchUpdated}
      >
        { onScroll => (
          <SectionList
            contentInset={{ top: SEARCH_BAR_HEIGHT }}
            contentOffset={{ x: 0, y: -SEARCH_BAR_HEIGHT }}
            onScroll={onScroll}
            onScrollBeginDrag={this._handleScrollBeginDrag}
            sections={this.groupedInvestigators()}
            renderSectionHeader={this._renderSectionHeader}
            renderSectionFooter={this._renderSectionFooter}
            ListHeaderComponent={this._renderCustomHeader}
            ListFooterComponent={this._renderFooter}
            renderItem={this._renderItem}
            initialNumToRender={24}
            keyExtractor={this._investigatorToCode}
            stickySectionHeadersEnabled={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            scrollEventThrottle={1}
          />
        ) }
      </CollapsibleSearchBox>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    in_collection: getPacksInCollection(state),
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, unknown, OwnProps, AppState>(
  mapStateToProps
)(
  withPlayerCards<OwnProps & ReduxProps>(
    withDimensions(InvestigatorsListComponent)
  )
);

const styles = StyleSheet.create({
  footer: {
    marginBottom: 60,
  },
});
