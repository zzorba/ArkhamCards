import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { TouchableShrink } from './Touchables';

export default function SimpleFab({ color, icon, onPress, accessiblityLabel,
  position, offsetX, offsetY }: {
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
  accessiblityLabel: string;
  position?: 'right' | 'left';
  offsetX: number;
  offsetY: number;
}) {
  const { shadow } = useContext(StyleContext);
  return (
    <View style={{
      position: 'absolute',
      bottom: offsetY,
      right: position !== 'left' ? offsetX : undefined,
      left: position === 'left' ? offsetX : undefined,
    }}>
      <TouchableShrink onPress={onPress} accessibilityLabel={accessiblityLabel}>
        <View style={[{ borderRadius: 30, width: 55, height: 55, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }, shadow.large]}>
          {icon}
        </View>
      </TouchableShrink>
    </View>
  );
}