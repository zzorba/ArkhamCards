import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { flatMap, keys, range, map, sum, values } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { t } from 'ttag';

import ChaosBagLine from '@components/core/ChaosBagLine';
import CampaignLogSuppliesComponent from './CampaignLogSuppliesComponent';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide, { CARD_REGEX } from '@data/scenario/CampaignGuide';
import GuidedCampaignLog, { EntrySection } from '@data/scenario/GuidedCampaignLog';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import space, { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import { CampaignId } from '@actions/types';
import { showGuideChaosBagOddsCalculator, showGuideDrawChaosBag } from '@components/campaign/nav';
import useSingleCard from '@components/card/useSingleCard';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import CampaignLogPartnersComponent from './CampaignLogPartnersComponent';
import { CalendarEntry, ChecklistItem, Partner, ScarletKey } from '@data/scenario/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import { ProcessedCampaign } from '@data/scenario';
import CampaignLogScarletKeysComponent from './CampaignLogScarletKeysComponent';
import CampaignLogCalendarComponent from './CampaignLogCalendarComponent';
import { MAX_WIDTH } from '@styles/sizes';
import AppIcon from '@icons/AppIcon';
import CampaignLogChecklistComponent from './CampaignLogChecklistComponent';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  scenarioId?: string;
  standalone?: boolean;
  hideChaosBag?: boolean;
  width: number;
  interScenarioId?: string;
  hideChaosBagButtons?: boolean;
  processedCampaign: ProcessedCampaign | undefined;
}

function RelationshipBoxes({ section }: { section: EntrySection }) {
  const { colors, typography } = useContext(StyleContext);
  const relationshipEntry = section.entries.find(entry => entry.id === '$relationship');
  const relationshipValue = relationshipEntry?.type === 'count' ? relationshipEntry.count : 0;
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[typography.cursive, { fontSize: 14, lineHeight: 16, color: colors.D30 }, space.paddingRightXs]} allowFontScaling={false}>{'Relationship'}</Text>
      { map(range(0, 4), (idx) => (
        <View key={idx} style={[{ width: 14, height: 14, borderWidth: 1, borderColor: colors.D30, position: 'relative' }, space.marginRightXs]}>
          { relationshipValue > idx ? (
            <View style={{ position: 'absolute', top: 0, left: 0 }}>
              <MaterialIcons size={12} name="favorite" color={colors.D20} allowFontScaling={false} />
            </View>
          ) : null }
        </View>
      )) }
    </View>
  )
}

interface CardSectionProps {
  code: string;
  section?: EntrySection;
  campaignGuide: CampaignGuide;
  width: number;
  isRelationship: boolean
}

function CardSection({ code, section, campaignGuide, width, isRelationship }: CardSectionProps) {
  const [card] = useSingleCard(code, 'encounter');
  const eliminated = !!section?.sectionCrossedOut;
  const header = useMemo(() => {
    return (
      <CompactInvestigatorRow
        transparent
        name={campaignGuide.card(code)?.name}
        investigator={card}
        detail={isRelationship && section ? <RelationshipBoxes section={section} /> : undefined}
        eliminated={eliminated}
        width={width}
        open={!eliminated}
      />
    );
  }, [card, eliminated, width]);
  const entries = useMemo(() => {
    return section?.entries.filter(entry => entry.id !== '$relationship') ?? []
  }, [section?.entries]);
  if (eliminated) {
    return header;
  }
  return (
    <RoundedFactionBlock
      header={header}
      noSpace
      faction="neutral"
    >
      { !!section && !!entries.length && (
        <View style={[space.paddingTopM, space.paddingSideM]}>
          <CampaignLogSectionComponent
            sectionId={code}
            campaignGuide={campaignGuide}
            section={section}
          />
        </View>
      ) }
    </RoundedFactionBlock>
  )
}

export default function CampaignLogComponent({
  componentId,
  campaignId,
  campaignGuide,
  campaignLog,
  scenarioId,
  standalone,
  hideChaosBag,
  width,
  interScenarioId,
  hideChaosBagButtons,
  processedCampaign,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { colon } = useContext(LanguageContext);
  const renderLogEntrySectionContent = useCallback((
    id: string,
    title: string,
    type?: 'investigator_count' | 'count' | 'checklist' | 'supplies' | 'header' | 'partner' | 'scarlet_keys' | 'relationship',
    checklist?: ChecklistItem[],
    partners?: Partner[],
    calendar?: CalendarEntry[],
    keys?: ScarletKey[]
  ) => {
    switch (type) {
      case 'header': {
        return (
          <View style={space.paddingSideS}>
            <DeckBubbleHeader inverted title={title} />
          </View>
        );
      }
      case 'count': {
        const count = campaignLog.count(id, '$count');
        return (
          <View style={[space.paddingSideS, styles.column]}>
            <View style={{ width: '100%' }}>
              <DeckBubbleHeader inverted title={`${title}${colon}${count}`} />
            </View>
            <View style={{ maxWidth: MAX_WIDTH }}>
              { !!calendar && (
                <CampaignLogCalendarComponent
                  sectionId={id}
                  campaignLog={campaignLog}
                  time={count}
                  width={Math.min(width - s * 2, MAX_WIDTH)}
                />
              )}
            </View>
          </View>
        );
      }
      case 'investigator_count':
        const section = campaignLog.investigatorSections[id];
        return (
          <View style={space.paddingSideS}>
            { !!section && (
              <CampaignLogSuppliesComponent
                sectionId={id}
                title={title}
                section={section}
                campaignGuide={campaignGuide}
                campaignLog={campaignLog}
                width={width - s * 2}
              />
            ) }
          </View>
        );
      case 'supplies': {
        const section = campaignLog.investigatorSections[id];
        return (
          <View style={[space.paddingSideS, space.paddingBottomM]}>
            <DeckBubbleHeader title={title} />
            { !!section && (
              <CampaignLogSuppliesComponent
                sectionId={id}
                section={section}
                campaignGuide={campaignGuide}
                campaignLog={campaignLog}
                width={width - s * 2}
              />
            ) }
          </View>
        );
      }
      case 'partner': {
        return (
          <View style={[space.paddingSideS, space.paddingBottomM, styles.column, { width }]}>
            <View style={{ maxWidth: MAX_WIDTH }}>
              <DeckBubbleHeader inverted title={title} />
              { !!partners && (
                <CampaignLogPartnersComponent
                  partners={partners}
                  campaignLog={campaignLog}
                  width={Math.min(MAX_WIDTH, width - s * 2)}
                />
              ) }
            </View>
          </View>
        );
      }
      case 'checklist':
        return (
          <View style={[space.paddingSideS, space.paddingBottomM]}>
            <DeckBubbleHeader inverted title={title} />
            { !!checklist && (
              <CampaignLogChecklistComponent
                sectionId={id}
                checklist={checklist}
                campaignLog={campaignLog}
              />
            )}
          </View>
        );
      case 'scarlet_keys':
        return (
          <View style={[space.paddingSideS, space.paddingBottomM]}>
            <DeckBubbleHeader inverted title={title} />
            { !!keys && (
              <CampaignLogScarletKeysComponent
                keys={keys}
                campaignLog={campaignLog}
              />
            )}
          </View>
        );
      case 'relationship':
      default: {
        const section = campaignLog.sections[id];
        if (CARD_REGEX.test(id) || type === 'relationship') {
          return (
            <View style={[space.paddingTopS, space.paddingSideS]}>
              <CardSection
                code={id}
                campaignGuide={campaignGuide}
                section={section}
                width={width - s * 2}
                isRelationship={type === 'relationship'}
              />
            </View>
          );
        }
        return (
          <View style={space.paddingSideS}>
            <DeckBubbleHeader title={title} crossedOut={section && section.sectionCrossedOut} />
            { !!section && (
              <View style={[space.paddingTopS, space.paddingSideS, space.paddingBottomS]}>
                <CampaignLogSectionComponent
                  sectionId={id}
                  campaignGuide={campaignGuide}
                  section={section}
                  interScenarioId={interScenarioId}
                />
              </View>
            ) }
          </View>
        );
      }
    }
  }, [campaignLog, campaignGuide, width, interScenarioId, colon]);

  const oddsCalculatorPressed = useCallback(() => {
    showGuideChaosBagOddsCalculator(componentId, campaignId, campaignLog.chaosBag, campaignLog.investigatorCodesSafe(), scenarioId, standalone, processedCampaign);
  }, [componentId, campaignId, campaignLog, scenarioId, standalone, processedCampaign]);

  const chaosBagSimulatorPressed = useCallback(() => {
    showGuideDrawChaosBag(
      componentId,
      campaignId,
      campaignLog.investigatorCodesSafe(),
      scenarioId,
      standalone,
    );
  }, [componentId, campaignId, campaignLog, scenarioId, standalone]);

  const chaosBagSection = useMemo(() => {
    if (hideChaosBag) {
      return null;
    }
    if (!keys(campaignLog.chaosBag).length && !standalone) {
      return null;
    }
    const tokenCount = sum(values(campaignLog.chaosBag));
    return (
      <View style={[space.paddingSideS, space.paddingBottomM]}>
        <DeckBubbleHeader title={t`Chaos Bag (${tokenCount})`} />
        <View style={space.paddingSideS}>
          <ChaosBagLine
            chaosBag={campaignLog.chaosBag}
            width={width - m * 2}
          />
          { !hideChaosBagButtons && (
            <>
              <DeckButton
                thin
                icon="chaos_bag"
                title={t`Draw chaos tokens`}
                onPress={chaosBagSimulatorPressed}
                topMargin={s}
                bottomMargin={m}
              />
              <DeckButton
                thin
                icon="difficulty"
                title={t`Odds calculator`}
                onPress={oddsCalculatorPressed}
              />
            </>
          ) }
        </View>
      </View>
    );
  }, [campaignLog, hideChaosBagButtons, chaosBagSimulatorPressed, oddsCalculatorPressed, width, hideChaosBag, standalone]);
  return (
    <View style={[backgroundStyle, space.paddingBottomM]}>
      { chaosBagSection }
      { flatMap(campaignGuide.campaignLogSections(), log => {
        if (log.hidden) {
          return null;
        }
        return (
          <View key={log.id}>
            { renderLogEntrySectionContent(log.id, log.title, log.type, log.checklist, log.partners, log.calendar, log.scarlet_keys) }
          </View>
        );
      }) }
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

