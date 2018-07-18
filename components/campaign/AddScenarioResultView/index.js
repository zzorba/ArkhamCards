import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, flatMap, forEach, last, map, mapValues } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import withTextEditDialog from '../../core/withTextEditDialog';
import ScenarioSection from './ScenarioSection';
import SelectedDeckListComponent from '../SelectedDeckListComponent';
import XpComponent from '../../XpComponent';
import { addScenarioResult } from '../actions';
import { getAllDecks, getAllPacks, getPack } from '../../../reducers';

const DEFAULT_SETTINGS = {
  xp: 0,
  trauma: {
    mental: 0,
    physical: 0,
    killed: false,
    insane: false,
  },
  exile: {},
};

class AddScenarioResultView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    // from redux/realm
    addScenarioResult: PropTypes.func.isRequired,
    decks: PropTypes.object,
    cycleScenarios: PropTypes.array,
    standaloneScenarios: PropTypes.array,
    showTextEditDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const deckIds = props.campaign.latestDeckIds || [];
    const deckUpdates = {};
    forEach(deckIds, deckId => {
      deckUpdates[deckId] = Object.assign({}, DEFAULT_SETTINGS);
    });
    this.state = {
      deckIds,
      deckUpdates,
      chaosBag: Object.assign({}, props.campaign.chaosBag),
      campaignNotes: Object.assign({}, props.campaign.campaignNotes),
      investigatorData: Object.assign({}, props.campaign.investigatorData),
      scenario: '',
      xp: 0,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._chaosBagChanged = this.chaosBagChanged.bind(this);
    this._notesChanged = this.notesChanged.bind(this);
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
          title: 'Save',
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
        const {
          campaign,
          decks,
          addScenarioResult,
        } = this.props;
        const {
          deckIds,
          campaignNotes,
          scenario,
          deckUpdates,
          chaosBag,
        } = this.state;
        const investigatorUpdates = {};
        forEach(deckIds, deckId => {
          const investigatorId = decks[deckId].investigator_code;
          investigatorUpdates[investigatorId] = deckUpdates[deckId];
        });

        addScenarioResult(
          campaign.id,
          deckIds,
          scenario,
          campaignNotes,
          investigatorUpdates,
          chaosBag,
        );
        this.props.navigator.pop();
      }
    }
  }

  chaosBagChanged(chaosBag) {
    this.setState({
      chaosBag: Object.assign({}, chaosBag),
    });
  }

  notesChanged(campaignNotes) {
    this.setState({
      campaignNotes,
    });
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
      showTextEditDialog,
    } = this.props;
    return (
      <ScenarioSection
        navigator={navigator}
        scenarioChanged={this._scenarioChanged}
        allScenarios={concat(cycleScenarios, standaloneScenarios)}
        showTextEditDialog={showTextEditDialog}
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
      <SelectedDeckListComponent
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
      decks,
    } = this.props;
    const {
      deckIds,
      xp,
      campaignNotes,
      investigatorData,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        { this.renderScenarios() }
        <View style={[styles.row, styles.margin]}>
          <XpComponent xp={xp} onChange={this._xpChanged} />
        </View>
        { this.renderInvestigators() }
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const latestScenario = last(props.campaign.scenarioResults);
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
  return bindActionCreators({
    addScenarioResult,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(withTextEditDialog(AddScenarioResultView), {
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
  footer: {
    height: 100,
  },
});
