import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, forEach, head, map } from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Input } from 'react-native-elements';

import * as Actions from '../../actions';
import { getAllDecks, getAllPacks, getPack } from '../../reducers';
import AddDeckRow from './AddDeckRow';
import DeckRow from './DeckRow';

const CUSTOM = 'Custom';

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
    };

    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
    this._customScenarioTextChanged = this.customScenarioTextChanged.bind(this);
    this._scenarioPressed = this.scenarioPressed.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
  }

  deckAdded(id) {
    this.props.navigator.pop();
    this.setState({
      deckIds: [...this.state.deckIds, id],
    });
  }

  deckRemoved(id) {
    this.setState({
      deckIds: filter([...this.state.deckIds], deckId => deckId !== id),
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
    } = this.state;

    return (
      <View>
        <TouchableOpacity onPress={this._scenarioPressed}>
          <View style={styles.row}>
            <Input
              value={selectedScenario}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableOpacity>
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
    } = this.state;
    return (
      <View>
        { map(deckIds, deckId => (
          <DeckRow key={deckId} id={deckId} remove={this._deckRemoved} />
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
    marginLeft: 8,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
