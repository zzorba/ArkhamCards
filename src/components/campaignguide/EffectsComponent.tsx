import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import SingleCardWrapper from './SingleCardWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import { isSpecialToken } from 'constants';
import Card from 'data/Card';
import { Effect, CampaignLogEffect, AddRemoveChaosTokenEffect } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  id: string;
  effects?: Effect[];
  input?: {
    card?: string;
  };
  skipCampaignLog?: boolean;
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

  renderCampaignLogEffect(
    campaignGuide: CampaignGuide,
    effect: CampaignLogEffect
  ): React.ReactNode {
    if (this.props.skipCampaignLog) {
      return null;
    }
    if (effect.id) {
      const logEntry = campaignGuide.logEntry(effect.section, effect.id);
      if (!logEntry) {
        return (
          <Text>
            Unknown campaign log { effect.section }.
          </Text>
        );
      }
      switch (logEntry.type) {
        case 'text': {
          const text = (effect.section === 'campaign_notes') ?
            t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
            t`In your Campaign Log, under "${logEntry.section}", record that <i>${logEntry.text}</i>`;
          return (
            <CardTextComponent text={text} />
          );
        }
        case 'card': {
          return (
            <SingleCardWrapper
              code={logEntry.code}
              render={(card: Card) => (
                <CardTextComponent
                  text={t`In your Campaign Log, under "${logEntry.section}", record ${card.name}. `}
                />
              )}
            />
          );
        }
        case 'section_count': {
          // Not possible as a record
          return null;
        }
        case 'investigator': {
          // Not possible as a record?
          return null;
        }
      }
    }

    // No id, just a section / count
    const logSection = campaignGuide.logSection(effect.section);
    if (!logSection) {
      return (
        <Text>
          Unknown campaign log section { effect.section }.
        </Text>
      );
    }
    return <Text>Campaign Log Section: { logSection.section }</Text>;
  }

  renderEffect(
    campaignGuide: CampaignGuide,
    effect: Effect
  ) {
    switch (effect.type) {
      case 'campaign_log': {
        return this.renderCampaignLogEffect(campaignGuide, effect);
      }
      case 'add_chaos_token':
      case 'remove_chaos_token': {
        return this.renderChaosTokenEffect(effect);
      }
      case 'add_card':
        if (effect.investigator === 'choice') {
          return (
            <ChooseInvestigatorPrompt
              id={this.props.id}
              title={t`Investigator`}
              defaultLabel={t`None`}
            />
          );
        }
        // otherwise we have written it out
        return null;
      case 'earn_xp':
      case 'campaign_data':
      case 'remove_card':
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
