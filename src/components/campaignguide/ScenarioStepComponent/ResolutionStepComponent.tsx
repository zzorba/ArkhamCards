import React, { useCallback, useContext } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { hasDissonantVoices } from '@reducers';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { ResolutionStep } from '@data/scenario/types';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { playNarration } from '../Narrator';

interface Props {
  step: ResolutionStep;
}

export default function ResolutionStepComponent({ step }: Props) {
  const { typography } = useContext(StyleContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  const resolution = processedScenario.scenarioGuide.resolution(step.resolution);
  const hasDS = useSelector(hasDissonantVoices);
  const playNarrationPressed = useCallback(() => {
    if (resolution?.narration) {
      playNarration(resolution.narration.id);
    }
  }, [resolution?.narration]);
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
            { hasDS && resolution.narration && (
              <Icon name="play-circle-outline" type="material" onPress={playNarrationPressed} />
            ) }
            <Text style={{ ...typography.mediumGameFont, flex: 1, paddingLeft: s }}>
              { resolution.title }
            </Text>
          </View>
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
