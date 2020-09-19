import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

const ICON_SIZE = 28;

interface Props {
  label?: string;
  icon?: string;
  setting: string;
  value: boolean;
  onChange: (setting: string, value: boolean) => void;
  style?: ViewStyle;
}

function Label({ label, icon }: { label?: string; icon?: string }) {
  const { colors, typography } = useContext(StyleContext);
  if (icon) {
    return (
      <View style={styles.icon}>
        <ArkhamIcon name={icon} size={ICON_SIZE} color={colors.darkText} />
      </View>
    );
  }
  return (
    <Text style={[typography.text, styles.labelText]}>{ label }</Text>
  );
}

export default function ToggleFilter({ onChange, setting, label, value, icon, style }: Props) {
  const onToggle = () => {
    onChange(setting, !value);
  }
  return (
    <View style={[styles.row, style]}>
      <View style={styles.label}>
        <Label label={label} icon={icon} />
      </View>
      <ArkhamSwitch
        value={value}
        onValueChange={onToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: s + xs,
    paddingBottom: xs,
  },
  icon: {
    width: 28,
  },
  label: {
    paddingLeft: s,
    paddingRight: xs,
  },
  labelText: {
    fontWeight: '400',
    minWidth: 28,
  },
});
