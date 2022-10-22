import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import { BorderStep } from '@data/scenario/types';
import BorderWrapper from '../BorderWrapper';
import space, { l } from '@styles/space';
import { ProcessedScenario } from '@data/scenario';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStepComponent from '.';
import ArkhamButton from '@components/core/ArkhamButton';
import TitleComponent from './TitleComponent';

interface Props {
  componentId: string;
  step: BorderStep;
  width: number;
  processedScenario: ProcessedScenario;
  scenarioState: ScenarioStateHelper;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

export default function BorderStepComponent({ componentId, switchCampaignScenario, step, width, processedScenario, scenarioState, campaignLog }: Props) {
  const id = `${step.id}_read_the_thing`;
  const decision = useMemo(() => scenarioState.decision(id), [scenarioState, id]);
  const showButton = useMemo(() => decision === undefined && processedScenario.canUndo, [decision, processedScenario.canUndo]);
  const readTheThingPress = useCallback(() => {
    scenarioState.setDecision(id, true);
  }, [id, scenarioState]);
  return (
    <BorderWrapper border width={width} color={step.border_color}>
      { !!step.title && (
        <TitleComponent
          border_color={step.border_color}
          center
          title={step.title}
          simpleTitleFont={step.title_font === 'status'}
          strikethrough={step.title_strikethrough}
        />
      ) }
      <View style={[space.paddingSideL, space.paddingTopS]}>
        { map(
          processedScenario.scenarioGuide.expandSteps(
            [
              ...step.steps,
              ...(decision && step.confirmation_steps?.length ? step.confirmation_steps : []),
            ],
            scenarioState,
            campaignLog
          ),
          subStep => (
            <ScenarioStepComponent
              key={subStep.step.id}
              componentId={componentId}
              width={width - l * 2}
              step={subStep}
              border
              color={step.border_color}
              switchCampaignScenario={switchCampaignScenario}
            />
          )
        ) }
        { !!step.confirmation_text && showButton && (
          <ArkhamButton
            title={step.confirmation_text}
            icon="search"
            onPress={readTheThingPress}
          />
        ) }
      </View>
    </BorderWrapper>
  );
}
