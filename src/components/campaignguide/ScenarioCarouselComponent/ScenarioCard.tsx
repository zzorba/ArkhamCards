import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { t } from 'ttag';

import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import StyleContext from '@styles/StyleContext';
import DeckButton from '@components/deck/controls/DeckButton';
import AppIcon from '@icons/AppIcon';
import EncounterIcon from '@icons/EncounterIcon';
import space, { m } from '@styles/space';
import AddSideScenarioButton from './AddSideScenarioButton';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  componentId: string;
  scenario: ProcessedScenario;
  showScenario: (scenario: ProcessedScenario) => void;
  processedCampaign: ProcessedCampaign;
  showAlert: ShowAlert;
  isActive: boolean;
  finalScenario?: boolean;
  last?: boolean;
}

export default function ScenarioCard({ componentId, processedCampaign, showAlert, scenario, showScenario, finalScenario, last, isActive }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const [scenarioNumber, scenarioName] = useMemo(() => {
    const scenarioName = scenario.scenarioGuide.scenarioHeader();
    const actualName = scenario.scenarioGuide.scenarioName();
    if (scenario.id.replayAttempt) {
      const attempt = scenario.id.replayAttempt + 1;
      return [t`${ scenarioName } (Attempt ${ attempt })`, actualName];
    }
    return [scenarioName, actualName];
  }, [scenario.scenarioGuide, scenario.id]);
  const onPress = useCallback(() => {
    showScenario(scenario);
  }, [showScenario, scenario]);
  const light = colors.D10;
  const color = colors.D30;
  const background = colors.L10;
  const campaignResult = scenario.latestCampaignLog.campaignData.result;
  const action = useMemo(() => {
    switch (scenario.type) {
      case 'started':
        return (
          <View style={[styles.button, space.paddingBottomM]}>
            <DeckButton
              icon="right-arrow"
              title={t`Continue`}
              onPress={onPress}
              color="light_gray"
            />
          </View>
        );
      case 'playable':
        return (
          <View style={styles.button}>
            <DeckButton
              icon="right-arrow"
              title={t`Start`}
              onPress={onPress}
              color="light_gray"
            />
            <AddSideScenarioButton
              componentId={componentId}
              processedCampaign={processedCampaign}
              showAlert={showAlert}
            />
          </View>
        );
      case 'placeholder':
        if (isActive) {
          return (
            <View style={styles.button}>
              <View style={styles.row}>
                <AppIcon size={32} name="lock" color={light} />
                <Text style={[typography.large, typography.italic, { color: light }]}>
                  { t`Coming soon` }
                </Text>
              </View>
              <AddSideScenarioButton
                componentId={componentId}
                processedCampaign={processedCampaign}
                showAlert={showAlert}
              />
            </View>
          );
        }
        return (
          <View style={[styles.row, space.paddingBottomM]}>
            <AppIcon size={32} name="lock" color={light} />
            <Text style={[typography.large, typography.italic, { color: light }]}>
              { t`Coming soon` }
            </Text>
          </View>
        );
      case 'completed':
        return (
          <View style={space.paddingBottomM}>
            <TouchableOpacity onPress={onPress}>
              <View style={styles.row}>
                <AppIcon size={32} name="toggle" color={light} />
                <Text style={[space.marginLeftXs, typography.large, typography.italic, { color: light }]}>
                  { t`View results` }
                </Text>
              </View>
            </TouchableOpacity>
            { !!(finalScenario && campaignResult && campaignResult !== 'lose') && (
              <AddSideScenarioButton
                componentId={componentId}
                processedCampaign={processedCampaign}
                showAlert={showAlert}
              />
            ) }
          </View>
        );
      case 'skipped':
        return (
          <View style={[styles.row, space.paddingBottomM]}>
            <Text style={[typography.large, typography.italic, { color: light }]}>
              { t`Skipped` }
            </Text>
          </View>
        );
      case 'locked':
        return (
          <View style={[styles.row, space.paddingBottomM]}>
            <AppIcon size={32} name="lock" color={light} />
            <Text style={[typography.large, typography.italic, { color: light }]}>
              { t`Locked` }
            </Text>
          </View>
        );
    }
  }, [onPress, scenario.type, typography, light, componentId, processedCampaign, isActive, showAlert, finalScenario, campaignResult]);
  return (
    <View style={[
      space.paddingTopM,
      space.paddingLeftM,
      space.paddingRightM,
      space.marginBottomM,
      styles.card,
      { backgroundColor: background },
      shadow.large,
      last ? space.marginRightM : undefined,
    ]}>
      <View style={styles.icon}>
        <EncounterIcon size={80} color={colors.M} encounter_code={scenario.scenarioGuide.scenarioIcon()} />
      </View>
      <Text style={[typography.small, typography.italic, { color: light }]}>
        { scenarioNumber }
      </Text>
      <Text style={[typography.mediumGameFont, { color: color, marginRight: 80 }, space.marginBottomS]} numberOfLines={2}>
        { scenarioName }
      </Text>
      { action }
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: m,
    right: m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 80 + m,
  },
});
