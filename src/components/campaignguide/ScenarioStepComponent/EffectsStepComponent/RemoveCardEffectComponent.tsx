import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorCheckListComponent from '../../prompts/InvestigatorCheckListComponent';
import { InvestigatorDeck } from 'data/scenario';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { RemoveCardEffect } from 'data/scenario/types';
import Card from 'data/Card';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  id: string;
  effect: RemoveCardEffect;
  input?: string[];
  skipCampaignLog?: boolean;
  campaignLog: GuidedCampaignLog;
}

export default class RemoveCardEffectComponent extends React.Component<Props> {
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

  _investigatorHasCard = ({ investigator }: InvestigatorDeck) => {
    const { effect, campaignLog } = this.props;
    return campaignLog.hasCard(investigator.code, effect.card);
  };

  _renderCard = (card: Card) => {
    const { id, effect, input } = this.props;
    if (!effect.investigator) {
      // These are always spelled out.
      return null;
    }
    if (effect.investigator === 'choice' && input) {
      return (
        <InvestigatorCheckListComponent
          id={`${id}_investigator`}
          min={input.length}
          max={input.length}
          checkText={t`Remove ${card.name} (${input.length})`}
          filter={this._investigatorHasCard}
        />
      );
    }
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
    const { effect } = this.props;
    if (effect.card === '$input_value') {
      // We always write these out.
      return null;
    }
    return (
      <SingleCardWrapper
        code={this.props.effect.card}
        render={this._renderCard}
      />
    )
  }
}
