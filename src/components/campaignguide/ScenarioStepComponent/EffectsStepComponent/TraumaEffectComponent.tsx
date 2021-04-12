import React, { useCallback } from 'react';
import { View } from 'react-native';
import { map } from 'lodash';
import { c, t, msgid } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorChoicePrompt from '../../prompts/InvestigatorChoicePrompt';
import Card from '@data/types/Card';
import { TraumaEffect } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import space from '@styles/space';

interface Props {
  id: string;
  effect: TraumaEffect;
  border?: boolean;
  input?: string[];
}

export default function TraumaEffectComponent({ id, effect, border, input }: Props) {
  const message = useCallback((investigator: Card): string => {
    const male = investigator.grammarGenderMasculine();
    if (effect.insane) {
      return male ?
        c('masculine').t`${investigator.name} is driven <b>insane</b>.` :
        c('feminine').t`${investigator.name} is driven <b>insane</b>.`;
    }
    if (effect.killed) {
      return male ?
        c('masculine').t`${investigator.name} is <b>killed</b>.` :
        c('feminine').t`${investigator.name} is <b>killed</b>.`;
    }
    if (effect.mental_or_physical) {
      return male ?
        c('masculine').t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.` :
        c('feminine').t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.`;
    }
    if (effect.mental && effect.physical) {
      const traumaTotal = effect.mental + effect.physical;
      return male ?
        c('masculine').ngettext(
          msgid`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
          `${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
          traumaTotal
        ) :
        c('feminine').ngettext(
          msgid`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
          `${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
          traumaTotal
        );
    }
    if (effect.mental) {
      if (effect.mental < 0) {
        const mental = Math.abs(effect.mental);
        return male ?
          c('masculine').ngettext(
            msgid`${investigator.name} heals ${mental} mental trauma.`,
            `${investigator.name} heals ${mental} mental trauma.`,
            mental
          ) :
          c('feminine').ngettext(
            msgid`${investigator.name} heals ${mental} mental trauma.`,
            `${investigator.name} heals ${mental} mental trauma.`,
            mental
          );
      }
      return male ?
        c('masculine').ngettext(
          msgid`${investigator.name} suffers ${effect.mental} mental trauma.`,
          `${investigator.name} suffers ${effect.mental} mental trauma.`,
          effect.mental
        ) :
        c('feminine').ngettext(
          msgid`${investigator.name} suffers ${effect.mental} mental trauma.`,
          `${investigator.name} suffers ${effect.mental} mental trauma.`,
          effect.mental
        );
    }
    if (effect.physical) {
      if (effect.physical < 0) {
        const physical = Math.abs(effect.physical);
        return male ?
          c('masculine').ngettext(
            msgid`${investigator.name} heals ${physical} physical trauma.`,
            `${investigator.name} heals ${physical} physical trauma.`,
            physical
          ) : c('feminine').ngettext(
            msgid`${investigator.name} heals ${physical} physical trauma.`,
            `${investigator.name} heals ${physical} physical trauma.`,
            physical
          );
      }
      return male ?
        c('masculine').ngettext(
          msgid`${investigator.name} suffers ${effect.physical} physical trauma.`,
          `${investigator.name} suffers ${effect.physical} physical trauma.`,
          effect.physical
        ) :
        c('feminine').ngettext(
          msgid`${investigator.name} suffers ${effect.physical} physical trauma.`,
          `${investigator.name} suffers ${effect.physical} physical trauma.`,
          effect.physical
        );
    }
    return 'Unknown trauma type';
  }, [effect]);

  const renderInvestigators = useCallback((
    investigators: Card[]
  ) => {
    if (effect.mental_or_physical) {
      if (effect.mental_or_physical !== 1) {
        throw new Error('Always should be 1 mental_or_physical');
      }
      return (
        <>
          { !effect.hidden && (
            <View style={border ? space.paddingSideL : undefined}>
              <SetupStepWrapper bulletType={effect.bullet_type}>
                <CampaignGuideTextComponent text={t`You suffer 1 physical or mental trauma <i>(your choice)</i>.`} />
              </SetupStepWrapper>
            </View>
          ) }
          <InvestigatorChoicePrompt
            id={`${id}_trauma`}
            investigators={investigators}
            bulletType="none"
            options={{
              type: 'universal',
              choices: [
                {
                  id: 'physical',
                  text: t`Physical trauma`,
                },
                {
                  id: 'mental',
                  text: t`Mental trauma`,
                },
              ],
            }}
          />
          { !!border && <View style={space.marginBottomL} /> }
        </>
      );
    }
    return map(investigators, (investigator, idx) => (
      <View key={investigator.code} style={border ? space.paddingSideL : undefined}>
        <SetupStepWrapper key={idx} bulletType="small">
          <CampaignGuideTextComponent
            text={message(investigator)}
          />
        </SetupStepWrapper>
      </View>
    ));
  }, [id, effect, border, message]);

  if (effect.hidden && !effect.mental_or_physical) {
    return null;
  }
  return (
    <InvestigatorSelectorWrapper
      id={id}
      investigator={effect.investigator}
      input={input}
      render={renderInvestigators}
      extraArg={undefined}
    />
  );
}
