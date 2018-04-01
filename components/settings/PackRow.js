import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements'

import EncounterIcon from '../cards/CardDetailView/EncounterIcon';

export default class PackRow extends React.Component {
  static propTypes = {
    pack: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
    checked: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      pack,
      checked,
      setInCollection,
    } = this.props;
    setInCollection(pack.code, !checked);
  }

  render() {
    const {
      pack,
      checked,
    } = this.props;

    return (
      <View style={styles.row}>
        { (pack.position > 1 && pack.cycle_position < 70) && (
          <Text style={styles.bullet}>•</Text>
        ) }
        <View style={styles.icon}>
          <EncounterIcon
            encounter_code={pack.code}
            size={28}
            color="#000000"
          />
        </View>
        <Text style={styles.title}>{ pack.name }</Text>
        <CheckBox
          checked={checked}
          onPress={this._onPress}
          onIconPress={this._onPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
  },
  bullet: {
    marginLeft: 16,
    marginRight: 8,
    fontSize: 24,
    fontWeight: '900',
  },
  icon: {
    marginLeft: 8,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontFamily: 'System',
    flex: 1,
  },

});
