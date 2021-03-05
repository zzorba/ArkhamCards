import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { last } from 'lodash';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import DeckUpgradeComponent, { DeckUpgradeHandles } from './DeckUpgradeComponent';
import { CampaignId, Deck, DeckId, getCampaignId, getDeckId, Slots, Trauma } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { showDeckModal } from '@components/nav/helper';
import StoryCardSelectorComponent from '@components/campaign/StoryCardSelectorComponent';
import { updateCampaign } from '@components/campaign/actions';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import Card from '@data/types/Card';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign } from '@data/remote/hooks';
import { useDeck, useInvestigatorCards, useNavigationButtonPressed, useSlots } from '@components/core/hooks';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useDeckUpgrade from './useDeckUpgrade';
import { useCreateDeckActions } from '@data/remote/decks';

export interface UpgradeDeckProps {
  id: DeckId;
  campaignId?: CampaignId;
  showNewDeck: boolean;
}

const EMPTY_TRAUMA = {};
function DeckUpgradeDialog({ id, campaignId, showNewDeck, componentId }: UpgradeDeckProps & NavigationProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const actions = useCreateDeckActions();
  const { user } = useContext(ArkhamCardsAuthContext);
  const [deck] = useDeck(id);
  const campaign = useCampaign(campaignId);
  const deckUpgradeComponent = useRef<DeckUpgradeHandles>(null);

  const latestScenario = useMemo(() => campaign && last(campaign.scenarioResults || []), [campaign]);
  const scenarioName = latestScenario ? latestScenario.scenario : undefined;
  const storyEncounterCodes = useMemo(() => latestScenario && latestScenario.scenarioCode ? [latestScenario.scenarioCode] : [], [latestScenario]);

  const [storyCounts, updateStoryCounts] = useSlots({});
  const investigators = useInvestigatorCards(deck?.taboo_id);
  const dispatch = useDispatch();

  const [traumaUpdate, setTraumaUpdate] = useState<Trauma | undefined>();
  const setInvestigatorTrauma = useCallback((investigator: string, trauma: Trauma) => {
    setTraumaUpdate(trauma);
  }, [setTraumaUpdate]);
  const {
    showTraumaDialog,
    traumaDialog,
  } = useTraumaDialog(setInvestigatorTrauma);

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
      if (traumaUpdate && campaign) {
        const investigatorData = {
          ...(campaign.investigatorData || {}),
          [deck.investigator_code]: {
            ...(campaign.investigatorData || {})[deck.investigator_code],
            ...traumaUpdate,
          },
        };
        dispatch(updateCampaign(
          user,
          getCampaignId(campaign),
          { investigatorData }
        ));
      }
    }
    if (showNewDeck) {
      showDeckModal(componentId, deck, colors, investigator, { initialMode: 'upgrade' });
    } else {
      Navigation.pop(componentId);
    }
  }, [showNewDeck, componentId, dispatch, user, campaign, colors, investigator, traumaUpdate]);

  const onStoryCountsChange = useCallback((storyCounts: Slots) => {
    updateStoryCounts({ type: 'sync', slots: storyCounts });
  }, [updateStoryCounts]);

  const campaignSection = useMemo(() => {
    if (!deck || !campaign || !investigator) {
      return null;
    }
    return (
      <>
        { !campaign.guided && (
          <EditTraumaComponent
            investigator={investigator}
            traumaData={traumaUpdate || ((campaign.investigatorData || {})[investigator.code]) || EMPTY_TRAUMA}
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
  }, [deck, componentId, campaign, showTraumaDialog, storyEncounterCodes, scenarioName, investigator, traumaUpdate, onStoryCountsChange]);
  const [saving, error, saveDeckUpgrade] = useDeckUpgrade(deck, actions, deckUpgradeComplete);

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
          campaignSection={campaignSection}
          saveButtonText={t`Save upgrade`}
          ref={deckUpgradeComponent}
          saving={saving}
          error={error}
          saveDeckUpgrade={saveDeckUpgrade}
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
