import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, mapValues } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import withTextEditDialog from '../../core/withTextEditDialog';
import ScenarioSection from './ScenarioSection';
import SelectedDeckListComponent from '../SelectedDeckListComponent';
import XpComponent from '../XpComponent';
import { addScenarioResult } from '../actions';
import { getAllDecks, getCampaign } from '../../../reducers';

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
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    // from redux/realm
    campaign: PropTypes.object.isRequired,
    addScenarioResult: PropTypes.func.isRequired,
    decks: PropTypes.object,
    //  From HOC
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
      investigatorData: Object.assign({}, props.campaign.investigatorData),
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
          scenario,
          deckUpdates,
          chaosBag,
        } = this.state;
        const investigatorUpdates = {};
        forEach(deckIds, deckId => {
          const deck = decks[deckId];
          const investigatorId = deck.investigator_code;
          investigatorUpdates[investigatorId] = deckUpdates[deckId];
        });

        addScenarioResult(
          campaign.id,
          deckIds,
          scenario,
          investigatorUpdates,
          chaosBag,
        );
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
      xp,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        { this.renderScenarios() }
        <XpComponent xp={xp} onChange={this._xpChanged} />
        { this.renderInvestigators() }
        <View style={styles.footer} />
      </ScrollView>
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
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(AddScenarioResultView)
);
const styles = StyleSheet.create({
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
