import React, { useContext } from 'react';
import {
  View,
  Text,
} from 'react-native';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { ResolutionStep } from '@data/scenario/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { NarrationInlineControls, useNarration } from './NarrationStepComponent';

interface Props {
  step: ResolutionStep;
}

export default function ResolutionStepComponent({ step }: Props) {
  const { typography } = useContext(StyleContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  const resolution = processedScenario.scenarioGuide.resolution(step.resolution);
  const narration = useNarration(resolution?.narration);

  if (!resolution) {
    return <Text>Unknown resolution: { step.resolution }</Text>;
  }

  return (
    <>
      { !!step.text && (
        <SetupStepWrapper>
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      ) }
      { (!!resolution.text || resolution.steps.length > 0) && (
        <View style={space.marginTopM}>
          <View style={{ ...space.marginSideM, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...typography.mediumGameFont, flex: 1 }}>
              { resolution.title }
            </Text>
          </View>
          { narration && <NarrationInlineControls narration={narration} />}
          { !!resolution.text && (
            <View style={space.marginSideM}>
              <CampaignGuideTextComponent
                text={resolution.text}
                flavor
              />
            </View>
          ) }
        </View>
      ) }
    </>
  );
}
