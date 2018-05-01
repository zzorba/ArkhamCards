import React from 'react';
import PropTypes from 'prop-types';
import { head, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';

import LabeledTextBox from '../core/LabeledTextBox';

const CUSTOM = 'Custom';

export default class ScenarioSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    scenarioChanged: PropTypes.func.isRequired,
    allScenarios: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const nextScenario = head(props.allScenarios);
    this.state = {
      selectedScenario: nextScenario ? nextScenario.name : null,
      customScenario: null,
    };

    this._updateManagedScenario = this.updateManagedScenario.bind(this);
    this._scenarioPressed = this.scenarioPressed.bind(this);
    this._customScenarioTextChanged = this.customScenarioTextChanged.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
  }

  componentDidMount() {
    this.updateManagedScenario();
  }

  updateManagedScenario() {
    const {
      selectedScenario,
      customScenario,
    } = this.state;

    this.props.scenarioChanged(
      selectedScenario === CUSTOM ? customScenario : selectedScenario);
  }

  scenarioChanged(value) {
    this.setState({
      selectedScenario: value,
    }, this._updateManagedScenario);
  }

  customScenarioTextChanged(value) {
    this.setState({
      customScenario: value,
    }, this._updateManagedScenario);
  }

  scenarioPressed() {
    const {
      navigator,
    } = this.props;
    navigator.showLightBox({
      screen: 'Dialog.Scenario',
      passProps: {
        scenarioChanged: this._scenarioChanged,
        scenarios: this.possibleScenarios(),
        selected: this.state.selectedScenario,
      },
      style: {
        backgroundColor: 'rgba(128,128,128,.75)',
      },
    });
  }

  possibleScenarios() {
    const {
      allScenarios,
    } = this.props;
    const scenarios = map(allScenarios, card => card.name);
    scenarios.push(CUSTOM);
    return scenarios;
  }

  render() {
    const {
      selectedScenario,
      customScenario,
    } = this.state;

    return (
      <View>
        <LabeledTextBox
          label="Scenario"
          onPress={this._scenarioPressed}
          value={selectedScenario}
          style={styles.margin}
        />
        { selectedScenario === CUSTOM && (
          <View style={styles.row}>
            <Input
              placeholder="Custom Scenario Name"
              onChangeText={this._customScenarioTextChanged}
              value={customScenario}
            />
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
