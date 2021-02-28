import React, { useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaignScenarios } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import { completedScenario } from './constants';
import StyleContext from '@styles/StyleContext';
import { showAddScenarioResult } from './nav';
import { NavigationProps } from '@components/nav/types';
import space, { m, s } from '@styles/space';
import { EditScenarioResultProps } from './EditScenarioResultView';
import CampaignScenarioButton from './CampaignScenarioButton';
import DeckButton from '@components/deck/controls/DeckButton';

export interface CampaignScenariosViewProps {
  campaignId: CampaignId;
}

function ScenarioResultButton({ name, campaignId, componentId, code, status, index, onPress }: {
  name: string;
  campaignId: CampaignId;
  componentId: string;
  status: 'completed' | 'playable';
  index: number;
  code?: string;
  onPress?: (code?: string) => void;
}) {
  const buttonOnPress = useCallback(() => {
    if (onPress) {
      onPress(code);
    } else {
      Navigation.push<EditScenarioResultProps>(componentId, {
        component: {
          name: 'Campaign.EditResult',
          passProps: {
            campaignId,
            index,
          },
        },
      });
    }
  }, [componentId, campaignId, index, code, onPress]);
  return (
    <CampaignScenarioButton
      onPress={buttonOnPress}
      status={status}
      title={name}
    />
  );
}


export default function CampaignScenariosView({ campaignId, componentId }: CampaignScenariosViewProps & NavigationProps) {
  const { backgroundStyle } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  const [cycleScenarios] = useCampaignScenarios(campaign);

  const addScenarioResultPressed = useCallback((code?: string) => {
    showAddScenarioResult(componentId, campaignId, code);
  }, [campaignId, componentId]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  const hasCompletedScenario = completedScenario(campaign.scenarioResults);
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        { !(campaign.scenarioResults?.length === 0 && cycleScenarios.length === 0) && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            { map(campaign.scenarioResults, (scenario, idx) => {
              return (
                <ScenarioResultButton
                  key={idx}
                  componentId={componentId}
                  campaignId={campaignId}
                  name={scenario.interlude ? scenario.scenario : `${scenario.scenario} (${scenario.resolution}, ${scenario.xp || 0} XP)`}
                  index={idx}
                  status="completed"
                />
              );
            }) }
            { map(
              filter(cycleScenarios, scenario => !hasCompletedScenario(scenario)),
              (scenario, idx) => (
                <ScenarioResultButton
                  key={idx}
                  componentId={componentId}
                  campaignId={campaignId}
                  name={scenario.name}
                  code={scenario.code}
                  index={-1}
                  status="playable"
                  onPress={addScenarioResultPressed}
                />
              ))
            }
          </View>
        ) }
        <View style={space.paddingSideS}>
          <DeckButton
            icon="finish"
            title={t`Add scenario result`}
            detail={t`Record completed scenario`}
            onPress={addScenarioResultPressed}
            color="dark_gray"
            topMargin={s}
            bottomMargin={m}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
