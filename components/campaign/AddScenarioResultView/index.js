import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import withTextEditDialog from '../../core/withTextEditDialog';
import ScenarioSection from './ScenarioSection';
import XpComponent from '../XpComponent';
import * as Actions from '../../../actions';
import { addScenarioResult } from '../actions';
import { getAllDecks, getCampaign } from '../../../reducers';

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
  };

  constructor(props) {
    super(props);

    this.state = {
      scenario: {
        scenario: '',
        scenarioCode: '',
        resolution: '',
      },
      xp: 0,
    };

    this.updateNavigatorButtons();
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._doSave = this.doSave.bind(this);
    this._scenarioChanged = this.scenarioChanged.bind(this);
    this._xpChanged = this.xpChanged.bind(this);
    this._updateNavigatorButtons = this.updateNavigatorButtons.bind(this);
  }

  hideTraumaDialog() {
    this.setState({
      traumaDialogVisible: false,
    });
  }

  updateNavigatorButtons() {
    this.props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
          disabled: this.state.scenario.scenario === '' || this.state.scenario.resolution === '',
        },
      ],
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.doSave();
      }
    }
  }

  doSave() {
    const {
      navigator,
      campaign,
      addScenarioResult,
    } = this.props;
    const {
      scenario,
      xp,
    } = this.state;
    addScenarioResult(
      campaign.id,
      scenario,
      xp
    );
    navigator.pop();
  }

  scenarioChanged(scenario) {
    this.setState({
      scenario,
    }, this._updateNavigatorButtons);
  }

  xpChanged(xp) {
    this.setState({
      xp,
    });
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

  render() {
    const {
      xp,
    } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        { this.renderScenarios() }
        <XpComponent xp={xp} onChange={this._xpChanged} />
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
    ...Actions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTextEditDialog(AddScenarioResultView)
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
});
