import React, { useCallback, useContext, useMemo } from 'react';
import { find, flatMap, partition } from 'lodash';
import { InteractionManager, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import InvestigatorCampaignRow from '@components/campaign/InvestigatorCampaignRow';
import { CampaignId, CampaignNotes, InvestigatorNotes, Deck, DeckId, getDeckId, Trauma } from '@actions/types';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import Card from '@data/types/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ShowAlert, ShowCountDialog } from '@components/deck/dialogs';
import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import InvestigatorSectionRow from '../CampaignLogSection/InvestigatorSectionRow';
import InvestigatorCountsSection from '../CampaignLogSection/InvestigatorCountsSection';
import { useDispatch } from 'react-redux';
import { updateCampaignNotes } from '../actions';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { SetCampaignNotesAction } from '@data/remote/campaigns';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import LoadingSpinner from '@components/core/LoadingSpinner';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  campaign: SingleCampaignT;
  loading: boolean;
  latestDecks: LatestDeckT[];
  allInvestigators: Card[];
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  removeInvestigator: (investigator: Card, removedDeckId?: DeckId) => void;
  showChooseDeck: (investigator?: Card) => void;
  showXpDialog: (investigator: Card) => void;
  setCampaignNotes: SetCampaignNotesAction;
  showAlert: ShowAlert;
  showTextEditDialog: ShowTextEditDialog;
  showCountDialog: ShowCountDialog;
}

export default function DecksSection({
  componentId,
  campaignId,
  campaign,
  latestDecks,
  allInvestigators,
  loading,
  setCampaignNotes,
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
    const deck = find(latestDecks, deck => {
      return !!(deck && deck.investigator === investigator.code);
    });
    showAlert(
      t`Remove ${investigator.name}?`,
      deck ?
        t`Are you sure you want to remove this deck from the campaign?\n\nThe deck will remain on ArkhamDB.` :
        t`Are you sure you want to remove ${investigator.name} from this campaign?\n\nCampaign log data associated with them may be lost.`,
      [
        {
          text: t`Cancel`,
          style: 'cancel',
        },
        {
          text: t`Remove`,
          onPress: () => removeInvestigator(investigator, deck?.id),
          style: 'destructive',
        },
      ],
    );
  }, [latestDecks, removeInvestigator, showAlert]);

  const showDeckUpgradeDialog = useCallback((investigator: Card, deck: Deck) => {
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<UpgradeDeckProps>(componentId, {
      component: {
        name: 'Deck.Upgrade',
        passProps: {
          id: getDeckId(deck),
          campaignId: campaign.id,
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
  const dispatch = useDispatch();
  const saveCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaignNotes(setCampaignNotes, campaignId, campaignNotes));
  }, [dispatch, setCampaignNotes, campaignId]);

  const delayedUpdateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    InteractionManager.runAfterInteractions(() => {
      saveCampaignNotes(campaignNotes);
    });
  }, [saveCampaignNotes]);
  const updateInvestigatorNotes = useCallback((investigatorNotes: InvestigatorNotes) => {
    delayedUpdateCampaignNotes({
      ...campaign.campaignNotes,
      investigatorNotes,
    });
  }, [delayedUpdateCampaignNotes, campaign.campaignNotes]);

  const renderInvestigator = useCallback((investigator: Card, eliminated: boolean, deck?: LatestDeckT) => {
    const traumaAndCardData = campaign.getInvestigatorData(investigator.code);
    return (
      <InvestigatorCampaignRow
        key={investigator.code}
        componentId={componentId}
        campaign={campaign}
        investigator={investigator}
        spentXp={traumaAndCardData.spentXp || 0}
        totalXp={traumaAndCardData.availableXp || 0}
        unspentXp={0}
        showXpDialog={showXpDialog}
        traumaAndCardData={traumaAndCardData}
        showTraumaDialog={showTraumaDialog}
        showDeckUpgrade={showDeckUpgradeDialog}
        chooseDeckForInvestigator={showChooseDeckForInvestigator}
        deck={deck}
        removeInvestigator={removeDeckPrompt}
        miniButtons={campaign.campaignNotes.investigatorNotes?.counts?.length ?
          <InvestigatorCountsSection
            investigator={investigator}
            updateInvestigatorNotes={updateInvestigatorNotes}
            investigatorNotes={campaign.campaignNotes.investigatorNotes}
            showCountDialog={showCountDialog}
          /> : undefined}
      >
        <InvestigatorSectionRow
          investigator={investigator}
          investigatorNotes={campaign.campaignNotes.investigatorNotes}
          updateInvestigatorNotes={updateInvestigatorNotes}
          showDialog={showTextEditDialog}
          showCountDialog={showCountDialog}
          inline
          hideCounts
        />
      </InvestigatorCampaignRow>
    );
  }, [componentId, campaign,
    showTextEditDialog, updateInvestigatorNotes, showCountDialog,
    showTraumaDialog, showXpDialog, removeDeckPrompt, showDeckUpgradeDialog, showChooseDeckForInvestigator]);

  const [killedInvestigators, aliveInvestigators] = useMemo(() => {
    return partition(allInvestigators, investigator => {
      return investigator.eliminated(campaign.getInvestigatorData(investigator.code));
    });
  }, [allInvestigators, campaign]);
  if (loading) {
    return <LoadingSpinner inline />;
  }
  return (
    <>
      { flatMap(aliveInvestigators, investigator => {
        const deck = find(latestDecks, deck => deck.investigator === investigator.code);
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
            const deck = find(latestDecks, deck => deck.investigator === investigator.code);
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
