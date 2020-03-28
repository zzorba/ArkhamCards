import React from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import ChaosTokenEffectComponent from './ChaosTokenEffectComponent';
import CampaignLogEffectComponent from './CampaignLogEffectComponent';
import AddCardEffectComponent from './AddCardEffectComponent';
import TraumaEffectComponent from './TraumaEffectComponent';
import { EffectsStep, Effect } from 'data/scenario/types';

interface Props {
  step: EffectsStep;
}

export default class EffectsStepComponent extends React.Component<Props> {
  renderEffect(
    id: string,
    effect: Effect,
    input?: string[],
    counterInput?: number,
  ): React.ReactNode {
    const { step } = this.props;
    switch (effect.type) {
      case 'campaign_log':
        if (this.props.step.stepText) {
          return null;
        }
        return (
          <CampaignLogEffectComponent
            bulletType={step.bullet_type}
            effect={effect}
            input={input}
            counterInput={counterInput}
          />
        );
      case 'add_chaos_token':
      case 'remove_chaos_token':
        if (this.props.step.stepText) {
          return null;
        }
        return (
          <ChaosTokenEffectComponent
            effect={effect}
          />
        );
      case 'add_card':
        return (
          <AddCardEffectComponent
            id={id}
            effect={effect}
          />
        );
      case 'trauma':
        return (
          <TraumaEffectComponent
            id={id}
            effect={effect}
            input={input}
          />
        );
      case 'earn_xp':
      case 'campaign_data':
      case 'remove_card':
      case 'replace_card':
      case 'scenario_data':
      default: {
        // We always write these out.
        return null;
      }
    }
  }

  render() {
    const { step } = this.props;
    return map(step.effectsWithInput, (effectsWithInput, outerIdx) => (
      <View key={`${step.id}_${outerIdx}`}>
        { map(effectsWithInput.effects, (effect, innerIdx) => (
          <View key={`${step.id}_${outerIdx}_${innerIdx}`}>
            { this.renderEffect(
                step.id,
                effect,
                effectsWithInput.input,
                effectsWithInput.counterInput
              )
            }
          </View>
        )) }
      </View>
    ));
  }
}
