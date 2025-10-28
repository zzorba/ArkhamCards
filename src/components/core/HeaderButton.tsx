import React, { useCallback, useContext, useMemo } from 'react';
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
  color?: string;
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
  const { colors, typography } = useContext(StyleContext);
  const content = useMemo(() => {
    if (props.iconComponent) {
      return props.iconComponent;
    }
    if (props.iconName) {
      return <AppIcon name={props.iconName} size={props.size ?? 28} color={props.color!} />;
    }
    if (props.text) {
      return (
        <Text style={[typography.text, { color: props.color ?? (disabled ? colors.M : colors.D30) }]}>
          {props.text}
        </Text>
      );
    }
  }, [props, colors, typography, disabled]);
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

export function HeaderButtonWithId<T>({ id, onPress, ...props }: Omit<HeaderButtonProps, 'onPress'> & { id: T, onPress: (id: T) => void }) {
  const handleOnPress = useCallback(() => {
    onPress(id);
  }, [onPress, id]);
  return (
    <HeaderButton
      {...props as any}
      onPress={handleOnPress}
    />
  );
};
