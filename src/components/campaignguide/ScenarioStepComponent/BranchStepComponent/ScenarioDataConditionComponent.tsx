import React from 'react';
import {
  Text,
} from 'react-native';
import { find } from 'lodash';
import { ngettext, msgid, t } from 'ttag';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import Card from 'data/Card';
import {
  BranchStep,
  ScenarioDataCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: ScenarioDataCondition;
  campaignLog: GuidedCampaignLog;
}

export default class ScenarioDataConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    switch (condition.scenario_data) {
      case 'player_count': {
        const playerCount = campaignLog.playerCount();
        return (
          <SetupStepWrapper bulletType={step.bullet_type}>
            <CardTextComponent text={step.text ||
              ngettext(msgid`Because there is ${playerCount} player in the game:`,
                `Because there are ${playerCount} players in the game:`,
                playerCount)
              }
            />
          </SetupStepWrapper>
        );
      }
      case 'investigator_status': {
        // Only used for control flow right now.
        return null;
      }
      case 'investigator': {
        if (condition.options.length === 1 && condition.options[0].condition) {
          return (
            <SingleCardWrapper
              code={condition.options[0].condition}
              render={(card: Card) => (
                <BinaryPrompt
                  id={step.id}
                  bulletType={step.bullet_type}
                  text={t`If ${card.name} was chosen as an investigator for this campaign`}
                  trueResult={find(condition.options, option => option.condition === card.code)}
                  falseResult={find(condition.options, option => !!option.default)}
                />
              )}
            />
          );
        }
        return <Text>More complex investigator</Text>;
      }
    }
  }
}
