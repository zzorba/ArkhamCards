import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import EncounterIcon from 'icons/EncounterIcon';
import NavButton from 'components/core/NavButton';
import { Scenario } from 'data/scenario/types';
import typography from 'styles/typography';
import space, { s, m } from 'styles/space';

interface Props {
  scenario: Scenario;
  fontScale: number;
  onPress: (scenario: Scenario) => void;
}

export default class SideScenarioButton extends React.Component<Props> {
  _onPress = () => {
    const { scenario, onPress } = this.props;
    onPress(scenario);
  };

  render() {
    const { fontScale, scenario } = this.props;
    const xpCost = scenario.xp_cost || 0;
    return (
      <NavButton
        fontScale={fontScale}
        onPress={this._onPress}
      >
        <View style={[styles.row, space.paddingTopS, space.paddingBottomS]}>
          <View style={styles.icon}>
            <EncounterIcon
              encounter_code={scenario.id}
              size={28}
              color="#000000"
            />
          </View>
          <View>
            <Text style={typography.text}>{ scenario.scenario_name }</Text>
            <Text style={[typography.label, typography.darkGray, space.paddingTopS]}>
              { t`Experience cost: ${xpCost}` }
            </Text>
          </View>
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
