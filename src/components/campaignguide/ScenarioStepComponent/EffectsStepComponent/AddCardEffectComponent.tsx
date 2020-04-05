import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import { AddCardEffect } from 'data/scenario/types';
import Card from 'data/Card';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';

interface Props {
  id: string;
  effect: AddCardEffect;
  input?: string[];
  skipCampaignLog?: boolean;
}

export default class AddCardEffectComponent extends React.Component<Props> {
  _renderInvestigators = (
    investigators: Card[],
    card: Card
  ) => {
    return map(investigators, (investigator, idx) => (
      <SetupStepWrapper bulletType="small" key={idx}>
        <CampaignGuideTextComponent
          text={`${investigator.name} earns ${card.name}`}
        />
      </SetupStepWrapper>
    ));
  };

  _renderCard = (card: Card) => {
    const { id, effect } = this.props;
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        render={this._renderInvestigators}
        description={t`Who will add ${card.name} to their deck?`}
        extraArg={card}
      />
    );
  };

  render() {
    return (
      <SingleCardWrapper
        code={this.props.effect.card}
        render={this._renderCard}
        extraArg={undefined}
      />
    );
  }
}
