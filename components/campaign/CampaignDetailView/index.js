import React from 'react';
import PropTypes from 'prop-types';
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
import { getCampaign, getAllPacks, getAllDecks } from '../../../reducers';
import { COLORS } from '../../../styles/colors';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
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
    decks: PropTypes.object,
    investigators: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      addSectionVisible: false,
      addSectionFunction: null,
    };

    this._toggleAddSectionDialog = this.toggleAddSectionDialog.bind(this);
    this._showAddSectionDialog = this.showAddSectionDialog.bind(this);
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._deletePressed = this.deletePressed.bind(this);
    this._delete = this.delete.bind(this);

    props.navigator.setTitle({
      title: props.campaign.name,
    });

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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

  onNavigatorEvent(event) {
    const {
      campaign,
      decks,
      investigators,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'share') {
        Share.share({
          text: campaign.name,
          message: campaignToText(campaign, decks, investigators),
        }, {
          subject: campaign.name,
        });
      }
    }
  }

  applyCampaignUpdate(key, value) {
    const {
      campaign,
      updateCampaign,
    } = this.props;
    updateCampaign(campaign.id, { [key]: value });
  }

  componentDidMount() {
    this.props.navigator.setButtons({
      rightButtons: [{
        icon: iconsMap.share,
        id: 'share',
      }],
    });
  }

  componentDidUpdate(prevProps) {
    const {
      campaign,
      navigator,
      investigatorDataUpdates,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      navigator.setSubTitle({ subtitle: campaign.name });
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
      navigator,
    } = this.props;
    deleteCampaign(id);
    navigator.pop();
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
      navigator,
      campaign,
      showTraumaDialog,
      updateCampaign,
      captureViewRef,
      showTextEditDialog,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <View style={styles.flex}>
        <ScrollView style={styles.flex} ref={captureViewRef}>
          <ScenarioSection
            navigator={navigator}
            campaign={campaign}
          />
          <ChaosBagSection
            navigator={navigator}
            chaosBag={campaign.chaosBag}
            updateChaosBag={this._updateChaosBag}
          />
          <WeaknessSetSection
            navigator={navigator}
            campaignId={campaign.id}
            weaknessSet={campaign.weaknessSet}
          />
          <DecksSection
            navigator={navigator}
            campaign={campaign}
            showTraumaDialog={showTraumaDialog}
            updateCampaign={updateCampaign}
          />
          <CampaignLogSection navigator={navigator}
            campaign={campaign}
            updateCampaignNotes={this._updateCampaignNotes}
            showTextEditDialog={showTextEditDialog}
            showAddSectionDialog={this._showAddSectionDialog}
          />
          <View style={styles.margin}>
            <Button color={COLORS.red} onPress={this._deletePressed} title="Delete Campaign" />
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
  return {
    campaign: campaign,
    packs: packs,
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withPlayerCards(
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
});
