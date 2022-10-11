import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { map, forEach } from 'lodash';
import { c, t, msgid } from 'ttag';

import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import InvestigatorChoicePrompt from '../../prompts/InvestigatorChoicePrompt';
import Card, { cardInCollection } from '@data/types/Card';
import { TraumaEffect } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { PersonalizedChoices, UniversalChoices } from '@data/scenario';
import { NumberChoices } from '@actions/types';
import space from '@styles/space';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  id: string;
  effect: TraumaEffect;
  border?: boolean;
  input?: string[];
}

function InvestigatorTraumaChoiceComponent({ investigators, heal, id, effect, border }: Props & { investigators: Card[]; heal: boolean }) {
  const { campaignLog } = useContext(ScenarioStepContext)
  const options: PersonalizedChoices | UniversalChoices = useMemo(() => {
    if (!heal) {
      return {
        type: 'universal',
        choices: [
          {
            id: 'physical',
            icon: 'physical',
            selected_text: t`Physical trauma`,
            selected_feminine_text: c('feminine').t`Physical trauma`,
            masculine_text: t`Physical trauma`,
            feminine_text: c('feminine').t`Physical trauma`,
            nonbinary_text: c('nonbinary').t`Physical trauma`,
          },
          {
            id: 'mental',
            icon: 'mental',
            selected_text: t`Mental trauma`,
            selected_feminine_text: c('feminine').t`Mental trauma`,
            masculine_text: t`Mental trauma`,
            feminine_text: c('feminine').t`Mental trauma`,
            nonbinary_text: c('nonbinary').t`Mental trauma`,
          },
        ],
      };
    }
    const perCode: NumberChoices = {};
    forEach(investigators, investigator => {
      const trauma = campaignLog.traumaAndCardData(investigator.code);
      perCode[investigator.code] = [];
      if (trauma.physical) {
        perCode[investigator.code].push(0);
      }
      if (trauma.mental) {
        perCode[investigator.code].push(1);
      }
      perCode[investigator.code].push(2);
    });
    return {
      type: 'personalized',
      choices: [
        {
          id: 'physical',
          icon: 'physical',
          selected_text: t`Physical trauma`,
          selected_feminine_text: c('feminine').t`Physical trauma`,
          selected_nonbinary_text: c('nonbinary').t`Physical trauma`,
          masculine_text: t`Physical trauma`,
          feminine_text: c('feminine').t`Physical trauma`,
          nonbinary_text: c('nonbinary').t`Physical trauma`,
        },
        {
          id: 'mental',
          icon: 'mental',
          selected_text: t`Mental trauma`,
          selected_feminine_text: c('feminine').t`Mental trauma`,
          selected_nonbinary_text: c('nonbinary').t`Mental trauma`,
          masculine_text: t`Mental trauma`,
          feminine_text: c('feminine').t`Mental trauma`,
          nonbinary_text: c('nonbinary').t`Mental trauma`,
        },
        {
          id: 'none',
          icon: 'dismiss',
          selected_text: t`None`,
        },
      ],
      perCode,
    };
  },[heal, investigators, campaignLog]);
  return (
    <>
      { !effect.hidden && (
        <View style={border ? space.paddingSideL : undefined}>
          <SetupStepWrapper bulletType={effect.bullet_type}>
            <CampaignGuideTextComponent text={heal ?
              t`You may heal 1 physical or mental trauma <i>(your choice)</i>` :
              t`You suffer 1 physical or mental trauma <i>(your choice)</i>.`
            } />
          </SetupStepWrapper>
        </View>
      ) }
      <InvestigatorChoicePrompt
        id={`${id}_trauma`}
        text={heal ? t`Choose heal type` : t`Choose trauma type`}
        confirmText={heal ? t`Chosen heal type` : t`Chosen trauma type`}
        promptType="header"
        investigators={investigators}
        options={options}
      />
      { !!border && <View style={space.marginBottomL} /> }
    </>
  );
}

export default function TraumaEffectComponent({ id, effect, border, input }: Props) {
  const message = useCallback((investigator: Card): string => {
    const gender = investigator.gender || Gender_Enum.M;
    if (effect.insane) {
      switch (gender) {
        case 'm': return c('masculine').t`${investigator.name} is driven <b>insane</b>.`;
        case 'f': return c('feminine').t`${investigator.name} is driven <b>insane</b>.`;
        case 'nb': return c('nonbinary').t`${investigator.name} is driven <b>insane</b>.`;
      }
    }
    if (effect.killed) {
      switch (gender) {
        case 'm': return c('masculine').t`${investigator.name} is <b>killed</b>.`;
        case 'f': return c('feminine').t`${investigator.name} is <b>killed</b>.`;
        case 'nb': return c('nonbinary').t`${investigator.name} is <b>killed</b>.`;
      }
    }
    if (effect.mental_or_physical) {
      switch (gender) {
        case 'm': return c('masculine').t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.`;
        case 'f': return c('feminine').t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.`;
        case 'nb': return c('nonbinary').t`${investigator.name} suffers 1 physical or mental trauma <i>(their choice)</i>.`;
      }
    }
    if (effect.mental && effect.physical) {
      const traumaTotal = effect.mental + effect.physical;
      switch (gender) {
        case 'm':
          return c('masculine').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            traumaTotal
          );
        case 'f':
          return c('feminine').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            traumaTotal
          );
        case 'nb':
          return c('nonbinary').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.mental} mental and ${effect.physical} physical trauma.`,
            traumaTotal
          );
      }
    }
    if (effect.mental) {
      if (effect.mental < 0) {
        const mental = Math.abs(effect.mental);
        switch (gender) {
          case 'm':
            return c('masculine').ngettext(
              msgid`${investigator.name} heals ${mental} mental trauma.`,
              `${investigator.name} heals ${mental} mental trauma.`,
              mental
            );
          case 'f':
            return c('feminine').ngettext(
              msgid`${investigator.name} heals ${mental} mental trauma.`,
              `${investigator.name} heals ${mental} mental trauma.`,
              mental
            );
          case 'nb':
            return c('nonbinary').ngettext(
              msgid`${investigator.name} heals ${mental} mental trauma.`,
              `${investigator.name} heals ${mental} mental trauma.`,
              mental
            );
        }
      }
      switch (gender) {
        case 'm':
          return c('masculine').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental trauma.`,
            `${investigator.name} suffers ${effect.mental} mental trauma.`,
            effect.mental
          );
        case 'f':
          return c('feminine').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental trauma.`,
            `${investigator.name} suffers ${effect.mental} mental trauma.`,
            effect.mental
          );
        case 'nb':
          return c('nonbinary').ngettext(
            msgid`${investigator.name} suffers ${effect.mental} mental trauma.`,
            `${investigator.name} suffers ${effect.mental} mental trauma.`,
            effect.mental
          );
      }
    }
    if (effect.physical) {
      if (effect.physical < 0) {
        const physical = Math.abs(effect.physical);
        switch (gender) {
          case 'm':
            return c('masculine').ngettext(
              msgid`${investigator.name} heals ${physical} physical trauma.`,
              `${investigator.name} heals ${physical} physical trauma.`,
              physical
            );
          case 'f':
           return c('feminine').ngettext(
              msgid`${investigator.name} heals ${physical} physical trauma.`,
              `${investigator.name} heals ${physical} physical trauma.`,
              physical
            );
          case 'nb':
            return c('nonbinary').ngettext(
              msgid`${investigator.name} heals ${physical} physical trauma.`,
              `${investigator.name} heals ${physical} physical trauma.`,
              physical
            );
        }
      }
      switch (gender) {
        case 'm':
          return c('masculine').ngettext(
            msgid`${investigator.name} suffers ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.physical} physical trauma.`,
            effect.physical
          );
        case 'f':
          return c('feminine').ngettext(
            msgid`${investigator.name} suffers ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.physical} physical trauma.`,
            effect.physical
          );
        case 'nb':
          return c('nonbinary').ngettext(
            msgid`${investigator.name} suffers ${effect.physical} physical trauma.`,
            `${investigator.name} suffers ${effect.physical} physical trauma.`,
            effect.physical
          );
      }
    }
    return 'Unknown trauma type';
  }, [effect]);

  const renderInvestigators = useCallback((
    investigators: Card[]
  ) => {
    if (effect.mental_or_physical) {
      const heal = effect.mental_or_physical === -1;
      return (
        <InvestigatorTraumaChoiceComponent
          effect={effect}
          id={id}
          investigators={investigators}
          heal={heal}
          border={border}
        />
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
      fixedInvestigator={effect.fixed_investigator}
      input={input}
      render={renderInvestigators}
      extraArg={undefined}
    />
  );
}
