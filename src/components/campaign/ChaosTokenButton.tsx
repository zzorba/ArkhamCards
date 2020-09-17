import React from 'react';
import { TouchableHighlight } from 'react-native';

import ChaosToken from './ChaosToken';
import { ChaosTokenType } from '@app_constants';

interface Props {
  iconKey: ChaosTokenType;
  selected: boolean;
  onPress: () => void;
}

export default function ChaosTokenButton({ iconKey, selected, onPress }: Props) {
  return (
    <TouchableHighlight
      style={selected && { opacity: 0.2 }}
      onPress={onPress}
      underlayColor="transparent"
      delayPressIn={0}
    >
      <ChaosToken iconKey={iconKey} small />
    </TouchableHighlight>
  );
}
