import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { COLORS } from '../../styles/colors';

export default class MenuItem extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    screen: PropTypes.string.isRequired,
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
    } = this.props;

    navigator.push({
      screen,
      title: text,
      navigatorStyle: {
        tabBarHidden: true,
      },
    });
  }

  render() {
    const {
      text,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row}>
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
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 40,
  },
});
