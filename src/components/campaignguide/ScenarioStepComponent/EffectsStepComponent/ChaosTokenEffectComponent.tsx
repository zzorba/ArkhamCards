import React from 'react';
import { map } from 'lodash';
import { t } from 'ttag';

import { isSpecialToken } from 'constants';
import { AddRemoveChaosTokenEffect } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';
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
      t`Add ${tokenString} to the Chaos Bag` :
      t`Remove ${tokenString} from the Chaos Bag`;
    return (
      <SetupStepWrapper bulletType="small">
        <CardTextComponent text={text} />
      </SetupStepWrapper>
    );
  }
}
