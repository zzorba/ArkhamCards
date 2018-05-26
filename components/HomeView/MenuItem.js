import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { COLORS } from '../../styles/colors';
import ArkhamIcon from '../../assets/ArkhamIcon';

export default class MenuItem extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    screen: PropTypes.string.isRequired,
    icon: PropTypes.string,
    passProps: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    const {
      text,
      navigator,
      screen,
      passProps,
    } = this.props;

    navigator.push({
      screen,
      title: text,
      passProps,
    });
  }

  render() {
    const {
      text,
      icon,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row}>
          { !!icon && (
            <View style={styles.icon}>
              <ArkhamIcon name={icon} size={18} color="#000000" />
            </View>
          ) }
          <Text style={styles.text}>
            { text }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 40,
  },
});
