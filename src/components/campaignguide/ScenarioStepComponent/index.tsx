import React from 'react';
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
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import CampaignLogCountComponent from './CampaignLogCountComponent';
import XpCountComponent from './XpCountComponent';
import BranchStepComponent from './BranchStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import LocationConnectorsStepComponent from './LocationConnectorsStepComponent';
import GenericStepComponent from './GenericStepComponent';
import InputStepComponent from './InputStepComponent';
import RuleReminderStepComponent from './RuleReminderStepComponent';
import StoryStepComponent from './StoryStepComponent';
import ScenarioStep from '@data/scenario/ScenarioStep';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import space, { m, s } from '@styles/space';

interface Props {
  componentId: string;
  step: ScenarioStep;
  fontScale: number;
  width: number;
  border?: boolean;
  switchCampaignScenario: () => void;
}

export default class ScenarioStepComponent extends React.Component<Props> {
  renderContent(): React.ReactNode {
    const {
      componentId,
      step: { step, campaignLog },
      fontScale,
      width,
      border,
      switchCampaignScenario,
    } = this.props;
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
          <BranchStepComponent
            step={step}
            campaignLog={campaignLog}
          />
        );
      case 'story':
        return (
          <View style={border && !step.title ? styles.extraTopPadding : {}}>
            <StoryStepComponent
              step={step}
              width={width}
            />
          </View>
        );
      case 'encounter_sets':
        return <EncounterSetStepComponent step={step} />;
      case 'location_connectors':
        return <LocationConnectorsStepComponent step={step} />;
      case 'rule_reminder':
        return <RuleReminderStepComponent step={step} />;
      case 'resolution':
        return <ResolutionStepComponent step={step} />;
      case 'campaign_log_count':
        return <CampaignLogCountComponent step={step} />;
      case 'xp_count':
        return (
          <XpCountComponent 
            step={step} 
            campaignLog={campaignLog}
          />
        );
      case 'input':
        return (
          <InputStepComponent
            componentId={componentId}
            fontScale={fontScale}
            step={step}
            campaignLog={campaignLog}
            switchCampaignScenario={switchCampaignScenario}
          />
        );
      case 'effects':
        return (
          <EffectsStepComponent
            componentId={componentId}
            fontScale={fontScale}
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
    }
  }

  _proceed = () => {
    Navigation.pop(this.props.componentId);
  }

  render() {
    const { step, border } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignInvestigators }: CampaignGuideContextType) => (
          <ScenarioGuideContext.Consumer>
            { (scenarioGuideContext: ScenarioGuideContextType) => {
              const safeCodes = new Set(step.campaignLog.investigatorCodesSafe());
              const investigators = filter(
                campaignInvestigators,
                investigator => safeCodes.has(investigator.code)
              );
              const context: ScenarioStepContextType = {
                ...scenarioGuideContext,
                campaignLog: step.campaignLog,
                scenarioInvestigators: investigators,
              };
              return (
                <ScenarioStepContext.Provider value={context}>
                  { !!step.step.title && (
                    <View style={styles.titleWrapper}>
                      <Text style={[
                        typography.bigGameFont,
                        styles.title,
                        space.paddingTopL,
                        border ? typography.center : {},
                      ]}>
                        { step.step.title }
                      </Text>
                    </View>
                  ) }
                  { this.renderContent() }
                  { (step.step.id === '$proceed') && (
                    <BasicButton
                      onPress={this._proceed}
                      title={t`Done`}
                    />
                  ) }
                </ScenarioStepContext.Provider>
              );
            } }
          </ScenarioGuideContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.scenarioGreen,
  },
  titleWrapper: {
    marginLeft: m + s,
    marginRight: m + s,
  },
  extraTopPadding: {
    paddingTop: m + s,
  },
});
