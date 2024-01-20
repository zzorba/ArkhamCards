import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import { BorderColor, BulletType } from '@data/scenario/types';
import space, { s, m, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ScenarioStepContext from './ScenarioStepContext';
import ScenarioGuideContext from './ScenarioGuideContext';

interface Props {
  bulletType?: BulletType;
  reverseSpacing?: boolean;
  children: React.ReactNode | React.ReactNode[];
  border?: boolean;
  color?: BorderColor;
  hasTitle?: boolean;

  noPadding?: boolean;
}

export default function SetupStepWrapper({ bulletType, noPadding, reverseSpacing, children, border, color, hasTitle }: Props) {
  const { colors } = useContext(StyleContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  const resolution = !!(campaignLog && processedScenario) && campaignLog.scenarioStatus(processedScenario.id.encodedScenarioId) === 'resolution';

  const balancedSpacing = useMemo(() => {
    switch (bulletType) {
      case 'small':
        return s + m + 20;
      case 'none':
        return s;
      default:
        return s + 22;
    }
  }, [bulletType]);

  const bulletNode = useMemo(() => {
    switch (bulletType) {
      case 'none':
        return <View style={styles.bullet} />;
      case 'small':
        return (
          <View style={[noPadding ? undefined : styles.smallBullet, { width: 20 }]}>
            <ArkhamSlimIcon
              name="bullet"
              size={20}
              color={(color && colors.campaign.text[color]) || (resolution ? colors.campaign.text.resolution : colors.campaign.text.setup)}
            />
          </View>
        );
      default:
        return (
          <View style={styles.bullet}>
            <ArkhamSlimIcon
              name="guide_bullet"
              size={22}
              color={(color && colors.campaign.text[color]) || (resolution ? colors.campaign.text.resolution : colors.campaign.text.setup)}
            />
          </View>
        );
    }
  }, [bulletType, color, resolution, noPadding, colors]);

  if (reverseSpacing) {
    return (
      <View style={[
        styles.step,
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: balancedSpacing,
        },
      ]}>
        { children }
      </View>
    );
  }

  return (
    <View style={[
      styles.step,
      noPadding ? undefined : space.paddingS,
      noPadding ? undefined : space.paddingSideM,
      border ? {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.divider,
        backgroundColor: colors.background,
      } : {},
      hasTitle ? { paddingTop: 0, paddingBottom: 0 } : {},
    ]}>
      { bulletNode }
      <View style={styles.mainText}>
        { children }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: s,
    marginTop: xs,
  },
  smallBullet: {
    marginLeft: s + m,
    marginRight: s,
    marginTop: 0,
  },
  mainText: {
    flex: 1,
    flexDirection: 'column',
  },
});
