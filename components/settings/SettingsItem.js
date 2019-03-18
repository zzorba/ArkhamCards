import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {
  SettingsButton,
} from 'react-native-settings-components';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { COLORS } from '../../styles/colors';
import typography from '../../styles/typography';

export default class SettingsItem extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    navigation: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._renderIcon = this.renderIcon.bind(this);
    this._dummyOnPress = this.dummyOnPress.bind(this);
  }

  dummyOnPress() {

  }

  renderIcon() {
    return (
      <MaterialCommunityIcons
        size={28}
        color={COLORS.button}
        name="chevron-right"
      />
    );
  }
  render() {
    const { loading, navigation, text, onPress } = this.props;
    if (loading) {
      return (
        <View style={styles.wrapper}>
          <Text style={[typography.text, styles.text]}>{ text }</Text>
          <ActivityIndicator style={styles.spinner} size="small" animating />
        </View>
      );

    }
    return (
      <SettingsButton
        onPress={onPress || this._dummyOnPress}
        title={text}
        rightIcon={navigation ? this._renderIcon : null}
        disabled={!onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  text: {
    marginLeft: 8,
  },
  spinner: {
    height: 20,
    marginLeft: 16,
  },
});
