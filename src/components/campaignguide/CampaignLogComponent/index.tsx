import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { flatMap, keys, sum, values } from 'lodash';
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
import { Partner } from '@data/scenario/types';
import LanguageContext from '@lib/i18n/LanguageContext';

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
}

interface CardSectionProps {
  code: string;
  section?: EntrySection;
  campaignGuide: CampaignGuide;
  width: number;
}

function CardSection({ code, section, campaignGuide, width }: CardSectionProps) {
  const [card] = useSingleCard(code, 'encounter');
  const eliminated = !!section?.sectionCrossedOut;
  const header = useMemo(() => {
    return <CompactInvestigatorRow transparent investigator={card} eliminated={eliminated} width={width} open={!eliminated} />
  }, [card, eliminated, width]);
  if (eliminated) {
    return header;
  }
  return (
    <RoundedFactionBlock
      header={header}
      faction="neutral"
    >
      { !!section && (
        <View style={[space.paddingTopM, space.paddingSideS]}>
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
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { colon } = useContext(LanguageContext);
  const renderLogEntrySectionContent = useCallback((id: string, title: string, type?: 'investigator_count' | 'count' | 'supplies' | 'header' | 'partner', partners?: Partner[]) => {
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
          <View style={space.paddingSideS}>
            <DeckBubbleHeader inverted title={`${title}${colon}${count}`} />
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
          <View style={[space.paddingSideS, space.paddingBottomM]}>
            <DeckBubbleHeader inverted title={title} />
            { !!partners && (
              <CampaignLogPartnersComponent
                partners={partners}
                campaignLog={campaignLog}
                width={width - s * 2}
              />
            ) }
          </View>
        );
      }
      default: {
        const section = campaignLog.sections[id];
        if (CARD_REGEX.test(id)) {
          return (
            <View style={[space.paddingTopS, space.paddingSideS]}>
              <CardSection code={id} campaignGuide={campaignGuide} section={section} width={width - s * 2} />
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
    showGuideChaosBagOddsCalculator(componentId, campaignId, campaignLog.chaosBag, campaignLog.investigatorCodesSafe(), scenarioId, standalone);
  }, [componentId, campaignId, campaignLog, scenarioId, standalone]);

  const chaosBagSimulatorPressed = useCallback(() => {
    showGuideDrawChaosBag(
      componentId,
      campaignId,
      campaignLog.chaosBag,
      campaignLog.investigatorCodesSafe(),
      scenarioId,
      standalone
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
        </View>
      </View>
    );
  }, [campaignLog, chaosBagSimulatorPressed, oddsCalculatorPressed, width, hideChaosBag, standalone]);
  return (
    <View style={[backgroundStyle, space.paddingBottomM]}>
      { chaosBagSection }
      { flatMap(campaignGuide.campaignLogSections(), log => {
        if (log.type === 'hidden') {
          return null;
        }
        return (
          <View key={log.id}>
            { renderLogEntrySectionContent(log.id, log.title, log.type, log.partners) }
          </View>
        );
      }) }
    </View>
  );
}
