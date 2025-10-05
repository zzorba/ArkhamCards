import React, { useCallback, useContext } from 'react';
import { Text } from 'react-native';


import { TouchableOpacity } from '@components/core/Touchables';
import { CampaignId, ScenarioResult } from '@actions/types';
import { Scenario } from '../constants';
import StyleContext from '@styles/StyleContext';
import { useNavigation } from '@react-navigation/native';

interface Props {
  campaignId: CampaignId;
  index: number;
  scenarioResult: ScenarioResult;
  scenarioByCode?: { [code: string]: Scenario };
  editable?: boolean;
}

export default function ScenarioResultRow({ campaignId, index, scenarioResult, scenarioByCode, editable }: Props) {
  const { typography } = useContext(StyleContext);
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate('Campaign.EditResult', {
      campaignId,
      index,
    });
  }, [navigation, campaignId, index]);

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
