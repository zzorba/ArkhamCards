import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import BorderWrapper from '@components/campaignguide/BorderWrapper';
import LocationSetupButton from './LocationSetupButton';
import TableStepComponent from './TableStepComponent';
import EffectsStepComponent from './EffectsStepComponent';
import ResolutionStepComponent from './ResolutionStepComponent';
import CampaignGuideContext from '../CampaignGuideContext';
import { CHOOSE_RESOLUTION_STEP_ID } from '@data/scenario/fixedSteps';
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
import space, { m, s, l } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import NarrationStepComponent from './NarrationStepComponent';
import ScenarioGuideContext from '../ScenarioGuideContext';
import ActionButton from '../prompts/ActionButton';

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
  const { typography, colors } = useContext(StyleContext);
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
        <BorderWrapper border width={width} color={step.border_color}>
          { !!step.title && (
            <View style={styles.titleWrapper}>
              <Text style={[
                typography.bigGameFont,
                { color: colors.campaign[step.border_color || 'setup'] },
                space.paddingTopL,
                typography.center,
              ]}>
                { step.title }
              </Text>
            </View>
          ) }
          <View style={[space.paddingSideL, space.paddingTopS]}>
            { map(
              processedScenario.scenarioGuide.expandSteps(
                step.steps,
                scenarioState,
                campaignLog
              ),
              step => (
                <ScenarioStepComponent
                  key={step.step.id}
                  componentId={componentId}
                  width={width - l * 2}
                  step={step}
                  border
                  switchCampaignScenario={switchCampaignScenario}
                />
              )
            ) }
          </View>
        </BorderWrapper>
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
  const { typography, colors } = useContext(StyleContext);
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
      { !!step.step.title && step.step.type !== 'border' && (
        <View style={styles.titleWrapper}>
          <Text style={[
            typography.bigGameFont,
            { color: resolution ? colors.campaign.resolution : colors.campaign.setup },
            space.paddingTopL,
            border ? typography.center : {},
          ]}>
            { step.step.title }
          </Text>
        </View>
      ) }
      <ScenarioStepComponentContent
        componentId={componentId}
        step={step}
        border={border}
        width={width}
        switchCampaignScenario={switchCampaignScenario}
      />
      { (step.step.id === '$proceed') && (
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
  titleWrapper: {
    marginLeft: m,
    marginRight: m + s,
  },
  extraTopPadding: {
    paddingTop: m + s,
  },
});
