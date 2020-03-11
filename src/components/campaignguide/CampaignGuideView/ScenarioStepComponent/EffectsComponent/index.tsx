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
import { AddCardEffect, RemoveCardEffect, Effect, CampaignLogEffect, AddRemoveChaosTokenEffect, InvestigatorSelector } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  effects?: Effect[];
  guide: CampaignGuide;
  input?: {
    card?: string;
  };
}

export default class EffectsComponent extends React.Component<Props> {
  renderChaosTokenEffect(effect: AddRemoveChaosTokenEffect) {
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

  renderCampaignLogEffect(effect: CampaignLogEffect) {
    const { guide } = this.props;
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
    return <Text>Unknown Campaign Log Effect</Text>
  }

  renderEffect(effect: Effect) {
    const { input } = this.props;
    switch (effect.type) {
      case 'campaign_log': {
        return this.renderCampaignLogEffect(effect);
      }
      case 'add_chaos_token':
      case 'remove_chaos_token': {
        return this.renderChaosTokenEffect(effect);
      }
      case 'earn_xp':
      case 'campaign_data':
        return <Text>Effect: {effect.type}</Text>;
      case 'remove_card':
      case 'add_card':
      case 'replace_card':
      case 'trauma': {
        // We always write these out.
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
