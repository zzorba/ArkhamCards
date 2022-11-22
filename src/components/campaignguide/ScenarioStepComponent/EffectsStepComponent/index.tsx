import React, { useEffect, useContext } from 'react';
import { View } from 'react-native';
import { flatMap, map } from 'lodash';

import BorderWrapper from '@components/campaignguide/BorderWrapper';
import ScenarioStepComponent from '@components/campaignguide/ScenarioStepComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import ChaosTokenEffectComponent from './ChaosTokenEffectComponent';
import CampaignLogEffectComponent from './CampaignLogEffectComponent';
import AddWeaknessEffectComponent from './AddWeaknessEffectComponent';
import AddCardEffectComponent from './AddCardEffectComponent';
import RemoveCardEffectComponent from './RemoveCardEffectComponent';
import TraumaEffectComponent from './TraumaEffectComponent';
import { EffectsStep, Effect, BorderColor } from '@data/scenario/types';
import { getSpecialEffectChoiceList } from '@data/scenario/effectHelper';
import space from '@styles/space';
import CheckCampaignLogCardsComponent from './CheckCampaignLogCardsComponent';
import CheckCampaignLogCountComponent from './CheckCampaignLogCountComponent';
import PartnerStatusEffectComponent from './PartnerStatusEffectComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';

interface Props {
  componentId: string;
  width: number;
  step: EffectsStep;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

function SingleEffectComponent({ id, effect, border, input, numberInput, step, width, componentId, campaignLog, switchCampaignScenario, color }: {
  id: string;
  effect: Effect;
  border: boolean;
  input?: string[];
  numberInput?: number[];
  color?: BorderColor;
} & Props) {
  const { campaign, campaignState } = useContext(CampaignGuideContext);
  const { processedScenario, scenarioState } = useContext(ScenarioGuideContext);
  useEffect(() => {
    if (campaign.investigators && effect.type === 'scenario_data' && effect.setting === 'add_investigator' && effect.investigator === '$fixed_investigator') {
      if (!campaign.investigators.find(code => code === effect.fixed_investigator)) {
        campaignState.addInvestigator(effect.fixed_investigator);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.investigators, effect]);
  switch (effect.type) {
    case 'freeform_campaign_log':
      return (
        <CampaignLogEffectComponent
          effect={effect}
          input={input}
          numberInput={numberInput}
        />
      );
    case 'check_campaign_log_cards':
      return (
        <View style={border ? space.paddingSideL : undefined}>
          <CheckCampaignLogCardsComponent effect={effect} input={input} numberInput={numberInput} />
        </View>
      );
    case 'check_campaign_log_count':
      return (
        <View style={border ? space.paddingSideL : undefined}>
          <CheckCampaignLogCountComponent effect={effect} numberInput={numberInput} />
        </View>
      );
    case 'campaign_log_cards':
      if (step.stepText) {
        return null;
      }
      return (
        <View style={border ? space.paddingSideL : undefined}>
          <CampaignLogEffectComponent
            bulletType={step.bullet_type}
            effect={effect}
            input={input}
            numberInput={numberInput}
          />
        </View>
      );
    case 'campaign_log':
      if (step.stepText || border) {
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
      if (step.stepText || border) {
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
          numberInput={numberInput}
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
              campaignLog
            ),
            step => (
              <ScenarioStepComponent
                key={step.step.id}
                componentId={componentId}
                width={width}
                step={step}
                border={border}
                color={color}
                switchCampaignScenario={switchCampaignScenario}
              />
            )
          ) }
        </View>
      );
    }
    case 'partner_status':
      if (effect.hidden) {
        return null;
      }
      return <PartnerStatusEffectComponent effect={effect} input={input} />;
    case 'campaign_data':
    case 'earn_xp':
    case 'scenario_data':
    case 'replace_card':
    case 'save_decks':
    default: {
      // We always write these out.
      return null;
    }
  }
}

export default function EffectsStepComponent(props: Props) {
  const { width, step } = props;
  const { scenarioState } = useContext(ScenarioGuideContext);
  let foundSpecialEffect = false;
  return (
    <>
      { flatMap(step.effectsWithInput, (effectsWithInput, outerIdx) => {
        if (foundSpecialEffect) {
          return null;
        }
        const key = `${step.id}_${outerIdx}`;
        const id = step.syntheticId ? key : step.id;
        return (
          <BorderWrapper
            key={`${step.id}_${outerIdx}`}
            width={width}
            border={!!effectsWithInput.border}
            color={effectsWithInput.border_color}
          >
            { flatMap(effectsWithInput.effects, (effect, innerIdx) => {
              if (foundSpecialEffect) {
                return null;
              }
              const specialEffectChoice = getSpecialEffectChoiceList(id, effect);
              if (specialEffectChoice && specialEffectChoice !== '$fixed_investigator' &&
                scenarioState.stringChoices(specialEffectChoice) === undefined
              ) {
                foundSpecialEffect = true;
              }
              return (
                <View key={`${step.id}_${outerIdx}_${innerIdx}`}>
                  <SingleEffectComponent
                    id={id}
                    effect={effect}
                    border={!!effectsWithInput.border}
                    color={effectsWithInput.border_color}
                    input={effectsWithInput.input}
                    numberInput={effectsWithInput.numberInput}
                    {...props}
                  />
                </View>
              );
            }) }
          </BorderWrapper>
        );
      }) }
    </>
  );
}
