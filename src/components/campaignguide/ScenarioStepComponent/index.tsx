import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import LocationSetupButton from './LocationSetupButton';
import TableStepComponent from './TableStepComponent';
import EffectsStepComponent from './EffectsStepComponent';
import ResolutionStepComponent from './ResolutionStepComponent';
import CampaignGuideContext from '../CampaignGuideContext';
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
import StyleContext from '@styles/StyleContext';
import NarrationStepComponent from './NarrationStepComponent';

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
  if (!step.type) {
    return <GenericStepComponent step={step} />;
  }
  switch (step.type) {
    case 'table':
      return (
        <TableStepComponent step={step} />
      );
    case 'branch':
      return (
        <NarrationStepComponent narration={step.narration}>
          <BranchStepComponent
            step={step}
            campaignLog={campaignLog}
          />
        </NarrationStepComponent>
      );
    case 'story':
      return (
        <NarrationStepComponent narration={step.narration}>
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
        <NarrationStepComponent narration={step.narration}>
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
  const proceed = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);

  return (
    <ScenarioStepContext.Provider value={context}>
      { !!step.step.title && (
        <View style={styles.titleWrapper}>
          <Text style={[
            typography.bigGameFont,
            { color: colors.scenarioGreen },
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
        <BasicButton
          onPress={proceed}
          title={t`Done`}
        />
      ) }
    </ScenarioStepContext.Provider>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: m + s,
    marginRight: m + s,
  },
  extraTopPadding: {
    paddingTop: m + s,
  },
});
