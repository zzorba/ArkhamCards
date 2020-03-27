import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import Card from 'data/Card';
import { InvestigatorDeck } from 'data/scenario';
import { TraumaEffect } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  id: string;
  effect: TraumaEffect;
  input?: string[];
  skipCampaignLog?: boolean;
}

export default class TraumaEffectComponent extends React.Component<Props> {
  message(investigator: Card): string {
    const { effect } = this.props;
    if (effect.insane) {
      return t`${investigator.name} is driven <b>insane</b>.`;
    }
    if (effect.killed) {
      return t`${investigator.name} is <b>killed</b>.`;
    }
    if (effect.mental_or_physical) {
      return t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.`;
    }
    if (effect.mental && effect.physical) {
      return t`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`;
    }
    if (effect.mental) {
      return t`${investigator.name} suffers ${effect.mental} mental trauma.`;
    }
    if (effect.physical) {
      return t`${investigator.name} took ${effect.physical} physical trauma.`;
    }
    return 'Unknown trauma type';
  }

  _renderInvestigators = (investigatorDecks: InvestigatorDeck[]) => {
    return map(investigatorDecks, ({ investigator }, idx) => (
      <CardTextComponent
        key={idx}
        text={this.message(investigator)}
      />
    ));
  };

  render() {
    const { id, effect, input } = this.props;
    return (
      <SetupStepWrapper bulletType="small">
        <InvestigatorSelectorWrapper
          id={id}
          investigator={effect.investigator}
          input={input}
          render={this._renderInvestigators}
          extraArgs={undefined}
        />
      </SetupStepWrapper>
    );
  }
}
