import React, { useCallback, useContext, useMemo } from 'react';
import { find, flatMap, partition } from 'lodash';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { Campaign, CampaignId, CampaignNotes, InvestigatorNotes, Deck, DeckId, DecksMap, getCampaignId, getDeckId, InvestigatorData, Trauma, TraumaAndCardData } from '@actions/types';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import Card, { CardsMap } from '@data/types/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import { getDeck } from '@reducers';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import InvestigatorSectionRow from '../CampaignLogSection/InvestigatorSectionRow';
import InvestigatorCountsSection from '../CampaignLogSection/InvestigatorCountsSection';
import { useDispatch } from 'react-redux';
import { updateCampaign } from '../actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaign: Campaign;
  latestDeckIds: DeckId[];
  decks: DecksMap;
  cards: CardsMap;
  allInvestigators: Card[];
  investigatorData: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  removeInvestigator: (investigator: Card, removedDeckId?: DeckId) => void;
  showChooseDeck: (investigator?: Card) => void;
  showXpDialog: (investigator: Card) => void;
  showAlert: ShowAlert;
  showTextEditDialog: ShowTextEditDialog;
  showCountDialog: ShowCountDialog;
}

const EMPTY_TRAUMA_DATA: TraumaAndCardData = {};

export default function DecksSection({
  componentId,
  campaignId,
  campaign,
  latestDeckIds,
  decks,
  cards,
  allInvestigators,
  investigatorData,
  showXpDialog,
  showTraumaDialog,
  removeInvestigator,
  showChooseDeck,
  showAlert,
  showTextEditDialog,
  showCountDialog,
}: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
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
          campaignId: getCampaignId(campaign),
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
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const updateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaign(user, campaignId, { campaignNotes }));
  }, [dispatch, campaignId, user]);

  const delayedUpdateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    InteractionManager.runAfterInteractions(() => {
      updateCampaignNotes(campaignNotes);
    });
  }, [updateCampaignNotes]);
  const updateInvestigatorNotes = useCallback((investigatorNotes: InvestigatorNotes) => {
    delayedUpdateCampaignNotes({
      ...campaign.campaignNotes,
      investigatorNotes,
    });
  }, [delayedUpdateCampaignNotes, campaign.campaignNotes]);

  const renderInvestigator = useCallback((investigator: Card, eliminated: boolean, deck?: Deck) => {
    const traumaAndCardData = campaign.investigatorData?.[investigator.code] || EMPTY_TRAUMA_DATA;
    return (
      <InvestigatorCampaignRow
        key={investigator.code}
        componentId={componentId}
        campaignId={campaignId}
        investigator={investigator}
        spentXp={traumaAndCardData.spentXp || 0}
        totalXp={traumaAndCardData.availableXp || 0}
        showXpDialog={showXpDialog}
        traumaAndCardData={traumaAndCardData}
        showTraumaDialog={showTraumaDialog}
        showDeckUpgrade={showDeckUpgradeDialog}
        playerCards={cards}
        chooseDeckForInvestigator={showChooseDeckForInvestigator}
        deck={deck}
        removeInvestigator={removeDeckPrompt}
        miniButtons={campaign.campaignNotes?.investigatorNotes?.counts?.length ?
          <InvestigatorCountsSection
            investigator={investigator}
            updateInvestigatorNotes={updateInvestigatorNotes}
            investigatorNotes={campaign.campaignNotes.investigatorNotes}
            showCountDialog={showCountDialog}
          /> : undefined}
      >
        <InvestigatorSectionRow
          investigator={investigator}
          investigatorNotes={campaign.campaignNotes?.investigatorNotes}
          updateInvestigatorNotes={updateInvestigatorNotes}
          showDialog={showTextEditDialog}
          showCountDialog={showCountDialog}
          inline
          hideCounts
        />
      </InvestigatorCampaignRow>
    );
  }, [componentId, campaign.campaignNotes?.investigatorNotes, campaignId, campaign.investigatorData, cards,
    showTextEditDialog, updateInvestigatorNotes, showCountDialog,
    showTraumaDialog, showXpDialog, removeDeckPrompt, showDeckUpgradeDialog, showChooseDeckForInvestigator]);

  const latestDecks: Deck[] = useMemo(() => flatMap(latestDeckIds, deckId => getDeck(decks, deckId) || []), [latestDeckIds, decks]);
  const [killedInvestigators, aliveInvestigators] = useMemo(() => {
    return partition(allInvestigators, investigator => {
      return investigator.eliminated(investigatorData?.[investigator.code]);
    });
  }, [allInvestigators, investigatorData]);
  return (
    <>
      { flatMap(aliveInvestigators, investigator => {
        const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
        return renderInvestigator(investigator, false, deck);
      }) }
      { killedInvestigators.length > 0 && (
        <View style={[styles.underline, borderStyle]}>
          <View style={space.paddingS}>
            <Text style={[typography.large, typography.center, typography.light]}>
              { `— ${t`Killed and Insane Investigators`} · ${killedInvestigators.length} —` }
            </Text>
          </View>
          { flatMap(killedInvestigators, investigator => {
            const deck = find(latestDecks, deck => deck.investigator_code === investigator.code);
            return renderInvestigator(investigator, true, deck);
          }) }
        </View>
      ) }
    </>
  );
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
