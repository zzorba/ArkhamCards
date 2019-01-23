import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import withTextEditDialog from '../../core/withTextEditDialog';
import ScenarioSection from './ScenarioSection';
import XpComponent from '../XpComponent';
import * as Actions from '../../../actions';
import { addScenarioResult } from '../actions';
import { getAllDecks, getCampaign } from '../../../reducers';
import typography from '../../../styles/typography';

class AddScenarioResultView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
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
        scenario: null,
        resolution: '',
        interlude: false,
      },
      xp: 0,
    };

    this.updateNavigationButtons();
    this._navEventListener = Navigation.events().bindComponent(this);

    this._doSave = throttle(this.doSave.bind(this), 200);
    this._scenarioChanged = this.scenarioChanged.bind(this);
    this._xpChanged = this.xpChanged.bind(this);
    this._updateNavigationButtons = this.updateNavigationButtons.bind(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  hideTraumaDialog() {
    this.setState({
      traumaDialogVisible: false,
    });
  }

  updateNavigationButtons() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [{
          text: L('Save'),
          id: 'save',
          showAsAction: 'ifRoom',
          enabled: (!!this.state.scenario.scenario) &&
            !!(this.state.scenario.interlude || this.state.scenario.resolution !== ''),
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'save') {
      this._doSave();
    }
  }

  doSave() {
    const {
      componentId,
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
    Navigation.pop(componentId);
  }

  scenarioChanged(scenario) {
    this.setState({
      scenario,
    }, this._updateNavigationButtons);
  }

  xpChanged(xp) {
    this.setState({
      xp,
    });
  }

  renderScenarios() {
    const {
      componentId,
      campaign,
      showTextEditDialog,
    } = this.props;
    return (
      <ScenarioSection
        componentId={componentId}
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
        <View style={styles.text}>
          <Text style={typography.small}>
            { L('After saving the scenario result, you can use the "Upgrade Deck" buttons to award XP and adjust trauma for each investigator.') }
          </Text>
        </View>
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
  text: {
    margin: 8,
  },
});
