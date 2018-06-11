import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';

import EncounterIcon from '../../assets/EncounterIcon';

export default class PackRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    pack: PropTypes.object,
    setChecked: PropTypes.func,
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
      setChecked,
    } = this.props;
    setChecked && setChecked(pack.code, !checked);
  }

  render() {
    const {
      pack,
      checked,
      setChecked,
    } = this.props;

    const mythosPack = (pack.position > 1 && pack.cycle_position < 70);
    const backgroundColor = mythosPack ? '#FFFFFF' : '#f0f0f0';
    const textColor = mythosPack ? '#222222' : '#222222';
    const iconSize = mythosPack ? 24 : 28;
    const fontSize = mythosPack ? 16 : 24;
    const rowHeight = mythosPack ? 50 : 60;
    return (
      <View style={[styles.row, { backgroundColor, height: rowHeight }]}>
        <TouchableOpacity style={styles.touchable} onPress={this._onPress}>
          <View style={styles.touchableContent}>
            <View style={styles.icon}>
              <EncounterIcon
                encounter_code={pack.code}
                size={iconSize}
                color="#000000"
              />
            </View>
            <Text style={[styles.title, { color: textColor, fontSize }]}>{ pack.name }</Text>
          </View>
        </TouchableOpacity>
        { !!setChecked && (
          <View style={[styles.checkbox, { height: rowHeight }]}>
            <Switch
              value={checked}
              onValueChange={this._onCheckPress}
              onTintColor="#222222"
            />
          </View>
        ) }
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});
