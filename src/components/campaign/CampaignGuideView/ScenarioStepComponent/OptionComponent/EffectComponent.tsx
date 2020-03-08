import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import { isSpecialToken } from 'constants';
import { Effect } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  effect: Effect;
}

export default class EffectComponent extends React.Component<Props> {
  render() {
    const {
      effect,
    } = this.props;

    switch (effect.type) {
      case 'add_chaos_token':
      case 'remove_chaos_token': {
        const tokenString = map(effect.tokens, token =>
          isSpecialToken(token) ? `[${token}]` : `${token}`
        ).join(' ');
        const text = effect.type === 'add_chaos_token' ?
          t`Add ${tokenString} to the Chaos Bag` :
          t`Remove ${tokenString} from the Chaos Bag`;
        return (
          <CardTextComponent text={text} />
        );
      }
      case 'earn_xp':
      case 'add_card':
      case 'remove_card':
      case 'replace_card':
      case 'trauma':
      case 'campaign_log':
      case 'campaign_data':
      default:
        return <Text>{effect.type}</Text>;
    }
  }
}
