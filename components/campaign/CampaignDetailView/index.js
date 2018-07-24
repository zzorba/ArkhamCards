import React from 'react';
import PropTypes from 'prop-types';
import { filter, find } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ChaosBagSection from '../ChaosBagSection';
import CampaignNotesSection from './CampaignNotesSection';
import InvestigatorNotesSection from './InvestigatorNotesSection';
import WeaknessSetSection from './WeaknessSetSection';
import { CUSTOM } from '../constants';
import Button from '../../core/Button';
import { updateCampaign, deleteCampaign } from '../actions';
import { getCampaign, getAllPacks } from '../../../reducers';
import typography from '../../../styles/typography';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    deleteCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    scenarioPack: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._addDeck = this.addDeck.bind(this);
    this._removeDeckPrompt = this.removeDeckPrompt.bind(this);
    this._showCampaignNotesDialog = this.showCampaignNotesDialog.bind(this);
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateChaosBag = this.applyCampaignUpdate.bind(this, 'chaosBag');
    this._updateCampaignNotes = this.applyCampaignUpdate.bind(this, 'campaignNotes');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
    this._deletePressed = this.deletePressed.bind(this);
    this._delete = this.delete.bind(this);
    this._addScenarioResult = this.addScenarioResult.bind(this);
  }

  addDeck(deckId) {
    const {
      campaign: {
        latestDeckIds,
      },
    } = this.props;
    const newLatestDeckIds = latestDeckIds.slice();
    newLatestDeckIds.push(deckId);
    this._updateLatestDeckIds(newLatestDeckIds);
  }

  removeDeck(removedDeckId) {
    const {
      campaign: {
        latestDeckIds,
      },
    } = this.props;
    const newLatestDeckIds = filter(latestDeckIds, deckId => deckId !== removedDeckId);
    this._updateLatestDeckIds(newLatestDeckIds);
  }

  removeDeckPrompt(removedDeckId, deck, investigator) {
    Alert.alert(
      `Remove ${investigator.name}?`,
      `Are you sure you want to remove ${investigator.name} from this campaign?\n\nAll campaign log data associated with them will be lost (but the deck will remain on ArkhamDB).\n\nIf you are just swapping investigators for a scenario, it is okay to have more than 4 in the party.`,
      [
        {
          text: 'Remove',
          onPress: () => this.removeDeck(removedDeckId),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
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
      navigator,
    } = this.props;
    if (campaign && prevProps.campaign && campaign.name !== prevProps.campaign.name) {
      navigator.setSubTitle({ subtitle: campaign.name });
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

  addScenarioResult() {
    const {
      campaign,
      navigator,
    } = this.props;
    navigator.push({
      screen: 'Campaign.AddResult',
      title: 'Scenario Results',
      passProps: {
        id: campaign.id,
      },
      backButtonTitle: 'Cancel',
    });
  }

  showCampaignNotesDialog() {
    const {
      navigator,
      campaign,
    } = this.props;
    navigator.push({
      screen: 'Dialog.EditCampaignNotes',
      title: 'Campaign Log',
      passProps: {
        campaignId: campaign.id,
      },
      backButtonTitle: 'Cancel',
    });
  }

  render() {
    const {
      navigator,
      campaign,
      scenarioPack,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView>
        <Text style={[typography.bigLabel, styles.margin]}>
          { campaign.name }
        </Text>
        { campaign.cycleCode !== CUSTOM && (
          <Text style={[typography.text, styles.margin]}>
            { scenarioPack.name }
          </Text>
        ) }
        <View style={styles.section}>
          <Button onPress={this._addScenarioResult} text="Record Scenario Result" />
        </View>
        <View style={styles.section}>
          <InvestigatorNotesSection
            navigator={navigator}
            campaignId={campaign.id}
            campaign={campaign}
            deckIds={campaign.latestDeckIds || []}
            deckAdded={this._addDeck}
            deckRemoved={this._removeDeckPrompt}
          />
        </View>
        <View style={styles.section}>
          <CampaignNotesSection
            campaignNotes={campaign.campaignNotes}
          />
          <View style={styles.button}>
            <Button text="Edit" align="left" onPress={this._showCampaignNotesDialog} />
          </View>
        </View>
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
        <View style={styles.margin}>
          <Button color="red" onPress={this._deletePressed} text="Delete Campaign" />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  const packs = getAllPacks(state);
  return {
    campaign: campaign,
    scenarioPack: campaign && find(packs, pack => pack.code === campaign.cycleCode),
    packs: packs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteCampaign,
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingBottom: 8,
    marginBottom: 8,
  },
  margin: {
    margin: 8,
  },
  footer: {
    height: 100,
  },
});
