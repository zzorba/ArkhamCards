import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import TextBoxButton from './TextBoxButton';
import typography from '@styles/typography';
import COLORS from '@styles/colors';

interface Props {
  label: string;
  onPress: () => void;
  value: string;
  placeholder?: string;
  style?: ViewStyle;
  column?: boolean;
  required?: boolean;
}

export default function LabeledTextBox({
  label,
  onPress,
  value,
  placeholder,
  column,
  style,
}: Props) {
  const viewStyle = column ? styles.column : styles.row;
  return (
    <View style={[viewStyle, style]}>
      <Text style={[column ? typography.smallLabel : typography.label, { color: COLORS.darkText }]}>
        { column ? label.toUpperCase() : `${label}:` }
      </Text>
      <TouchableOpacity onPress={onPress} style={column ? {} : styles.grow}>
        <TextBoxButton
          value={value}
          placeholder={placeholder}
          pointerEvents="none"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  grow: {
    flex: 1,
  },
});
