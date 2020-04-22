import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Text } from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import ScenarioStepContext, { ScenarioStepContextType } from 'components/campaignguide/ScenarioStepContext';
import { ReceiveCampaignLinkInput } from 'data/scenario/types';
import BasicButton from 'components/core/BasicButton';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  componentId: string;
  id: string;
  input: ReceiveCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
}


export default class ReceiveCampaignLinkInputComponent extends React.Component<Props> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _close = () => {
    const { componentId } = this.props;
    Navigation.pop(componentId);
  };

  render() {
    const { input, campaignLog } = this.props;
    if (campaignLog.linked) {
      return (
        <ScenarioStepContext.Consumer>
          { ({ scenarioState }: ScenarioStepContextType) => {
            const decision = scenarioState.campaignLink('receive', input.id);
            if (decision === undefined) {
              return (
                <>
                  <SetupStepWrapper>
                    <CampaignGuideTextComponent text={input.linked_prompt} />
                  </SetupStepWrapper>
                  <BasicButton
                    title={t`Proceed`}
                    onPress={this._close}
                  />
                </>
              );
            }
            return null;
          } }
        </ScenarioStepContext.Consumer>
      );
    }
    return <Text>TODO: manual linked campaign</Text>;
  }
}
