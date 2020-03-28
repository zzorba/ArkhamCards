import React from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import Card from 'data/Card';
import {
  BranchStep,
  CardCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

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
        return t`Does any investigator have ${cardName} in their deck?`;
      case 'defeated':
        return t`Was an investigator with ${cardName} in their deck defeated?`;
    }
  }

  _renderCard = (card: Card): React.ReactNode => {
    const { step, condition } = this.props;
    return (
      <BinaryPrompt
        id={step.id}
        bulletType={step.bullet_type}
        text={this.investigatorCardPrompt(card, condition.investigator)}
        trueResult={find(condition.options, option => option.boolCondition === true)}
        falseResult={find(condition.options, option => option.boolCondition === false)}
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
