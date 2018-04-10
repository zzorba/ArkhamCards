import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import InvestigatorImage from '../core/InvestigatorImage';

export default class InvestigatorRow extends React.Component {
  static propTypes = {
    investigator: PropTypes.object.isRequired,
    cards: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      onPress,
      investigator,
    } = this.props;
    onPress(investigator);
  }

  render() {
    const {
      cards,
      investigator,
    } = this.props;

    if (!investigator.deck_requirements) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row} >
          <View style={styles.image}>
            <InvestigatorImage card={investigator} />
          </View>
          <View style={styles.titleColumn}>
            <Text style={styles.title}>
              { investigator.name }
            </Text>
            <Text style={styles.text}>
              { `${investigator.deck_requirements.size} Cards` }
            </Text>
            { map(investigator.deck_requirements.card, req => {
              const card = cards[req.code];
              if (!card) {
                return <Text key={req.code}>Unknown card: { req.code }</Text>;
              }
              return (
                <Text key={req.code}>
                  { card.quantity }x { card.name }
                </Text>
              );
            }) }
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    height: 100,
  },
  image: {
    marginLeft: 10,
    marginRight: 8,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  title: {
    fontFamily: 'System',
    fontSize: 22,
  },
});
