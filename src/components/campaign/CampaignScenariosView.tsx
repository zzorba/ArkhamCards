import React, { useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { filter, map } from 'lodash';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaignScenarios } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import { completedScenario } from './constants';
import StyleContext from '@styles/StyleContext';
import { showAddScenarioResult } from './nav';
import space, { m, s } from '@styles/space';
import CampaignScenarioButton from './CampaignScenarioButton';
import DeckButton from '@components/deck/controls/DeckButton';
import { BasicStackParamList } from '@navigation/types';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';

export interface CampaignScenariosViewProps {
  campaignId: CampaignId;
}

function ScenarioResultButton({ name, campaignId, code, status, index, onPress }: {
  name: string;
  campaignId: CampaignId;
  status: 'completed' | 'playable';
  index: number;
  code?: string;
  onPress?: (code?: string) => void;
}) {
  const navigation = useNavigation();
  const buttonOnPress = useCallback(() => {
    if (onPress) {
      onPress(code);
    } else {
      navigation.navigate('Campaign.EditResult', {
        campaignId,
        index,
      });
    }
  }, [campaignId, index, code, onPress, navigation]);
  return (
    <CampaignScenarioButton
      onPress={buttonOnPress}
      status={status}
      title={name}
    />
  );
}


export default function CampaignScenariosView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Campaign.Scenarios'>>();
  const { campaignId } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  const [cycleScenarios] = useCampaignScenarios(campaign);
  useDismissOnCampaignDeleted(navigation, campaign);

  const addScenarioResultPressed = useCallback((code?: string) => {
    showAddScenarioResult(navigation, campaignId, code);
  }, [campaignId, navigation]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  const scenarioResults = campaign.scenarioResults;
  const hasCompletedScenario = completedScenario(scenarioResults);
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        { !(scenarioResults.length === 0 && cycleScenarios.length === 0) && (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            { map(scenarioResults, (scenario, idx) => {
              const resolution = scenario.resolution;
              const scenarioXp = scenario.xp || 0;
              return (
                <ScenarioResultButton
                  key={idx}
                  campaignId={campaignId}
                  name={scenario.interlude ? scenario.scenario : t`${scenario.scenario} (${resolution}, ${scenarioXp} XP)`}
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
