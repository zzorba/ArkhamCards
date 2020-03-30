import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorChoicePrompt from '../../prompts/InvestigatorChoicePrompt';
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

  _renderInvestigators = (
    investigatorDecks: InvestigatorDeck[]
  ) => {
    const { id, effect } = this.props;
    if (effect.mental_or_physical) {
      if (effect.mental_or_physical !== 1) {
        throw new Error('Always should be 1 mental_or_physical');
      }
      return (
        <>
          <SetupStepWrapper bulletType="right">
            <CardTextComponent text={t`You suffer 1 physical or mental trauma <i>(your choice)</i>.`} />
          </SetupStepWrapper>
          <InvestigatorChoicePrompt
            id={`${id}_trauma`}
            investigatorDecks={investigatorDecks}
            bulletType="none"
            choices={[{
              text: 'Physical Trauma',
              effects: [{
                type: 'trauma',
                physical: 1,
                investigator: '$input_value',
              }],
            },{
              text: 'Mental Trauma',
              effects: [{
                type: 'trauma',
                mental: 1,
                investigator: '$input_value',
              }],
            }]}
          />
        </>
      );
    }
    return (
      <SetupStepWrapper bulletType="small">
        { map(investigatorDecks, ({ investigator }, idx) => (
          <CardTextComponent
            key={idx}
            text={this.message(investigator)}
          />
        )) }
      </SetupStepWrapper>
    );
  };

  render() {
    const { id, effect, input } = this.props;
    return (
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        input={input}
        render={this._renderInvestigators}
        extraArgs={undefined}
      />
    );
  }
}
