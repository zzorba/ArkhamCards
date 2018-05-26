import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';

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
      screen: 'CollectionEdit',
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

  render() {
    const {
      investigators,
      in_collection,
    } = this.props;

    const partitionedInvestigators = partition(
      investigators,
      investigator => in_collection[investigator.pack_code]);
    const myInvestigators = partitionedInvestigators[0];
    const otherInvestigators = partitionedInvestigators[1];

    return (
      <ScrollView>
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            My Investigators
          </Text>
        </View>
        { map(myInvestigators, card => this.renderItem(card)) }
        <View style={styles.headerRow}>
          <Text style={styles.header}>
            Other Investigators
          </Text>
          <View style={styles.editCollectionButton}>
            <Button onPress={this._editCollection} text="Edit Collection" />
          </View>
        </View>
        { map(otherInvestigators, card => this.renderItem(card)) }
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
        results.cards.filtered('type_code == "investigator"')
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
    borderBottomWidth: 2,
    height: 50,
  },
  editCollectionButton: {
    marginRight: 10,
  },
});
