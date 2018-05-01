import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, forEach, map, mapValues } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import { getAllDecks, getAllPacks, getPack } from '../../reducers';
import XpController from './XpController';
import InvestigatorSection from './InvestigatorSection';
import ScenarioSection from './ScenarioSection';

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
    /* eslint-disable react/no-unused-prop-types */
    campaign: PropTypes.object.isRequired,
    // from redux/realm
    /* eslint-disable react/no-unused-prop-types */
    decks: PropTypes.object,
    cycleScenarios: PropTypes.array,
    standaloneScenarios: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      deckIds: [],
      deckUpdates: {},
      campaignNotes: [],
      scenario: '',
      xp: 0,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._scenarioChanged = this.scenarioChanged.bind(this);
    this._xpChanged = this.xpChanged.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
    this._deckUpdatesChanged = this.deckUpdatesChanged.bind(this);
    this._updateNavigatorButtons = this.updateNavigatorButtons.bind(this);
  }

  updateNavigatorButtons(){
    this.props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Done',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: this.state.deckIds.length === 0,
        },
      ],
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        // TODO: push it into redux.
        this.props.navigator.pop();
      }
    }
  }

  scenarioChanged(scenario) {
    this.setState({
      scenario,
    });
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
    }, this._updateNavigatorButtons);
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
    }, this._updateNavigatorButtons);
  }

  renderScenarios() {
    const {
      navigator,
      cycleScenarios,
      standaloneScenarios,
    } = this.props;
    return (
      <ScenarioSection
        navigator={navigator}
        scenarioChanged={this._scenarioChanged}
        allScenarios={concat(cycleScenarios, standaloneScenarios)}
      />
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
      <InvestigatorSection
        navigator={navigator}
        deckIds={deckIds}
        deckUpdates={deckUpdates}
        deckUpdatesChanged={this._deckUpdatesChanged}
        deckAdded={this._deckAdded}
        deckRemoved={this._deckRemoved}
      />
    );
  }

  render() {
    const {
      xp,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        { this.renderScenarios() }
        <View style={[styles.row, styles.margin]}>
          <XpController xp={xp} onChange={this._xpChanged} />
        </View>
        { this.renderInvestigators() }
      </ScrollView>
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
    marginTop: 8,
    marginBottom: 8,
  },
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
