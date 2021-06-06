import React from 'react';
import { TouchableHighlight } from 'react-native';

import ChaosToken from './ChaosToken';
import { ChaosTokenType } from '@app_constants';

interface Props {
  iconKey: ChaosTokenType;
  selected: boolean;
  onPress: () => void;
  tiny?: boolean;
}

export default function ChaosTokenButton({ iconKey, selected, onPress, tiny }: Props) {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor="transparent"
      delayPressIn={0}
    >
      <ChaosToken iconKey={iconKey} size={tiny ? 'tiny' : 'small'} sealed={selected} />
    </TouchableHighlight>
  );
}
