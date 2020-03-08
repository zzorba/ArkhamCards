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
import { ScenarioResult, CUSTOM } from 'actions/types';
import LabeledTextBox from 'components/core/LabeledTextBox';
import withDialogs, { InjectedDialogProps } from 'components/core/withDialogs';
import { NavigationProps } from 'components/nav/types';
import XpComponent from './XpComponent';
import { editScenarioResult } from './actions';
import { getCampaign, AppState } from 'reducers';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

export interface EditScenarioResultProps {
  campaignId: number;
  index: number;
}

interface ReduxProps {
  scenarioResult?: ScenarioResult;
}

interface ReduxActionProps {
  editScenarioResult: (id: number, index: number, scenarioResult: ScenarioResult) => void;
}

type Props = NavigationProps & EditScenarioResultProps & ReduxProps & ReduxActionProps & InjectedDialogProps;
interface State {
  scenarioResult?: ScenarioResult;
}

class AddScenarioResultView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  _doSave!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      scenarioResult: props.scenarioResult,
    };

    this._updateNavigationButtons();
    this._navEventListener = Navigation.events().bindComponent(this);
    this._doSave = throttle(this.doSave.bind(this), 200);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _updateNavigationButtons = () => {
    const { scenarioResult } = this.state;
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          color: COLORS.navButton,
          enabled: scenarioResult && !!(scenarioResult.scenario &&
            (scenarioResult.interlude || scenarioResult.resolution !== '')),
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
      campaignId,
      index,
      editScenarioResult,
    } = this.props;
    const {
      scenarioResult,
    } = this.state;
    if (scenarioResult) {
      editScenarioResult(campaignId, index, scenarioResult);
    }
    Navigation.pop(componentId);
  }

  _showResolutionDialog = () => {
    const {
      showTextEditDialog,
      scenarioResult,
    } = this.props;
    showTextEditDialog(
      'Resolution',
      scenarioResult ? scenarioResult.resolution : '',
      this._resolutionChanged
    );
  };

  _resolutionChanged = (value: string) => {
    const {
      scenarioResult,
    } = this.state;
    if (scenarioResult) {
      this.setState({
        scenarioResult: {
          ...scenarioResult,
          resolution: value,
        },
      }, this._updateNavigationButtons);
    }
  };

  _xpChanged = (xp: number) => {
    const {
      scenarioResult,
    } = this.state;
    if (scenarioResult) {
      this.setState({
        scenarioResult: {
          ...scenarioResult,
          xp,
        },
      });
    }
  };

  render() {
    const {
      scenarioResult,
    } = this.state;
    if (!scenarioResult) {
      return null;
    }
    const {
      xp,
      scenario,
      scenarioCode,
      interlude,
      resolution,
    } = scenarioResult;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.margin}>
          <Text style={typography.smallLabel}>
            { (interlude ? t`Interlude` : t`Scenario`).toUpperCase() }
          </Text>
          <Text style={typography.text}>
            { scenario }
          </Text>
          { (scenarioCode === CUSTOM || !interlude) && (
            <LabeledTextBox
              label={t`Resolution`}
              onPress={this._showResolutionDialog}
              value={resolution}
              column
            />
          ) }
        </View>
        <XpComponent xp={xp || 0} onChange={this._xpChanged} />
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & EditScenarioResultProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  const scenarioResult = campaign && campaign.scenarioResults[props.index];
  return {
    scenarioResult,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    editScenarioResult,
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
  margin: {
    marginLeft: 8,
    marginRight: 8,
  },
});
