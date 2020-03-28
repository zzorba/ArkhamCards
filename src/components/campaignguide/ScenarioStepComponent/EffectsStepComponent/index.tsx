import React from 'react';
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
    key: string,
    id: string,
    effect: Effect,
    input?: string[],
    counterInput?: number,
  ): React.ReactNode {
    switch (effect.type) {
      case 'campaign_log':
        if (this.props.step.stepText) {
          return null;
        }
        return (
          <CampaignLogEffectComponent
            key={key}
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
            key={key}
            effect={effect}
          />
        );
      case 'add_card':
        return (
          <AddCardEffectComponent
            key={key}
            id={id}
            effect={effect}
          />
        );
      case 'trauma':
        return (
          <TraumaEffectComponent
            key={key}
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
    return map(step.effectsWithInput, (effectsWithInput, outerIdx) =>
      map(effectsWithInput.effects, (effect, innerIdx) =>
        this.renderEffect(
          `${step.id}_${outerIdx}_${innerIdx}`,
          step.id,
          effect,
          effectsWithInput.input,
          effectsWithInput.counterInput
        )
      )
    );
  }
}
