import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CardWrapper from '../CardWrapper';
import SetupStepWrapper from '../SetupStepWrapper';
import { isSpecialToken } from 'constants';
import Card from 'data/Card';
import { Effect } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  effects?: Effect[];
  guide: CampaignGuide;
}

export default class EffectsComponent extends React.Component<Props> {

  renderEffect(effect: Effect) {
    const { guide } = this.props;
    switch (effect.type) {
      case 'campaign_log': {
        if (effect.id) {
          const logEntry = guide.logEntry(effect.section, effect.id);
          if (!logEntry) {
            return (
              <Text>
                Unknown campaign log {effect.section}.
              </Text>
            );
          }
          if (logEntry.type === 'text') {
            const text = (effect.section === 'campaign_notes') ?
              t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
              t`In your Campaign Log, under "${logEntry.section}", record that <i>${logEntry.text}</i>`;
            return (
              <CardTextComponent text={text} />
            );
          }
          return (
            <CardWrapper
              code={logEntry.code}
              render={(card: Card) => (
                <CardTextComponent
                  text={t`In your Campaign Log, under "${logEntry.section}", record ${card.name}. `}
                />
              )}
            />
          );
        }
        return
      }
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
      case 'campaign_data':
        return <Text>Effect: {effect.type}</Text>;
      case 'remove_card':
      case 'replace_card':
      case 'add_card':
      case 'trauma': {
        // We always write this one out.
        return null;
      }
    }
  }

  render() {
    const { effects } = this.props;
    if (!effects) {
      return null;
    }
    return (
      <>
        {map(effects, (effect, idx) => (
          <View key={idx}>
            { this.renderEffect(effect) }
          </View>
        ))}
      </>
    );
  }
}
