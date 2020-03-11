import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioStateHelper from '../../ScenarioStateHelper';
import { CounterInput } from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  input: CounterInput;
  onCountChange: (count: number) => void;
  scenarioState: ScenarioStateHelper;
  guide: CampaignGuide;
  scenario: ScenarioGuide;
}

interface State {
  count: number;
}

export default class InputCounter extends React.Component<Props, State> {
  state: State = {
    count: 0,
  };

  _inc = () => {
    this.setState(state => {
      return {
        count: state.count + 1,
      };
    });
  };

  _dec = () => {
    this.setState(state => {
      return {
        count: Math.max(state.count - 1, 0),
      };
    });
  };

  renderCount() {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center]}>
          {this.state.count}
        </Text>
      </View>
    );
  }

  render() {
    const { input } = this.props;
    return (
      <View>
        <Text>
          {input.text}
        </Text>
        <PlusMinusButtons
          count={this.state.count}
          onIncrement={this._inc}
          onDecrement={this._dec}
          countRender={this.renderCount()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: 4,
    paddingRight: 4,
    minWidth: 40,
  }
})
