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
import { playNarration } from '../Narrator';
import { Icon } from 'react-native-elements';

interface Props {
  step: ResolutionStep;
}

export default function ResolutionStepComponent({ step }: Props) {
  const { typography } = useContext(StyleContext);
  const { processedScenario } = useContext(ScenarioGuideContext);
  const resolution = processedScenario.scenarioGuide.resolution(step.resolution);
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
          <View style={{...space.marginSideM, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            { resolution.narration && (
              <Icon name='play-circle-outline' type='material' onPress={() => playNarration(resolution.narration!.id)}/>
            ) }
            <Text style={{...typography.mediumGameFont, flex: 1, paddingLeft: 8}}>
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
