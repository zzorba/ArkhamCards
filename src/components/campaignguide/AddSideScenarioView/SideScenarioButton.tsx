import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import EncounterIcon from '@icons/EncounterIcon';
import NavButton from '@components/core/NavButton';
import { ChallengeData, Scenario } from '@data/scenario/types';
import space, { s, m } from '@styles/space';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import { ChallengeScenarioProps } from '@components/campaignguide/ChallengeScenarioView';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  scenario: Scenario;
  onPress: (scenario: Scenario) => void;
}

function ChallengeBlock({ scenario, challenge }: { scenario: Scenario; challenge: ChallengeData }) {
  const { typography } = useContext(StyleContext);
  const xpCost = scenario.xp_cost || 0;
  const challengeCost = xpCost + challenge.xp_cost;
  return (
    <SingleCardWrapper code={challenge.investigator} type="player">
      { investigator => (
        <View style={styles.flex}>
          <Text style={[typography.small, space.paddingTopS]}>
            { t`${investigator.name} Challenge Scenario` }
          </Text>
          <Text style={[typography.small, typography.light, space.paddingTopS]}>
            { t`Experience cost: ${challengeCost} for ${investigator.name}, ${xpCost} for each other investigator` }
          </Text>
        </View>
      ) }
    </SingleCardWrapper>
  );
}
export default function SideScenarioButton({ scenario, onPress, componentId }: Props) {
  const { typography, colors } = useContext(StyleContext);

  const _onPress = () => {
    onPress(scenario);
  };

  const _onPressChallenge = () => {
    if (scenario.challenge) {
      Navigation.push<ChallengeScenarioProps>(componentId, {
        component: {
          name: 'Guide.ChallengeScenario',
          passProps: {
            scenario,
            challenge: scenario.challenge,
            onPress,
          },
          options: {
            topBar: {
              title: {
                text: scenario.scenario_name,
              },
              subtitle: {
                text: t`Challenge Scenario`,
              },
              backButton: {
                title: t`Cancel`,
              },
            },
          },
        },
      });
    }
  };
  const xpCost = scenario.xp_cost || 0;
  return (
    <NavButton
      onPress={scenario.side_scenario_type === 'challenge' && scenario.challenge ? _onPressChallenge : _onPress}
    >
      <View style={[styles.row, space.paddingTopS, space.paddingBottomS]}>
        <View style={styles.icon}>
          <EncounterIcon
            encounter_code={scenario.id}
            size={28}
            color={colors.darkText}
          />
        </View>
        <View style={styles.column}>
          <Text style={typography.text}>
            { scenario.scenario_name }
          </Text>
          { (scenario.side_scenario_type === 'challenge' && !!scenario.challenge) ? (
            <ChallengeBlock challenge={scenario.challenge} scenario={scenario} />
          ) : (
            <Text style={[typography.small, typography.light, space.paddingTopS]}>
              { t`Experience cost: ${xpCost}` }
            </Text>
          ) }
        </View>
      </View>
    </NavButton>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  icon: {
    marginLeft: s,
    marginRight: m,
    width: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
