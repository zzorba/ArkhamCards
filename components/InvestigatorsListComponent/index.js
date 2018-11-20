import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, sortBy, throttle } from 'lodash';
import {
  Animated,
  Button,
  Keyboard,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { searchMatchesText } from '../searchHelpers';
import InvestigatorSearchBox from './InvestigatorSearchBox';
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK } from '../CardSortDialog/constants';
import ShowNonCollectionFooter from '../CardSearchComponent/ShowNonCollectionFooter';
import InvestigatorRow from './InvestigatorRow';
import InvestigatorSectionHeader from './InvestigatorSectionHeader';
import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';
import typography from '../../styles/typography';

const SCROLL_DISTANCE_BUFFER = 50;

class InvestigatorsListComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    investigators: PropTypes.array.isRequired,
    sort: PropTypes.string.isRequired,
    cards: PropTypes.object.isRequired,
    in_collection: PropTypes.object,
    filterInvestigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      showNonCollection: {},
      headerVisible: true,
      searchTerm: '',
      scrollY: new Animated.Value(0),
    };

    this.lastOffsetY = 0;
    this._handleScrollBeginDrag = this.handleScrollBeginDrag.bind(this);
    this._onScroll = this.onScroll.bind(this);
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
    this._searchUpdated = this.searchUpdated.bind(this);
    this._showNonCollectionCards = this.showNonCollectionCards.bind(this);
    this._investigatorToCode = this.investigatorToCode.bind(this);
    this._renderSectionHeader = this.renderSectionHeader.bind(this);
    this._renderSectionFooter = this.renderSectionFooter.bind(this);
    this._renderItem = this.renderItem.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
    this._onPress = this.onPress.bind(this);
    this._editCollection = this.editCollection.bind(this);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  handleScrollBeginDrag() {
    Keyboard.dismiss();
  }

  onScroll(event) {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  }

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  throttledScroll(offsetY) {
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

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
  }

  onPress(investigator) {
    this.props.onPress(investigator);
  }

  editCollection() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }

  showNonCollectionCards(id) {
    Keyboard.dismiss();
    this.setState({
      showNonCollection: Object.assign(
        {},
        this.state.showNonCollection,
        { [id]: true },
      ),
    });
  }

  renderItem({ item }) {
    return (
      <InvestigatorRow
        key={item.code}
        investigator={item}
        cards={this.props.cards}
        onPress={this._onPress}
      />
    );
  }

  renderInvestigators(header, investigators) {
    if (investigators.length === 0) {
      return null;
    }
    return (
      <View>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            { header }
          </Text>
        </View>
        { map(investigators, card => this.renderItem(card)) }
      </View>
    );
  }

  static headerForInvestigator(investigator, sort) {
    switch (sort) {
      case SORT_BY_FACTION:
        return investigator.faction_name;
      case SORT_BY_TITLE:
        return L('All Investigators');
      case SORT_BY_PACK:
        return investigator.pack_name;
      default:
        return L('N/A');
    }
  }

  groupedInvestigators() {
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
          return searchMatchesText(searchTerm, [i.name, i.faction_name, i.traits]);
        }),
      investigator => {
        switch (sort) {
          case SORT_BY_FACTION:
            return investigator.faction_code;
          case SORT_BY_TITLE:
            return investigator.name;
          case SORT_BY_PACK:
          default:
            return investigator.code;
        }
      });

    const results = [];
    let nonCollectionCards = [];
    let currentBucket = null;
    forEach(allInvestigators, i => {
      const header = InvestigatorsListComponent.headerForInvestigator(i, sort);
      if (!currentBucket || currentBucket.title !== header) {
        if (nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, c => currentBucket.data.push(c));
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
    if (nonCollectionCards.length > 0) {
      if (showNonCollection[currentBucket.id]) {
        forEach(nonCollectionCards, c => currentBucket.data.push(c));
      }
      currentBucket.nonCollectionCount = nonCollectionCards.length;
      nonCollectionCards = [];
    }
    return results;
  }

  renderSectionHeader({ section }) {
    return <InvestigatorSectionHeader title={section.title} />;
  }


  renderSectionFooter({ section }) {
    const {
      showNonCollection,
    } = this.state;
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <Button
          style={styles.sectionFooterButton}
          title={L('Edit Collection')}
          onPress={this._editCollection}
        />
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        title={L('Show {{count}} Non-Collection Investigators', { count: section.nonCollectionCount })}
        onPress={this._showNonCollectionCards}
      />
    );
  }

  investigatorToCode(investigator) {
    return investigator.code;
  }

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
        visible={this.state.headerVisible}
        onChangeText={this._searchUpdated}
      />
    );
  }

  renderFooter() {
    const {
      searchTerm,
    } = this.state;
    if (searchTerm && this.groupedInvestigators().length === 0) {
      return (
        <View style={styles.footer}>
          <Text style={[typography.text, typography.center]}>
            { L('No matching investigators for "{{searchTerm}}".', { searchTerm }) }
          </Text>
        </View>
      );
    }
    return <View style={styles.footer} />;
  }

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

function mapStateToProps(state) {
  return {
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(InvestigatorsListComponent),
  {
    schemas: ['Card'],
    mapToProps(results) {
      const investigators = [];
      const names = {};
      forEach(
        results.cards.filtered('type_code == "investigator" AND encounter_code == null')
          .sorted('code', false),
        card => {
          if (!names[card.name]) {
            names[card.name] = true;
            investigators.push(card);
          }
        });

      const cards = {};
      forEach(
        results.cards.filtered('has_restrictions == true OR code == "01000"'),
        card => {
          cards[card.code] = card;
        });
      return {
        investigators,
        cards,
      };
    },
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    fontFamily: 'System',
    fontSize: 22,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    height: 50,
  },
  footer: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 60,
  },
});
