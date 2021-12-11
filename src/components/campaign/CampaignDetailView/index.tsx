import React, { useCallback, useContext, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';
import { Action } from 'redux';

import BasicButton from '@components/core/BasicButton';
import { CampaignId, CUSTOM, Deck, DeckId, getDeckId, Slots, Trauma, WeaknessSet } from '@actions/types';
import DecksSection from './DecksSection';
import { updateCampaignXp, cleanBrokenCampaigns, addInvestigator, removeInvestigator, updateCampaignInvestigatorTrauma, updateCampaignWeaknessSet, updateCampaignName } from '../actions';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import { useCampaign, useCampaignInvestigators } from '@data/hooks';
import useTraumaDialog from '../useTraumaDialog';
import { showAddScenarioResult, showDrawWeakness } from '@components/campaign/nav';
import { campaignNames } from '../constants';
import space, { s } from '@styles/space';
import CampaignSummaryHeader from '../CampaignSummaryHeader';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import { maybeShowWeaknessPrompt, useMaybeShowWeaknessPrompt } from '../campaignHelper';
import Card from '@data/types/Card';
import { MyDecksSelectorProps } from '../MyDecksSelectorDialog';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaignId, useXpDialog } from '../hooks';
import DeckButton from '@components/deck/controls/DeckButton';
import DeleteCampaignButton from '../DeleteCampaignButton';
import { CampaignLogViewProps } from '../CampaignLogView';
import { CampaignScenariosViewProps } from '../CampaignScenariosView';
import UploadCampaignButton from '../UploadCampaignButton';
import useChaosBagDialog from './useChaosBagDialog';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useDeckActions } from '@data/remote/decks';
import { useCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';

export interface CampaignDetailProps {
  campaignId: CampaignId;
  upload?: boolean;
}

type Props = NavigationProps & CampaignDetailProps

const EMPTY_CHAOS_BAG = {};
type AsyncDispatch = ThunkDispatch<AppState, unknown, Action>;

function CampaignDetailView(props: Props) {
  const { componentId, upload } = props;
  const [textEditDialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const [campaignId, setCampaignServerId, uploadingCampaign] = useCampaignId(props.campaignId);
  const { backgroundStyle, typography } = useContext(StyleContext);
  const { userId } = useContext(ArkhamCardsAuthContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaign = useCampaign(campaignId, true);
  const [allInvestigators, loadingInvestigators] = useCampaignInvestigators(campaign, investigators);

  const updateCampaignActions = useUpdateCampaignActions();
  const dispatch = useDispatch();
  const asyncDispatch: AsyncDispatch = useDispatch();

  const updateInvestigatorTrauma = useCallback((investigator: string, trauma: Trauma) => {
    dispatch(updateCampaignInvestigatorTrauma(updateCampaignActions, campaignId, investigator, trauma));
  }, [dispatch, updateCampaignActions, campaignId]);

  const {
    showTraumaDialog,
    traumaDialog,
  } = useTraumaDialog(updateInvestigatorTrauma);

  useCampaignDeleted(componentId, campaign);

  const updateWeaknessSet = useCallback((weaknessSet: WeaknessSet) => {
    dispatch(updateCampaignWeaknessSet(updateCampaignActions.setWeaknessSet, campaignId, weaknessSet));
  }, [dispatch, updateCampaignActions, campaignId]);

  const updateSpentXp = useCallback((code: string, value: number) => {
    dispatch(updateCampaignXp(updateCampaignActions, campaignId, code, value, 'spentXp'));
  }, [dispatch, campaignId, updateCampaignActions]);
  const name = campaign?.name;
  useEffect(() => {
    if (name) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: name,
          },
        },
      });
    }
  }, [name, componentId]);

  const cleanBrokenCampaignsPressed = useCallback(() => {
    dispatch(cleanBrokenCampaigns());
    Navigation.pop(componentId);
  }, [componentId, dispatch]);


  const drawWeaknessPressed = useCallback(() => {
    showDrawWeakness(componentId, campaignId);
  }, [componentId, campaignId]);

  const setCampaignName = useCallback((name: string) => {
    dispatch(updateCampaignName(updateCampaignActions, campaignId, name));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, updateCampaignActions, componentId]);
  const [dialog, showEditNameDialog] = useSimpleTextDialog({
    title: t`Name`,
    value: campaign?.name || '',
    onValueChange: setCampaignName,
  });

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);

  const updateWeaknessAssignedCards = useCallback((weaknessCards: Slots) => {
    if (campaign) {
      updateWeaknessSet({
        packCodes: campaign.weaknessSet.packCodes || [],
        assignedCards: weaknessCards,
      });
    }
  }, [updateWeaknessSet, campaign]);
  const [alertDialog, showAlert] = useAlertDialog();

  const checkForWeaknessPrompt = useCallback((deck: Deck) => {
    if (cards && campaign) {
      maybeShowWeaknessPrompt(
        deck,
        cards,
        campaign.weaknessSet.assignedCards || {},
        updateWeaknessAssignedCards,
        showAlert
      );
    }
  }, [cards, campaign, updateWeaknessAssignedCards, showAlert]);
  const deckActions = useDeckActions();
  const checkNewDeckForWeakness = useMaybeShowWeaknessPrompt(componentId, checkForWeaknessPrompt);
  const onAddDeck = useCallback(async(deck: Deck) => {
    await asyncDispatch(addInvestigator(userId, deckActions, updateCampaignActions, campaignId, deck.investigator_code, getDeckId(deck)));
    checkNewDeckForWeakness(deck);
  }, [userId, campaignId, deckActions, updateCampaignActions, checkNewDeckForWeakness, asyncDispatch]);

  const onAddInvestigator = useCallback((card: Card) => {
    dispatch(addInvestigator(userId, deckActions, updateCampaignActions, campaignId, card.code));
  }, [userId, campaignId, deckActions, updateCampaignActions, dispatch]);

  const onRemoveInvestigator = useCallback((investigator: Card, removedDeckId?: DeckId) => {
    dispatch(removeInvestigator(userId, updateCampaignActions, campaignId, investigator.code, removedDeckId));
  }, [userId, updateCampaignActions, campaignId, dispatch]);

  const showChooseDeck = useCallback((
    singleInvestigator?: Card,
  ) => {
    if (!cards || !campaign) {
      return;
    }
    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaign.id,
      singleInvestigator: singleInvestigator.code,
      onDeckSelect: onAddDeck,
    } : {
      campaignId: campaign.id,
      selectedInvestigatorIds: map(
        allInvestigators,
        investigator => investigator.code
      ),
      onDeckSelect: onAddDeck,
      onInvestigatorSelect: onAddInvestigator,
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
  }, [campaign, allInvestigators, cards, onAddDeck, onAddInvestigator]);

  const showAddInvestigator = useCallback(() => {
    showChooseDeck();
  }, [showChooseDeck]);
  const [xpDialog, actuallyShowXpDialog] = useXpDialog(updateSpentXp);
  const showXpDialog = useCallback((investigator: Card) => {
    const data = campaign?.getInvestigatorData(investigator.code) || {};
    actuallyShowXpDialog(investigator, data?.spentXp || 0, data?.availableXp || 0);
  }, [actuallyShowXpDialog, campaign]);
  const showCampaignLog = useCallback(() => {
    Navigation.push<CampaignLogViewProps>(componentId, {
      component: {
        name: 'Campaign.Log',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: t`Campaign Log`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId]);
  const showScenarios = useCallback(() => {
    Navigation.push<CampaignScenariosViewProps>(componentId, {
      component: {
        name: 'Campaign.Scenarios',
        passProps: {
          campaignId,
        },
        options: {
          topBar: {
            title: {
              text: t`Scenarios`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId]);
  const investigatorCount = allInvestigators.length;

  const addScenarioResultPressed = useCallback(() => {
    showAddScenarioResult(componentId, campaignId);
  }, [campaignId, componentId]);
  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({
    componentId,
    allInvestigators,
    campaignId,
    chaosBag: campaign?.chaosBag || EMPTY_CHAOS_BAG,
    setChaosBag: updateCampaignActions.setChaosBag,
    scenarioId: undefined,
    cycleCode: campaign?.cycleCode || 'custom',
  });
  if (!campaign) {
    if (campaignId.serverId) {
      return (
        <LoadingSpinner large message={uploadingCampaign ? t`Uploading campaign` : undefined} />
      );
    }
    return (
      <View>
        <BasicButton
          title={t`Clean up broken campaigns`}
          color={COLORS.red}
          onPress={cleanBrokenCampaignsPressed}
        />
      </View>
    );
  }
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <View style={space.paddingSideS}>
            <CampaignSummaryHeader
              name={campaign.cycleCode === CUSTOM ? campaign.name : campaignNames()[campaign.cycleCode]}
              cycle={campaign.cycleCode}
              difficulty={campaign.difficulty}
            />
            <DeckButton
              icon="log"
              title={t`Campaign Log`}
              detail={t`Review and add records`}
              color="light_gray"
              onPress={showCampaignLog}
              bottomMargin={s}
            />
            <DeckButton
              icon="chaos_bag"
              title={t`Chaos Bag`}
              detail={t`Review and draw tokens`}
              color="light_gray"
              onPress={showChaosBag}
              bottomMargin={s}
            />
            <DeckButton
              icon="book"
              title={t`Scenarios`}
              detail={t`Review scenario results`}
              color="light_gray"
              onPress={showScenarios}
              bottomMargin={s}
            />
            <DeckButton
              icon="finish"
              title={t`Add scenario result`}
              detail={t`Record completed scenario`}
              onPress={addScenarioResultPressed}
              color="dark_gray"
              bottomMargin={s}
            />
            <View style={[space.paddingBottomS, space.paddingTopS]}>
              <Text style={[typography.large, typography.center, typography.light]}>
                { `— ${t`Investigators`} · ${investigatorCount} —` }
              </Text>
            </View>
            { !!cards && (
              <DecksSection
                showAlert={showAlert}
                showTextEditDialog={showTextEditDialog}
                showCountDialog={showCountDialog}
                componentId={componentId}
                campaign={campaign}
                campaignId={campaignId}
                latestDecks={campaign.latestDecks()}
                allInvestigators={allInvestigators}
                loading={loadingInvestigators}
                cards={cards}
                showTraumaDialog={showTraumaDialog}
                removeInvestigator={onRemoveInvestigator}
                showXpDialog={showXpDialog}
                showChooseDeck={showChooseDeck}
                setCampaignNotes={updateCampaignActions.setCampaignNotes}
              />
            ) }
            <DeckButton
              color="light_gray"
              icon="plus-thin"
              title={t`Add Investigator`}
              onPress={showAddInvestigator}
              bottomMargin={s}
            />
            <DeckButton
              icon="weakness"
              color="light_gray"
              title={t`Draw random basic weakness`}
              onPress={drawWeaknessPressed}
              bottomMargin={s}
            />
            <View style={[space.paddingBottomS, space.paddingTopS]}>
              <Text style={[typography.large, typography.center, typography.light]}>
                { `— ${t`Settings`} —` }
              </Text>
            </View>
            <UploadCampaignButton
              componentId={componentId}
              campaignId={campaignId}
              campaign={campaign}
              setCampaignServerId={setCampaignServerId}
              showAlert={showAlert}
              deckActions={deckActions}
              upload={upload}
            />
            <DeleteCampaignButton
              actions={updateCampaignActions}
              componentId={componentId}
              campaignId={campaignId}
              campaign={campaign}
              showAlert={showAlert}
            />
          </View>
        </ScrollView>
      </View>
      { alertDialog }
      { traumaDialog }
      { xpDialog }
      { dialog }
      { textEditDialog }
      { chaosBagDialog }
      { countDialog }
    </View>
  );
}

CampaignDetailView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Campaign`,
      },
    },
  };
};
export default CampaignDetailView;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
