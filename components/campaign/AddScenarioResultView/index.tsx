import React from 'react';
import { throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';

import { t } from 'ttag';
import { DecksMap, SingleCampaign, ScenarioResult } from '../../../actions/types';
import withDialogs, { InjectedDialogProps } from '../../core/withDialogs';
import { NavigationProps } from '../../types';
import ScenarioSection from './ScenarioSection';
import XpComponent from '../XpComponent';
import { addScenarioResult } from '../actions';
import { getAllDecks, getCampaign, AppState } from '../../../reducers';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';

export interface AddScenarioResultProps {
  id: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  decks: DecksMap;
}

interface ReduxActionProps {
  addScenarioResult: (id: number, scenarioResult: ScenarioResult) => void;
}

type Props = NavigationProps & AddScenarioResultProps & ReduxProps & ReduxActionProps & InjectedDialogProps;
interface State {
  scenario?: ScenarioResult;
  xp: number;
}

class AddScenarioResultView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  _doSave!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      xp: 0,
    };

    this._updateNavigationButtons();
    this._navEventListener = Navigation.events().bindComponent(this);
    this._doSave = throttle(this.doSave.bind(this), 200);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _updateNavigationButtons = () => {
    const { scenario } = this.state;
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          color: COLORS.navButton,
          enabled: !!(scenario &&
            scenario.scenario &&
            (scenario.interlude || scenario.resolution !== '')),
          testID: t`Save`,
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string}) {
    if (buttonId === 'save') {
      this._doSave();
    }
  }

  doSave() {
    const {
      componentId,
      id,
      addScenarioResult,
    } = this.props;
    const {
      scenario,
      xp,
    } = this.state;
    addScenarioResult(
      id,
      Object.assign({}, scenario, { xp })
    );
    Navigation.pop(componentId);
  }

  _scenarioChanged = (scenario: ScenarioResult) => {
    this.setState({
      scenario,
    }, this._updateNavigationButtons);
  };

  _xpChanged = (xp: number) => {
    this.setState({
      xp,
    });
  };

  renderScenarios() {
    const {
      componentId,
      campaign,
      showTextEditDialog,
    } = this.props;
    if (!campaign) {
      return null;
    }
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
            { t`After saving the scenario result, you can use the "Upgrade Deck" buttons to award XP and adjust trauma for each investigator.` }
          </Text>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state: AppState, props: NavigationProps & AddScenarioResultProps): ReduxProps {
  const campaign = getCampaign(state, props.id);
  return {
    campaign: campaign || undefined,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    addScenarioResult,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withDialogs(AddScenarioResultView)
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
