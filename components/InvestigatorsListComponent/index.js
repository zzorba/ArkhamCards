import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, sortBy } from 'lodash';
import {
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
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK } from '../CardSortDialog/constants';
import ShowNonCollectionFooter from '../CardSearchComponent/ShowNonCollectionFooter';
import InvestigatorRow from './InvestigatorRow';
import InvestigatorSectionHeader from './InvestigatorSectionHeader';
import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';

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
    };

    this._showNonCollectionCards = this.showNonCollectionCards.bind(this);
    this._investigatorToCode = this.investigatorToCode.bind(this);
    this._renderSectionHeader = this.renderSectionHeader.bind(this);
    this._renderSectionFooter = this.renderSectionFooter.bind(this);
    this._renderItem = this.renderItem.bind(this);
    this._onPress = this.onPress.bind(this);
    this._editCollection = this.editCollection.bind(this);
    this._navEventListener = Navigation.events().bindComponent(this);
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
    } = this.state;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const allInvestigators = sortBy(
      filter(
        investigators,
        i => !filterInvestigatorsSet.has(i.code)),
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

  render() {
    const {
      sort,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <SectionList
          onScroll={this._handleScroll}
          onScrollBeginDrag={this._handleScrollBeginDrag}
          sections={this.groupedInvestigators()}
          renderSectionHeader={this._renderSectionHeader}
          renderSectionFooter={this._renderSectionFooter}
          renderItem={this._renderItem}
          initialNumToRender={12}
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
    height: 60,
  },
});
