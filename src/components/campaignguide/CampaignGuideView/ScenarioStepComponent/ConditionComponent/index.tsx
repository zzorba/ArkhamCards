import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { t } from 'ttag';

import CardWrapper from '../CardWrapper';
import {
  Condition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  ScenarioDataCondition,
} from 'data/scenario/types';
import Card from 'data/Card';
import CampaignGuide from 'data/scenario/CampaignGuide';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  condition: Condition;
}

export default class ConditionComponent extends React.Component<Props> {

}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})
