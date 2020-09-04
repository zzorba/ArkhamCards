import React from 'react';
import { find, forEach, map, sum } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import InvestigatorCheckListComponent from './InvestigatorCheckListComponent';
import InvestigatorCounterComponent from './InvestigatorCounterComponent';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { BulletType, UseSuppliesInput, UseSuppliesAllInput } from '@data/scenario/types';
import Card from '@data/Card';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: UseSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

interface State {
  counts: {
    [code: string]: {
      [id: string]: number ;
    };
  };
}

export default class UseSuppliesPrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      counts: {},
    };
  }

  _save = () => {
    const { id } = this.props;
    const { counts } = this.state;
    this.context.scenarioState.setSupplies(id, counts);
  };

  supplyLimits() {
    const { input, campaignLog } = this.props;
    const investigagorSupplies = campaignLog.investigatorSections[input.section] || {};
    const limits: { [code: string]: number } = {};
    const investigators = campaignLog.investigators(false);
    forEach(investigators, investigator => {
      limits[investigator.code] = 0;
    });
    forEach(investigators, investigator => {
      const supplies = investigagorSupplies[investigator.code] || {};
      const entry = find(supplies.entries || [],
        entry => entry.id === input.id &&
          !supplies.crossedOut[entry.id] &&
          entry.type === 'count'
      );
      limits[investigator.code] = (entry && entry.type === 'count') ? entry.count : 0;
    });
    return limits;
  }

  renderFirstAllPrompt(input: UseSuppliesAllInput) {
    const { id, campaignLog } = this.props;
    const limits = this.supplyLimits();

    // Basically 2 sequential choices.
    // 1) How many "supply" to consume
    // 2) If count != players, who doesn't get any?
    const supplyName = input.name;
    const desiredCount = campaignLog.playerCount();
    const totalProvisionCount = sum(map(limits, count => count));
    return (
      <InvestigatorCounterComponent
        id={`${id}_used`}
        countText={t`${supplyName} to use (${desiredCount})`}
        limits={limits}
        requiredTotal={Math.min(totalProvisionCount, desiredCount)}
      />
    );
  }

  renderSecondAllPrompt(input: UseSuppliesAllInput, scenarioState: ScenarioStateHelper) {
    const { id, campaignLog } = this.props;
    const choiceList = scenarioState.numberChoices(`${id}_used`);
    if (choiceList === undefined) {
      return null;
    }

    const usedCount = sum(map(choiceList, choices => choices[0]));
    const desiredCount = campaignLog.playerCount();
    if (usedCount >= desiredCount) {
      // No secondary prompt is needed/
      return null;
    }
    // Choose people who are left behind.
    const target = desiredCount - usedCount;
    const badThing = find(input.choices, choice => choice.boolCondition === false);
    return (
      <InvestigatorCheckListComponent
        id={id}
        choiceId="bad_thing"
        checkText={badThing ? t`Reads "${badThing.condition}"` : t`Doesn't get any`}
        min={target}
        max={target}
      />
    );
  }

  _filterInvestigatorChoice = (investigator: Card) => {
    const limits = this.supplyLimits();
    const count = limits[investigator.code] || 0;
    return count > 0;
  };

  render() {
    const { id, input, text } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          switch (input.investigator) {
            case 'all':
              return (
                <>
                  { !!text && (
                    <SetupStepWrapper>
                      <CampaignGuideTextComponent text={text} />
                    </SetupStepWrapper>
                  ) }
                  { this.renderFirstAllPrompt(input) }
                  { this.renderSecondAllPrompt(input, scenarioState) }
                </>
              );
            case 'choice': {
              // Single choice of players with Gasoline/Medicine, must choose one.
              const useChecklist = input.max === 1 ||
                scenarioState.stringChoices(id) !== undefined;
              const limits = this.supplyLimits();
              return (
                <>
                  { !!text && (
                    <SetupStepWrapper>
                      <CampaignGuideTextComponent text={text} />
                    </SetupStepWrapper>
                  ) }
                  { useChecklist ? (
                    <InvestigatorCheckListComponent
                      id={id}
                      choiceId="use_supply"
                      checkText={`Use ${input.id}`}
                      min={input.min}
                      max={input.max}
                      filter={this._filterInvestigatorChoice}
                    />
                  ) : (
                    <InvestigatorCounterComponent
                      id={id}
                      countText={`Use ${input.id}`}
                      limits={limits}
                    />
                  ) }
                </>
              );
            }
          }
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
