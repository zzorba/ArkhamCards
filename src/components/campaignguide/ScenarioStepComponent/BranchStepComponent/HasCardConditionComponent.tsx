import React from 'react';
import { find, filter, map } from 'lodash';
import { ngettext, msgid, t } from 'ttag';

import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SingleCardWrapper from '../../SingleCardWrapper';
import SetupStepWrapper from '../../SetupStepWrapper';
import BinaryResult from '../../BinaryResult';
import CardTextComponent from 'components/card/CardTextComponent';
import Card from 'data/Card';
import {
  BranchStep,
  CardCondition,
} from 'data/scenario/types';
import { InvestigatorDeck } from 'data/scenario';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { stringList } from 'lib/stringHelper';

interface Props {
  step: BranchStep;
  condition: CardCondition;
  campaignLog: GuidedCampaignLog;
}

export default class HasCardConditionComponent extends React.Component<Props> {
  investigatorCardPrompt(
    card: Card,
    investigator: 'defeated' | 'any'
  ): string {
    const cardName = card.cardName();
    switch (investigator) {
      case 'any':
        return t`Does any investigator have \"${cardName}\" in their deck?`;
      case 'defeated':
        return t`Was an investigator with \"${cardName}\" in their deck defeated?`;
    }
  }

  _renderCard = (card: Card): React.ReactNode => {
    const { step, condition, campaignLog } = this.props;
    const investigatorsWithCards: string[] = filter(
      campaignLog.investigatorCodes(),
      code => {
        const hasIt = campaignLog.hasCard(code, condition.card);
        return hasIt && (
          condition.investigator !== 'defeated' ||
          campaignLog.isDefeated(code)
        );
      }
    );
    const positiveCondition = find(condition.options, option => option.boolCondition === true);
    if (condition.investigator === 'each') {
      // TODO: investigator lookup.
      const investigators = stringList(investigatorsWithCards);
      if (!investigatorsWithCards.length) {
        return null;
      }
      const prompt = positiveCondition && positiveCondition.condition;
      return (
        <SetupStepWrapper>
          <CardTextComponent
            text={ngettext(
              msgid`${investigators} must read <b>${prompt}</b>.`,
              `${investigators} must read <b>${prompt}</b>.`,
              investigatorsWithCards.length
            )}
          />
        </SetupStepWrapper>
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
        result={investigatorsWithCards.length > 0}
      />
    );
  };

  render() {
    const { condition } = this.props;
    return (
      <SingleCardWrapper
        code={condition.card}
        render={this._renderCard}
      />
    );
  }
}
