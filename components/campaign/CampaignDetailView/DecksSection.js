import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import {
  Alert,
  Button,
  StyleSheet,
  View,
} from 'react-native';

import CampaignDecks from './CampaignDecks';
import { FACTION_DARK_GRADIENTS } from '../../../constants';

export default class DecksSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    latestDeckIds: PropTypes.array,
    investigatorData: PropTypes.object.isRequired,
    updateLatestDeckIds: PropTypes.func.isRequired,
    showTraumaDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._showDeckSelector = this.showDeckSelector.bind(this);
    this._addDeck = this.addDeck.bind(this);
    this._showDeckUpgradeDialog = this.showDeckUpgradeDialog.bind(this);
    this._removeDeckPrompt = this.removeDeckPrompt.bind(this);
  }

  showDeckSelector() {
    const {
      navigator,
      campaignId,
      latestDeckIds,
    } = this.props;
    navigator.showModal({
      screen: 'Dialog.DeckSelector',
      passProps: {
        campaignId: campaignId,
        onDeckSelect: this._addDeck,
        selectedDeckIds: latestDeckIds,
      },
    });
  }

  addDeck(deckId) {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = latestDeckIds.slice();
    newLatestDeckIds.push(deckId);
    updateLatestDeckIds(newLatestDeckIds);
  }

  removeDeck(removedDeckId) {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = filter(latestDeckIds, deckId => deckId !== removedDeckId);
    updateLatestDeckIds(newLatestDeckIds);
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

  showDeckUpgradeDialog(deck, investigator) {
    const {
      navigator,
      campaignId,
    } = this.props;
    navigator.push({
      screen: 'Deck.Upgrade',
      title: 'Upgrade',
      subtitle: investigator.name,
      backButtonTitle: 'Cancel',
      passProps: {
        id: deck.id,
        campaignId: campaignId,
        showNewDeck: false,
      },
      navigatorStyle: {
        navBarBackgroundColor: FACTION_DARK_GRADIENTS[investigator.faction_code][0],
        navBarTextColor: '#FFFFFF',
        navBarSubtitleColor: '#FFFFFF',
        navBarButtonColor: '#FFFFFF',
        statusBarTextColorScheme: 'light',
      },
    });
  }

  render() {
    const {
      navigator,
      campaignId,
      latestDeckIds,
      investigatorData,
      showTraumaDialog,
    } = this.props;
    return (
      <View style={styles.underline}>
        <CampaignDecks
          navigator={navigator}
          campaignId={campaignId}
          investigatorData={investigatorData}
          deckIds={latestDeckIds}
          deckRemoved={this._removeDeckPrompt}
          showTraumaDialog={showTraumaDialog}
          showDeckUpgradeDialog={this._showDeckUpgradeDialog}
        />
        <Button title="Add Investigator" onPress={this._showDeckSelector} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
