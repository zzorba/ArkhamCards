import React from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import ScenarioStepComponent from 'components/campaignguide/ScenarioStepComponent';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import ChaosTokenEffectComponent from './ChaosTokenEffectComponent';
import CampaignLogEffectComponent from './CampaignLogEffectComponent';
import AddWeaknessEffectComponent from './AddWeaknessEffectComponent';
import AddCardEffectComponent from './AddCardEffectComponent';
import RemoveCardEffectComponent from './RemoveCardEffectComponent';
import TraumaEffectComponent from './TraumaEffectComponent';
import { EffectsStep, Effect } from 'data/scenario/types';

interface Props {
  componentId: string;
  fontScale: number;
  step: EffectsStep;
  campaignLog: GuidedCampaignLog;
}

export default class EffectsStepComponent extends React.Component<Props> {
  renderEffect(
    id: string,
    effect: Effect,
    input?: string[],
    numberInput?: number[],
  ): React.ReactNode {
    const {
      step,
      campaignLog,
      componentId,
      fontScale,
    } = this.props;
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
            numberInput={numberInput}
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
      case 'add_weakness':
        return (
          <AddWeaknessEffectComponent
            id={id}
            effect={effect}
          />
        );
      case 'add_card':
        return (
          <AddCardEffectComponent
            id={id}
            effect={effect}
            input={input}
          />
        );
      case 'remove_card':
        return (
          <RemoveCardEffectComponent
            id={id}
            effect={effect}
            input={input}
            campaignLog={campaignLog}
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
      case 'story_step': {
        return (
          <ScenarioGuideContext.Consumer>
            { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => (
              map(
                scenarioGuide.expandSteps(effect.steps, scenarioState, this.props.campaignLog),
                step => (
                  <ScenarioStepComponent
                    key={step.step.id}
                    componentId={componentId}
                    fontScale={fontScale}
                    step={step}
                  />
                )
              ))
            }
          </ScenarioGuideContext.Consumer>
        );
      }
      case 'earn_xp':
      case 'campaign_data':
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
              effectsWithInput.numberInput
            ) }
          </View>
        )) }
      </View>
    ));
  }
}
