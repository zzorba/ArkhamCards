import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import BranchButton from './BranchButton';
import ChooseOnePrompt from 'components/campaignguide/prompts/ChooseOnePrompt';
import BasicButton from 'components/core/BasicButton';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ScenarioStepContext, { ScenarioStepContextType } from 'components/campaignguide/ScenarioStepContext';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import { PlayScenarioInput } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { PlayingScenarioBranch } from 'data/scenario/fixedSteps';
import { chooseOneInputChoices } from 'data/scenario/inputHelper';

interface Props {
  componentId: string;
  id: string;
  input: PlayScenarioInput;
}

export default class PlayScenarioComponent extends React.Component<Props> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _campaignLogPressed: () => void;
  _resolutionPressed: () => void;
  _drawWeaknessPressed: () => void;

  constructor(props: Props) {
    super(props);

    this._campaignLogPressed = this._branchPress.bind(this, PlayingScenarioBranch.CAMPAIGN_LOG);
    this._resolutionPressed = this._branchPress.bind(this, PlayingScenarioBranch.RESOLUTION);
    this._drawWeaknessPressed = this._branchPress.bind(this, PlayingScenarioBranch.DRAW_WEAKNESS);
  }

  _branchPress = (index: number) => {
    const { id } = this.props;
    this.context.scenarioState.setChoice(id, index);
  };

  renderContent(
    scenarioState: ScenarioStateHelper,
    campaignLog: GuidedCampaignLog
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
            title={t`Draw random basic weakness`}
            onPress={this._drawWeaknessPressed}
          />
          <BasicButton
            title={t`Resolutions`}
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
        { ({ scenarioState, campaignLog }: ScenarioStepContextType) => {
          return (
            <>
              { (id === '$play_scenario') && (
                <SetupStepWrapper>
                  <CampaignGuideTextComponent
                    text={t`Start playing the scenario now.`}
                  />
                </SetupStepWrapper>
              ) }
              { this.renderContent(scenarioState, campaignLog) }
            </>
          );
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}
