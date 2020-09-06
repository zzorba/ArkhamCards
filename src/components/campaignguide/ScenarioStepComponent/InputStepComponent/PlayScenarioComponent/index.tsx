import React from 'react';
import { Navigation } from 'react-native-navigation';
import { map } from 'lodash';
import { t } from 'ttag';

import BranchButton from './BranchButton';
import { GuideChaosBagProps } from '@components/campaignguide/GuideChaosBagView';
import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ScenarioStepContext, { ScenarioStepContextType } from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { PlayScenarioInput } from '@data/scenario/types';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { PlayingScenarioBranch } from '@data/scenario/fixedSteps';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import { ProcessedScenario } from '@data/scenario';

interface Props {
  componentId: string;
  campaignId: number;
  id: string;
  input: PlayScenarioInput;
}

export default class PlayScenarioComponent extends React.Component<Props> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _campaignLogPressed: () => void;
  _resolutionPressed: () => void;
  _drawWeaknessPressed: () => void;
  _recordTraumaPressed: () => void;

  constructor(props: Props) {
    super(props);

    this._campaignLogPressed = this._branchPress.bind(this, PlayingScenarioBranch.CAMPAIGN_LOG);
    this._resolutionPressed = this._branchPress.bind(this, PlayingScenarioBranch.RESOLUTION);
    this._drawWeaknessPressed = this._branchPress.bind(this, PlayingScenarioBranch.DRAW_WEAKNESS);
    this._recordTraumaPressed = this._branchPress.bind(this, PlayingScenarioBranch.RECORD_TRAUMA);
  }

  _branchPress = (index: number) => {
    const { id } = this.props;
    this.context.scenarioState.setChoice(id, index);
  };



  _showScenarioFaq = () => {
    const { componentId, campaignId } = this.props;
    Navigation.push<ScenarioFaqProps>(componentId, {
      component: {
        name: 'Guide.ScenarioFaq',
        passProps: {
          scenario: this.context.processedScenario.id.scenarioId,
          campaignId,
        },
      },
    });
  };

  _chaosBagSimulatorPressed = () => {
    const { componentId, campaignId } = this.props;
    Navigation.push<GuideChaosBagProps>(componentId, {
      component: {
        name: 'Guide.ChaosBag',
        passProps: {
          componentId,
          campaignId,
          chaosBag: this.context.campaignLog.chaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  };

  renderContent(
    scenarioState: ScenarioStateHelper,
    campaignLog: GuidedCampaignLog,
    processedScenario: ProcessedScenario
  ) {
    const { id, input } = this.props;
    const firstDecision = scenarioState.choice(id);
    if (firstDecision === PlayingScenarioBranch.CAMPAIGN_LOG) {
      const choices = chooseOneInputChoices(
        input.campaign_log || [],
        campaignLog
      );
      if (choices.length) {
        return (
          <ChooseOnePrompt
            id={`${id}_campaign_log`}
            text={t`Choose entry to add to campaign log:`}
            choices={[
              ...choices,
              {
                text: 'Other.',
              },
            ]}
          />
        );
      }
    }
    if (firstDecision === undefined) {
      const hasFaq = processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;

      return (
        <>
          { map(
            input.branches || [],
            (choice, index) => (
              <BranchButton
                key={index}
                index={index}
                choice={choice}
                campaignLog={campaignLog}
                onPress={this._branchPress}
              />
            )
          ) }
          <BasicButton
            title={t`Edit campaign log`}
            onPress={this._campaignLogPressed}
          />
          <BasicButton
            title={t`Draw chaos tokens`}
            onPress={this._chaosBagSimulatorPressed}
          />
          <BasicButton
            title={t`Draw random basic weakness`}
            onPress={this._drawWeaknessPressed}
          />
          <BasicButton
            title={t`Record trauma`}
            onPress={this._recordTraumaPressed}
          />
          { !!hasFaq && (
            <BasicButton
              title={t`Scenario FAQ`}
              onPress={this._showScenarioFaq}
            />
          ) }
          <BasicButton
            title={input.no_resolutions ? t`Scenario completed` : t`Resolutions`}
            onPress={this._resolutionPressed}
          />
        </>
      );
    }
    return null;
  }

  render() {
    const { id } = this.props;
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState, processedScenario, campaignLog }: ScenarioStepContextType) => {
          return (
            <>
              { (id === '$play_scenario') && (
                <SetupStepWrapper>
                  <CampaignGuideTextComponent
                    text={t`Start playing the scenario now.`}
                  />
                </SetupStepWrapper>
              ) }
              { this.renderContent(scenarioState, campaignLog, processedScenario) }
            </>
          );
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}
