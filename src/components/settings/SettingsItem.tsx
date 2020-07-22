import React from 'react';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {
  SettingsButton,
} from 'react-native-settings-components';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import COLORS from '@styles/colors';
import typography from '@styles/typography';
import space from '@styles/space';

interface Props {
  loading?: boolean;
  navigation?: boolean;
  text: string;
  onPress?: () => void;
}
export default class SettingsItem extends React.Component<Props> {
  _dummyOnPress = () => {};

  _renderIcon = () => {
    return (
      <MaterialCommunityIcons
        size={28}
        color={COLORS.button}
        name="chevron-right"
      />
    );
  };

  render() {
    const { loading, navigation, text, onPress } = this.props;
    if (loading) {
      return (
        <View style={[styles.wrapper, space.paddingXs]}>
          <Text style={[typography.text, space.marginLeftS]}>{ text }</Text>
          <ActivityIndicator
            style={[styles.spinner, space.marginLeftM]}
            size="small"
            animating
          />
        </View>
      );

    }
    return (
      <SettingsButton
        onPress={onPress || this._dummyOnPress}
        title={text}
        titleStyle={{ color: COLORS.darkText }}
        containerStyle={styles.categoryContainer}
        rightIcon={navigation ? this._renderIcon : undefined}
        disabled={!onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  spinner: {
    height: 20,
  },
  categoryContainer: {
    backgroundColor: COLORS.background,
  },
});
