import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CampaignDecks from './CampaignDecks';
import { updateCampaign } from '../actions';
import { getCampaign } from '../../../reducers';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._addDeck = this.addDeck.bind(this);
    this._removeDeckPrompt = this.removeDeckPrompt.bind(this);
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');
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
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView style={styles.flex}>
        <CampaignDecks
          navigator={navigator}
          campaignId={campaign.id}
          campaign={campaign}
          deckIds={campaign.latestDeckIds || []}
          deckAdded={this._addDeck}
          deckRemoved={this._removeDeckPrompt}
        />
        <View style={styles.footer} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  const campaign = getCampaign(state, props.id);
  return {
    campaign: campaign,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetailView);

const styles = StyleSheet.create({
  footer: {
    height: 100,
  },
  flex: {
    flex: 1,
  },
});
