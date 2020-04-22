import React from 'react';
import { Text, View } from 'react-native';
import { t } from 'ttag';

import NavButton from 'components/core/NavButton';
import { Scenario } from 'data/scenario/types';
import typography from 'styles/typography';
import space from 'styles/space';

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
        <View style={[space.paddingTopS, space.paddingBottomS]}>
          <Text style={typography.text}>{ scenario.scenario_name }</Text>
          <Text style={[typography.label, typography.darkGray, space.paddingTopS]}>
            { t`Experience cost for each investigator: ${xpCost}` }
          </Text>
        </View>
      </NavButton>
    );
  }
}
