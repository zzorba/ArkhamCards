import React from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '@components/campaignguide/ScenarioStepContext';
import { ReceiveCampaignLinkInput } from '@data/scenario/types';
import BasicButton from '@components/core/BasicButton';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  componentId: string;
  id: string;
  input: ReceiveCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

export default class ReceiveCampaignLinkInputComponent extends React.Component<Props> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _close = () => {
    const { componentId } = this.props;
    Navigation.pop(componentId);
  };

  render() {
    const {
      id,
      input,
      campaignLog,
      switchCampaignScenario,
    } = this.props;
    if (campaignLog.linked) {
      return (
        <ScenarioStepContext.Consumer>
          { ({ scenarioState }: ScenarioStepContextType) => {
            const decision = scenarioState.campaignLink('receive', input.id);
            if (decision === undefined) {
              return (
                <>
                  { input.linked_prompt && (
                    <SetupStepWrapper>
                      <CampaignGuideTextComponent text={input.linked_prompt} />
                    </SetupStepWrapper>
                  ) }
                  { input.flip_campaign ? (
                    <BasicButton
                      title={t`Switch campaign`}
                      onPress={switchCampaignScenario}
                    />
                  ) : (
                    <BasicButton
                      title={t`Close`}
                      onPress={this._close}
                    />
                  ) }
                </>
              );
            }
            return null;
          } }
        </ScenarioStepContext.Consumer>
      );
    }
    if (!input.choices.length) {
      // Just a roadbump
      return null;
    }
    return (
      <ChooseOnePrompt
        id={id}
        text={input.manual_prompt}
        choices={input.choices}
      />
    );
  }
}
