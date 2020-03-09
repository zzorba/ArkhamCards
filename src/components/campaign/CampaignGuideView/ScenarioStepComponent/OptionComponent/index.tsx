import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import { Option } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  option: Option;
}

export default class OptionComponent extends React.Component<Props> {
  renderResults() {
    const { option, guide } = this.props;
    if (option.effects) {
      return (
        <EffectsComponent
          effects={option.effects}
          guide={guide}
        />
      );
    }
    if (option.steps) {
      return <Text>Steps: { JSON.stringify(option.steps) }</Text>;
    }
    if (option.resolution) {
      return <Text>Resolution: { JSON.stringify(option.resolution) }</Text>;
    }
    return <Text>Unknown Results</Text>;
  }

  renderOption() {
    const { option } = this.props;
    if (option.condition) {
      return (
        <Text>{option.condition}</Text>
      );
    }
    if (option.boolCondition !== undefined) {
      return (
        <Text>{option.boolCondition ? t`True` : t`False`}</Text>
      );
    }
    return <Text>Num: {option.numCondition}</Text>;
  }

  render() {
    return (
      <View>
        { this.renderOption() }
        { this.renderResults() }
      </View>
    );
  }
}
