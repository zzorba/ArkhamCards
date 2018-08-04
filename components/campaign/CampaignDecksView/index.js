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
import withTraumaDialog from '../withTraumaDialog';
import { updateCampaign } from '../actions';
import { iconsMap } from '../../../app/NavIcons';
import { getCampaign } from '../../../reducers';

class CampaignDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    // redux
    updateCampaign: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    // from HOC
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._addDeck = this.addDeck.bind(this);
    this._removeDeckPrompt = this.removeDeckPrompt.bind(this);
    this._updateLatestDeckIds = this.applyCampaignUpdate.bind(this, 'latestDeckIds');
    this._updateInvestigatorData = this.applyCampaignUpdate.bind(this, 'investigatorData');

    props.navigator.setButtons({
      rightButtons: [{
        icon: iconsMap.add,
        id: 'add',
      }],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        this.showDeckSelector();
      }
    }
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

  showDeckSelector() {
    const {
      navigator,
      campaign,
    } = this.props;
    navigator.showModal({
      screen: 'Dialog.DeckSelector',
      passProps: {
        campaignId: campaign.id,
        onDeckSelect: this._addDeck,
        selectedDeckIds: campaign.latestDeckIds,
      },
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
      showTraumaDialog,
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
          deckRemoved={this._removeDeckPrompt}
          showTraumaDialog={showTraumaDialog}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  withTraumaDialog(CampaignDetailView)
);

const styles = StyleSheet.create({
  footer: {
    height: 100,
  },
  flex: {
    flex: 1,
  },
});
