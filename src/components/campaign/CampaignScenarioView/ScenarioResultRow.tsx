import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { ScenarioResult } from 'actions/types';
import { Scenario } from '../constants';
import { EditScenarioResultProps } from '../EditScenarioResultView';
import typography from 'styles/typography';

interface Props {
  componentId: string;
  campaignId: number;
  index: number;
  scenarioResult: ScenarioResult;
  scenarioByCode?: { [code: string]: Scenario };
  editable?: boolean;
}

export default class ScenarioResultRow extends React.Component<Props> {
  _onPress = () => {
    const {
      componentId,
      campaignId,
      index,
    } = this.props;
    Navigation.push<EditScenarioResultProps>(componentId, {
      component: {
        name: 'Campaign.EditResult',
        passProps: {
          campaignId,
          index,
        },
      },
    });
  };

  render() {
    const {
      scenarioResult,
      scenarioByCode,
      editable,
    } = this.props;
    const resolution = scenarioResult.resolution ?
      `: ${scenarioResult.resolution}` : '';
    const xp = ((scenarioResult.xp || 0) > 0 || !scenarioResult.interlude) ?
      ` (${scenarioResult.xp} XP)` : '';
    const scenarioCard = scenarioByCode && scenarioByCode[scenarioResult.scenarioCode];
    const scenarioName = scenarioCard ? scenarioCard.name : scenarioResult.scenario;
    const content = (
      <Text style={typography.gameFont}>
        { `${scenarioName}${resolution}${xp}` }
      </Text>
    );
    if (!editable) {
      return content;
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        { content }
      </TouchableOpacity>
    );
  }
}
