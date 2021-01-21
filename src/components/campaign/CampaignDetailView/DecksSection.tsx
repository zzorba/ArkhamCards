import React, { useCallback, useContext, useMemo } from 'react';
import { find, flatMap, filter, map, partition } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { Campaign, Deck, DeckId, DecksMap, getCampaignId, getDeckId, InvestigatorData, Trauma, TraumaAndCardData } from '@actions/types';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import Card, { CardsMap } from '@data/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { ShowAlert } from '@components/deck/dialogs';
import { getDeck } from '@reducers';

interface Props {
  componentId: string;
  campaign: Campaign;
  latestDeckIds: DeckId[];
  decks: DecksMap;
  cards: CardsMap;
  allInvestigators: Card[];
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  updateLatestDeckIds: (latestDeckIds: DeckId[]) => void;
  updateNonDeckInvestigators: (nonDeckInvestigators: string[]) => void;
  showChooseDeck: (investigator?: Card) => void;
  incSpentXp: (code: string) => void;
  decSpentXp: (code: string) => void;
  header?: React.ReactNode;
  removeMode: boolean;
  toggleRemoveMode: () => void;
  showAlert: ShowAlert;
}

const EMPTY_TRAUMA_DATA: TraumaAndCardData = {};

export default function DecksSection({
  header,
  componentId,
  campaign,
  latestDeckIds,
  decks,
  cards,
  allInvestigators,
  investigatorData,
  showTraumaDialog,
  updateLatestDeckIds,
  updateNonDeckInvestigators,
  incSpentXp,
  decSpentXp,
  removeMode,
  toggleRemoveMode,
  showChooseDeck,
  showAlert,
}: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const removeInvestigator = useCallback((investigator: Card, removedDeckId?: DeckId) =>{
    if (removedDeckId) {
      const newLatestDeckIds = filter(
        latestDeckIds,
        deckId => deckId.uuid !== removedDeckId.uuid
      );
      const deck = getDeck(decks, removedDeckId);
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
      const deck = getDeck(decks, deckId);
      return !!(deck && deck.investigator_code === investigator.code);
    });
    showAlert(
      t`Remove ${investigator.name}?`,
      deckId ?
        t`Are you sure you want to remove this deck from the campaign?\n\nThe deck will remain on ArkhamDB.` :
        t`Are you sure you want to remove ${investigator.name} from this campaign?\n\nCampaign log data associated with them may be lost.`,
      [
        {
          text: t`Cancel`,
          style: 'cancel',
        },
        {
          text: t`Remove`,
          onPress: () => removeInvestigator(investigator, deckId),
          style: 'destructive',
        },
      ],
    );
  }, [latestDeckIds, decks, removeInvestigator, showAlert]);

  const showDeckUpgradeDialog = useCallback((investigator: Card, deck: Deck) => {
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: getDeckId(deck),
          campaignId: campaign.uuid,
          showNewDeck: false,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
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
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, campaign, colors]);

  const showChooseDeckForInvestigator = useCallback((investigator: Card) => {
    showChooseDeck(investigator);
  }, [showChooseDeck]);
  const campaignId = useMemo(() => getCampaignId(campaign), [campaign]);
  const renderInvestigator = useCallback((investigator: Card, eliminated: boolean, deck?: Deck) => {
    const traumaAndCardData = campaign.investigatorData[investigator.code] || EMPTY_TRAUMA_DATA;
    return (
      <InvestigatorCampaignRow
        key={investigator.code}
        componentId={componentId}
        campaignId={campaignId}
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
  }, [componentId, campaignId, campaign.investigatorData, cards, showTraumaDialog, incSpentXp, decSpentXp, removeDeckPrompt, showDeckUpgradeDialog, showChooseDeckForInvestigator, removeMode]);

  const latestDecks: Deck[] = useMemo(() => flatMap(latestDeckIds, deckId => getDeck(decks, deckId) || []), [latestDeckIds, decks]);
  const [killedInvestigators, aliveInvestigators] = useMemo(() => {
    return partition(allInvestigators, investigator => {
      return investigator.eliminated(investigatorData[investigator.code]);
    });
  }, [allInvestigators, investigatorData]);
  return (
    <RoundedFactionBlock
      faction="neutral"
      noSpace
      header={header}
      footer={
        removeMode ? (
          <RoundedFooterButton
            icon="check"
            title={t`Finished Removing Investigarors`}
            onPress={toggleRemoveMode}
          />
        ) : (
          <RoundedFooterButton
            icon="expand"
            title={t`Add Investigator`}
            onPress={showChooseDeck}
          />
        )
      }
    >
      { flatMap(aliveInvestigators, investigator => {
        const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
        return renderInvestigator(investigator, false, deck);
      }) }
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
    </RoundedFactionBlock>
  );
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
