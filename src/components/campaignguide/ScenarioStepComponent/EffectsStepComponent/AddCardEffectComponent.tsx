import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import InvestigatorSelectorWrapper from '@components/campaignguide/InvestigatorSelectorWrapper';
import { AddCardEffect } from '@data/scenario/types';
import Card from '@data/Card';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

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
          text={
            card.advanced ?
              t`${investigator.name} earns ${card.name} (Advanced)` :
              t`${investigator.name} earns ${card.name}`}
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
        fixedInvestigator={effect.fixed_investigator}
        render={this._renderInvestigators}
        optional={effect.optional}
        description={t`Who will add ${card.name} to their deck?`}
        extraArg={card}
      />
    );
  };

  render() {    
    return (
      <SingleCardWrapper
        code={this.props.effect.card}
        type="player"
      >
        { this._renderCard }
      </SingleCardWrapper>
    );
  }
}
