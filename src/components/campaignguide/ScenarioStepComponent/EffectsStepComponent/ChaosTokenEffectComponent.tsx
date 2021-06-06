import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import { isSpecialToken } from '@app_constants';
import { AddRemoveChaosTokenEffect } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';

interface Props {
  effect: AddRemoveChaosTokenEffect;
}

function formatTokenString(tokens: string[]): string {
  if (tokens.length === 2) {
    return t`${tokens[0]} and ${tokens[1]}`;
  }
  return tokens.join(' ');
}

export default function ChaosTokenEffectComponent({ effect }: Props) {
  const tokens = map(effect.tokens, token =>
    isSpecialToken(token) ? `[${token}]` : `${token}`
  );
  const tokenString = formatTokenString(tokens);
  const text = effect.type === 'add_chaos_token' ?
    t`Add ${tokenString} to the chaos bag.` :
    t`Remove ${tokenString} from the chaos bag.`;
  return (
    <SetupStepWrapper bulletType="small">
      <CampaignGuideTextComponent text={text} />
    </SetupStepWrapper>
  );
}
