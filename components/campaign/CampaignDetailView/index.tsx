import React from 'react';
import { filter, flatMap, throttle } from 'lodash';
import {
  Alert,
  Button,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';

import { t } from 'ttag';
import { Campaign, CampaignNotes, Deck, DecksMap, InvestigatorData, WeaknessSet } from '../../../actions/types';
import CampaignLogSection from './CampaignLogSection';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { campaignToText } from '../campaignUtil';
import withTraumaDialog, { TraumaProps } from '../withTraumaDialog';
import withPlayerCards, { PlayerCardProps } from '../../withPlayerCards';
import withDialogs, { InjectedDialogProps } from '../../core/withDialogs';
import { iconsMap } from '../../../app/NavIcons';
import Card from '../../../data/Card';
import { ChaosBag } from '../../../constants';
import { updateCampaign, deleteCampaign } from '../actions';
import { NavigationProps } from '../../types';
import { getCampaign, getAllDecks, getLatestCampaignDeckIds, AppState } from '../../../reducers';
import { COLORS } from '../../../styles/colors';

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
  InjectedDialogProps;

interface State {
  addSectionVisible: boolean;
  addSectionFunction?: AddSectionFunction;
}

class CampaignDetailView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  _onCampaignNameChange!: (name: string) => void;
  _updateLatestDeckIds!: (latestDeckIds: number[]) => void;
  _updateCampaignNotes!: (campaignNotes: CampaignNotes) => void;
  _updateInvestigatorData!: (investigatorData: InvestigatorData) => void;
  _updateChaosBag!: (chaosBag: ChaosBag) => void;
  _updateWeaknessSet!: (weaknessSet: WeaknessSet) => void;
  _showShareSheet!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      addSectionVisible: false,
    };

    this._onCampaignNameChange = this.applyCampaignUpdate.bind(this, 'name');
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._updateWeaknessSet = this.applyCampaignUpdate.bind(this, 'weaknessSet');

    this._showShareSheet = throttle(this.showShareSheet.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);

    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: props.campaign ? props.campaign.name : t`Campaign`,
        },
        rightButtons: [{
          icon: iconsMap.share,
          id: 'share',
          color: COLORS.navButton,
          testID: t`Share Campaign`,
        }, {
          icon: iconsMap.edit,
          id: 'edit',
          color: COLORS.navButton,
          testID: t`Edit Campaign`,
        }],
      },
    });
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

  showShareSheet() {
    const {
      campaign,
      latestDeckIds,
      decks,
      investigators,
    } = this.props;
    if (campaign) {
      Share.share({
        title: campaign.name,
        message: campaignToText(campaign, latestDeckIds, decks, investigators),
      }, {
        // @ts-ignore
        subject: campaign.name,
      });
    }
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      showTextEditDialog,
      campaign,
    } = this.props;
    if (buttonId === 'share') {
      this._showShareSheet();
    } else if (buttonId === 'edit') {
      if (campaign) {
        showTextEditDialog(
          t`Campaign Name`,
          campaign.name,
          this._onCampaignNameChange
        );
      }
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

  _deletePressed = () => {
    const {
      campaign,
    } = this.props;
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

  render() {
    const {
      componentId,
      campaign,
      latestDeckIds,
      showTraumaDialog,
      captureViewRef,
      showTextEditDialog,
      allInvestigators,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <View style={styles.flex} ref={captureViewRef}>
        <ScrollView style={styles.flex}>
          <ScenarioSection
            componentId={componentId}
            campaign={campaign}
          />
          <ChaosBagSection
            componentId={componentId}
            chaosBag={campaign.chaosBag}
            updateChaosBag={this._updateChaosBag}
          />
          <DecksSection
            componentId={componentId}
            campaignId={campaign.id}
            weaknessSet={campaign.weaknessSet}
            latestDeckIds={latestDeckIds || []}
            investigatorData={campaign.investigatorData || {}}
            showTraumaDialog={showTraumaDialog}
            updateLatestDeckIds={this._updateLatestDeckIds}
            updateWeaknessSet={this._updateWeaknessSet}
          />
          <WeaknessSetSection
            componentId={componentId}
            campaignId={campaign.id}
            weaknessSet={campaign.weaknessSet}
          />
          <CampaignLogSection
            componentId={componentId}
            campaignNotes={campaign.campaignNotes}
            scenarioCount={(campaign.scenarioResults || []).length}
            allInvestigators={allInvestigators}
            updateCampaignNotes={this._updateCampaignNotes}
            showTextEditDialog={showTextEditDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
          <View style={styles.margin}>
            <Button
              title={t`Delete Campaign`}
              color={COLORS.red}
              onPress={this._deletePressed}
            />
          </View>
          <View style={styles.footer} />
        </ScrollView>
        { this.renderAddSectionDialog() }
      </View>
    );
  }
}

function mapStateToPropsFix(
  state: AppState,
  props: NavigationProps & CampaignDetailProps & PlayerCardProps
): ReduxProps {
  const campaign = getCampaign(state, props.id);
  const decks = getAllDecks(state);
  const latestDeckIds = getLatestCampaignDeckIds(state, campaign);
  const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => decks[deckId]);
  return {
    allInvestigators: flatMap(
      filter(latestDecks, deck => !!(deck && deck.investigator_code)),
      deck => props.investigators[deck.investigator_code]),
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
  connect(mapStateToPropsFix, mapDispatchToProps)(
    withTraumaDialog<NavigationProps & CampaignDetailProps & PlayerCardProps & ReduxProps & ReduxActionProps>(
      withDialogs<NavigationProps & CampaignDetailProps & PlayerCardProps & ReduxProps & ReduxActionProps & TraumaProps>(CampaignDetailView)
    )
  )
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  margin: {
    margin: 8,
  },
  footer: {
    height: 40,
  },
});
