import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter } from 'lodash';
import { t } from 'ttag';

import LocationSetupButton from './LocationSetupButton';
import TableStepComponent from './TableStepComponent';
import EffectsStepComponent from './EffectsStepComponent';
import ResolutionStepComponent from './ResolutionStepComponent';
import CampaignGuideContext from '../CampaignGuideContext';
import { CHOOSE_RESOLUTION_STEP_ID, PROCEED_STEP_ID } from '@data/scenario/fixedSteps';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import XpCountComponent from './XpCountComponent';
import BranchStepComponent from './BranchStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import LocationConnectorsStepComponent from './LocationConnectorsStepComponent';
import GenericStepComponent from './GenericStepComponent';
import InputStepComponent from './InputStepComponent';
import RuleReminderStepComponent from './RuleReminderStepComponent';
import StoryStepComponent from './StoryStepComponent';
import ScenarioStep from '@data/scenario/ScenarioStep';
import space, { m, s } from '@styles/space';
import NarrationStepComponent from './NarrationStepComponent';
import ScenarioGuideContext from '../ScenarioGuideContext';
import ActionButton from '../prompts/ActionButton';
import BorderStepComponent from './BorderStepComponent';
import TitleComponent from './TitleComponent';

interface Props {
  componentId: string;
  step: ScenarioStep;
  width: number;
  border?: boolean;
  switchCampaignScenario: () => void;
}

function ScenarioStepComponentContent({
  componentId,
  step: { step, campaignLog },
  border,
  width,
  switchCampaignScenario,
}: Props) {
  const { campaignGuide, campaignId } = useContext(CampaignGuideContext);
  const { processedScenario, scenarioState } = useContext(ScenarioGuideContext);
  if (step.border_only && !border) {
    return null;
  }
  if (!step.type) {
    return (
      <NarrationStepComponent narration={step.narration} hideTitle={!!step.title}>
        <GenericStepComponent step={step} />
      </NarrationStepComponent>
    );
  }
  switch (step.type) {
    case 'table':
      return (
        <TableStepComponent step={step} />
      );
    case 'branch':
      return (
        <NarrationStepComponent narration={step.narration} hideTitle={!!step.title}>
          <BranchStepComponent
            step={step}
            campaignLog={campaignLog}
          />
        </NarrationStepComponent>
      );
    case 'story':
      return (
        <NarrationStepComponent narration={step.narration} hideTitle={!!step.title}>
          <View style={border && !step.title ? styles.extraTopPadding : {}}>
            <StoryStepComponent
              step={step}
              width={width}
            />
          </View>
        </NarrationStepComponent>
      );
    case 'encounter_sets':
      return (
        <EncounterSetStepComponent
          step={step}
          campaignGuide={campaignGuide}
          campaignId={campaignId}
          componentId={componentId}
        />
      );
    case 'location_connectors':
      return <LocationConnectorsStepComponent step={step} />;
    case 'rule_reminder':
      return <RuleReminderStepComponent step={step} />;
    case 'resolution':
      return <ResolutionStepComponent step={step} />;
    case 'campaign_log_count':
      return null;
    case 'xp_count':
      return (
        <XpCountComponent
          step={step}
          campaignLog={campaignLog}
        />
      );
    case 'input':
      return (
        <NarrationStepComponent narration={step.narration} hideTitle={!!step.title}>
          <InputStepComponent
            componentId={componentId}
            step={step}
            campaignLog={campaignLog}
            switchCampaignScenario={switchCampaignScenario}
          />
        </NarrationStepComponent>
      );
    case 'effects':
      return (
        <EffectsStepComponent
          componentId={componentId}
          width={width}
          step={step}
          campaignLog={campaignLog}
          switchCampaignScenario={switchCampaignScenario}
        />
      );
    case 'location_setup':
      return (
        <LocationSetupButton
          step={step}
          componentId={componentId}
        />
      );
    case 'border':
      return (
        <BorderStepComponent
          componentId={componentId}
          step={step}
          width={width}
          processedScenario={processedScenario}
          campaignLog={campaignLog}
          scenarioState={scenarioState}
          switchCampaignScenario={switchCampaignScenario}
        />
      );
    default:
      return null;
  }
}

export default function ScenarioStepComponent({
  componentId,
  step,
  width,
  border,
  switchCampaignScenario,
}: Props) {
  const { campaignInvestigators } = useContext(CampaignGuideContext);
  const { processedScenario } = useContext(ScenarioGuideContext);

  const context: ScenarioStepContextType = useMemo(() => {
    const safeCodes = new Set(step.campaignLog.investigatorCodesSafe());
    const investigators = filter(
      campaignInvestigators,
      investigator => safeCodes.has(investigator.code)
    );
    return {
      campaignLog: step.campaignLog,
      scenarioInvestigators: investigators,
    };
  }, [step.campaignLog, campaignInvestigators]);
  const resolution = step.step.id === CHOOSE_RESOLUTION_STEP_ID || context.campaignLog.scenarioStatus(processedScenario.id.encodedScenarioId) === 'resolution';
  const proceed = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);
  return (
    <ScenarioStepContext.Provider value={context}>
      { !!step.step.title && step.step.type !== 'border' && step.step.type !== 'xp_count' && (
        <TitleComponent
          title={step.step.title}
          border_color={(step.step.type === 'story' && step.step.border_color) || (resolution ? 'resolution' : 'setup')}
          center={border}
        />
      ) }
      <ScenarioStepComponentContent
        componentId={componentId}
        step={step}
        border={border}
        width={width}
        switchCampaignScenario={switchCampaignScenario}
      />
      { (step.step.id === PROCEED_STEP_ID) && (
        <View style={space.paddingS}>
          <ActionButton
            leftIcon="check"
            onPress={proceed}
            color="light"
            title={t`Done`}
          />
        </View>
      ) }
    </ScenarioStepContext.Provider>
  );
}

const styles = StyleSheet.create({
  extraTopPadding: {
    paddingTop: m + s,
  },
});
