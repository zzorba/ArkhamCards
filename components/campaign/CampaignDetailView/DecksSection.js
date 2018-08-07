import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, keys, map, sumBy } from 'lodash';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';

import CampaignDecks from './CampaignDecks';
import withWeaknessCards from '../../weakness/withWeaknessCards';
import { FACTION_DARK_GRADIENTS } from '../../../constants';

class DecksSection extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    latestDeckIds: PropTypes.array,
    investigatorData: PropTypes.object.isRequired,
    showTraumaDialog: PropTypes.func.isRequired,
    weaknessSet: PropTypes.object.isRequired,
    updateLatestDeckIds: PropTypes.func.isRequired,
    updateWeaknessSet: PropTypes.func.isRequired,
    // From HOC
    cardsMap: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._addDeck = this.addDeck.bind(this);
    this._showDeckUpgradeDialog = this.showDeckUpgradeDialog.bind(this);
    this._removeDeckPrompt = this.removeDeckPrompt.bind(this);
  }

  maybeShowWeaknessPrompt(deck) {
    const {
      cardsMap
    } = this.props;
    const weaknesses = filter(keys(deck.slots), code => (code in cardsMap));
    const count = sumBy(weaknesses, code => deck.slots[code]);
    if (weaknesses.length) {
      setTimeout(() => {
        Alert.alert(
          'Adjust Weakness Set',
          (count > 1 ?
            'This deck contains several basic weaknesses' :
            'This deck contains a basic weakness') +
          '\n\n' +
          map(weaknesses, code => `${deck.slots[code]}x - ${cardsMap[code].name}`).join('\n') +
          '\n\n' +
          (count > 1 ?
            'Do you want to remove them from the campaign’s Basic Weakness set?' :
            'Do you want to remove it from the campaign’s Basic Weakness set?'),
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Okay',
              style: 'default',
              onPress: () => {
                const {
                  weaknessSet,
                  updateWeaknessSet,
                } = this.props;
                const assignedCards = Object.assign({}, weaknessSet.assignedCards);
                forEach(weaknesses, code => {
                  const count = deck.slots[code];
                  if (!(code in assignedCards)) {
                    assignedCards[code] = 0;
                  }
                  if ((assignedCards[code] + count) > cardsMap[code].quantity) {
                    assignedCards[code] = cardsMap[code].quantity;
                  } else {
                    assignedCards[code] += count;
                  }
                });
                updateWeaknessSet(Object.assign({}, weaknessSet, { assignedCards }));
              },
            },
          ],
        );
      }, 50);
    }
  }

  addDeck(deck) {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = latestDeckIds.slice();
    newLatestDeckIds.push(deck.id);
    updateLatestDeckIds(newLatestDeckIds);
    this.maybeShowWeaknessPrompt(deck);
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
      `Are you sure you want to remove ${investigator.name} from this campaign?` +
      '\n\n' +
      'Campaign log data associated with them may be lost (but the deck will remain on ArkhamDB).',
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
          deckAdded={this._addDeck}
          deckRemoved={this._removeDeckPrompt}
          showTraumaDialog={showTraumaDialog}
          showDeckUpgradeDialog={this._showDeckUpgradeDialog}
        />
      </View>
    );
  }
}

export default withWeaknessCards(DecksSection);

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
