import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { last } from 'lodash';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import DeckUpgradeComponent, { DeckUpgradeHandles } from './DeckUpgradeComponent';
import { Deck, DeckId, getCampaignId, getDeckId, Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { showDeckModal } from '@components/nav/helper';
import StoryCardSelectorComponent from '@components/campaign/StoryCardSelectorComponent';
import { updateCampaign } from '@components/campaign/actions';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import Card from '@data/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useDeck, useInvestigatorCards, useNavigationButtonPressed, useSlots } from '@components/core/hooks';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import { saveDeckChanges, saveDeckUpgrade, SaveDeckChanges } from './actions';
import { AppState } from '@reducers';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export interface UpgradeDeckProps {
  id: DeckId;
  campaignId?: string;
  showNewDeck: boolean;
}

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;
function DeckUpgradeDialog({ id, campaignId, showNewDeck, componentId }: UpgradeDeckProps & NavigationProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const [deck] = useDeck(id, {});
  const campaign = useCampaign(campaignId);
  const deckUpgradeComponent = useRef<DeckUpgradeHandles>(null);

  const latestScenario = useMemo(() => campaign && last(campaign.scenarioResults || []), [campaign]);
  const scenarioName = latestScenario ? latestScenario.scenario : undefined;
  const storyEncounterCodes = useMemo(() => latestScenario && latestScenario.scenarioCode ? [latestScenario.scenarioCode] : [], [latestScenario]);

  const [storyCounts, updateStoryCounts] = useSlots({});
  const investigators = useInvestigatorCards(deck?.taboo_id);
  const dispatch = useDispatch();
  const deckDispatch: DeckDispatch = useDispatch();

  const {
    showTraumaDialog,
    investigatorDataUpdates,
    traumaDialog,
  } = useTraumaDialog({});

  const investigatorData = useMemo(() => {
    if (!campaign) {
      return undefined;
    }
    return {
      ...(campaign.investigatorData || {}),
      ...investigatorDataUpdates,
    };
  }, [campaign, investigatorDataUpdates]);

  const save = useCallback(() => {
    if (deckUpgradeComponent.current) {
      deckUpgradeComponent.current.save();
    }
  }, [deckUpgradeComponent]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      save();
    }
  }, componentId, [save]);

  const investigator: Card | undefined = useMemo(() => {
    if (!deck || !investigators) {
      return undefined;
    }
    return investigators[deck.investigator_code];
  }, [deck, investigators]);

  const deckUpgradeComplete = useCallback((deck: Deck) => {
    if (campaign) {
      if (investigatorData) {
        dispatch(updateCampaign(
          getCampaignId(campaign),
          { investigatorData }
        ));
      }
    }
    if (showNewDeck) {
      showDeckModal(componentId, deck, colors, investigator, { upgrade: true });
    } else {
      Navigation.pop(componentId);
    }
  }, [showNewDeck, componentId, dispatch, campaign, colors, investigator, investigatorData]);

  const onStoryCountsChange = useCallback((storyCounts: Slots) => {
    updateStoryCounts({ type: 'sync', slots: storyCounts });
  }, [updateStoryCounts]);

  const performSaveDeckChanges = useCallback((deck: Deck, changes: SaveDeckChanges): Promise<Deck> => {
    return deckDispatch(saveDeckChanges(user, deck, changes));
  }, [deckDispatch, user]);

  const performSaveDeckUpgrade = useCallback((deck: Deck, xp: number, exileCounts: Slots): Promise<Deck> => {
    return deckDispatch(saveDeckUpgrade(user, deck, xp, exileCounts));
  }, [deckDispatch, user]);

  const campaignSection = useMemo(() => {
    if (!deck || !campaign || !investigator) {
      return null;
    }
    return (
      <>
        { !campaign.guided && (
          <EditTraumaComponent
            investigator={investigator}
            investigatorData={investigatorData}
            showTraumaDialog={showTraumaDialog}
            sectionHeader
          />
        ) }
        <StoryCardSelectorComponent
          componentId={componentId}
          investigator={investigator}
          deckId={getDeckId(deck)}
          updateStoryCounts={onStoryCountsChange}
          encounterCodes={storyEncounterCodes}
          scenarioName={scenarioName}
        />
      </>
    );
  }, [deck, componentId, campaign, showTraumaDialog, storyEncounterCodes, scenarioName, investigator, investigatorData, onStoryCountsChange]);

  if (!deck || !investigator) {
    return null;
  }
  const xp = latestScenario ? (latestScenario.xp || 0) : 0;
  return (
    <View style={styles.wrapper}>
      { traumaDialog }
      <ScrollView style={[styles.container, backgroundStyle]}>
        <View style={space.paddingM}>
          <Text style={typography.text}>
            { t`Upgrading your deck allows changes and experience to be tracked over the course of a campaign.` }
          </Text>
        </View>
        <DeckUpgradeComponent
          componentId={componentId}
          deck={deck}
          investigator={investigator}
          startingXp={xp}
          storyCounts={storyCounts}
          ignoreStoryCounts={{}}
          saveDeckUpgrade={performSaveDeckUpgrade}
          saveDeckChanges={performSaveDeckChanges}
          upgradeCompleted={deckUpgradeComplete}
          campaignSection={campaignSection}
          saveButtonText={t`Save upgrade`}
          ref={deckUpgradeComponent}
        />
      </ScrollView>
    </View>
  );
}

DeckUpgradeDialog.options = () => {
  return {
    topBar: {
      tintColor: 'white',
      rightButtons: [{
        text: t`Save`,
        color: 'white',
        id: 'save',
        accessibilityLabel: t`Save`,
      }],
      backButton: {
        title: t`Cancel`,
        color: 'white',
        accessibilityLabel: t`Cancel`,
      },
    },
  };
};

export default DeckUpgradeDialog;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
