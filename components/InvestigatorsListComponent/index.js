import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import L from '../../app/i18n';
import Button from '../core/Button';
import InvestigatorRow from './InvestigatorRow';
import * as Actions from '../../actions';
import { getPacksInCollection } from '../../reducers';

class InvestigatorsListComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    investigators: PropTypes.array.isRequired,
    cards: PropTypes.object.isRequired,
    in_collection: PropTypes.object,
    filterInvestigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._editCollection = this.editCollection.bind(this);
  }

  onPress(investigator) {
    this.props.onPress(investigator);
  }

  editCollection() {
    this.props.navigator.push({
      screen: 'My.Collection',
    });
  }

  renderItem(card) {
    return (
      <InvestigatorRow
        key={card.code}
        investigator={card}
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

  render() {
    const {
      investigators,
      in_collection,
      filterInvestigators = [],
    } = this.props;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const partitionedInvestigators = partition(
      filter(investigators, investigator => !filterInvestigatorsSet.has(investigator.code)),
      investigator => in_collection[investigator.pack_code]);
    const myInvestigators = partitionedInvestigators[0];
    const otherInvestigators = partitionedInvestigators[1];

    return (
      <ScrollView>
        { this.renderInvestigators(L('My Investigators'), myInvestigators) }
        <View style={styles.editCollectionButton}>
          <Button onPress={this._editCollection} text={L('Manage Collection')} />
        </View>
        { this.renderInvestigators(L('Other Investigators'), otherInvestigators) }
        <View style={styles.footer} />
      </ScrollView>
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
  editCollectionButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    height: 100,
  },
});
