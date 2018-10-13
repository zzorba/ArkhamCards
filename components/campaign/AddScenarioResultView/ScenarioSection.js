import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, find, forEach, head, last, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import { updateCampaign } from '../actions';
import { campaignScenarios } from '../constants';
import LabeledTextBox from '../../core/LabeledTextBox';
import Switch from '../../core/Switch';
import { getAllDecks, getAllPacks, getPack } from '../../../reducers';
import typography from '../../../styles/typography';

const CUSTOM = 'Custom';

class ScenarioSection extends React.Component {
  static propTypes = {
    campaignId: PropTypes.number.isRequired,
    scenarioChanged: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    // From redux/realm
    updateCampaign: PropTypes.func.isRequired,
    showInterludes: PropTypes.bool.isRequired,
    allScenarios: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const nextScenario = head(props.allScenarios);
    this.state = {
      selectedScenario: nextScenario ? nextScenario : null,
      customScenario: '',
      resolution: '',
    };

    this._toggleShowInterludes = this.toggleShowInterludes.bind(this);
    this._showCustomCampaignDialog = this.showCustomCampaignDialog.bind(this);
    this._updateManagedScenario = this.updateManagedScenario.bind(this);
    this._showScenarioDialog = this.showScenarioDialog.bind(this);
    this._showResolutionDialog = this.showResolutionDialog.bind(this);
    this._customScenarioTextChanged = this.customScenarioTextChanged.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
    this._resolutionChanged = this.resolutionChanged.bind(this);
  }

  componentDidMount() {
    this.updateManagedScenario();
  }

  toggleShowInterludes() {
    const {
      campaignId,
      showInterludes,
      updateCampaign,
    } = this.props;
    updateCampaign(campaignId, { showInterludes: !showInterludes });
  }

  showCustomCampaignDialog() {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      L('Custom Scenario Name'),
      this.state.customScenario,
      this._customScenarioTextChanged
    );
  }

  showResolutionDialog() {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      'Resolution',
      this.state.resolution,
      this._resolutionChanged
    );
  }

  updateManagedScenario() {
    const {
      selectedScenario,
      customScenario,
      resolution,
    } = this.state;

    this.props.scenarioChanged({
      scenario: selectedScenario !== CUSTOM ? selectedScenario.name : customScenario,
      scenarioCode: selectedScenario !== CUSTOM ? selectedScenario.code : CUSTOM,
      scenarioPack: selectedScenario !== CUSTOM ? selectedScenario.pack_code : CUSTOM,
      interlude: selectedScenario !== CUSTOM && !!selectedScenario.interlude,
      resolution: resolution,
    });
  }

  scenarioChanged(value) {
    const {
      allScenarios,
    } = this.props;
    this.setState({
      selectedScenario: find(
        allScenarios,
        scenario => scenario.name === value
      ) || CUSTOM,
    }, this._updateManagedScenario);
  }

  customScenarioTextChanged(value) {
    this.setState({
      customScenario: value,
    }, this._updateManagedScenario);
  }

  resolutionChanged(value) {
    this.setState({
      resolution: value,
    }, this._updateManagedScenario);
  }

  showScenarioDialog() {
    const {
      selectedScenario,
    } = this.state;
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Scenario',
        passProps: {
          scenarioChanged: this._scenarioChanged,
          scenarios: this.possibleScenarios(),
          selected: selectedScenario === CUSTOM ? CUSTOM : selectedScenario.name,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  }

  possibleScenarios() {
    const {
      allScenarios,
      showInterludes,
    } = this.props;
    const scenarios = map(
      filter(allScenarios, scenario => showInterludes || !scenario.interlude),
      card => card.name);
    scenarios.push(CUSTOM);
    return scenarios;
  }

  render() {
    const {
      selectedScenario,
      customScenario,
      resolution,
    } = this.state;

    return (
      <View>
        <View style={[styles.margin, styles.row]}>
          <Text style={typography.text}>
            { L('Show Interludes') }
          </Text>
          <Switch
            value={this.props.showInterludes}
            onValueChange={this._toggleShowInterludes}
          />
        </View>
        <LabeledTextBox
          label={selectedScenario !== CUSTOM && selectedScenario.interlude ? L('Interlude') : L('Scenario')}
          onPress={this._showScenarioDialog}
          value={selectedScenario === CUSTOM ? CUSTOM : selectedScenario.name}
          style={styles.margin}
          column
        />
        { selectedScenario === CUSTOM && (
          <LabeledTextBox
            label={L('Name')}
            onPress={this._showCustomCampaignDialog}
            value={customScenario}
            style={styles.margin}
            column
          />
        ) }
        { (selectedScenario === CUSTOM || !selectedScenario.interlude) && (
          <LabeledTextBox
            label={L('Resolution')}
            onPress={this._showResolutionDialog}
            value={resolution}
            style={styles.margin}
            column
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
    campaignId: props.campaign.id,
    showInterludes: !!props.campaign.showInterludes,
    cycleScenarios: campaignScenarios()[props.campaign.cycleCode],
    cyclePacks,
    standalonePacks,
    decks: getAllDecks(state),
    latestScenario,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
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
        if (cyclePackCodes.has(card.pack_code)) {
          cycleScenarios.push(card);
        }
        if (standalonePackCodes.has(card.pack_code) && !finishedScenarios.has(card.name)) {
          standaloneScenarios.push(card);
        }
      });
      console.log(props.campaign.finishedScenarios);
      return {
        allScenarios: concat(
          filter(
            props.cycleScenarios || cycleScenarios,
            scenario => !finishedScenarios.has(scenario.name)),
          standaloneScenarios
        ),
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
