import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import { isSpecialToken } from 'app_constants';
import { AddRemoveChaosTokenEffect } from 'data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';

interface Props {
  effect: AddRemoveChaosTokenEffect;
}

export default class ChaosTokenEffectComponent extends React.Component<Props> {
  render() {
    const { effect } = this.props;
    const tokenString = map(effect.tokens, token =>
      isSpecialToken(token) ? `[${token}]` : `${token}`
    ).join(' ');
    const text = effect.type === 'add_chaos_token' ?
      t`Add ${tokenString} to the chaos bag.` :
      t`Remove ${tokenString} from the chaos bag.`;
    return (
      <SetupStepWrapper bulletType="small">
        <CampaignGuideTextComponent text={text} />
      </SetupStepWrapper>
    );
  }
}
