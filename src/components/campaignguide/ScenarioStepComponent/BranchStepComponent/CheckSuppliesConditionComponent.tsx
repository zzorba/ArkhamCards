import React from 'react';
import { Text } from 'react-native';
import { find, forEach, map, upperFirst } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import ChooseInvestigatorPrompt from '../../prompts/ChooseInvestigatorPrompt';
import { stringList } from 'lib/stringHelper';
import CardQueryWrapper from '../../CardQueryWrapper';
import SetupStepWrapper from '../../SetupStepWrapper';
import CardTextComponent from 'components/card/CardTextComponent';
import BinaryPrompt from 'components/campaignguide/prompts/BinaryPrompt';
import { InvestigatorDeck } from 'data/scenario';
import Card from 'data/Card';
import {
  BranchStep,
  CheckSuppliesCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CheckSuppliesCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CheckSuppliesConditionComponent extends React.Component<Props> {
  renderCondition(cards: Card[], positive: boolean) {
    const { condition } = this.props;
    const option = find(condition.options, option => option.boolCondition === positive);
    if (!option) {
      return null;
    }
    const sectionName = option.condition || 'Missing';
    const supplyName = condition.id;
    const list = stringList(map(cards, card => card.name));
    return (
      <SetupStepWrapper bulletType="small">
        <CardTextComponent
          text={positive ?
            ngettext(
              msgid`Since ${list} has a ${supplyName}, they must read <b>${sectionName}</b>.`,
              `Since ${list} all have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              cards.length
            ) : ngettext(
              msgid`Since ${list} does not have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              `Since ${list} do not have a ${supplyName}, they must read <b>${sectionName}</b>.`,
              cards.length
            )}
        />
      </SetupStepWrapper>
    );
  }

  _renderTrue = (cards: Card[]) => {
    return this.renderCondition(cards, true);
  };

  _renderFalse = (cards: Card[]) => {
    return this.renderCondition(cards, false);
  };

  investigatorHasSupply(code: string) {
    const { condition, campaignLog } = this.props;
    const investigatorSection = campaignLog.investigatorSections[condition.section] || {};
    const section = investigatorSection[code];
    return !!(section &&
      find(section.entries, entry => entry.id === condition.id && entry.type === 'count' && entry.count > 0) &&
      !section.crossedOut[condition.id]
    );
  }

  _investigatorToString = (card: Card) => {
    const { condition } = this.props;
    if (this.investigatorHasSupply(card.code)) {
      return t`${card.name} (has ${condition.id})`;
    }
    return card.name;
  };

  _renderInvestigatorChoiceResults = (investigatorDeck?: InvestigatorDeck) => {
    if (!investigatorDeck) {
      return null;
    }
    const { condition } = this.props;
    const investigator = investigatorDeck.investigator;
    const decision = this.investigatorHasSupply(investigator.code);
    const option = find(condition.options, option => option.boolCondition === decision);
    return (
      <SetupStepWrapper bulletType="small">
        <CardTextComponent text={`${investigator.name} reads <b>${option ? option.condition : ''}</b>`} />
      </SetupStepWrapper>
    );
  };

  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    switch (condition.investigator) {
      case 'any': {
        const investigatorSection = campaignLog.investigatorSections[condition.section];
        // TODO
        return <Text>{step.text}</Text>;
      }
      case 'all': {
        const investigatorSection = campaignLog.investigatorSections[condition.section] || {};
        const haves: string[] = [];
        const haveNots: string[] = [];
        forEach(investigatorSection, (section, code) => {
          if (find(section.entries, entry => entry.id === condition.id) && !section.crossedOut[condition.id]) {
            haves.push(code);
          } else {
            haveNots.push(code);
          }
        });
        return (
          <>
            <SetupStepWrapper>
              { !!step.text && <CardTextComponent text={step.text} /> }
            </SetupStepWrapper>
            { (haves.length > 0) && (
              <CardQueryWrapper
                query={`(${map(haves, code => `(code == '${code}')`).join(' OR ')})`}
                render={this._renderTrue}
              />
            )}
            { (haveNots.length > 0) && (
              <CardQueryWrapper
                query={`(${map(haveNots, code => `(code == '${code}')`).join(' OR ')})`}
                render={this._renderFalse}
              />
            )}
          </>
        );
      }
      case 'choice': {
        return (
          <>
            <SetupStepWrapper>
              { !!step.text && <CardTextComponent text={step.text} /> }
            </SetupStepWrapper>
            <ChooseInvestigatorPrompt
              id={step.id}
              title={condition.prompt || t`Lookout`}
              investigatorToValue={this._investigatorToString}
              renderResults={this._renderInvestigatorChoiceResults}
              required
            />
          </>
        );
      }
    }
  }
}
