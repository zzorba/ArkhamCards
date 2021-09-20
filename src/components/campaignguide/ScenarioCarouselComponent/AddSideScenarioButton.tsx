import React, { useCallback, useContext, useMemo } from 'react';
import { find, findLast, findLastIndex } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { AddSideScenarioProps } from '@components/campaignguide/AddSideScenarioView';
import { ProcessedCampaign } from '@data/scenario';
import { ShowAlert } from '@components/deck/dialogs';
import CampaignGuideContext from '../CampaignGuideContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space, { m } from '@styles/space';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  showAlert: ShowAlert;
}

export default function AddSideScenarioButton({ componentId, processedCampaign, showAlert }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const { campaignId, campaignGuide, campaignState } = useContext(CampaignGuideContext);
  const canAddScenario = useMemo(() => {
    const lastCompletedScenarioIndex = findLastIndex(
      processedCampaign.scenarios,
      scenario => scenario.type === 'completed'
    );
    if (processedCampaign.campaignLog.campaignData.result === 'lose') {
      return false;
    }
    // Have to have completed a scenario
    if (lastCompletedScenarioIndex === -1) {
      return false;
    }
    if (lastCompletedScenarioIndex + 1 < processedCampaign.scenarios.length) {
      const lastScenario = processedCampaign.scenarios[lastCompletedScenarioIndex];
      const nextScenario = processedCampaign.scenarios[lastCompletedScenarioIndex + 1];
      if (lastScenario.id.scenarioId === nextScenario.id.scenarioId) {
        // Can't insert a scenario in the middle of a replay-loop.
        return false;
      }
    }
    const scenarioInProgress = !!find(
      processedCampaign.scenarios,
      scenario => scenario.type === 'started'
    );
    if (scenarioInProgress) {
      return false;
    }
    const completedActualScenario = find(
      processedCampaign.scenarios,
      scenario =>
        scenario.type === 'completed' &&
        (scenario.scenarioGuide.scenarioType() === 'scenario')
    );
    if (!completedActualScenario) {
      return false;
    }

    const nextScenario = campaignGuide.nextScenario(
      campaignState,
      processedCampaign.campaignLog,
      false
    );
    if (nextScenario && (nextScenario.scenario.type === 'interlude' && !nextScenario.scenario.allow_side_scenario)) {
      // Can't break up an interlude and a scenario.
      return false;
    }
    if (nextScenario && nextScenario.scenario.type === 'epilogue') {
      return false;
    }
    return true;
  }, [processedCampaign.scenarios, processedCampaign.campaignLog, campaignGuide, campaignState]);

  const onPress = useCallback(() => {
    if (!canAddScenario) {
      showAlert(
        t`Can't add side scenario right now.`,
        t`Side scenarios cannot be added to a campaign until the previous scenario and following interludes are completed.`
      );
      return;
    }
    const lastCompletedScenario = findLast(
      processedCampaign.scenarios,
      scenario => scenario.type === 'completed'
    );
    if (!lastCompletedScenario) {
      return null;
    }
    Navigation.push<AddSideScenarioProps>(componentId, {
      component: {
        name: 'Guide.SideScenario',
        passProps: {
          campaignId,
          latestScenarioId: lastCompletedScenario.id,
        },
        options: {
          topBar: {
            title: {
              text: t`Choose Side-Scenario`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, processedCampaign.scenarios, canAddScenario, showAlert]);
  if (!canAddScenario) {
    return <View style={{ height: m }} />;
  }
  return (
    <View style={[space.paddingTopS, space.paddingBottomS]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.row}>
          <View style={space.paddingRightS}>
            <AppIcon name="plus" size={20} color={colors.D10} />
          </View>
          <Text style={[typography.button, typography.italic, { color: colors.D10 }, space.marginTopXs]}>{t`Add side scenario`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
