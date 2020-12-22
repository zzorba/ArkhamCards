import React, { useCallback, useContext, useMemo } from 'react';
import { find, flatMap, filter, map, partition } from 'lodash';
import {
  Alert,
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';
import BasicButton from '@components/core/BasicButton';
import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
import { Campaign, Deck, DecksMap, InvestigatorData, Slots, Trauma, TraumaAndCardData, WeaknessSet } from '@actions/types';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import Card, { CardsMap } from '@data/Card';
import space from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';

interface Props {
  componentId: string;
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

const EMPTY_TRAUMA_DATA: TraumaAndCardData = {};

export default function DecksSection({
  componentId,
  campaign,
  latestDeckIds,
  decks,
  cards,
  allInvestigators,
  investigatorData,
  showTraumaDialog,
  weaknessSet,
  updateLatestDeckIds,
  updateNonDeckInvestigators,
  updateWeaknessSet,
  incSpentXp,
  decSpentXp,
}: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const [removeMode, toggleRemoveMode] = useFlag(false);

  const updateWeaknessAssignedCards = useCallback((weaknessCards: Slots) => {
    updateWeaknessSet({
      ...weaknessSet,
      assignedCards: weaknessCards,
    });
  }, [updateWeaknessSet, weaknessSet]);

  const checkForWeaknessPrompt = useCallback((deck: Deck) => {
    maybeShowWeaknessPrompt(
      deck,
      cards,
      weaknessSet.assignedCards,
      updateWeaknessAssignedCards
    );
  }, [cards, weaknessSet, updateWeaknessAssignedCards]);

  const addDeck = useCallback((deck: Deck) => {
    const newLatestDeckIds = [...(latestDeckIds || []), deck.id];
    updateLatestDeckIds(newLatestDeckIds);
    checkForWeaknessPrompt(deck);
  }, [latestDeckIds, updateLatestDeckIds, checkForWeaknessPrompt]);

  const addInvestigator = useCallback((card: Card) => {
    const newInvestigators = [
      ...map(allInvestigators, investigator => investigator.code),
      card.code,
    ];
    updateNonDeckInvestigators(newInvestigators);
  }, [allInvestigators, updateNonDeckInvestigators]);

  const showChooseDeck = useCallback((
    singleInvestigator?: Card,
  ) => {
    const campaignInvestigators = flatMap(latestDeckIds, deckId => {
      const deck = decks[deckId];
      return (deck && cards[deck.investigator_code]) || [];
    });

    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaign.id,
      singleInvestigator: singleInvestigator.code,
      onDeckSelect: addDeck,
    } : {
      campaignId: campaign.id,
      selectedInvestigatorIds: map(
        campaignInvestigators,
        investigator => investigator.code
      ),
      onDeckSelect: addDeck,
      onInvestigatorSelect: addInvestigator,
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
                OptionsModalPresentationStyle.fullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [campaign, latestDeckIds, decks, cards, addDeck, addInvestigator]);

  const removeInvestigator = useCallback((investigator: Card, removedDeckId?: number) =>{
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
  }, [latestDeckIds, allInvestigators, updateLatestDeckIds, updateNonDeckInvestigators, decks]);

  const removeDeckPrompt = useCallback((investigator: Card) => {
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
          onPress: () => removeInvestigator(investigator, deckId),
          style: 'destructive',
        },
        {
          text: t`Cancel`,
          style: 'cancel',
        },
      ],
    );
  }, [latestDeckIds, decks, removeInvestigator]);

  const showDeckUpgradeDialog = useCallback((investigator: Card, deck: Deck) => {
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
              color: colors.faction[investigator ? investigator.factionCode() : 'neutral'].background,
            },
          },
        },
      },
    });
  }, [componentId, campaign, colors]);

  const showChooseDeckForInvestigator = useCallback((investigator: Card) => {
    showChooseDeck(investigator);
  }, [showChooseDeck]);

  const renderInvestigator = useCallback((investigator: Card, eliminated: boolean, deck?: Deck) => {
    const traumaAndCardData = campaign.investigatorData[investigator.code] || EMPTY_TRAUMA_DATA;
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
        showDeckUpgrade={showDeckUpgradeDialog}
        playerCards={cards}
        chooseDeckForInvestigator={showChooseDeckForInvestigator}
        deck={deck}
        removeInvestigator={removeMode ? removeDeckPrompt : undefined}
      />
    );
  }, [componentId, campaign, cards, showTraumaDialog, incSpentXp, decSpentXp, removeDeckPrompt, showDeckUpgradeDialog, showChooseDeckForInvestigator, removeMode]);

  const latestDecks: Deck[] = useMemo(() => flatMap(latestDeckIds, deckId => decks[deckId] || []), [latestDeckIds, decks]);
  const [killedInvestigators, aliveInvestigators] = useMemo(() => {
    return partition(allInvestigators, investigator => {
      return investigator.eliminated(investigatorData[investigator.code]);
    });
  }, [allInvestigators, investigatorData]);

  const removeButton = useMemo(() => {
    if (!aliveInvestigators.length) {
      return null;
    }
    return (
      <BasicButton
        title={t`Remove investigators`}
        color={COLORS.red}
        onPress={toggleRemoveMode}
      />
    );
  }, [aliveInvestigators, toggleRemoveMode]);

  const showAddInvestigator = useCallback(() => {
    showChooseDeck();
  }, [showChooseDeck]);

  return (
    <View style={[styles.underline, borderStyle]}>
      { flatMap(aliveInvestigators, investigator => {
        const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
        return renderInvestigator(investigator, false, deck);
      }) }
      { !removeMode && (
        <BasicButton
          title={t`Add Investigator`}
          onPress={showAddInvestigator}
        />
      ) }
      { removeMode ?
        <BasicButton
          title={t`Finished removing investigators`}
          color={COLORS.red}
          onPress={toggleRemoveMode}
        /> : removeButton
      }
      { killedInvestigators.length > 0 && (
        <View style={[styles.underline, borderStyle]}>
          <View style={space.paddingS}>
            <Text style={typography.text}>
              { t`Killed and Insane Investigators` }
            </Text>
          </View>
          { flatMap(killedInvestigators, investigator => {
            const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
            return renderInvestigator(investigator, true, deck);
          }) }
        </View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
