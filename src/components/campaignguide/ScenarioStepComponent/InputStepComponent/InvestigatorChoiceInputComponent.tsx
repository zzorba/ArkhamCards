import React from 'react';
import { forEach } from 'lodash';

import { ListChoices } from 'actions/types';
import InvestigatorCheckListComponent from 'components/campaignguide/prompts/InvestigatorCheckListComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from 'components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { InvestigatorDeck } from 'data/scenario';
import { hasCardConditionResult } from 'data/scenario/conditionHelper';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorChoiceInputComponent extends React.Component<Props> {
  choicesByInvestigator(): ListChoices {
    const { input, campaignLog } = this.props;
    const codes = campaignLog.investigatorCodes();
    const result: ListChoices = {};
    forEach(
      input.choices,
      (choice, idx) => {
        if (!choice.condition) {
          forEach(codes, code => {
            result[code] = [
              ...(result[code] || []),
              idx,
            ];
          });
        } else {
          const conditionResult = hasCardConditionResult(choice.condition, campaignLog);
          forEach(conditionResult.investigatorChoices,
            (indexes, code) => {
              // If we got one or more matches, that means this 'choice' is good.
              if (indexes.length) {
                result[code] = [
                  ...(result[code] || []),
                  idx
                ];
              }
            }
          );
        }
      }
    );
    return result;
  }

  _filterSingleChoiceInvestigator = ({ investigator }: InvestigatorDeck) => {
    const { input, campaignLog } = this.props;
    if (input.choices.length !== 1) {
      throw new Error('Should only be used on single choices');
    }
    const choice = input.choices[0];
    if (!choice.condition) {
      return true;
    }
    const conditionResult = hasCardConditionResult(choice.condition, campaignLog);
    return !!conditionResult.investigatorChoices[investigator.code];
  };

  render() {
    const { step, input } = this.props;
    if (input.investigator === 'any') {
      return (
        <ChooseInvestigatorPrompt
          id={step.id}
          title={input.choices[0].text}
          required
        />
      );
    }
    if (
      (input.investigator === 'all' || input.investigator === 'choice') &&
      input.choices.length === 1
    ) {
      return (
        <>
          { !!step.text && (
            <SetupStepWrapper>
              <CardTextComponent text={step.text} />
            </SetupStepWrapper>
          ) }
          <InvestigatorCheckListComponent
            id={step.id}
            checkText={input.choices[0].text}
            filter={this._filterSingleChoiceInvestigator}
            min={input.investigator === 'choice' ? 1 : 0}
            max={4}
          />
        </>
      );
    }
    return (
      <InvestigatorChoicePrompt
        id={step.id}
        text={step.text}
        bulletType={step.bullet_type}
        choices={input.choices}
        detailed={input.detailed}
        optional={input.investigator === 'choice'}
      />
    );
  }
}
