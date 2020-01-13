import React from 'react';
import { throttle } from 'lodash';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignNotes, SingleCampaign, ScenarioResult } from '../../../actions/types';
import withDialogs, { InjectedDialogProps } from '../../core/withDialogs';
import withDimensions, { DimensionsProps } from '../../core/withDimensions';
import { NavigationProps } from '../../types';
import withPlayerCards, { PlayerCardProps } from '../../withPlayerCards';
import ScenarioSection from './ScenarioSection';
import CampaignLogSection from '../CampaignDetailView/CampaignLogSection';
import XpComponent from '../XpComponent';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { UpgradeDecksProps } from '../UpgradeDecksView';
import { addScenarioResult } from '../actions';
import Card from '../../../data/Card';
import { getCampaign, getLatestCampaignInvestigators, AppState } from '../../../reducers';
import { COLORS } from '../../../styles/colors';

export interface AddScenarioResultProps {
  id: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
  allInvestigators: Card[];
}

interface ReduxActionProps {
  addScenarioResult: (
    id: number,
    scenarioResult: ScenarioResult,
    campaignNotes?: CampaignNotes
  ) => void;
}

type Props = NavigationProps &
  PlayerCardProps &
  AddScenarioResultProps &
  ReduxProps &
  ReduxActionProps &
  InjectedDialogProps &
  DimensionsProps;

interface State {
  scenario?: ScenarioResult;
  xp: number;
  campaignNotes?: CampaignNotes;
  addSectionVisible: boolean;
  addSectionFunction?: AddSectionFunction;
}

class AddScenarioResultView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  _doSave!: (showDeckUpgrade: boolean) => void;

  static get options() {
    return {
      topBar: {
        title: {
          text: t`Scenario Result`,
        },
        backButton: {
          title: t`Cancel`,
        },
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          color: COLORS.navButton,
          testID: t`Save`,
        }],
      },
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      xp: 0,
      addSectionVisible: false,
    };

    this._doSave = throttle(this.doSave.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    this._syncNavigationButtons();
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'save') {
      this._doSave(true);
    }
  }

  saveEnabled() {
    const { scenario } = this.state;
    return !!(scenario &&
      scenario.scenario &&
      (scenario.interlude || scenario.resolution !== ''));
  }

  _syncNavigationButtons = () => {
    const { componentId } = this.props;
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          enabled: this.saveEnabled(),
          color: COLORS.navButton,
          testID: t`Save`,
        }],
      },
    });
  };

  doSave(showDeckUpgrade: boolean) {
    const {
      componentId,
      id,
      addScenarioResult,
    } = this.props;
    const {
      scenario,
      xp,
      campaignNotes,
    } = this.state;
    if (scenario) {
      const scenarioResult: ScenarioResult = { ...scenario, xp };
      addScenarioResult(id, scenarioResult, campaignNotes);
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
                options: {
                  modalPresentationStyle: Platform.OS === 'ios' ?
                    OptionsModalPresentationStyle.overFullScreen :
                    OptionsModalPresentationStyle.overCurrentContext,
                },
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
    }, this._syncNavigationButtons);
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

  _showAddSectionDialog = (addSectionFunction: AddSectionFunction) => {
    this.setState({
      addSectionVisible: true,
      addSectionFunction,
    });
  };

  _toggleAddSectionDialog = () => {
    this.setState({
      addSectionVisible: false,
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

  campaignNotes(): CampaignNotes | undefined {
    const {
      campaign,
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    return campaignNotes ||
      (campaign && campaign.campaignNotes);
  }

  _updateCampaignNotes = (campaignNotes: CampaignNotes) => {
    this.setState({
      campaignNotes,
    });
  };

  renderAddSectionDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      addSectionVisible,
      addSectionFunction,
    } = this.state;

    return (
      <AddCampaignNoteSectionDialog
        viewRef={viewRef}
        visible={addSectionVisible}
        addSection={addSectionFunction}
        toggleVisible={this._toggleAddSectionDialog}
      />
    );
  }
  render() {
    const {
      campaign,
      componentId,
      showTextEditDialog,
      captureViewRef,
      allInvestigators,
      fontScale,
    } = this.props;
    const {
      xp,
    } = this.state;
    const hasDecks = !!campaign && !!campaign.baseDeckIds && campaign.baseDeckIds.length > 0;
    const notes = this.campaignNotes();
    const scenarioResults = (campaign && campaign.scenarioResults) || [];
    return (
      <View style={styles.flex} ref={captureViewRef}>
        { this.renderAddSectionDialog() }
        <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
          { this.renderScenarios() }
          <View style={styles.bottomBorder}>
            <XpComponent xp={xp} onChange={this._xpChanged} />
          </View>
          { hasDecks && (
            <View style={styles.button}>
              <Button
                title={t`Save and Upgrade Decks`}
                onPress={this._saveAndUpgradeDecks}
                disabled={!this.saveEnabled()}
              />
            </View>
          ) }
          <View style={[styles.button, styles.bottomBorder]}>
            <Button
              title={hasDecks ? t`Only Save` : t`Save`}
              onPress={this._saveAndDismiss}
              disabled={!this.saveEnabled()}
            />
          </View>
          { !!notes && (
            <CampaignLogSection
              componentId={componentId}
              fontScale={fontScale}
              scenarioCount={scenarioResults.length}
              campaignNotes={notes}
              allInvestigators={allInvestigators}
              updateCampaignNotes={this._updateCampaignNotes}
              showTextEditDialog={showTextEditDialog}
              showAddSectionDialog={this._showAddSectionDialog}
            />
          ) }
          <View style={styles.footer} />
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & AddScenarioResultProps & PlayerCardProps
): ReduxProps {
  const campaign = getCampaign(state, props.id);
  const allInvestigators = getLatestCampaignInvestigators(state, props.investigators, campaign);
  return {
    campaign,
    allInvestigators,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    addScenarioResult,
  }, dispatch);
}

export default withPlayerCards<NavigationProps & AddScenarioResultProps>(
  connect(mapStateToProps, mapDispatchToProps)(
    withDialogs(
      withDimensions(AddScenarioResultView)
    )
  )
);
const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
  button: {
    padding: 8,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  flex: {
    flex: 1,
  },
});
