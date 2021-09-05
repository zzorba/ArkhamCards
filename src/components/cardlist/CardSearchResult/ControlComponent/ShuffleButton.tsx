import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import RoundButton from '@components/core/RoundButton';
import space from '@styles/space';

interface Props {
  onPress: () => void;
}

export default function ShuffleButton({ onPress }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.countWrapper, space.paddingLeftXs]}>
      <RoundButton onPress={onPress} accessibilityLabel={t`Draw random basic weakness`}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={20}
            color={colors.M}
          />
        </View>
      </RoundButton>
    </View>
  );
}

const styles = StyleSheet.create({
  countWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 1,
    paddingBottom: 2,
  },
});