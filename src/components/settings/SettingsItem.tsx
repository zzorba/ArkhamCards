import React, { useContext } from 'react';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {
  SettingsButton,
} from '@lib/react-native-settings-components';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  loading?: boolean;
  navigation?: boolean;
  text: string;
  onPress?: () => void;
}
export default function SettingsItem({ loading, navigation, text, onPress }: Props) {
  const dummyOnPress = () => {
    // Ignore me
  };
  const { colors, typography } = useContext(StyleContext);
  if (loading) {
    return (
      <View style={[styles.wrapper, space.paddingXs]}>
        <Text style={[typography.text, space.marginLeftS]}>{ text }</Text>
        <ActivityIndicator
          style={[styles.spinner, space.marginLeftM]}
          color={colors.lightText}
          size="small"
          animating
        />
      </View>
    );

  }
  return (
    <SettingsButton
      onPress={onPress || dummyOnPress}
      title={text}
      titleStyle={{ color: colors.darkText }}
      containerStyle={{
        backgroundColor: colors.background,
        borderColor: colors.divider,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      rightIcon={navigation ? (
        <MaterialCommunityIcons
          size={28}
          color={colors.M}
          name="chevron-right"
        />
      ) : undefined}
      disabled={!onPress}
    />
  );
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
});
