import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import { Option } from '../../../../../data/scenario/types';
import CampaignGuide from '../../../../../data/scenario/CampaignGuide';
import typography from '../../../../../styles/typography';

interface Props {
  guide: CampaignGuide;
  option: Option;
}

export default class OptionComponent extends React.Component<Props> {
  render() {
    const { option } = this.props;
    if (option.effects) {
      return <Text>Effects: {JSON.stringify(option.effects)}</Text>;
    }
    if (option.steps) {
      return <Text>Steps: {JSON.stringify(option.steps)}</Text>;
    }
    if (option.resolution) {
      return <Text>Resolution: {JSON.stringify(option.resolution)}</Text>;
    }
    return <Text>Unknown Option</Text>;
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})
