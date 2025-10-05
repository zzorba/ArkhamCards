import React, { useContext, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import AppIcon from '@icons/AppIcon';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

type HeaderButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
} & ({
  iconName: string;
  color: string;
  size?: number;
  iconComponent?: undefined;
  text?: undefined;
} | {
  iconComponent: React.ReactNode;
  iconName?: undefined;
  color?: undefined;
  size?: undefined;
  text?: undefined;
} | {
  iconComponent?: undefined;
  iconName?: undefined;
  text?: string;
  color: string;
});

export default function HeaderButton(props: HeaderButtonProps) {
  const { onPress, accessibilityLabel, disabled } = props;
  const { typography } = useContext(StyleContext);
  const content = useMemo(() => {
    if (props.iconComponent) {
      return props.iconComponent;
    }
    if (props.iconName) {
      return <AppIcon name={props.iconName} size={props.size ?? 28} color={props.color!} />;
    }
    if (props.text) {
      return <Text style={[typography.smallButtonLabel, { color: props.color }]}>{props.text}</Text>;
    }
  }, [props, typography]);
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={{ padding: s, opacity: disabled ? 0.7 : 1 }}
      disabled={disabled}
    >
      {content}
    </TouchableOpacity>
  );
}