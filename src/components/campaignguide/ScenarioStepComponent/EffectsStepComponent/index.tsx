import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import BorderWrapper from 'components/campaignguide/BorderWrapper';
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
  width: number;
  step: EffectsStep;
  campaignLog: GuidedCampaignLog;
}

export default class EffectsStepComponent extends React.Component<Props> {
  renderEffect(
    id: string,
    effect: Effect,
    border: boolean,
    input?: string[],
    numberInput?: number[],
  ): React.ReactNode {
    const {
      step,
      campaignLog,
      componentId,
      fontScale,
      width,
    } = this.props;
    switch (effect.type) {
      case 'campaign_log':
        if (this.props.step.stepText || border) {
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
        if (this.props.step.stepText || border) {
          return null;
        }
        return (
          <ChaosTokenEffectComponent
            effect={effect}
          />
        );
      case 'add_weakness':
        // Doesn't handle border cause it doesn't need to.
        return (
          <AddWeaknessEffectComponent
            id={id}
            effect={effect}
            input={input}
          />
        );
      case 'add_card':
        // no need to handle border yet.
        return (
          <AddCardEffectComponent
            id={id}
            effect={effect}
            input={input}
          />
        );
      case 'remove_card':
        if (border) {
          return null;
        }
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
            border={border}
          />
        );
      case 'story_step': {
        return (
          <View style={border ? styles.borderPadding : undefined}>
            <ScenarioGuideContext.Consumer>
              { ({ processedScenario, scenarioState }: ScenarioGuideContextType) => (
                map(
                  processedScenario.scenarioGuide.expandSteps(
                    effect.steps,
                    scenarioState,
                    this.props.campaignLog
                  ),
                  step => (
                    <ScenarioStepComponent
                      key={step.step.id}
                      componentId={componentId}
                      fontScale={fontScale}
                      width={width}
                      step={step}
                      border={border}
                    />
                  )
                ))
              }
            </ScenarioGuideContext.Consumer>
          </View>
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
    const { step, width } = this.props;
    return map(step.effectsWithInput, (effectsWithInput, outerIdx) => (
      <BorderWrapper
        key={`${step.id}_${outerIdx}`}
        width={width}
        border={!!effectsWithInput.border}
      >
        { map(effectsWithInput.effects, (effect, innerIdx) => (
          <View key={`${step.id}_${outerIdx}_${innerIdx}`}>
            { this.renderEffect(
              step.id,
              effect,
              !!effectsWithInput.border,
              effectsWithInput.input,
              effectsWithInput.numberInput
            ) }
          </View>
        )) }
      </BorderWrapper>
    ));
  }
}

const styles = StyleSheet.create({
  borderPadding: {
    paddingLeft: 32,
    paddingRight: 32,
  },
});
