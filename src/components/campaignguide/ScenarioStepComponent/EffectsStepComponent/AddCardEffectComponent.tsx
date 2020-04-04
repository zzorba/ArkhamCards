import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import AddWeaknessCardEffectComponent from './AddWeaknessCardEffectComponent';
import { RANDOM_BASIC_WEAKNESS } from 'constants';
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
    const { id, effect } = this.props;
    return map(investigators, (investigator, idx) => (
      card.code === RANDOM_BASIC_WEAKNESS ? (
        <AddWeaknessCardEffectComponent
          key={idx}
          id={id}
          investigator={investigator}
          traits={effect.weakness_traits || []}
        />
      ) : (
        <SetupStepWrapper bulletType="small" key={idx}>
          <CampaignGuideTextComponent
            text={`${investigator.name} earns ${card.name}`}
          />
        </SetupStepWrapper>
      )
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
        extraArgs={card}
      />
    );
  };

  render() {
    return (
      <SingleCardWrapper
        code={this.props.effect.card}
        render={this._renderCard}
      />
    );
  }
}
