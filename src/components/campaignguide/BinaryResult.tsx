import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import ResultIndicatorIcon from './ResultIndicatorIcon';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import SetupStepWrapper from './SetupStepWrapper';
import { BorderColor, BulletType } from '@data/scenario/types';

interface Props {
  bulletType?: BulletType;
  color?: BorderColor;
  prompt?: string;
  children?: React.ReactNode | React.ReactNode[];
  result: boolean;
}

export default function BinaryResult({
  bulletType,
  prompt,
  result,
  children,
  color,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.step}>
        <SetupStepWrapper bulletType={bulletType} color={color}>
          { !!prompt && <CampaignGuideTextComponent text={prompt} /> }
          { !!children && children }
        </SetupStepWrapper>
      </View>
      <ResultIndicatorIcon result={result} />
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
    flexDirection: 'column',
  },
});
