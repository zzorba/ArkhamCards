import React from 'react';
import PropTypes from 'prop-types';
import { concat, filter, findIndex, forEach, keys, map, mapValues, range, uniqBy } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddScenarioDeckList from './AddScenarioDeckList';
import SaveDialog from './SaveDialog';
import withTextEditDialog from '../../core/withTextEditDialog';
import ScenarioSection from './ScenarioSection';
import XpComponent from '../XpComponent';
import EditTraumaDialog from '../EditTraumaDialog';
import * as Actions from '../../../actions';
import { upgradeDeck } from '../../../lib/authApi';
import { traumaDelta, DEFAULT_TRAUMA_DATA } from '../trauma';
import { addScenarioResult } from '../actions';
import { getAllDecks, getCampaign } from '../../../reducers';

const DEFAULT_SETTINGS = {
  xp: 0,
  exile: {},
};

class AddScenarioResultView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    // from redux/realm
    campaign: PropTypes.object.isRequired,
    decks: PropTypes.object,
    addScenarioResult: PropTypes.func.isRequired,
    setNewDeck: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
    //  From HOC
    showTextEditDialog: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    captureViewRef: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      addedDeckIds: [],
      removedDeckIds: [],
      deckUpdates: {},
      investigatorData: Object.assign({}, props.campaign.investigatorData),
      scenario: '',
      xp: 0,
      traumaDialogVisible: false,
      traumaInvestigator: null,
      traumaData: {},
      saveDialogVisible: false,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._doSave = this.doSave.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
    this._xpChanged = this.xpChanged.bind(this);
    this._deckAdded = this.deckAdded.bind(this);
    this._deckRemoved = this.deckRemoved.bind(this);
    this._deckUpdatesChanged = this.deckUpdatesChanged.bind(this);
    this._updateNavigatorButtons = this.updateNavigatorButtons.bind(this);
    this._hideTraumaDialog = this.hideTraumaDialog.bind(this);
    this._showTraumaDialog = this.showTraumaDialog.bind(this);
    this._updateTraumaData = this.updateTraumaData.bind(this);
    this._toggleSaveDialog = this.toggleSaveDialog.bind(this);
  }

  deckIds() {
    const {
      campaign: {
        latestDeckIds,
      },
    } = this.props;
    const {
      addedDeckIds,
      removedDeckIds,
    } = this.state;

    const removedSet = new Set(removedDeckIds);
    return uniqBy(
      filter(
        concat(latestDeckIds, addedDeckIds),
        deckId => !removedSet.has(deckId)));
  }

  deckUpdates() {
    const {
      xp,
      deckUpdates,
    } = this.state;
    const deckIds = this.deckIds();
    const result = {};
    forEach(deckIds, deckId => {
      if (deckUpdates[deckId]) {
        result[deckId] = deckUpdates[deckId];
      } else {
        result[deckId] = Object.assign({}, DEFAULT_SETTINGS, { xp: xp });
      }
    });
    return result;
  }

  toggleSaveDialog() {
    this.setState({
      saveDialogVisible: !this.state.saveDialogVisible,
    });
  }

  hideTraumaDialog() {
    this.setState({
      traumaDialogVisible: false,
    });
  }

  showTraumaDialog(investigator, traumaData) {
    this.setState({
      traumaDialogVisible: true,
      traumaInvestigator: investigator,
      traumaData,
    });
  }

  updateTraumaData(code, data) {
    const {
      investigatorData,
    } = this.state;
    this.setState({
      investigatorData: Object.assign({},
        investigatorData,
        { [code]: Object.assign({}, data) },
      ),
    });
  }

  updateNavigatorButtons(){
    this.props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: this.deckIds().length === 0,
        },
      ],
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.toggleSaveDialog();
      }
    }
  }

  doSave() {
    const {
      navigator,
      campaign,
      addScenarioResult,
      setNewDeck,
      updateDeck,
    } = this.props;
    const {
      scenario,
      investigatorData,
    } = this.state;
    const deckIds = this.deckIds();
    const deckUpdates = this.deckUpdates();
    return Promise.all(
      map(deckIds, deckId => {
        const {
          exiles = {},
          xp,
        } = deckUpdates[deckId];
        const exileParts = [];
        forEach(keys(exiles), code => {
          const count = exiles[code];
          if (count > 0) {
            forEach(range(0, count), () => exileParts.push(code));
          }
        });
        const exilesParam = exileParts.join(',');
        if (exilesParam === '' && xp === 0) {
          // No exile, no XP change... no need to send it to ArkhamDB?
          return Promise.resolve(deckId);
        }
        return upgradeDeck(deckId, xp, exilesParam).then(decks => {
          const {
            deck,
            upgradedDeck,
          } = decks;
          updateDeck(deck.id, deck, false);
          setNewDeck(upgradedDeck.id, upgradedDeck);
          return upgradedDeck.id;
        }, () => {
          return null;
        });
      })
    ).then(newDeckIds => {
      if (findIndex(newDeckIds, deckId => (deckId === null)) !== -1) {
        Alert.alert('Something went wrong when saving decks to ArkhamDB.');
      } else {
        addScenarioResult(
          campaign.id,
          newDeckIds,
          deckIds,
          scenario,
          investigatorData,
        );
        navigator.pop();
      }
    }, () => {
      Alert.alert('Something went wrong when saving decks to ArkhamDB.');
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
      addedDeckIds,
      removedDeckIds,
    } = this.state;
    this.setState({
      addedDeckIds: uniqBy([...addedDeckIds, id]),
      removedDeckIds: filter(removedDeckIds, deckId => deckId !== id),
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
      addedDeckIds,
      removedDeckIds,
      deckUpdates,
    } = this.state;
    const newDeckUpdates = Object.assign({}, deckUpdates);
    delete newDeckUpdates[id];
    this.setState({
      addedDeckIds: filter(addedDeckIds, deckId => deckId !== id),
      removedDeckIds: uniqBy([...removedDeckIds, id]),
      deckUpdates: newDeckUpdates,
    }, this._updateNavigatorButtons);
  }

  renderScenarios() {
    const {
      navigator,
      campaign,
      showTextEditDialog,
    } = this.props;
    return (
      <ScenarioSection
        navigator={navigator}
        campaign={campaign}
        scenarioChanged={this._scenarioChanged}
        showTextEditDialog={showTextEditDialog}
      />
    );
  }

  renderInvestigators() {
    const {
      navigator,
      id,
    } = this.props;
    const {
      investigatorData,
    } = this.state;
    return (
      <AddScenarioDeckList
        navigator={navigator}
        campaignId={id}
        deckIds={this.deckIds()}
        deckUpdates={this.deckUpdates()}
        deckUpdatesChanged={this._deckUpdatesChanged}
        deckAdded={this._deckAdded}
        deckRemoved={this._deckRemoved}
        investigatorData={investigatorData}
        showTraumaDialog={this._showTraumaDialog}
      />
    );
  }

  renderUpdateSaveDialog() {
    const {
      viewRef,
      campaign: {
        investigatorData,
      },
    } = this.props;

    const {
      saveDialogVisible,
    } = this.state;

    const deckIds = this.deckIds();
    const traumaDeltas = {};
    forEach(
      uniqBy(concat(keys(this.state.investigatorData), keys(investigatorData))),
      investigatorCode => {
        traumaDeltas[investigatorCode] = traumaDelta(
          this.state.investigatorData[investigatorCode] || DEFAULT_TRAUMA_DATA,
          investigatorData[investigatorCode] || DEFAULT_TRAUMA_DATA
        );
      });

    return (
      <SaveDialog
        deckIds={deckIds}
        deckUpdates={this.deckUpdates()}
        traumaDeltas={traumaDeltas}
        onSave={this._doSave}
        onToggleDialog={this._toggleSaveDialog}
        visible={saveDialogVisible}
        viewRef={viewRef}
      />
    );
  }

  renderTraumaDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      traumaDialogVisible,
      traumaInvestigator,
      traumaData,
    } = this.state;

    return (
      <EditTraumaDialog
        visible={traumaDialogVisible}
        investigator={traumaInvestigator}
        trauma={traumaData}
        updateTrauma={this._updateTraumaData}
        hideDialog={this._hideTraumaDialog}
        viewRef={viewRef}
      />
    );
  }

  render() {
    const {
      captureViewRef,
    } = this.props;
    const {
      xp,
    } = this.state;
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container} ref={captureViewRef}>
          { this.renderScenarios() }
          <XpComponent xp={xp} onChange={this._xpChanged} />
          { this.renderInvestigators() }
          <View style={styles.footer} />
        </ScrollView>
        { this.renderTraumaDialog() }
        { this.renderUpdateSaveDialog() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  return {
    campaign: campaign,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addScenarioResult,
    ...Actions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(AddScenarioResultView)
);
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    marginTop: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  footer: {
    height: 100,
  },
});
