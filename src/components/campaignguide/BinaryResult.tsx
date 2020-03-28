import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { every, find } from 'lodash';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { BulletType } from 'data/scenario/types';
import { COLORS } from 'styles/colors';

interface Props {
  bulletType?: BulletType;
  prompt?: string;
  result: boolean;
}

export default function BinaryResult({ bulletType, prompt, result }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.step}>
        <SetupStepWrapper bulletType={bulletType}>
          { !!prompt && <CardTextComponent text={prompt} /> }
        </SetupStepWrapper>
      </View>
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name={result ? 'thumb-up-outline' : 'thumb-down-outline'}
          size={24}
          color={COLORS.white}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
  },
  icon: {
    padding: 4,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkGray,
  },
});
