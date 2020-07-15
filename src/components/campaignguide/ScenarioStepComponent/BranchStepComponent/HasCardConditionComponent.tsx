import React from 'react';
import { map } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import InvestigatorResultConditionWrapper from '../../InvestigatorResultConditionWrapper';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import SetupStepWrapper from '../../SetupStepWrapper';
import BinaryResult from '../../BinaryResult';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import Card from '@data/Card';
import {
  BranchStep,
  CardCondition,
  Option,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { hasCardConditionResult } from '@data/scenario/conditionHelper';
import { stringList } from 'lib/stringHelper';

interface Props {
  step: BranchStep;
  condition: CardCondition;
  campaignLog: GuidedCampaignLog;
}

export default class HasCardConditionComponent extends React.Component<Props> {
  investigatorCardPrompt(
    card: Card,
    investigator: 'defeated' | 'any' | 'each'
  ): string {
    const cardName = card.cardName();
    switch (investigator) {
      case 'any':
        return t`Does any investigator have \"${cardName}\" in their deck?`;
      case 'defeated':
        return t`Was an investigator with \"${cardName}\" in their deck defeated?`;
      case 'each':
        return t`For each investigator with \"${cardName}\" in their deck:`;
    }
  }

  _renderInvestigators = (
    investigatorCards: Card[],
    option: Option
  ): Element | null => {
    const investigators = stringList(map(investigatorCards, card => card.name));
    const prompt = option && option.condition;
    return (
      <SetupStepWrapper>
        <CampaignGuideTextComponent
          text={ngettext(
            msgid`${investigators} must read <b>${prompt}</b>.`,
            `${investigators} must read <b>${prompt}</b>.`,
            investigators.length
          )}
        />
      </SetupStepWrapper>
    );
  };

  _renderCard = (card: Card): Element | null => {
    const { step, condition, campaignLog } = this.props;
    const result = hasCardConditionResult(condition, campaignLog);
    if (result.type === 'investigator') {
      return (
        <InvestigatorResultConditionWrapper
          result={result}
          renderOption={this._renderInvestigators}
          extraArg={card}
        />
      );
    }
    const prompt = this.investigatorCardPrompt(
      card,
      condition.investigator
    );

    return (
      <BinaryResult
        bulletType={step.bullet_type}
        prompt={prompt}
        result={result.decision}
      />
    );
  };

  render() {
    const { condition } = this.props;
    return (
      <SingleCardWrapper
        code={condition.card}
        type="player"
      >
        { this._renderCard }
      </SingleCardWrapper>
    );
  }
}
