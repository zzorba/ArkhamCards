import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

import EncounterIcon from '../../assets/EncounterIcon';

export default class PackRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    pack: PropTypes.object,
    setInCollection: PropTypes.func.isRequired,
    checked: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._onCheckPress = this.onCheckPress.bind(this);
  }

  onPress() {
    const {
      pack,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Pack',
      title: pack.name,
      passProps: {
        pack_code: pack.code,
      },
    });
  }

  onCheckPress() {
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
        <TouchableOpacity style={styles.touchable} onPress={this._onPress}>
          <View style={styles.touchableContent}>
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
          </View>
        </TouchableOpacity>
        <View style={styles.checkbox}>
          <CheckBox
            checked={checked}
            onPress={this._onCheckPress}
            onIconPress={this._onPress}
          />
        </View>
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
  touchable: {
    flex: 1,
  },
  touchableContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  checkbox: {
    width: 60,
  },
});
