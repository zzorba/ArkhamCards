import React from 'react';
import { map } from 'lodash';

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
      <SetupStepWrapper bulletType="small">
        <CardTextComponent
          key={idx}
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
