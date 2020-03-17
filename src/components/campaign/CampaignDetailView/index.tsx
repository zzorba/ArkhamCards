import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu';
import {
  SettingsButton,
  SettingsCategoryHeader,
} from 'react-native-settings-components';
import { t } from 'ttag';

import { campaignName } from '../constants';
import { Campaign, CampaignNotes, DecksMap, InvestigatorData, WeaknessSet } from 'actions/types';
import CampaignLogSection from './CampaignLogSection';
import { CampaignGuideProps } from 'components/campaignguide/CampaignGuideView';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import { AddScenarioResultProps } from '../AddScenarioResultView';
import { CampaignScenarioProps } from '../CampaignScenarioView';
import { CampaignChaosBagProps } from '../CampaignChaosBagView';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import { CampaignDrawWeaknessProps } from '../CampaignDrawWeaknessDialog';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { campaignToText } from '../campaignUtil';
import withTraumaDialog, { TraumaProps } from '../withTraumaDialog';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { OddsCalculatorProps } from '../OddsCalculatorView';
import withDialogs, { InjectedDialogProps } from 'components/core/withDialogs';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { iconsMap } from 'app/NavIcons';
import Card from 'data/Card';
import { ChaosBag } from 'constants';
import { updateCampaign, deleteCampaign } from '../actions';
import { NavigationProps } from 'components/nav/types';
import { getCampaign, getAllDecks, getLatestCampaignDeckIds, getLatestCampaignInvestigators, AppState } from 'reducers';
import { COLORS } from 'styles/colors';

const SHOW_GUIDE = true;

export interface CampaignDetailProps {
  id: number;
}

interface ReduxProps {
  campaign?: Campaign;
  latestDeckIds: number[];
  decks: DecksMap;
  allInvestigators: Card[];
}

interface ReduxActionProps {
  updateCampaign: (id: number, sparseCampaign: Partial<Campaign>) => void;
  deleteCampaign: (id: number) => void;
}

type Props = NavigationProps &
  CampaignDetailProps &
  ReduxProps &
  ReduxActionProps &
  TraumaProps &
  PlayerCardProps &
  InjectedDialogProps &
  DimensionsProps;

interface State {
  addSectionVisible: boolean;
  addSectionFunction?: AddSectionFunction;
  menuOpen: boolean;
}

class CampaignDetailView extends React.Component<Props, State> {
  static options(passProps: Props) {
    return {
      topBar: {
        title: {
          text: passProps.campaign ? passProps.campaign.name : t`Campaign`,
        },
        rightButtons: [{
          icon: iconsMap.menu,
          id: 'menu',
          color: COLORS.navButton,
        }],
      },
    };
  }
  _navEventListener?: EventSubscription;
  _onCampaignNameChange!: (name: string) => void;
  _updateLatestDeckIds!: (latestDeckIds: number[]) => void;
  _updateCampaignNotes!: (campaignNotes: CampaignNotes) => void;
  _updateInvestigatorData!: (investigatorData: InvestigatorData) => void;
  _updateChaosBag!: (chaosBag: ChaosBag) => void;
  _updateWeaknessSet!: (weaknessSet: WeaknessSet) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      addSectionVisible: false,
      menuOpen: false,
    };

    this._onCampaignNameChange = this.applyCampaignUpdate.bind(this, 'name');
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._updateWeaknessSet = this.applyCampaignUpdate.bind(this, 'weaknessSet');

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _showAddSectionDialog = (addSectionFunction: AddSectionFunction) => {
    this.setState({
      addSectionVisible: true,
      addSectionFunction,
    });
  };

  _toggleAddSectionDialog = () => {
    this.setState({
      addSectionVisible: !this.state.addSectionVisible,
    });
  };

  _showShareSheet = () => {
    const {
      campaign,
      latestDeckIds,
      decks,
      investigators,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
    if (campaign) {
      Share.share({
        title: campaign.name,
        message: campaignToText(campaign, latestDeckIds, decks, investigators),
      }, {
        // @ts-ignore
        subject: campaign.name,
      });
    }
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'menu') {
      this.setState({
        menuOpen: !this.state.menuOpen,
      });
    }
  }

  applyCampaignUpdate(key: keyof Campaign, value: any) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    if (campaign) {
      updateCampaign(campaign.id, { [key]: value });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      campaign,
      componentId,
      investigatorDataUpdates,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: campaign.name,
          },
        },
      });
    }

    if (investigatorDataUpdates !== prevProps.investigatorDataUpdates) {
      this._updateInvestigatorData(Object.assign(
        {},
        (campaign && campaign.investigatorData) || {},
        investigatorDataUpdates
      ));
    }
  }

  _editNamePressed = () => {
    const {
      campaign,
      showTextEditDialog,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
    if (campaign) {
      showTextEditDialog(
        t`Campaign Name`,
        campaign.name,
        this._onCampaignNameChange
      );
    }
  };

  _guidePressed = () => {
    const {
      componentId,
      campaign,
    } = this.props;
    if (campaign) {
      Navigation.push<CampaignGuideProps>(componentId, {
        component: {
          name: 'Guide.Campaign',
          passProps: {
            campaignId: campaign.id,
          },
          options: {
            topBar: {
              title: {
                text: campaignName(campaign.cycleCode) || undefined,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  _oddsCalculatorPressed = () => {
    const {
      componentId,
      campaign,
      allInvestigators,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
    if (campaign) {
      Navigation.push<OddsCalculatorProps>(componentId, {
        component: {
          name: 'OddsCalculator',
          passProps: {
            campaignId: campaign.id,
            investigatorIds: map(allInvestigators, card => card.code),
          },
          options: {
            topBar: {
              title: {
                text: t`Odds Calculator`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  _deletePressed = () => {
    const {
      campaign,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
    if (campaign) {
      Alert.alert(
        t`Delete`,
        t`Are you sure you want to delete the campaign: ${campaign.name}`,
        [
          { text: t`Delete`, onPress: this._delete, style: 'destructive' },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    }
  };

  _delete = () => {
    const {
      id,
      deleteCampaign,
      componentId,
    } = this.props;
    deleteCampaign(id);
    Navigation.pop(componentId);
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

  _menuOpenChange = (menuOpen: boolean) => {
    this.setState({
      menuOpen,
    });
  };

  _viewScenarios = () => {
    const {
      campaign,
      componentId,
    } = this.props;
    if (campaign) {
      this.setState({
        menuOpen: false,
      });
      Navigation.push<CampaignScenarioProps>(componentId, {
        component: {
          name: 'Campaign.Scenarios',
          passProps: {
            id: campaign.id,
          },
          options: {
            topBar: {
              title: {
                text: t`Scenarios`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  _addScenarioResult = () => {
    const {
      campaign,
      componentId,
    } = this.props;
    if (campaign) {
      this.setState({
        menuOpen: false,
      });
      Navigation.push<AddScenarioResultProps>(componentId, {
        component: {
          name: 'Campaign.AddResult',
          passProps: {
            id: campaign.id,
          },
        },
      });
    }
  };

  _drawChaosBag = () => {
    const {
      componentId,
      campaign,
    } = this.props;
    if (campaign) {
      this.setState({
        menuOpen: false,
      });
      Navigation.push<CampaignChaosBagProps>(componentId, {
        component: {
          name: 'Campaign.ChaosBag',
          passProps: {
            componentId,
            campaignId: campaign.id,
            updateChaosBag: this._updateChaosBag,
            trackDeltas: true,
          },
          options: {
            topBar: {
              title: {
                text: t`Chaos Bag`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  _editChaosBag = () => {
    const {
      componentId,
      campaign,
    } = this.props;
    if (campaign) {
      this.setState({
        menuOpen: false,
      });
      Navigation.push<EditChaosBagProps>(componentId, {
        component: {
          name: 'Dialog.EditChaosBag',
          passProps: {
            chaosBag: campaign.chaosBag,
            updateChaosBag: this._updateChaosBag,
            trackDeltas: true,
          },
          options: {
            topBar: {
              title: {
                text: t`Chaos Bag`,
                color: COLORS.black,
              },
            },
          },
        },
      });
    }
  };

  _showDrawWeakness = () => {
    const {
      componentId,
      campaign,
    } = this.props;
    this.setState({
      menuOpen: false,
    });
    if (campaign) {
      Navigation.push<CampaignDrawWeaknessProps>(componentId, {
        component: {
          name: 'Dialog.CampaignDrawWeakness',
          passProps: {
            campaignId: campaign.id,
          },
          options: {
            topBar: {
              title: {
                text: t`Draw Weaknesses`,
                color: COLORS.black,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  renderSideMenu(campaign: Campaign) {
    return (
      <ScrollView style={styles.menu}>
        <SettingsCategoryHeader title={t`Campaign`} />
        <SettingsButton
          onPress={this._editNamePressed}
          title={t`Name`}
          description={campaign.name}
        />
        <SettingsButton
          onPress={this._viewScenarios}
          title={t`Scenario History`}
        />
        <SettingsButton
          onPress={this._addScenarioResult}
          title={t`Record Scenario Results`}
        />
        <SettingsCategoryHeader title={t`Chaos Bag`} />
        <SettingsButton
          title={t`Edit Tokens`}
          onPress={this._editChaosBag}
        />
        <SettingsButton
          title={t`Draw Tokens`}
          onPress={this._drawChaosBag}
        />
        <SettingsButton
          title={t`Odds Calculator`}
          onPress={this._oddsCalculatorPressed}
        />
        <SettingsCategoryHeader title={t`Weakness Set`} />
        <SettingsButton
          title={t`Draw Basic Weakness`}
          onPress={this._showDrawWeakness}
        />
        <SettingsCategoryHeader title={t`Options`} />
        <SettingsButton
          onPress={this._showShareSheet}
          title={t`Share`}
        />
        <SettingsButton
          title={t`Delete`}
          titleStyle={styles.destructive}
          onPress={this._deletePressed}
        />
      </ScrollView>
    );
  }

  renderCampaignDetails(campaign: Campaign) {
    const {
      componentId,
      latestDeckIds,
      showTraumaDialog,
      showTextEditDialog,
      allInvestigators,
      fontScale,
      decks,
    } = this.props;
    return (
      <ScrollView style={styles.flex}>
        { SHOW_GUIDE && <Button onPress={this._guidePressed} title={t`Guide`} /> }
        <ScenarioSection
          campaign={campaign}
          fontScale={fontScale}
          addScenarioResult={this._addScenarioResult}
          viewScenarios={this._viewScenarios}
        />
        <ChaosBagSection
          fontScale={fontScale}
          chaosBag={campaign.chaosBag}
          showChaosBag={this._drawChaosBag}
          showOddsCalculator={this._oddsCalculatorPressed}
        />
        <DecksSection
          componentId={componentId}
          fontScale={fontScale}
          campaignId={campaign.id}
          weaknessSet={campaign.weaknessSet}
          latestDeckIds={latestDeckIds || []}
          decks={decks}
          allInvestigators={allInvestigators}
          investigatorData={campaign.investigatorData || {}}
          showTraumaDialog={showTraumaDialog}
          updateLatestDeckIds={this._updateLatestDeckIds}
          updateWeaknessSet={this._updateWeaknessSet}
        />
        <WeaknessSetSection
          fontScale={fontScale}
          weaknessSet={campaign.weaknessSet}
          showDrawDialog={this._showDrawWeakness}
        />
        <CampaignLogSection
          componentId={componentId}
          fontScale={fontScale}
          campaignNotes={campaign.campaignNotes}
          scenarioCount={(campaign.scenarioResults || []).length}
          allInvestigators={allInvestigators}
          updateCampaignNotes={this._updateCampaignNotes}
          showTextEditDialog={showTextEditDialog}
          showAddSectionDialog={this._showAddSectionDialog}
        />
      </ScrollView>
    );
  }

  render() {
    const {
      campaign,
      captureViewRef,
      width,
    } = this.props;

    if (!campaign) {
      return null;
    }
    const menuWidth = Math.min(width * 0.60, 240);
    return (
      <View style={styles.flex} ref={captureViewRef}>
        <SideMenu
          isOpen={this.state.menuOpen}
          onChange={this._menuOpenChange}
          menu={this.renderSideMenu(campaign)}
          openMenuOffset={menuWidth}
          autoClosing
          menuPosition="right"
        >
          { this.renderCampaignDetails(campaign) }
        </SideMenu>
        { this.renderAddSectionDialog() }
      </View>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignDetailProps & PlayerCardProps
): ReduxProps {
  const campaign = getCampaign(state, props.id);
  const decks = getAllDecks(state);
  const latestDeckIds = getLatestCampaignDeckIds(state, campaign);
  const allInvestigators = getLatestCampaignInvestigators(state, props.investigators, campaign);
  return {
    allInvestigators,
    latestDeckIds,
    campaign,
    decks,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards<NavigationProps & CampaignDetailProps>(
  connect(mapStateToProps, mapDispatchToProps)(
    withTraumaDialog<NavigationProps & CampaignDetailProps & PlayerCardProps & ReduxProps & ReduxActionProps>(
      withDialogs<NavigationProps & CampaignDetailProps & PlayerCardProps & ReduxProps & ReduxActionProps & TraumaProps>(
        withDimensions(CampaignDetailView)
      )
    )
  )
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'white',
  },
  menu: {
    borderLeftWidth: 2,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  destructive: {
    color: COLORS.red,
  },
});
