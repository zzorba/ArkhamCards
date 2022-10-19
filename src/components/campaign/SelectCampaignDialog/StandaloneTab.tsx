import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { forEach, map, sortBy, head } from 'lodash';
import { c, t } from 'ttag';

import { CampaignCycleCode, GUIDED_CAMPAIGNS, StandaloneId, STANDALONE_CAMPAGINS } from '@actions/types';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { getStandaloneScenarios, StandaloneInfo, StandaloneScenarioInfo } from '@data/scenario';
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
      if (!groups[scenario.campaign]) {
        groups[scenario.campaign] = [];
      }
      groups[scenario.campaign].push(scenario);
    });
    forEach(STANDALONE_CAMPAGINS, campaign => {
      if (!groups.side) {
        groups.side = [];
      }
      groups.side.push()
    })

    const allSections: {
      header: string;
      scenarios: StandaloneInfo[];
      position: number;
    }[] = [];
    forEach(groups, (group, campaign) => {
      const item = head(group);
      if (campaign !== 'side' && item) {
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
    } else {
      return (
        <CycleItem
          key={scenario.code}
          packCode={scenario.id}
          onPress={onPressCampaign}
          text={campaignName(scenario.id) || c('campaign').t`Custom`}
          description={campaignDescription(scenario.id)}
        />
      )
    }
  }, [onPress]);
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
