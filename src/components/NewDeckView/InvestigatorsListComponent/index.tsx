import React from 'react';
import { filter, forEach, sortBy, throttle } from 'lodash';
import {
  Animated,
  Button,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import InvestigatorSearchBox from './InvestigatorSearchBox';
import InvestigatorRow from './InvestigatorRow';
import InvestigatorSectionHeader from './InvestigatorSectionHeader';
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK, SortType } from 'actions/types';
import { RANDOM_BASIC_WEAKNESS } from 'constants';
import Card, { CardsMap } from 'data/Card';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { searchMatchesText } from 'components/core/searchHelpers';
import ShowNonCollectionFooter, { rowNonCollectionHeight } from 'components/cardlist/CardSearchResultsComponent/ShowNonCollectionFooter';
import { getTabooSet, getPacksInCollection, AppState } from 'reducers';
import typography from 'styles/typography';

const SCROLL_DISTANCE_BUFFER = 50;

interface OwnProps {
  componentId: string;
  sort: SortType;
  onPress: (investigator: Card) => void;
  filterInvestigators?: string[];
}

interface ReduxProps {
  in_collection: { [code: string]: boolean };
  tabooSetId?: number;
}

interface RealmProps {
  investigators: Card[];
  cards: CardsMap;
}

type Props = OwnProps & ReduxProps & RealmProps & DimensionsProps;

interface State {
  showNonCollection: { [key: string]: boolean };
  headerVisible: boolean;
  searchTerm: string;
  scrollY: Animated.Value;
}

interface Section {
  title: string;
  id: string;
  data: Card[];
  nonCollectionCount: number;
}

class InvestigatorsListComponent extends React.Component<Props, State> {
  lastOffsetY: number = 0;

  _navEventListener?: EventSubscription;
  _throttledScroll!: (offset: number) => void;
  _handleScroll!: (...args: any[]) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      showNonCollection: {},
      headerVisible: true,
      searchTerm: '',
      scrollY: new Animated.Value(0),
    };

    this._throttledScroll = throttle(
      this.throttledScroll.bind(this),
      100,
      { trailing: true },
    );
    this._handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      {
        listener: this._onScroll,
      },
    );
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  _handleScrollBeginDrag = () => {
    Keyboard.dismiss();
  };

  _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  };

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  throttledScroll(offsetY: number) {
    if (offsetY <= 0) {
      this.showHeader();
    } else {
      const delta = Math.abs(offsetY - this.lastOffsetY);
      if (delta < SCROLL_DISTANCE_BUFFER) {
        // Not a long enough scroll, don't update scrollY and don't take any
        // action at all.
        return;
      }

      // We have a decent sized scroll so we will make a direction based
      // show/hide decision UNLESS we are near the top/bottom of the content.
      const scrollingUp = offsetY < this.lastOffsetY;

      if (scrollingUp) {
        this.showHeader();
      } else {
        this.hideHeader();
      }
    }

    this.lastOffsetY = offsetY;
  }

  _searchUpdated = (text: string) => {
    this.setState({
      searchTerm: text,
    });
  };

  _onPress = (investigator: Card) => {
    this.props.onPress(investigator);
  };

  _editCollection = () => {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  };

  _showNonCollectionCards = (id: string) => {
    Keyboard.dismiss();
    this.setState({
      showNonCollection: Object.assign(
        {},
        this.state.showNonCollection,
        { [id]: true },
      ),
    });
  };

  _renderItem = ({ item }: { item: Card }) => {
    return (
      <InvestigatorRow
        key={item.code}
        investigator={item}
        cards={this.props.cards}
        onPress={this._onPress}
      />
    );
  };

  static headerForInvestigator(
    investigator: Card,
    sort: SortType
  ): string {
    switch (sort) {
      case SORT_BY_FACTION:
        return investigator.faction_name || t`N/A`;
      case SORT_BY_TITLE:
        return t`All Investigators`;
      case SORT_BY_PACK:
        return investigator.pack_name;
      default:
        return t`N/A`;
    }
  }

  groupedInvestigators(): Section[] {
    const {
      investigators,
      in_collection,
      filterInvestigators = [],
      sort,
    } = this.props;
    const {
      showNonCollection,
      searchTerm,
    } = this.state;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const allInvestigators = sortBy(
      filter(
        investigators,
        i => {
          if (filterInvestigatorsSet.has(i.code)) {
            return false;
          }
          return searchMatchesText(
            searchTerm,
            [i.name, i.faction_name || '', i.traits || '']
          );
        }),
      investigator => {
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
      const header = InvestigatorsListComponent.headerForInvestigator(i, sort);
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
      if (i && i.pack_code && (
        i.pack_code === 'core' || in_collection[i.pack_code])
      ) {
        currentBucket.data.push(i);
      } else {
        nonCollectionCards.push(i);
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

  _renderSectionHeader = ({ section }: { section: SectionListData<Section> }) => {
    return <InvestigatorSectionHeader title={section.title} />;
  };

  _renderSectionFooter = ({ section }: { section: SectionListData<Section> }) => {
    const { fontScale } = this.props;
    const {
      showNonCollection,
    } = this.state;
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <View style={[styles.sectionFooterButton, { height: rowNonCollectionHeight(fontScale) }]}>
          <Button
            title={t`Edit Collection`}
            onPress={this._editCollection}
          />
        </View>
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        title={ngettext(
          msgid`Show ${section.nonCollectionCount} Non-Collection Investigator`,
          `Show ${section.nonCollectionCount} Non-Collection Investigators`,
          section.nonCollectionCount
        )}
        onPress={this._showNonCollectionCards}
        fontScale={fontScale}
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

  renderHeader() {
    return (
      <InvestigatorSearchBox
        value={this.state.searchTerm}
        visible={this.state.headerVisible}
        onChangeText={this._searchUpdated}
      />
    );
  }

  _renderFooter = () => {
    const {
      searchTerm,
    } = this.state;
    if (searchTerm && this.groupedInvestigators().length === 0) {
      return (
        <View style={styles.footer}>
          <Text style={[typography.text, typography.center]}>
            { t`No matching investigators for "${searchTerm}".` }
          </Text>
        </View>
      );
    }
    return <View style={styles.footer} />;
  };

  render() {
    const {
      sort,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <SectionList
          onScroll={this._handleScroll}
          onScrollBeginDrag={this._handleScrollBeginDrag}
          sections={this.groupedInvestigators()}
          renderSectionHeader={this._renderSectionHeader}
          renderSectionFooter={this._renderSectionFooter}
          ListFooterComponent={this._renderFooter}
          renderItem={this._renderItem}
          initialNumToRender={24}
          keyExtractor={this._investigatorToCode}
          stickySectionHeadersEnabled={sort !== SORT_BY_TITLE}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          scrollEventThrottle={1}
        />
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    in_collection: getPacksInCollection(state),
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(connectRealm<OwnProps & ReduxProps, RealmProps, Card>(
  withDimensions(InvestigatorsListComponent),
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps & ReduxProps
    ): RealmProps {
      const investigators: Card[] = [];
      const names: { [name: string]: boolean } = {};
      forEach(
        results.cards.filtered(
          `(type_code == "investigator" AND encounter_code == null) and ${Card.tabooSetQuery(props.tabooSetId)}`)
          .sorted('code', false),
        card => {
          if (!names[card.name]) {
            names[card.name] = true;
            investigators.push(card);
          }
        });

      const cards: CardsMap = {};
      forEach(
        results.cards.filtered(`(has_restrictions == true OR code == "${RANDOM_BASIC_WEAKNESS}") and ${Card.tabooSetQuery(props.tabooSetId)}`),
        card => {
          cards[card.code] = card;
        });
      return {
        investigators,
        cards,
      };
    },
  })
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  footer: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 60,
  },
  sectionFooterButton: {
    margin: 8,
  },
});
