import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, find, forEach, head, last, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import LabeledTextBox from '../../core/LabeledTextBox';
import { getAllDecks, getAllPacks, getPack } from '../../../reducers';

const CUSTOM = 'Custom';

class ScenarioSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    scenarioChanged: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    // From redux/realm
    allScenarios: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const nextScenario = head(props.allScenarios);
    this.state = {
      selectedScenario: nextScenario ? nextScenario.name : null,
      customScenario: '',
    };

    this._showCustomCampaignDialog = this.showCustomCampaignDialog.bind(this);
    this._updateManagedScenario = this.updateManagedScenario.bind(this);
    this._scenarioPressed = this.scenarioPressed.bind(this);
    this._customScenarioTextChanged = this.customScenarioTextChanged.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
  }

  componentDidMount() {
    this.updateManagedScenario();
  }

  showCustomCampaignDialog() {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      'Custom Scenario Name',
      this.state.customScenario,
      this._customScenarioTextChanged
    );
  }

  updateManagedScenario() {
    const {
      allScenarios,
    } = this.props;
    const {
      selectedScenario,
      customScenario,
    } = this.state;
    const scenarioCard = find(allScenarios, s => s.name === selectedScenario);

    this.props.scenarioChanged({
      scenario: scenarioCard ? selectedScenario : customScenario,
      scenarioCode: scenarioCard ? scenarioCard.code : CUSTOM,
    });
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
          <LabeledTextBox
            label="Name"
            onPress={this._showCustomCampaignDialog}
            value={customScenario}
            style={styles.margin}
          />
        ) }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const latestScenario = last(props.campaign.scenarioResults || []);
  const cyclePack = getPack(state, props.campaign.cycleCode);
  const allPacks = getAllPacks(state);
  const cyclePacks = !cyclePack ? [] : filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position);
  const standalonePacks = filter(allPacks, pack => pack.cycle_position === 70);
  return {
    cyclePacks,
    standalonePacks,
    decks: getAllDecks(state),
    latestScenario,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(ScenarioSection, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      const finishedScenarios = new Set(props.campaign.finishedScenarios);
      const cyclePackCodes = new Set(map(props.cyclePacks, pack => pack.code));
      const standalonePackCodes = new Set(map(props.standalonePacks, pack => pack.code));

      const allScenarioCards = results.cards
        .filtered('type_code == "scenario"')
        .sorted('position');

      const cycleScenarios = [];
      const standaloneScenarios = [];
      forEach(allScenarioCards, card => {
        if (cyclePackCodes.has(card.pack_code) && !finishedScenarios.has(card.code)) {
          cycleScenarios.push(card);
        }
        if (standalonePackCodes.has(card.pack_code) && !finishedScenarios.has(card.code)) {
          standaloneScenarios.push(card);
        }
      });
      return {
        realm,
        allScenarios: concat(cycleScenarios, standaloneScenarios),
      };
    },
  }),
);

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});
