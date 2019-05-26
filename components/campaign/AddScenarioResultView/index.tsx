import React from 'react';
import { throttle } from 'lodash';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { SingleCampaign, ScenarioResult } from '../../../actions/types';
import withDialogs, { InjectedDialogProps } from '../../core/withDialogs';
import { NavigationProps } from '../../types';
import ScenarioSection from './ScenarioSection';
import XpComponent from '../XpComponent';
import { UpgradeDecksProps } from '../UpgradeDecksView';
import { addScenarioResult } from '../actions';
import { getCampaign, AppState } from '../../../reducers';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';

export interface AddScenarioResultProps {
  id: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
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
  _doSave!: (showDeckUpgrade: boolean) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      xp: 0,
    };

    this._doSave = throttle(this.doSave.bind(this), 200);
  }

  saveEnabled() {
    const { scenario } = this.state;
    return !!(scenario &&
      scenario.scenario &&
      (scenario.interlude || scenario.resolution !== ''));
  }

  doSave(showDeckUpgrade: boolean) {
    const {
      componentId,
      id,
      addScenarioResult,
    } = this.props;
    const {
      scenario,
      xp,
    } = this.state;
    if (scenario) {
      const scenarioResult: ScenarioResult = { ...scenario, xp };
      addScenarioResult(id, scenarioResult);
      const passProps: UpgradeDecksProps = {
        id,
        scenarioResult,
      };
      if (showDeckUpgrade) {
        Navigation.showModal({
          stack: {
            children: [{
              component: {
                name: 'Campaign.UpgradeDecks',
                passProps,
              },
            }],
          },
        });
        setTimeout(() => {
          Navigation.pop(componentId);
        }, 1500);
      } else {
        Navigation.pop(componentId);
      }
    }
  }

  _scenarioChanged = (scenario: ScenarioResult) => {
    this.setState({
      scenario,
    });
  };

  _xpChanged = (xp: number) => {
    this.setState({
      xp,
    });
  };

  _saveAndDismiss = () => {
    this._doSave(false);
  };

  _saveAndUpgradeDecks = () => {
    this._doSave(true);
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
      campaign,
    } = this.props;
    const {
      xp,
    } = this.state;
    const hasDecks = !!campaign && !!campaign.baseDeckIds && campaign.baseDeckIds.length > 0;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bottomBorder}>
          { this.renderScenarios() }
          <XpComponent xp={xp} onChange={this._xpChanged} />
        </View>
        { hasDecks && (
          <View style={styles.button}>
            <Button title={t`Save and Upgrade Decks`} onPress={this._saveAndUpgradeDecks} disabled={!this.saveEnabled()} />
          </View>
        ) }
        <View style={styles.button}>
          <Button title={hasDecks ? t`Only Save` : t`Save`} onPress={this._saveAndDismiss} disabled={!this.saveEnabled()}/>
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
  button: {
    margin: 8,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    marginBottom: 8,
  },
});
