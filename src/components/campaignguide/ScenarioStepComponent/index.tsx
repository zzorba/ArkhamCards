import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import LocationSetupButton from './LocationSetupButton';
import EffectsStepComponent from './EffectsStepComponent';
import ResolutionStepComponent from './ResolutionStepComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import BranchStepComponent from './BranchStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import GenericStepComponent from './GenericStepComponent';
import InputStepComponent from './InputStepComponent';
import RuleReminderStepComponent from './RuleReminderStepComponent';
import StoryStepComponent from './StoryStepComponent';
import ScenarioStep from 'data/scenario/ScenarioStep';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

interface Props {
  componentId: string;
  step: ScenarioStep;
  fontScale: number;
}

export default class ScenarioStepComponent extends React.Component<Props> {
  renderContent() {
    const {
      componentId,
      step: { step, campaignLog },
      fontScale,
    } = this.props;
    if (!step.type) {
      return <GenericStepComponent step={step} />;
    }
    switch (step.type) {
      case 'branch':
        return (
          <BranchStepComponent
            step={step}
            campaignLog={campaignLog}
          />
        );
      case 'story':
        return (
          <StoryStepComponent
            step={step}
          />
        );
      case 'encounter_sets':
        return <EncounterSetStepComponent step={step} />;
      case 'rule_reminder':
        return <RuleReminderStepComponent step={step} />;
      case 'resolution':
        return <ResolutionStepComponent step={step} />;
      case 'input':
        return (
          <InputStepComponent
            componentId={componentId}
            fontScale={fontScale}
            step={step}
            campaignLog={campaignLog}
          />
        );
      case 'effects':
        return (
          <EffectsStepComponent
            componentId={componentId}
            fontScale={fontScale}
            step={step}
            campaignLog={campaignLog}
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
        return <Text>Unknown step type</Text>;
    }
  }

  _proceed = () => {
    Navigation.pop(this.props.componentId);
  }

  render() {
    const { step } = this.props;
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
                    <SetupStepWrapper bulletType="none">
                      <Text style={[typography.bigGameFont, { color: COLORS.scenarioGreen }]}>
                        { step.step.title }
                      </Text>
                    </SetupStepWrapper>
                  ) }
                  { this.renderContent() }
                  { (step.step.id === '$proceed') && (
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={this._proceed}
                        title={t`Done`}
                      />
                    </View>
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
  buttonWrapper: {
    padding: 8,
  },
});
