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
  last?: boolean;
}

export default function ScenarioCard({ componentId, processedCampaign, showAlert, scenario, showScenario, last }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  const [scenarioNumber, scenarioName] = useMemo(() => {
    const fullScenarioName = scenario.scenarioGuide.fullScenarioName();
    const splitPoint = fullScenarioName.indexOf(':');
    return [
      fullScenarioName.substr(0, splitPoint),
      fullScenarioName.substr(splitPoint + 1),
    ];
  }, [scenario.scenarioGuide]);
  const onPress = useCallback(() => {
    showScenario(scenario);
  }, [showScenario, scenario]);
  const light = colors.D10;
  const color = colors.D30;
  const background = colors.L10;
  const action = useMemo(() => {
    switch (scenario.type) {
      case 'started':
        return (
          <View style={styles.button}>
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
      case 'completed':
        return (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.row}>
              <AppIcon size={32} name="toggle" color={light} />
              <Text style={[space.marginLeftXs, typography.large, typography.italic, { color: light }]}>
                { t`View results` }
              </Text>
            </View>
          </TouchableOpacity>
        );
      case 'skipped':
        return (
          <View style={styles.row}>
            <Text style={[typography.large, typography.italic, { color: light }]}>
              { t`Skipped` }
            </Text>
          </View>
        );
      case 'locked':
      case 'placeholder':
        return (
          <View style={styles.row}>
            <AppIcon size={32} name="lock" color={color} />
            <Text style={[typography.large, typography.italic, { color: light }]}>
              { scenario.type === 'placeholder' ? t`Coming soon` : t`Locked` }
            </Text>
          </View>
        );
    }
  }, [onPress, scenario.type, typography, light, color, componentId, processedCampaign, showAlert]);
  return (
    <View style={[
      space.paddingM,
      space.marginBottomM,
      styles.card,
      { backgroundColor: background },
      shadow.large,
      last ? space.marginRightM : undefined,
    ]}>
      <Text style={[typography.small, typography.italic, { color: light }]}>
        { scenarioNumber.trim() }
      </Text>
      <Text style={[typography.mediumGameFont, { color: color }, space.marginBottomS]}>
        { scenarioName.trim() }
      </Text>
      { action }
      <View style={styles.icon}>
        <EncounterIcon size={80} color={colors.M} encounter_code={scenario.scenarioGuide.scenarioIcon()} />
      </View>
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
