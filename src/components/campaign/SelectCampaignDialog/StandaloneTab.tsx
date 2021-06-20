import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { forEach, map, sortBy, head } from 'lodash';
import { t } from 'ttag';

import { CampaignCycleCode, StandaloneId } from '@actions/types';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { getStandaloneScenarios, StandaloneScenarioInfo } from '@data/scenario';
import StandaloneItem from './StandaloneItem';
import { campaignName } from '../constants';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface SelectCampagaignProps {
  standaloneChanged: (id: StandaloneId, text: string, hasGuide: boolean) => void;
}

export default function StandaloneTab({ standaloneChanged }: SelectCampagaignProps) {
  const { lang } = useContext(LanguageContext);
  const scenarios = useMemo(() => getStandaloneScenarios(lang), [lang]);
  const sections = useMemo(() => {
    const groups: { [campaign: string]: StandaloneScenarioInfo[] } = {};
    forEach(scenarios, scenario => {
      if (!groups[scenario.campaign]) {
        groups[scenario.campaign] = [];
      }
      groups[scenario.campaign].push(scenario);
    });

    const allSections: {
      header: string;
      scenarios: StandaloneScenarioInfo[];
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


  const renderStandalone = useCallback((scenario: StandaloneScenarioInfo) => {
    return (
      <StandaloneItem
        id={scenario.id}
        key={scenario.code}
        packCode={scenario.code}
        onPress={onPress}
        text={scenario.name}
      />
    );
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
