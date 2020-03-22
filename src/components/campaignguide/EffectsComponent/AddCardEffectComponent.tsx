import React from 'react';
import { map } from 'lodash';

import InvestigatorSelectorWrapper from '../InvestigatorSelectorWrapper';
import { InvestigatorDeck } from 'data/scenario';
import { AddCardEffect } from 'data/scenario/types';
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
  _renderInvestigators = (investigatorDecks: InvestigatorDeck[]) => {
    return map(investigatorDecks, ({ investigator }, idx) => (
      <CardTextComponent
        key={idx}
        text={`- ${investigator.name} gets a card`}
      />
    ));
  };

  render() {
    const { id, effect } = this.props;
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        render={this._renderInvestigators}
      />
    );
  }
}
