import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { t } from 'ttag';

import CardWrapper from '../CardWrapper';
import BinaryPrompt from '../prompts/BinaryPrompt';
import NumberPrompt from '../prompts/NumberPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import Card from 'data/Card';
import {
  BranchStep,
  CardCondition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  CampaignLogCondition,
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
    condition: CampaignDataCondition | CampaignDataScenarioCondition | CampaignDataChaosBagCondition
  ) {
    const { step } = this.props;
    switch (condition.campaign_data) {
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
            trueResult={find(step.options, option => option.boolCondition === true)}
            falseResult={find(step.options, option => option.boolCondition === false)}
          />
        );
      }
      case 'chaos_bag':
        return (
          <Text>Check Chaos Bag: {condition.campaign_data}</Text>
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
          options={step.options}
        />
      );
    }
    if (condition.scenario_data === 'investigator' &&
      step.options.length === 1 && step.options[0].condition)  {
      return (
        <CardWrapper
          code={step.options[0].condition}
          render={(card: Card) => (
            <BinaryPrompt
              id={step.id}
              text={t`If ${card.name} was chosen as an investigator for this campaign`}
              trueResult={find(step.options, option => option.condition === card.code)}
              falseResult={find(step.options, option => !!option.default)}
            />
          )}
        />
      );
    }
    return (
      <Text>Scenario Data: {condition.scenario_data}</Text>
    );
  }

  renderCampaignLog(campaignGuide: CampaignGuide, condition: CampaignLogCondition) {
    const { step } = this.props;
    if (every(step.options, option => option.boolCondition !== undefined)) {
      // It's a binary prompt.
      if (condition.id) {
        const logEntry = campaignGuide.logEntry(condition.section, condition.id);
        if (!logEntry) {
          return (
            <Text>
              Unknown campaign log {condition.section}.{condition.id}
            </Text>
          );
        }
        if (logEntry.type === 'text') {
          const prompt = step.text ||
            t`Check ${logEntry.section}. <i>If ${logEntry.text}</i>`;
          return (
            <BinaryPrompt
              id={step.id}
              text={prompt}
              trueResult={find(step.options, option => option.boolCondition === true)}
              falseResult={find(step.options, option => option.boolCondition === false)}
            />
          );
        }

        return (
          <CardWrapper
            code={logEntry.code}
            render={(card: Card) => {
              const prompt = step.text ||
                t`Is ${card.name} is listed under ${logEntry.section}?`;
              return (
                <BinaryPrompt
                  id={step.id}
                  text={prompt}
                  trueResult={find(step.options, option => option.boolCondition === true)}
                  falseResult={find(step.options, option => option.boolCondition === false)}
                />
              );
            }}
          />
        );
      }
    }
    // Not a binary condition.
    return (
      <Text>A more complex Campaign Log branch of some sort</Text>
    );
    /*

    if (condition.section) {
      // Just a section.
    }
    return (
      <Text>
        Check Campaign Log: {condition.section} {condition.id}
      </Text>
    );*/
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
      case 'input_value':
      default:
        // Doesn't makes sense for investigator card
        return '';
    }
  }

  hasCardCondition(condition: CardCondition) {
    const { step } = this.props;
    return (
      <CardWrapper
        code={condition.card}
        render={(card: Card) => (
          <BinaryPrompt
            id={step.id}
            text={this.investigatorCardCondition(card, condition.investigator)}
            trueResult={find(step.options, option => option.boolCondition === true)}
            falseResult={find(step.options, option => option.boolCondition === false)}
          />
        )}
      />
    );
    return null;
  }

  render() {
    const { step } = this.props;
    const condition = step.condition;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ campaignGuide }: ScenarioGuideContextType) => {
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
            default: return <Text>{condition.type}</Text>;
          }
        }}
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})
