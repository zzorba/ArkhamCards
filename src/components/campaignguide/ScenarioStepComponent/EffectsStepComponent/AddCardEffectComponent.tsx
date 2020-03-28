import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import { InvestigatorDeck } from 'data/scenario';
import { AddCardEffect } from 'data/scenario/types';
import Card from 'data/Card';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  id: string;
  effect: AddCardEffect;
  input?: {
    card?: string;
  };
  skipCampaignLog?: boolean;
}

export default class AddCardEffectComponent extends React.Component<Props> {
  _renderInvestigators = (
    investigatorDecks: InvestigatorDeck[],
    card: Card
  ) => {
    return map(investigatorDecks, ({ investigator }, idx) => (
      <SetupStepWrapper bulletType="small" key={idx}>
        <CardTextComponent
          text={`${investigator.name} earned ${card.name}`}
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
    )
  }
}
