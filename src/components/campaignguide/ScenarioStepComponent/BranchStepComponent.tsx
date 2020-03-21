import React from 'react';
import {
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { t } from 'ttag';

import SingleCardWrapper from '../SingleCardWrapper';
import BinaryPrompt from '../prompts/BinaryPrompt';
import NumberPrompt from '../prompts/NumberPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { InvestigatorDeck } from '../types';
import Card from 'data/Card';
import {
  BranchStep,
  CardCondition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  CampaignDataInvestigatorCondition,
  CampaignLogCondition,
  TraumaCondition,
  InvestigatorSelector,
  ScenarioDataCondition,
} from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';

interface Props {
  step: BranchStep;
}

/*
  export interface BranchStep {
    id: string;
    type: "branch";
    text?: string;
    condition: Condition;
    options: Option[];
  }
*/
export default class BranchStepComponent extends React.Component<Props> {

  renderCampaignData(
    campaignGuide: CampaignGuide,
    condition: CampaignDataInvestigatorCondition | CampaignDataCondition | CampaignDataScenarioCondition | CampaignDataChaosBagCondition
  ) {
    const { step } = this.props;
    switch (condition.campaign_data) {
      case 'investigator':
        return (
          <Text>
            Some condition of an investigator.
          </Text>
        );
      case 'difficulty':
        return (
          <Text>
            Check campaign difficulty.
          </Text>
        );
      case 'scenario_completed': {
        const chosenScenario = campaignGuide.getScenario(condition.scenario);
        const scenarioName =
          chosenScenario && chosenScenario.scenario.scenarioName || condition.scenario;
        return (
          <BinaryPrompt
            id={step.id}
            text={t`Have you have already completed ${scenarioName}?`}
            trueResult={find(condition.options, option => option.boolCondition === true)}
            falseResult={find(condition.options, option => option.boolCondition === false)}
          />
        );
      }
      case 'chaos_bag':
        return (
          <Text>
            Check Chaos Bag: { condition.campaign_data }
          </Text>
        );
    }
  }

  renderScenarioData(condition: ScenarioDataCondition) {
    const { step } = this.props;

    if (condition.scenario_data === 'player_count') {
      return (
        <NumberPrompt
          id={step.id}
          prompt={t`How many players?`}
          min={1}
          max={4}
          options={condition.options}
        />
      );
    }
    if (condition.scenario_data === 'investigator' &&
      condition.options.length === 1 &&
      condition.options[0].condition
    ) {
      return (
        <SingleCardWrapper
          code={condition.options[0].condition}
          render={(card: Card) => (
            <BinaryPrompt
              id={step.id}
              text={t`If ${card.name} was chosen as an investigator for this campaign`}
              trueResult={find(condition.options, option => option.condition === card.code)}
              falseResult={find(condition.options, option => !!option.default)}
            />
          )}
        />
      );
    }
    return (
      <Text>Scenario Data: { condition.scenario_data }</Text>
    );
  }

  renderCampaignLog(campaignGuide: CampaignGuide, condition: CampaignLogCondition) {
    const { step } = this.props;
    if (every(condition.options, option => option.boolCondition !== undefined)) {
      // It's a binary prompt.
      if (condition.id) {
        const logEntry = campaignGuide.logEntry(condition.section, condition.id);
        if (!logEntry) {
          return (
            <Text>
              Unknown campaign log { condition.section }.{ condition.id }
            </Text>
          );
        }
        switch (logEntry.type) {
          case 'text': {
            const prompt = step.text ||
              t`Check ${logEntry.section}. <i>If ${logEntry.text}</i>`;
            return (
              <BinaryPrompt
                id={step.id}
                text={prompt}
                trueResult={find(condition.options, option => option.boolCondition === true)}
                falseResult={find(condition.options, option => option.boolCondition === false)}
              />
            );
          }
          case 'card': {
            return (
              <SingleCardWrapper
                code={logEntry.code}
                render={(card: Card) => {
                  const prompt = step.text ||
                    t`Is ${card.name} is listed under ${logEntry.section}?`;
                  return (
                    <BinaryPrompt
                      id={step.id}
                      text={prompt}
                      trueResult={find(condition.options, option => option.boolCondition === true)}
                      falseResult={find(condition.options, option => option.boolCondition === false)}
                    />
                  );
                }}
              />
            );
          }
        }
      }
    }
    // Not a binary condition.
    return (
      <Text>
        A more complex Campaign Log branch of some sort
      </Text>
    );
  }

  investigatorCardCondition(card: Card, investigator?: InvestigatorSelector) {
    const cardName = card.cardName();
    switch (investigator) {
      case 'any':
        return t`Does any investigator have ${cardName} in their deck?`;
      case 'lead_investigator':
        return t`Does the lead investigator have ${cardName} in their deck?`;
      case 'defeated':
        return t`Was an investigator with ${cardName} in their deck defeated?`;
      case 'all':
      case 'choice':
      case '$input_value':
      default:
        // Doesn't makes sense for investigator card
        return '';
    }
  }

  hasCardCondition(condition: CardCondition) {
    const { step } = this.props;
    return (
      <SingleCardWrapper
        code={condition.card}
        render={(card: Card) => (
          <BinaryPrompt
            id={step.id}
            text={this.investigatorCardCondition(card, condition.investigator)}
            trueResult={find(condition.options, option => option.boolCondition === true)}
            falseResult={find(condition.options, option => option.boolCondition === false)}
          />
        )}
      />
    );
  }

  traumaCondition(
    condition: TraumaCondition,
    investigatorDecks: InvestigatorDeck[]
  ): React.ReactNode {
    const { step } = this.props;
    switch (condition.trauma) {
      case 'killed':
        switch (condition.investigator) {
          case 'lead_investigator':
            return (
              <BinaryPrompt
                id={step.id}
                text={t`Was the lead investigator <b>killed</b>?`}
                trueResult={find(condition.options, option => option.boolCondition === true)}
                falseResult={find(condition.options, option => option.boolCondition === false)}
              />
            );
          case 'all':
            return (
              <BinaryPrompt
                id={step.id}
                text={t`Were all investigators <b>killed</b>?`}
                trueResult={find(condition.options, option => option.boolCondition === true)}
                falseResult={find(condition.options, option => option.boolCondition === false)}
              />
            );
        }
    }
  }

  render() {
    const { step } = this.props;
    const condition = step.condition;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ campaignGuide, investigatorDecks }: ScenarioGuideContextType) => {
          switch (condition.type) {
            case 'campaign_log':
              return this.renderCampaignLog(campaignGuide, condition);
            case 'campaign_data': {
              return this.renderCampaignData(campaignGuide, condition);
            }
            case 'scenario_data': {
              return this.renderScenarioData(condition);
            }
            case 'has_card': {
              return this.hasCardCondition(condition);
            }
            case 'trauma': {
              return this.traumaCondition(condition, investigatorDecks);
            }
            default:
              return (
                <Text>
                  Other Branch: { condition.type }
                </Text>
              );
          }
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
