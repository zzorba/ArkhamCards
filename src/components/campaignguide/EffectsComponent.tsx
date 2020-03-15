import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CardWrapper from './CardWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { isSpecialToken } from 'constants';
import Card from 'data/Card';
import { EarnXpEffect, Effect, CampaignLogEffect, AddRemoveChaosTokenEffect, InvestigatorSelector } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  effects?: Effect[];
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

  renderCampaignLogEffect(campaignGuide: CampaignGuide, effect: CampaignLogEffect) {
    if (effect.id) {
      const logEntry = campaignGuide.logEntry(effect.section, effect.id);
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

  renderEarnXpEffect(effect: EarnXpEffect) {
    return null;
  }

  renderEffect(campaignGuide: CampaignGuide, effect: Effect) {
    switch (effect.type) {
      case 'campaign_log': {
        return this.renderCampaignLogEffect(campaignGuide, effect);
      }
      case 'add_chaos_token':
      case 'remove_chaos_token': {
        return this.renderChaosTokenEffect(effect);
      }
      case 'earn_xp':
        return this.renderEarnXpEffect(effect);
      case 'campaign_data':
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
      <ScenarioGuideContext.Consumer>
        { ({ campaignGuide }: ScenarioGuideContextType) => (
          map(effects, (effect, idx) => (
            <View key={idx}>
              { this.renderEffect(campaignGuide, effect) }
            </View>
          ))
        ) }
      </ScenarioGuideContext.Consumer>
    );
  }
}
