import React from 'react';
import { filter, forEach, keys, map, partition, sumBy } from 'lodash';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Deck, DecksMap, InvestigatorData, Trauma, WeaknessSet } from 'actions/types';
import CampaignDecks from './CampaignDecks';
import { UpgradeDeckProps } from 'components/deck/DeckUpgradeDialog';
import withWeaknessCards, { WeaknessCardProps } from 'components/weakness/withWeaknessCards';
import Card, { CardsMap } from 'data/Card';
import { FACTION_DARK_GRADIENTS } from 'constants';
import typography from 'styles/typography';

interface OwnProps {
  componentId: string;
  fontScale: number;
  campaignId: number;
  latestDeckIds: number[];
  decks: DecksMap;
  allInvestigators: Card[];
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  weaknessSet: WeaknessSet;
  updateLatestDeckIds: (latestDeckIds: number[]) => void;
  updateWeaknessSet: (weaknessSet: WeaknessSet) => void;
}

type Props = OwnProps & WeaknessCardProps;

class DecksSection extends React.Component<Props> {
  maybeShowWeaknessPrompt(deck: Deck) {
    const {
      cardsMap,
    } = this.props;
    const weaknesses = filter(keys(deck.slots), code => (code in cardsMap));
    const count = sumBy(weaknesses, code => deck.slots[code]);
    if (weaknesses.length) {
      setTimeout(() => {
        Alert.alert(
          t`Adjust Weakness Set`,
          /* eslint-disable prefer-template */
          (count > 1 ?
            t`This deck contains several basic weaknesses` :
            t`This deck contains a basic weakness`) +
          '\n\n' +
          map(weaknesses, code => `${deck.slots[code]}x - ${cardsMap[code].name}`).join('\n') +
          '\n\n' +
          (count > 1 ?
            t`Do you want to remove them from the campaign’s Basic Weakness set?` :
            t`Do you want to remove it from the campaign’s Basic Weakness set?`),
          [
            { text: t`Not Now`, style: 'cancel' },
            {
              text: t`Okay`,
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
                  if ((assignedCards[code] + count) > (cardsMap[code].quantity || 0)) {
                    // @ts-ignore
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

  _addDeck = (deck: Deck) => {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = [...(latestDeckIds || []), deck.id];
    updateLatestDeckIds(newLatestDeckIds);
    this.maybeShowWeaknessPrompt(deck);
  };

  removeDeck(removedDeckId: number) {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = filter(
      latestDeckIds,
      deckId => deckId !== removedDeckId
    );
    updateLatestDeckIds(newLatestDeckIds);
  }

  _removeDeckPrompt = (
    removedDeckId: number,
    deck?: Deck,
    investigator?: Card
  ) => {
    if (investigator) {
      Alert.alert(
        t`Remove ${investigator.name}?`,
        t`Are you sure you want to remove ${investigator.name} from this campaign?\n\nCampaign log data associated with them may be lost (but the deck will remain on ArkhamDB).`,
        [
          {
            text: t`Remove`,
            onPress: () => this.removeDeck(removedDeckId),
            style: 'destructive',
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ],
      );
    }
  };

  _showDeckUpgradeDialog = (
    deck: Deck,
    investigator?: Card
  ) => {
    const {
      componentId,
      campaignId,
    } = this.props;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deck.id,
          campaignId,
          showNewDeck: false,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Upgrade`,
              color: 'white',
            },
            subtitle: {
              text: investigator ? investigator.name : '',
              color: 'white',
            },
            background: {
              color: FACTION_DARK_GRADIENTS[investigator ? investigator.factionCode() : 'neutral'][0],
            },
          },
        },
      },
    });
  };

  render() {
    const {
      componentId,
      campaignId,
      latestDeckIds,
      investigatorData,
      showTraumaDialog,
      fontScale,
      decks,
      allInvestigators,
    } = this.props;
    const cards: CardsMap = {};
    forEach(allInvestigators, card => {
      cards[card.code] = card;
    });
    const [killedDeckIds, aliveDeckIds] = partition(latestDeckIds, deckId => {
      const deck = decks[deckId];
      if (!deck) {
        return false;
      }
      const investigator = cards[deck.investigator_code];
      if (!investigator) {
        return false;
      }
      return investigator.eliminated(investigatorData[deck.investigator_code]);
    });
    return (
      <>
        <View style={styles.underline}>
          <CampaignDecks
            componentId={componentId}
            fontScale={fontScale}
            campaignId={campaignId}
            investigatorData={investigatorData}
            deckIds={aliveDeckIds}
            deckAdded={this._addDeck}
            deckRemoved={this._removeDeckPrompt}
            showTraumaDialog={showTraumaDialog}
            showDeckUpgradeDialog={this._showDeckUpgradeDialog}
          />
        </View>
        { killedDeckIds.length > 0 && (
          <View style={styles.underline}>
            <View style={styles.padding}>
              <Text style={typography.text}>
                { t`Killed and Insane Investigators` }
              </Text>
            </View>
            <CampaignDecks
              componentId={componentId}
              fontScale={fontScale}
              campaignId={campaignId}
              investigatorData={investigatorData}
              deckIds={killedDeckIds}
              showTraumaDialog={showTraumaDialog}
              killedOrInsane
            />
          </View>
        ) }
      </>
    );
  }
}

export default withWeaknessCards<OwnProps>(DecksSection);

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  padding: {
    padding: 8,
  },
});
