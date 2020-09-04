import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { ScenarioResult } from '@actions/types';
import { Scenario } from '../constants';
import { EditScenarioResultProps } from '../EditScenarioResultView';
import withStyles, { StylesProps } from '@components/core/withStyles';
import typography from '@styles/typography';


interface Props {
  componentId: string;
  campaignId: number;
  index: number;
  scenarioResult: ScenarioResult;
  scenarioByCode?: { [code: string]: Scenario };
  editable?: boolean;
}

class ScenarioResultRow extends React.Component<Props & StylesProps> {
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
      gameFont,
    } = this.props;
    const resolution = scenarioResult.resolution ?
      `: ${scenarioResult.resolution}` : '';
    const scenarioCard = scenarioByCode && scenarioByCode[scenarioResult.scenarioCode];
    const scenarioName = scenarioCard ? scenarioCard.name : scenarioResult.scenario;
    const content = (
      <Text style={[typography.mediumGameFont, { fontFamily: gameFont }]}>
        { `${scenarioName}${resolution}` }
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

export default withStyles(ScenarioResultRow);
