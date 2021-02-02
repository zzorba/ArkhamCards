import React, { useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useCampaign, useCampaignScenarios } from '@components/core/hooks';
import { completedScenario } from './constants';
import StyleContext from '@styles/StyleContext';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { showAddScenarioResult } from './nav';
import { NavigationProps } from '@components/nav/types';
import ArkhamButton from '@components/core/ArkhamButton';
import space from '@styles/space';
import { EditScenarioResultProps } from './EditScenarioResultView';
import CampaignScenarioButton from './CampaignScenarioButton';

export interface CampaignScenariosViewProps {
  campaignId: CampaignId;
}

function ScenarioResultButton({ name, campaignId, componentId, status, index, onPress }: {
  name: string;
  campaignId: CampaignId;
  componentId: string;
  status: 'completed' | 'playable';
  index: number;
  onPress?: () => void;
}) {
  const buttonOnPress = useCallback(() => {
    if (onPress) {
      onPress();
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
  }, [componentId, campaignId, index, onPress]);
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

  const addScenarioResultPressed = useCallback(() => {
    showAddScenarioResult(componentId, campaignId);
  }, [campaignId, componentId]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  const hasCompletedScenario = completedScenario(campaign.scenarioResults);
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        { (campaign.scenarioResults.length === 0 && cycleScenarios.length === 0) ? (
          <ArkhamButton
            icon="expand"
            title={t`Record Scenario Result`}
            onPress={addScenarioResultPressed}
          />
        ) : (
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <RoundedFactionBlock faction="neutral"
              header={undefined}
              footer={<RoundedFooterButton icon="expand" title={t`Record Scenario Result`} onPress={addScenarioResultPressed} />}
            >
              { map(campaign.scenarioResults, (scenario, idx) => {
                console.log(campaign);
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
                    index={-1}
                    status="playable"
                    onPress={addScenarioResultPressed}
                  />
                ))
              }
            </RoundedFactionBlock>
          </View>
        ) }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
