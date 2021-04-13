import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import TextBoxButton from './TextBoxButton';
import StyleContext from '@styles/StyleContext';

interface Props {
  label: string;
  onPress: () => void;
  value: string;
  placeholder?: string;
  style?: ViewStyle;
  column?: boolean;
}

export default function LabeledTextBox({
  label,
  onPress,
  value,
  placeholder,
  column,
  style,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const viewStyle = column ? styles.column : styles.row;
  return (
    <View style={[viewStyle, style]}>
      <Text style={[column ? typography.smallLabel : typography.small, { color: colors.darkText }]}>
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
