import React from 'react';
import { find, flatMap, filter, forEach, keys, map, partition, sumBy } from 'lodash';
import {
  Alert,
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { MyDecksSelectorProps } from 'components/campaign/MyDecksSelectorDialog';
import BasicButton from 'components/core/BasicButton';
import InvestigatorCampaignRow from 'components/campaign/InvestigatorCampaignRow';
import { Campaign, Deck, DecksMap, InvestigatorData, Trauma, WeaknessSet } from 'actions/types';
import { UpgradeDeckProps } from 'components/deck/DeckUpgradeDialog';
import Card, { CardsMap } from 'data/Card';
import { FACTION_DARK_GRADIENTS } from 'constants';
import typography from 'styles/typography';
import space from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  componentId: string;
  fontScale: number;
  campaign: Campaign;
  latestDeckIds: number[];
  decks: DecksMap;
  cards: CardsMap;
  allInvestigators: Card[];
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  weaknessSet: WeaknessSet;
  updateLatestDeckIds: (latestDeckIds: number[]) => void;
  updateNonDeckInvestigators: (nonDeckInvestigators: string[]) => void;
  updateWeaknessSet: (weaknessSet: WeaknessSet) => void;
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
}

interface State {
  removeMode: boolean;
}
export default class DecksSection extends React.Component<Props, State> {
  state: State = {
    removeMode: false,
  };

  _showChooseDeck = (
    singleInvestigator?: Card,
  ) => {
    const { campaign, latestDeckIds, decks, cards } = this.props;
    const campaignInvestigators = flatMap(latestDeckIds, deckId => {
      const deck = decks[deckId];
      return (deck && cards[deck.investigator_code]) || [];
    });

    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaign.id,
      singleInvestigator: singleInvestigator.code,
      onDeckSelect: this._addDeck,
    } : {
      campaignId: campaign.id,
      selectedInvestigatorIds: map(
        campaignInvestigators,
        investigator => investigator.code
      ),
      onDeckSelect: this._addDeck,
      onInvestigatorSelect: this._addInvestigator,
      simpleOptions: true,
    };
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Dialog.DeckSelector',
            passProps,
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  };

  maybeShowWeaknessPrompt(deck: Deck) {
    const {
      cards,
    } = this.props;
    const weaknesses = filter(
      keys(deck.slots),
      code => {
        const card = cards[code];
        return card && card.isBasicWeakness();
      });
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
          map(weaknesses, code => `${deck.slots[code]}x - ${cards[code].name}`).join('\n') +
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
                const assignedCards = { ...weaknessSet.assignedCards };
                forEach(weaknesses, code => {
                  const card = cards[code];
                  if (!card) {
                    // Shouldn't happen because of above, but defensiveness never hurts.
                    return;
                  }
                  const count = deck.slots[code];
                  if (!(code in assignedCards)) {
                    assignedCards[code] = 0;
                  }
                  if ((assignedCards[code] + count) > (card.quantity || 0)) {
                    assignedCards[code] = card.quantity || 0;
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

  _addInvestigator = (card: Card) => {
    const {
      allInvestigators,
      updateNonDeckInvestigators,
    } = this.props;
    const newInvestigators = [
      ...map(allInvestigators, investigator => investigator.code),
      card.code,
    ];
    updateNonDeckInvestigators(newInvestigators);
  };

  _addDeck = (deck: Deck) => {
    const {
      latestDeckIds,
      updateLatestDeckIds,
    } = this.props;
    const newLatestDeckIds = [...(latestDeckIds || []), deck.id];
    updateLatestDeckIds(newLatestDeckIds);
    this.maybeShowWeaknessPrompt(deck);
  };

  removeInvestigator(investigator: Card, removedDeckId?: number) {
    const {
      latestDeckIds,
      allInvestigators,
      updateLatestDeckIds,
      updateNonDeckInvestigators,
      decks,
    } = this.props;
    if (removedDeckId) {
      const newLatestDeckIds = filter(
        latestDeckIds,
        deckId => deckId !== removedDeckId
      );
      const deck = decks[removedDeckId];
      if (deck && !find(allInvestigators, card => card.code === investigator.code)) {
        updateNonDeckInvestigators(map(allInvestigators, card => card.code));
      }
      updateLatestDeckIds(newLatestDeckIds);
    } else {
      updateNonDeckInvestigators(
        filter(
          map(allInvestigators, card => card.code),
          code => code !== investigator.code
        )
      );
    }
  }

  _removeDeckPrompt = (
    investigator: Card
  ) => {
    const { latestDeckIds, decks } = this.props;
    const deckId = find(latestDeckIds, deckId => {
      const deck = decks[deckId];
      return deck && deck.investigator_code === investigator.code;
    });
    Alert.alert(
      t`Remove ${investigator.name}?`,
      deckId ?
        t`Are you sure you want to remove this deck from the campaign?\n\nThe deck will remain on ArkhamDB.` :
        t`Are you sure you want to remove ${investigator.name} from this campaign?\n\nCampaign log data associated with them may be lost.`,
      [
        {
          text: t`Remove`,
          onPress: () => this.removeInvestigator(investigator, deckId),
          style: 'destructive',
        },
        {
          text: t`Cancel`,
          style: 'cancel',
        },
      ],
    );
  };

  _showDeckUpgradeDialog = (
    investigator: Card,
    deck: Deck
  ) => {
    const {
      componentId,
      campaign,
    } = this.props;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: deck.id,
          campaignId: campaign.id,
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

  _showChooseDeckForInvestigator = (investigator: Card) => {
    this._showChooseDeck(investigator);
  };

  renderInvestigator(investigator: Card, eliminated: boolean, deck?: Deck) {
    const {
      componentId,
      campaign,
      cards,
      fontScale,
      showTraumaDialog,
      incSpentXp,
      decSpentXp,
    } = this.props;
    const { removeMode } = this.state;
    const traumaAndCardData = campaign.investigatorData[investigator.code] || {};
    return (
      <InvestigatorCampaignRow
        key={investigator.code}
        componentId={componentId}
        campaignId={campaign.id}
        investigator={investigator}
        spentXp={traumaAndCardData.spentXp || 0}
        totalXp={traumaAndCardData.availableXp || 0}
        incSpentXp={incSpentXp}
        decSpentXp={decSpentXp}
        traumaAndCardData={traumaAndCardData}
        showTraumaDialog={showTraumaDialog}
        showDeckUpgrade={this._showDeckUpgradeDialog}
        fontScale={fontScale}
        playerCards={cards}
        chooseDeckForInvestigator={this._showChooseDeckForInvestigator}
        deck={deck}
        removeInvestigator={removeMode ? this._removeDeckPrompt : undefined}
      />
    );
  }

  _toggleRemoveMode = () => {
    this.setState(state => {
      return {
        removeMode: !state.removeMode,
      };
    });
  };

  renderRemoveButton(aliveInvestigators: Card[]) {
    if (!aliveInvestigators.length) {
      return null;
    }

    return (
      <BasicButton
        title={t`Remove investigators`}
        color={COLORS.red}
        onPress={this._toggleRemoveMode}
      />
    );
  }

  _showAddInvestigator = () => {
    this._showChooseDeck();
  };

  render() {
    const {
      allInvestigators,
      latestDeckIds,
      investigatorData,
      decks,
    } = this.props;
    const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => decks[deckId] || []);
    const { removeMode } = this.state;
    const [killedInvestigators, aliveInvestigators] = partition(allInvestigators, investigator => {
      return investigator.eliminated(investigatorData[investigator.code]);
    });
    return (
      <View style={styles.underline}>
        { flatMap(aliveInvestigators, investigator => {
          const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
          return this.renderInvestigator(investigator, false, deck);
        }) }
        { !removeMode && (
          <BasicButton
            title={t`Add Investigator`}
            onPress={this._showAddInvestigator}
          />
        ) }
        { removeMode ?
          <BasicButton
            title={t`Finished removing investigators`}
            color={COLORS.red}
            onPress={this._toggleRemoveMode}
          /> : this.renderRemoveButton(aliveInvestigators)
        }
        { killedInvestigators.length > 0 && (
          <View style={styles.underline}>
            <View style={space.paddingS}>
              <Text style={typography.text}>
                { t`Killed and Insane Investigators` }
              </Text>
            </View>
            { flatMap(killedInvestigators, investigator => {
              const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
              return this.renderInvestigator(investigator, true, deck);
            }) }
          </View>
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdbdbd',
  },
});
