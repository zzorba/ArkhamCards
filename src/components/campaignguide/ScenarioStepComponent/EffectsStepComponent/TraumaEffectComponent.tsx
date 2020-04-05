import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorChoicePrompt from '../../prompts/InvestigatorChoicePrompt';
import Card from 'data/Card';
import { TraumaEffect } from 'data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';

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
      if (effect.mental < 0) {
        const mental = Math.abs(effect.mental);
        return t`${investigator.name} heals ${mental} mental trauma.`;
      }
      return t`${investigator.name} suffers ${effect.mental} mental trauma.`;
    }
    if (effect.physical) {
      if (effect.physical < 0) {
        const physical = Math.abs(effect.physical);
        return t`${investigator.name} heals ${physical} physical trauma.`;
      }
      return t`${investigator.name} suffers ${effect.physical} physical trauma.`;
    }
    return 'Unknown trauma type';
  }

  _renderInvestigators = (
    investigators: Card[]
  ) => {
    const { id, effect } = this.props;
    if (effect.mental_or_physical) {
      if (effect.mental_or_physical !== 1) {
        throw new Error('Always should be 1 mental_or_physical');
      }
      return (
        <>
          <SetupStepWrapper bulletType="right">
            <CampaignGuideTextComponent text={t`You suffer 1 physical or mental trauma <i>(your choice)</i>.`} />
          </SetupStepWrapper>
          <InvestigatorChoicePrompt
            id={`${id}_trauma`}
            investigators={investigators}
            bulletType="none"
            options={{
              type: 'universal',
              choices: [
                {
                  id: 'physical',
                  text: t`Physical Trauma`,
                },
                {
                  id: 'mental',
                  text: t`Mental Trauma`,
                },
              ],
            }}
          />
        </>
      );
    }
    return map(investigators, (investigator, idx) => (
      <SetupStepWrapper key={idx} bulletType="small">
        <CampaignGuideTextComponent
          text={this.message(investigator)}
        />
      </SetupStepWrapper>
    ));
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
