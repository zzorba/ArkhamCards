import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { forEach, map, sortBy, head } from 'lodash';
import { c, t } from 'ttag';

import { CampaignCycleCode, GUIDED_CAMPAIGNS, StandaloneId } from '@actions/types';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { getStandaloneScenarios, StandaloneInfo } from '@data/scenario';
import StandaloneItem from './StandaloneItem';
import { campaignDescription, campaignName } from '../constants';
import LanguageContext from '@lib/i18n/LanguageContext';
import CycleItem from './CycleItem';

export interface SelectCampagaignProps {
  standaloneChanged: (id: StandaloneId, text: string, hasGuide: boolean) => void;
  campaignChanged: (packCode: CampaignCycleCode, text: string, hasGuide: boolean) => void;
}

export default function StandaloneTab({ campaignChanged, standaloneChanged }: SelectCampagaignProps) {
  const { lang } = useContext(LanguageContext);
  const scenarios = useMemo(() => getStandaloneScenarios(lang), [lang]);
  const sections = useMemo(() => {
    const groups: { [campaign: string]: StandaloneInfo[] } = {};
    forEach(scenarios, scenario => {
      const group = (scenario.type === 'standalone' ? scenario.specialGroup : undefined) || scenario.campaign;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(scenario);
    });

    const allSections: {
      header: string;
      scenarios: StandaloneInfo[];
      position: number;
    }[] = [];
    forEach(groups, (group, campaign) => {
      const item = head(group);
      if (campaign !== 'side' && campaign !== 'challenge' && campaign !== 'custom_side' && item) {
        allSections.push({
          header: campaignName(campaign as CampaignCycleCode) || t`Unknown campaign`,
          scenarios: sortBy(group, s => s.name),
          position: item.campaignPosition,
        });
      }
    });
    return [
      {
        header: t`Standalone`,
        scenarios: sortBy(groups.side, s => s.name),
        position: -1,
      },
      {
        header: t`Challenge Scenarios`,
        scenarios: sortBy(groups.challenge, s => s.name),
        position: -1,
      },
      {
        header: t`Fan-made Scenarios`,
        scenarios: sortBy(groups.custom_side, s => s.name),
        position: -1,
      },
      ...sortBy(allSections, s => s.position),
    ];
  }, [scenarios]);


  const onPress = useCallback((id: StandaloneId, text: string) => {
    standaloneChanged(id, text, true);
  }, [standaloneChanged]);


  const onPressCampaign = useCallback((campaignCode: CampaignCycleCode, text: string) => {
    campaignChanged(campaignCode, text, GUIDED_CAMPAIGNS.has(campaignCode));
  }, [campaignChanged]);

  const renderStandalone = useCallback((scenario: StandaloneInfo) => {
    if (scenario.type === 'standalone') {
      return (
        <StandaloneItem
          id={scenario.id}
          key={scenario.code}
          packCode={scenario.code}
          onPress={onPress}
          text={scenario.name}
        />
      );
    }
    return (
      <CycleItem
        key={scenario.code}
        packCode={scenario.id}
        onPress={onPressCampaign}
        text={campaignName(scenario.id) || c('campaign').t`Custom`}
        description={campaignDescription(scenario.id)}
      />
    );
  }, [onPress, onPressCampaign]);
  return (
    <>
      { map(sections, (section, idx) => {
        return (
          <View key={idx}>
            <CardDetailSectionHeader normalCase color="dark" title={section.header } />
            { map(section.scenarios, pack_code => renderStandalone(pack_code)) }
          </View>
        );
      }) }
    </>
  );
}
