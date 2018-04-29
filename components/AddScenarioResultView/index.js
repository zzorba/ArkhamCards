import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, forEach, head, map, mapValues } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Input } from 'react-native-elements';

import * as Actions from '../../actions';
import { getAllDecks, getAllPacks, getPack } from '../../reducers';
import LabeledTextBox from '../core/LabeledTextBox';
import AddDeckRow from './AddDeckRow';
import DeckRow from './DeckRow';
import XpController from './XpController';

const CUSTOM = 'Custom';

const DEFAULT_SETTINGS = {
  xp: 0,
  trauma: {
    mental: 0,
    physical: 0,
  },
  exile: {},
};

class AddScenarioResultView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    decks: PropTypes.object,
    cyclePacks: PropTypes.array,
    standalonePacks: PropTypes.array,
    cycleScenarios: PropTypes.array,
    standaloneScenarios: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const nextScenario = head(props.cycleScenarios);

    this.state = {
      selectedScenario: nextScenario ? nextScenario.name : null,
      customScenario: null,
      deckIds: [],
      deckUpdates: {},
      xp: 0,
    };

    this._xpChanged = this.xpChanged.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
    this._deckUpdatesChanged = this.deckUpdatesChanged.bind(this);
    this._customScenarioTextChanged = this.customScenarioTextChanged.bind(this);
    this._scenarioPressed = this.scenarioPressed.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
  }

  xpChanged(xp) {
    const delta = xp - this.state.xp;
    const deckUpdates = mapValues(
      this.state.deckUpdates,
      updates => Object.assign(
        {},
        updates,
        { xp: Math.max(0, updates.xp + delta) }));
    this.setState({
      xp,
      deckUpdates,
    });
  }

  deckAdded(id) {
    const {
      deckIds,
      deckUpdates,
      xp,
    } = this.state;
    this.props.navigator.pop();
    this.setState({
      deckIds: [...deckIds, id],
      deckUpdates: Object.assign(
        {},
        deckUpdates,
        { [id]: Object.assign({}, DEFAULT_SETTINGS, { xp }) },
      ),
    });
  }

  deckUpdatesChanged(id, updates) {
    const deckUpdates = Object.assign({},
      this.state.deckUpdates,
      { [id]: updates },
    );
    this.setState({
      deckUpdates,
    });
  }

  deckRemoved(id) {
    const {
      deckIds,
      deckUpdates,
    } = this.state;
    const newDeckUpdates = Object.assign({}, deckUpdates);
    delete newDeckUpdates[id];
    this.setState({
      deckIds: filter([...deckIds], deckId => deckId !== id),
      deckUpdates: newDeckUpdates,
    });
  }

  scenarioPressed() {
    this.props.navigator.showLightBox({
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

  scenarioChanged(value) {
    this.setState({
      selectedScenario: value,
    });
  }

  customScenarioTextChanged(value) {
    this.setState({
      customScenario: value,
    });
  }

  possibleScenarios() {
    const {
      cycleScenarios,
      standaloneScenarios,
    } = this.props;
    const scenarios = map(
      concat(cycleScenarios, standaloneScenarios),
      card => card.name);
    scenarios.push(CUSTOM);
    return scenarios;
  }

  renderScenarios() {
    const {
      selectedScenario,
      customScenario,
      xp,
    } = this.state;

    return (
      <View>
        <LabeledTextBox
          label="Scenario"
          onPress={this._scenarioPressed}
          value={selectedScenario}
        />
        <XpController xp={xp} onChange={this._xpChanged} />
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

  renderInvestigators() {
    const {
      navigator,
    } = this.props;
    const {
      deckIds,
      deckUpdates,
    } = this.state;
    return (
      <View>
        { map(deckIds, deckId => (
          <DeckRow
            key={deckId}
            id={deckId}
            navigator={navigator}
            updatesChanged={this._deckUpdatesChanged}
            remove={this._deckRemoved}
            updates={deckUpdates[deckId]}
          />
        )) }
        { deckIds.length < 4 && (
          <AddDeckRow
            navigator={navigator}
            deckAdded={this._deckAdded}
            selectedDeckIds={deckIds}
          />
        ) }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.renderScenarios() }
        { this.renderInvestigators() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const cyclePack = getPack(state, props.campaign.cycleCode);
  const allPacks = getAllPacks(state);
  const cyclePacks = !cyclePack ? [] : filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position);
  const standalonePacks = filter(allPacks, pack => pack.cycle_position === 70);
  return {
    cyclePacks,
    standalonePacks,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(AddScenarioResultView, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      const finishedScenarios = new Set(flatMap(
        props.campaign.scenarioResults,
        scenarioResult => {
          if (scenarioResult.scenarioCode) {
            return scenarioResult.scenarioCode;
          }
          return null;
        }));
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
        cycleScenarios,
        standaloneScenarios,
      };
    },
  }),
);

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
