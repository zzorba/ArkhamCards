import React, { useCallback } from 'react';
import { View } from 'react-native';

import { LocationSetupStep } from '@data/scenario/types';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';
import { useNavigation } from '@react-navigation/native';

interface Props {
  step: LocationSetupStep;
}

export default function LocationSetupButton({ step }: Props) {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate('Guide.LocationSetup', { step })
  }, [navigation, step]);
  return (
    <View style={space.marginSideM}>
      <DeckButton
        icon="show"
        color="dark_gray"
        title={step.text}
        detail={step.description}
        onPress={onPress}
      />
    </View>
  );
}
