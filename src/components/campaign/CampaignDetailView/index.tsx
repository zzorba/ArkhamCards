import React, { useCallback, useContext, useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignId, CUSTOM, Deck, DeckId, getDeckId, Slots, Trauma, WeaknessSet } from '@actions/types';
import DecksSection from './DecksSection';
import { updateCampaignXp, cleanBrokenCampaigns, addInvestigator, removeInvestigator, updateCampaignInvestigatorTrauma, updateCampaignWeaknessSet, updateCampaignName } from '../actions';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import { useLiveCampaign } from '@data/remote/hooks';
import useTraumaDialog from '../useTraumaDialog';
import { showAddScenarioResult, showDrawWeakness } from '@components/campaign/nav';
import { campaignNames } from '../constants';
import space, { s } from '@styles/space';
import CampaignSummaryHeader from '../CampaignSummaryHeader';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
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
import { useCreateDeckActions } from '@data/remote/decks';
import { useUpdateCampaignActions } from '@data/remote/campaigns';

export interface CampaignDetailProps {
  campaignId: CampaignId;
}

type Props = NavigationProps & CampaignDetailProps

const EMPTY_CHAOS_BAG = {};

function CampaignDetailView(props: Props) {
  const { componentId } = props;
  const [textEditDialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const [campaignId, setCampaignServerId] = useCampaignId(props.campaignId);
  const { backgroundStyle, typography } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const [campaign, allInvestigators] = useLiveCampaign(campaignId, investigators);
  const updateCampaignActions = useUpdateCampaignActions();
  const dispatch = useDispatch();

  const updateInvestigatorTrauma = useCallback((investigator: string, trauma: Trauma) => {
    dispatch(updateCampaignInvestigatorTrauma(user, updateCampaignActions, campaignId, investigator, trauma));
  }, [dispatch, updateCampaignActions, campaignId, user]);

  const {
    showTraumaDialog,
    traumaDialog,
  } = useTraumaDialog(updateInvestigatorTrauma);

  const updateWeaknessSet = useCallback((weaknessSet: WeaknessSet) => {
    dispatch(updateCampaignWeaknessSet(user, updateCampaignActions, campaignId, weaknessSet));
  }, [dispatch, updateCampaignActions, campaignId, user]);

  const updateSpentXp = useCallback((code: string, value: number) => {
    dispatch(updateCampaignXp(user, updateCampaignActions, campaignId, code, value, 'spentXp'));
  }, [dispatch, campaignId, updateCampaignActions, user]);
  const name = campaign?.name();
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
    dispatch(updateCampaignName(user, updateCampaignActions, campaignId, name));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, user, updateCampaignActions, componentId]);
  const { dialog, showDialog: showEditNameDialog } = useSimpleTextDialog({
    title: t`Name`,
    value: campaign?.name() || '',
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
        packCodes: campaign.weaknessSet().packCodes || [],
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
        campaign.weaknessSet().assignedCards || {},
        updateWeaknessAssignedCards,
        showAlert
      );
    }
  }, [cards, campaign, updateWeaknessAssignedCards, showAlert]);
  const createDeckActions = useCreateDeckActions();
  const onAddDeck = useCallback((deck: Deck) => {
    dispatch(addInvestigator(user, createDeckActions, updateCampaignActions, campaignId, deck.investigator_code, getDeckId(deck)));
    checkForWeaknessPrompt(deck);
  }, [user, campaignId, createDeckActions, updateCampaignActions, dispatch, checkForWeaknessPrompt]);

  const onAddInvestigator = useCallback((card: Card) => {
    dispatch(addInvestigator(user, createDeckActions, updateCampaignActions, campaignId, card.code));
  }, [user, campaignId, createDeckActions, updateCampaignActions, dispatch]);

  const onRemoveInvestigator = useCallback((investigator: Card, removedDeckId?: DeckId) => {
    dispatch(removeInvestigator(user, updateCampaignActions, campaignId, investigator.code, removedDeckId));
  }, [user, updateCampaignActions, campaignId, dispatch]);

  const showChooseDeck = useCallback((
    singleInvestigator?: Card,
  ) => {
    if (!cards || !campaign) {
      return;
    }
    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: campaign.id(),
      singleInvestigator: singleInvestigator.code,
      onDeckSelect: onAddDeck,
    } : {
      campaignId: campaign.id(),
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
  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({ componentId, allInvestigators, campaignId, chaosBag: campaign?.chaosBag() || EMPTY_CHAOS_BAG });
  if (!campaign) {
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
  const cycleCode = campaign.cycleCode();
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <View style={space.paddingSideS}>
            <CampaignSummaryHeader
              name={cycleCode === CUSTOM ? campaign.name() : campaignNames()[cycleCode]}
              cycle={cycleCode}
              difficulty={campaign.difficulty()}
            />
            <DeckButton
              icon="log"
              title={t`Campaign Log`}
              detail={t`Review records`}
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
                cards={cards}
                showTraumaDialog={showTraumaDialog}
                removeInvestigator={onRemoveInvestigator}
                showXpDialog={showXpDialog}
                showChooseDeck={showChooseDeck}
              />
            ) }
            <DeckButton
              icon="plus-thin"
              title={t`Add Investigator`}
              onPress={showAddInvestigator}
              color="light_gray"
              thin
              bottomMargin={s}
            />
            <DeckButton
              icon="weakness"
              color="light_gray"
              title={t`Draw random basic weakness`}
              onPress={drawWeaknessPressed}
              bottomMargin={s}
            />
            <UploadCampaignButton
              campaignId={campaignId}
              setCampaignServerId={setCampaignServerId}
              showAlert={showAlert}
              guided={false}
            />
            <DeleteCampaignButton
              componentId={componentId}
              campaignId={campaignId}
              campaignName={campaign?.name() || ''}
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
