import React, { useCallback, useContext } from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { CampaignId, ScenarioResult } from '@actions/types';
import { Scenario } from '../constants';
import { EditScenarioResultProps } from '../EditScenarioResultView';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  index: number;
  scenarioResult: ScenarioResult;
  scenarioByCode?: { [code: string]: Scenario };
  editable?: boolean;
}

export default function ScenarioResultRow({ componentId, campaignId, index, scenarioResult, scenarioByCode, editable }: Props) {
  const { typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    Navigation.push<EditScenarioResultProps>(componentId, {
      component: {
        name: 'Campaign.EditResult',
        passProps: {
          campaignId,
          index,
        },
      },
    });
  }, [componentId, campaignId, index]);

  const resolution = scenarioResult.resolution ? `: ${scenarioResult.resolution}` : '';
  const scenarioCard = scenarioByCode && scenarioByCode[scenarioResult.scenarioCode];
  const scenarioName = scenarioCard ? scenarioCard.name : scenarioResult.scenario;
  const content = (
    <Text style={typography.mediumGameFont}>
      { `${scenarioName}${resolution}` }
    </Text>
  );
  if (!editable) {
    return content;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      { content }
    </TouchableOpacity>
  );
}
