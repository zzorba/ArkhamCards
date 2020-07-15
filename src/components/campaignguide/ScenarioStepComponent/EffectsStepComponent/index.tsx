import React from 'react';
import { View } from 'react-native';
import { flatMap, map } from 'lodash';

import BorderWrapper from '@components/campaignguide/BorderWrapper';
import ScenarioStepComponent from '@components/campaignguide/ScenarioStepComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import ChaosTokenEffectComponent from './ChaosTokenEffectComponent';
import CampaignLogEffectComponent from './CampaignLogEffectComponent';
import AddWeaknessEffectComponent from './AddWeaknessEffectComponent';
import AddCardEffectComponent from './AddCardEffectComponent';
import RemoveCardEffectComponent from './RemoveCardEffectComponent';
import TraumaEffectComponent from './TraumaEffectComponent';
import { EffectsStep, Effect } from '@data/scenario/types';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { ProcessedScenario } from '@data/scenario';
import { getSpecialEffectChoiceList } from '@data/scenario/effectHelper';
import space from '@styles/space';

interface Props {
  componentId: string;
  fontScale: number;
  width: number;
  step: EffectsStep;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

export default class EffectsStepComponent extends React.Component<Props> {
  renderEffect(
    id: string,
    effect: Effect,
    processedScenario: ProcessedScenario,
    scenarioState: ScenarioStateHelper,
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
      switchCampaignScenario,
    } = this.props;
    switch (effect.type) {
      case 'freeform_campaign_log':
        return (
          <CampaignLogEffectComponent
            effect={effect}
            input={input}
            numberInput={numberInput}
          />
        );
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
          <View style={border ? space.paddingSideL : undefined}>
            { map(
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
                  switchCampaignScenario={switchCampaignScenario}
                />
              )
            ) }
          </View>
        );
      }
      case 'campaign_data':
      case 'earn_xp':
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
    let foundSpecialEffect = false;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ processedScenario, scenarioState }: ScenarioGuideContextType) => (
          flatMap(step.effectsWithInput, (effectsWithInput, outerIdx) => {
            if (foundSpecialEffect) {
              return null;
            }
            return (
              <BorderWrapper
                key={`${step.id}_${outerIdx}`}
                width={width}
                border={!!effectsWithInput.border}
              >
                { flatMap(effectsWithInput.effects, (effect, innerIdx) => {
                  if (foundSpecialEffect) {
                    return null;
                  }
                  const specialEffectChoice = getSpecialEffectChoiceList(step.id, effect);
                  if (specialEffectChoice && specialEffectChoice !== '$fixed_investigator' &&
                    scenarioState.stringChoices(specialEffectChoice) === undefined
                  ) {
                    foundSpecialEffect = true;
                  }
                  return (
                    <View key={`${step.id}_${outerIdx}_${innerIdx}`}>
                      { this.renderEffect(
                        step.id,
                        effect,
                        processedScenario,
                        scenarioState,
                        !!effectsWithInput.border,
                        effectsWithInput.input,
                        effectsWithInput.numberInput
                      ) }
                    </View>
                  );
                }) }
              </BorderWrapper>
            );
          })
        ) }
      </ScenarioGuideContext.Consumer>
    );
  }
}
