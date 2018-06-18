import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import InvestigatorImage from '../core/InvestigatorImage';
import { toRelativeDateString } from '../../lib/datetime';

export default class DeckListItem extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    investigator: PropTypes.object,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      id,
      onPress,
    } = this.props;
    onPress && onPress(id);
  }

  render() {
    const {
      deck,
      investigator,
    } = this.props;
    if (!deck) {
      return (
        <View style={styles.row}>
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#000000"
          />
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row}>
          <View style={styles.image}>
            { !!investigator && <InvestigatorImage card={investigator} /> }
          </View>
          <View style={styles.titleColumn}>
            <Text style={styles.title} numLines={2}>
              { deck.name }
            </Text>
            { !!deck.date_update && (
              <Text style={styles.date} >
                Updated: { toRelativeDateString(Date.parse(deck.date_update)) }
              </Text>
            ) }
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
  loading: {
    marginLeft: 10,
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
