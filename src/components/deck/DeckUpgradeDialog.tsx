import React, { useCallback, useContext, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { find, last } from 'lodash';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRoute, RouteProp, useNavigation, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import { getDeckScreenOptions, showDeckModal } from '@components/nav/helper';
import COLORS from '@styles/colors';

import { t } from 'ttag';

import DeckUpgradeComponent, { DeckUpgradeHandles } from './DeckUpgradeComponent';
import { CampaignId, Deck, DeckId, getDeckId, Slots, Trauma } from '@actions/types';
import StoryCardSelectorComponent from '@components/campaign/StoryCardSelectorComponent';
import { updateCampaignInvestigatorTrauma } from '@components/campaign/actions';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignDeck } from '@data/hooks';
import { useSlots } from '@components/core/hooks';
import useTraumaDialog from '@components/campaign/useTraumaDialog';
import useDeckUpgradeAction from './useDeckUpgradeAction';
import { useDeckActions } from '@data/remote/decks';
import { useUpdateCampaignActions } from '@data/remote/campaigns';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import useSingleCard from '@components/card/useSingleCard';
import { SimpleDeckEditContextProvider } from './DeckEditContext';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

export interface UpgradeDeckProps {
  id: DeckId;
  campaignId?: CampaignId;
  showNewDeck: boolean;
  headerBackgroundColor?: string;
}

const EMPTY_TRAUMA = {};

function useCampaignInvestigatorForCampaign(campaign: SingleCampaignT | undefined, deck: LatestDeckT | undefined): CampaignInvestigator | undefined {
  const [investigatorCard] = useSingleCard(deck?.deck.meta?.alternate_front ?? deck?.deck.investigator_code, 'player', deck?.deck.taboo_id);
  return useMemo(() => {
    if (!deck || !investigatorCard) {
      return undefined;
    }
    if (!campaign) {
      return {
        code: investigatorCard.code,
        card: investigatorCard,
        alternate_code: investigatorCard.alternate_of_code ? investigatorCard.code : undefined,
      };
    }
    const code = find(campaign?.investigators, i => i === investigatorCard.alternate_of_code || i === investigatorCard.code);
    if (!code) {
      return undefined;
    }
    return {
      code,
      card: investigatorCard,
      alternate_code: investigatorCard.alternate_of_code ? investigatorCard.code : undefined,
    };
  }, [investigatorCard, deck, campaign]);
}

type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;
export default function DeckUpgradeDialog() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.Upgrade'>>();
  const navigation = useNavigation();
  const { id, campaignId, showNewDeck } = route.params;
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const actions = useDeckActions();
  const updateCampaignActions = useUpdateCampaignActions();
  const deck = useCampaignDeck(id, campaignId);
  const campaign = useCampaign(campaignId);
  const deckUpgradeComponent = useRef<DeckUpgradeHandles>(null);
  const investigator = useCampaignInvestigatorForCampaign(campaign, deck);

  const save = useCallback(() => {
    if (deckUpgradeComponent.current) {
      deckUpgradeComponent.current.save();
    }
  }, [deckUpgradeComponent]);

  // Set screen options with proper styling, custom back button, and Save button
  useLayoutEffect(() => {
    if (investigator) {
      const screenOptions = getDeckScreenOptions(
        colors,
        { title: t`Upgrade Deck`, initialMode: 'upgrade' },
        investigator.card
      );
      // Custom back button text
      screenOptions.headerBackTitle = t`Cancel`;
      // Ensure tint color is dark for upgrade mode (controls back button color)
      screenOptions.headerTintColor = COLORS.D30;
      // Add Save button (use dark color for upgrade mode to match header tint)
      screenOptions.headerRight = () => (
        <Text
          style={{ color: COLORS.D30, fontSize: 16, fontFamily: 'Alegreya-Medium' }}
          onPress={save}
        >
          {t`Save`}
        </Text>
      );
      navigation.setOptions(screenOptions);
    }
  }, [navigation, colors, investigator, save]);

  const latestScenario = useMemo(() => campaign && last(campaign.scenarioResults || []), [campaign]);
  const scenarioName = latestScenario ? latestScenario.scenario : undefined;
  const storyEncounterCodes = useMemo(() => latestScenario && latestScenario.scenarioCode ? [latestScenario.scenarioCode] : [], [latestScenario]);

  const [storyCounts, updateStoryCounts] = useSlots({});
  const dispatch: AsyncDispatch = useDispatch();

  const [traumaUpdate, setTraumaUpdate] = useState<Trauma | undefined>();
  const setInvestigatorTrauma = useCallback((investigator: string, trauma: Trauma) => {
    setTraumaUpdate(trauma);
  }, [setTraumaUpdate]);
  const { showTraumaDialog, traumaDialog } = useTraumaDialog(setInvestigatorTrauma);


  const deckUpgradeComplete = useCallback(async(deck: Deck) => {
    if (campaignId && traumaUpdate) {
      return dispatch(updateCampaignInvestigatorTrauma(updateCampaignActions, campaignId, deck.investigator_code, traumaUpdate));
    }
    if (showNewDeck) {
      const newDeckId = getDeckId(deck);
      const backgroundColor = investigator ? colors.faction[investigator.card.factionCode()].background : undefined;

      // Get the current navigation state
      const state = navigation.getState();

      if (state) {
        // Find the index of the original Deck screen (with the old deck ID)
        const deckScreenIndex = state.routes.findIndex(
          (route: any) => route.name === 'Deck' && route.params?.id?.uuid === id.uuid
        );

        if (deckScreenIndex !== -1) {
          // Remove everything from the original Deck screen onwards, then push the new Deck
          const routesToKeep = state.routes.slice(0, deckScreenIndex);
          navigation.dispatch(
            CommonActions.reset({
              ...state,
              routes: [
                ...routesToKeep,
                {
                  name: 'Deck',
                  params: {
                    id: newDeckId,
                    modal: true,
                    campaignId: campaign?.id,
                    title: investigator?.card.name ?? t`Deck`,
                    subtitle: deck.name,
                    initialMode: 'upgrade',
                    headerBackgroundColor: backgroundColor,
                  },
                },
              ],
              index: routesToKeep.length,
            })
          );
        } else {
          // Fallback to the old behavior if we can't find the original deck
          showDeckModal(navigation, colors, newDeckId, deck, campaign?.id, investigator?.card, 'upgrade');
        }
      } else {
        // Fallback to the old behavior if navigation state is unavailable
        showDeckModal(navigation, colors, newDeckId, deck, campaign?.id, investigator?.card, 'upgrade');
      }
    } else {
      navigation.goBack();
    }
  }, [showNewDeck, navigation, colors, campaignId, campaign, dispatch, updateCampaignActions, investigator, traumaUpdate, id]);

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
            traumaData={traumaUpdate || ((campaign.investigatorData ?? {})[investigator.code]) || EMPTY_TRAUMA}
            showTraumaDialog={showTraumaDialog}
            sectionHeader
          />
        ) }
        <StoryCardSelectorComponent
          investigator={investigator}
          deck={deck}
          updateStoryCounts={onStoryCountsChange}
          encounterCodes={storyEncounterCodes}
          scenarioName={scenarioName}
        />
      </>
    );
  }, [deck, campaign, showTraumaDialog, storyEncounterCodes, scenarioName, investigator, traumaUpdate, onStoryCountsChange]);
  const [saving, error, saveDeckUpgrade] = useDeckUpgradeAction(actions, deckUpgradeComplete);
  if (!deck || !investigator) {
    return null;
  }
  const xp = latestScenario ? (latestScenario.xp || 0) : 0;
  return (
    <View style={styles.wrapper}>
      { traumaDialog }
      <SimpleDeckEditContextProvider deckId={id} investigator={deck.investigator}>
        <ScrollView style={[styles.container, backgroundStyle]}>
          <View style={space.paddingM}>
            <Text style={typography.text}>
              { t`Upgrading your deck allows changes and experience to be tracked over the course of a campaign.` }
            </Text>
          </View>
          <DeckUpgradeComponent
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
      </SimpleDeckEditContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
