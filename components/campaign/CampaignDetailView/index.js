import React from 'react';
import PropTypes from 'prop-types';
import { filter, flatMap, throttle } from 'lodash';
import {
  Alert,
  Button,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../../app/i18n';
import CampaignLogSection from './CampaignLogSection';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import AddCampaignNoteSectionDialog from '../AddCampaignNoteSectionDialog';
import { campaignToText } from '../campaignUtil';
import withTraumaDialog from '../withTraumaDialog';
import withPlayerCards from '../../withPlayerCards';
import withTextEditDialog from '../../core/withTextEditDialog';
import { iconsMap } from '../../../app/NavIcons';
import { updateCampaign, deleteCampaign } from '../actions';
import { getCampaign, getAllPacks, getAllDecks, getLatestDeckIds } from '../../../reducers';
import { COLORS } from '../../../styles/colors';

class CampaignDetailView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    // from HOC
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
    captureViewRef: PropTypes.func.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    latestDeckIds: PropTypes.array,
    decks: PropTypes.object,
    investigators: PropTypes.object,
    allInvestigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      addSectionVisible: false,
      addSectionFunction: null,
    };

    this._toggleAddSectionDialog = this.toggleAddSectionDialog.bind(this);
    this._showAddSectionDialog = this.showAddSectionDialog.bind(this);
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._updateWeaknessSet = this.applyCampaignUpdate.bind(this, 'weaknessSet');
    this._deletePressed = this.deletePressed.bind(this);
    this._delete = this.delete.bind(this);
    this._showShareSheet = throttle(this.showShareSheet.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);

    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: props.campaign ? props.campaign.name : L('Campaign'),
        },
        rightButtons: [{
          icon: iconsMap.share,
          id: 'share',
        }],
      },
    });
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  showAddSectionDialog(addSectionFunction) {
    this.setState({
      addSectionVisible: true,
      addSectionFunction,
    });
  }

  toggleAddSectionDialog() {
    this.setState({
      addSectionVisible: !this.state.addSectionVisible,
    });
  }

  showShareSheet() {
    const {
      campaign,
      latestDeckIds,
      decks,
      investigators,
    } = this.props;
    Share.share({
      text: campaign.name,
      message: campaignToText(campaign, latestDeckIds, decks, investigators),
    }, {
      subject: campaign.name,
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'share') {
      this._showShareSheet();
    }
  }

  applyCampaignUpdate(key, value) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    updateCampaign(campaign.id, { [key]: value });
  }

  componentDidUpdate(prevProps) {
    const {
      campaign,
      componentId,
      investigatorDataUpdates,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          subtitle: {
            text: campaign.name,
          },
        },
      });
    }

    if (investigatorDataUpdates !== prevProps.investigatorDataUpdates) {
      this._updateInvestigatorData(Object.assign(
        {},
        campaign.investigatorData || {},
        investigatorDataUpdates
      ));
    }
  }

  updateChaosBag(bag) {
    this.setState({
      chaosBag: bag,
    });
  }

  deletePressed() {
    const {
      campaign,
    } = this.props;
    Alert.alert(
      'Delete',
      `Are you sure you want to delete the campaign: ${campaign.name}?`,
      [
        { text: 'Delete', onPress: this._delete, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }

  delete() {
    const {
      id,
      deleteCampaign,
      componentId,
    } = this.props;
    deleteCampaign(id);
    Navigation.pop(componentId);
  }

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
      <View style={styles.flex}>
        <ScrollView style={styles.flex} ref={captureViewRef}>
          <ScenarioSection
            componentId={componentId}
            campaign={campaign}
          />
          <ChaosBagSection
            componentId={componentId}
            chaosBag={campaign.chaosBag}
            updateChaosBag={this._updateChaosBag}
          />
          <WeaknessSetSection
            componentId={componentId}
            campaignId={campaign.id}
            weaknessSet={campaign.weaknessSet}
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
          <CampaignLogSection
            componentId={componentId}
            campaignNotes={campaign.campaignNotes}
            allInvestigators={allInvestigators}
            updateCampaignNotes={this._updateCampaignNotes}
            showTextEditDialog={showTextEditDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
          <View style={[styles.margin, styles.button]}>
            <Button
              title={L('Delete Campaign')}
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

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  const packs = getAllPacks(state);
  const decks = getAllDecks(state);
  const latestDeckIds = getLatestDeckIds(campaign, state);
  return {
    allInvestigators: flatMap(
      filter(flatMap(latestDeckIds, deckId => decks[deckId]), deck => deck && deck.investigator_code),
      deck => props.investigators[deck.investigator_code]),
    latestDeckIds,
    campaign,
    packs,
    decks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default withPlayerCards(
  connect(mapStateToProps, mapDispatchToProps)(
    withTraumaDialog(
      withTextEditDialog(CampaignDetailView)
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
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
