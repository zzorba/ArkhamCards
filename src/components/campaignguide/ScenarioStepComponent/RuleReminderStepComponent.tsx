import React from 'react';
import { View } from 'react-native';
import { FasterImageView as FastImage } from '@candlefinance/faster-image';
import { map } from 'lodash';

import SetupStepWrapper from '../SetupStepWrapper';
import BulletsComponent from './BulletsComponent';
import { Image, RuleReminderStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';
import { MAX_WIDTH } from '@styles/sizes';

interface Props {
  step: RuleReminderStep;
  width: number;
}

const RATIOS = {
  full: 0.95,
  half: 0.5,
  quarter: 0.25,
};

function RuleImage({ scale, width, image, text }: { text?: string; scale: 'full' | 'half' | 'quarter'; width: number; image: Image }) {
  const theWidth = RATIOS[scale || 'quarter'] * Math.min(width, MAX_WIDTH);
  return (
    <View style={[{
      flexDirection: image.alignment === 'top' ? 'column' : 'column-reverse',
      alignItems: 'center',
    }, space.paddingBottomM]}>
      <FastImage
        source={{
          url: `https://img2.arkhamcards.com${image.uri}`,
          resizeMode: 'cover',
          cachePolicy: 'discNoCacheControl',
        }}
        style={{ width: theWidth, height: (theWidth * image.ratio) }}
      />
      { !!text && (
        <View style={image.alignment === 'top' ? space.paddingBottomS : space.paddingTopS}>
          <CampaignGuideTextComponent text={text} />
        </View>
      ) }
    </View>
  );
}

export default function RuleReminderStepComponent({ step, width }: Props) {
  return (
    <>
      { !!step.text && (
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      ) }
      <BulletsComponent bullets={step.bullets} normalBulletType />
      { !!step.example && (
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={step.example} />
        </SetupStepWrapper>
      ) }
      { !!step.images && (
        <SetupStepWrapper bulletType="none">
          { map(step.images, (image, idx) => (
            <RuleImage key={idx} text={image.text} scale={image.width} image={image.image} width={width - 8 * 2} />
          )) }
        </SetupStepWrapper>
      ) }
    </>
  );
}
