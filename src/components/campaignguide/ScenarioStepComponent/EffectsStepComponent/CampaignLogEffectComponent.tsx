import React, { useContext } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideContext from '../../CampaignGuideContext';
import { CampaignLogEffect, FreeformCampaignLogEffect, BulletType, CampaignLogCardsEffect, CampaignLogTextEffect } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { LogEntryText } from '@data/scenario/CampaignGuide';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  effect: CampaignLogEffect | CampaignLogTextEffect | FreeformCampaignLogEffect | CampaignLogCardsEffect;
  input?: string[];
  numberInput?: number[];
  bulletType?: BulletType;
}

function CardTextReplace({ code, text, feminineText, nonBinaryText }: { code: string; text: string; feminineText?: string; nonBinaryText?: string; }) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  const { colors, typography } = useContext(StyleContext);
  const [card, loading] = useSingleCard(code, 'encounter');
  const fixedCard = campaignGuide.card(code);
  if (loading && !fixedCard) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  if (!card && !fixedCard) {
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
  let theText = text;
  if (card?.gender === Gender_Enum.F && feminineText) {
    theText = feminineText;
  }
  if (card?.gender === Gender_Enum.Nb && nonBinaryText) {
    theText = nonBinaryText;
  }
  return (
    <CampaignGuideTextComponent
      text={theText.replace('#name#', card?.name || fixedCard?.name || '')}
    />
  );
}

function CardEffectContent({ code, section }: { code: string; section: string }) {
  return (
    <CardTextReplace
      code={code}
      text={t`In your Campaign Log, under "${section}", record #name#. `}
    />
  );
}

function genderizeText(logEntry: LogEntryText, gen: (logEntry: { text: string; section: string }) => string): [string, string, string] {
  const entry = gen(logEntry);
  return [
    entry,
    logEntry.feminineText ? gen({ ...logEntry, text: logEntry.feminineText }) : entry,
    logEntry.nonbinaryText ? gen({ ...logEntry, text: logEntry.nonbinaryText }) : entry,
  ];
}

function getText(
  effect: CampaignLogEffect | CampaignLogCardsEffect,
  logEntry: LogEntryText
): undefined | [string, string, string] {
  switch (logEntry.type) {
    case 'text':
      if (effect.cross_out) {
        if (effect.section === 'campaign_notes') {
          return genderizeText(logEntry, (logEntry) => t`In your Campaign Log, cross out <i>${logEntry.text}</i>`);
        }
        if (logEntry.text.endsWith('.')) {
          return genderizeText(logEntry, logEntry => t`In your Campaign Log, under "${logEntry.section}", cross out <i>${logEntry.text}</i>`);
        }
        return genderizeText(logEntry, logEntry => t`In your Campaign Log, under "${logEntry.section}", cross out <i>${logEntry.text}</i>.`);
      }
      if (effect.section === 'campaign_notes') {
        return genderizeText(logEntry, logEntry => t`In your Campaign Log, record that <i>${logEntry.text}</i>`);
      }
      if (logEntry.text.endsWith('.')) {
        return genderizeText(logEntry, logEntry => t`In your Campaign Log, under "${logEntry.section}", record <i>${logEntry.text}</i>`);
      }
      return genderizeText(logEntry, logEntry => t`In your Campaign Log, under "${logEntry.section}", record <i>${logEntry.text}</i>.`);
    default:
      return undefined;
  }
}

function CampaignLogEffectsContent({ effect, input }: {
  effect: CampaignLogEffect | CampaignLogTextEffect | FreeformCampaignLogEffect | CampaignLogCardsEffect;
  input?: string[];
}) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  if (effect.type === 'freeform_campaign_log') {
    const text = input && input.length ?
      input[0] : 'Missing text entry';
    return (
      <CampaignGuideTextComponent
        text={t`In your Campaign Log, record that <i>${text}</i>`}
      />
    );
  }
  if (effect.type === 'campaign_log_text') {
    const text = input && input.length ?
      input[0] : 'Missing text entry';
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <CampaignGuideTextComponent text={`${text}`} />
      </View>
    );
  }
  if (effect.id) {
    const cardSection = (effect.section === '$input_value' && input?.length) ? input[0] : undefined;
    const cardEntry = (effect.type === 'campaign_log_cards' && input?.length) ? input[0] : undefined;
    const logEntry = campaignGuide.logEntry(
      cardSection || effect.section,
      effect.id === '$input_value' && input?.length ? input[0] : effect.id
    );
    if (!logEntry) {
      return (
        <Text>
          Unknown campaign log { effect.section }.
        </Text>
      );
    }
    switch (logEntry.type) {
      case 'text': {
        const textEntry = getText(effect, logEntry);
        if (!textEntry) {
          return null;
        }
        const [text, feminineText, nonBinaryText] = textEntry;
        if (cardSection) {
          return (
            <CardTextReplace
              code={cardSection}
              text={text}
              feminineText={feminineText}
              nonBinaryText={nonBinaryText}
            />
          );
        }
        if (cardEntry) {
          return (
            <CardTextReplace
              code={cardEntry}
              text={text}
              feminineText={feminineText}
              nonBinaryText={nonBinaryText}
            />
          );
        }
        return (
          <CampaignGuideTextComponent text={text} />
        );
      }
      case 'card': {
        return (
          <CardEffectContent code={logEntry.code} section={logEntry.section} />
        );
      }
      case 'section_count': {
        // Not possible as a record
        return null;
      }
      case 'supplies': {
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

export default function CampaignLogEffectComponent({
  effect,
  input,
  bulletType,
}: Props) {
  if (effect.section === 'hidden' || effect.hidden) {
    return null;
  }
  return (
    <SetupStepWrapper bulletType={bulletType || effect.bullet_type}>
      <CampaignLogEffectsContent effect={effect} input={input} />
    </SetupStepWrapper>
  );
}
