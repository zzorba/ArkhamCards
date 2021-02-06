import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { keys, map, filter, flatMap } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignId, CUSTOM, Deck, DeckId, getCampaignId, getDeckId, InvestigatorData, Slots, WeaknessSet } from '@actions/types';
import DecksSection from './DecksSection';
import { updateCampaign, updateCampaignSpentXp, cleanBrokenCampaigns, addInvestigator, removeInvestigator } from '../actions';
import { NavigationProps } from '@components/nav/types';
import { getAllDecks, getDeck } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignDetails, useCampaignScenarios, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import useTraumaDialog from '../useTraumaDialog';
import { showAddScenarioResult, showDrawWeakness } from '@components/campaign/nav';
import { campaignNames, completedScenario } from '../constants';
import space, { s } from '@styles/space';
import CampaignSummaryHeader from '../CampaignSummaryHeader';
import { useAlertDialog, useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
import Card from '@data/Card';
import { MyDecksSelectorProps } from '../MyDecksSelectorDialog';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCampaignId, useXpDialog } from '../hooks';
import DeckButton from '@components/deck/controls/DeckButton';
import DeleteCampaignButton from '../DeleteCampaignButton';
import { CampaignLogViewProps } from '../CampaignLogView';
import { CampaignScenariosViewProps } from '../CampaignScenariosView';
import UploadCampaignButton from '../UploadCampaignButton';
import ArkhamButton from '@components/core/ArkhamButton';
import CampaignScenarioButton from '../CampaignScenarioButton';
import { EditScenarioResultProps } from '../EditScenarioResultView';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import useChaosBagDialog from './useChaosBagDialog';
import useTextEditDialog from '@components/core/useTextEditDialog';

export interface CampaignDetailProps {
  campaignId: CampaignId;
}

type Props = NavigationProps & CampaignDetailProps

function ScenarioResultButton({ name, campaignId, componentId, status, index, onPress }: {
  name: string;
  campaignId: CampaignId;
  componentId: string;
  status: 'completed' | 'playable';
  index: number;
  onPress?: () => void;
}) {
  const buttonOnPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      Navigation.push<EditScenarioResultProps>(componentId, {
        component: {
          name: 'Campaign.EditResult',
          passProps: {
            campaignId,
            index,
          },
        },
      });
    }
  }, [componentId, campaignId, index, onPress]);
  return (
    <CampaignScenarioButton
      onPress={buttonOnPress}
      status={status}
      title={name}
    />
  );
}

function CampaignDetailView(props: Props) {
  const { componentId } = props;
  const [textEditDialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const [campaignId, setCampaignServerId] = useCampaignId(props.campaignId);
  const { backgroundStyle, typography } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaign = useCampaign(campaignId);
  const decks = useSelector(getAllDecks);
  const {
    showTraumaDialog,
    investigatorDataUpdates,
    traumaDialog,
  } = useTraumaDialog({});
  const [latestDeckIds, allInvestigators] = useCampaignDetails(campaign, investigators);

  const dispatch = useDispatch();
  const updateInvestigatorData = useCallback((investigatorData: InvestigatorData) => {
    dispatch(updateCampaign(user, campaignId, { investigatorData }));
  }, [dispatch, campaignId, user]);
  const updateWeaknessSet = useCallback((weaknessSet: WeaknessSet) => {
    dispatch(updateCampaign(user, campaignId, { weaknessSet }));
  }, [dispatch, campaignId, user]);

  const updateSpentXp = useCallback((code: string, value: number) => {
    dispatch(updateCampaignSpentXp(campaignId, code, value));
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (campaign?.name) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: campaign.name,
          },
        },
      });
    }
  }, [campaign?.name, componentId]);

  useEffect(() => {
    if (campaign && keys(investigatorDataUpdates).length) {
      updateInvestigatorData({
        ...campaign.investigatorData,
        ...investigatorDataUpdates,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investigatorDataUpdates, updateInvestigatorData]);

  const cleanBrokenCampaignsPressed = useCallback(() => {
    dispatch(cleanBrokenCampaigns());
    Navigation.pop(componentId);
  }, [componentId, dispatch]);


  const drawWeaknessPressed = useCallback(() => {
    showDrawWeakness(componentId, campaignId);
  }, [componentId, campaignId]);

  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(user, campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, user, componentId]);
  const { dialog, showDialog: showEditNameDialog } = useSimpleTextDialog({
    title: t`Name`,
    value: campaign?.name || '',
    onValueChange: updateCampaignName,
  });

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'edit') {
      showEditNameDialog();
    }
  }, componentId, [showEditNameDialog]);


  const updateWeaknessAssignedCards = useCallback((weaknessCards: Slots) => {
    if (campaign) {
      updateWeaknessSet({
        ...campaign.weaknessSet,
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
        campaign.weaknessSet.assignedCards,
        updateWeaknessAssignedCards,
        showAlert
      );
    }
  }, [cards, campaign, updateWeaknessAssignedCards, showAlert]);

  const onAddDeck = useCallback((deck: Deck) => {
    dispatch(addInvestigator(user, campaignId, deck.investigator_code, getDeckId(deck)));
    checkForWeaknessPrompt(deck);
  }, [user, campaignId, dispatch, checkForWeaknessPrompt]);

  const onAddInvestigator = useCallback((card: Card) => {
    dispatch(addInvestigator(user, campaignId, card.code));
  }, [user, campaignId, dispatch]);

  const onRemoveInvestigator = useCallback((investigator: Card, removedDeckId?: DeckId) => {
    dispatch(removeInvestigator(user, campaignId, investigator.code, removedDeckId));
  }, [user, campaignId, dispatch]);

  const showChooseDeck = useCallback((
    singleInvestigator?: Card,
  ) => {
    if (!cards || !campaign) {
      return;
    }
    const campaignInvestigators = flatMap(latestDeckIds, deckId => {
      const deck = getDeck(decks, deckId);
      return (deck && cards[deck.investigator_code]) || [];
    });

    const passProps: MyDecksSelectorProps = singleInvestigator ? {
      campaignId: getCampaignId(campaign),
      singleInvestigator: singleInvestigator.code,
      onDeckSelect: onAddDeck,
    } : {
      campaignId: getCampaignId(campaign),
      selectedInvestigatorIds: map(
        campaignInvestigators,
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
  }, [campaign, latestDeckIds, decks, cards, onAddDeck, onAddInvestigator]);

  const showAddInvestigator = useCallback(() => {
    showChooseDeck();
  }, [showChooseDeck]);
  const [xpDialog, actuallyShowXpDialog] = useXpDialog(updateSpentXp);
  const headerButtons = useMemo(() => {
    return (
      <>
        <UploadCampaignButton
          campaignId={campaignId}
          setCampaignServerId={setCampaignServerId}
        />
        <DeleteCampaignButton
          componentId={componentId}
          campaignId={campaignId}
          campaignName={campaign?.name || ''}
          showAlert={showAlert}
        />
      </>
    );
  }, [showAlert, componentId, campaignId, campaign, setCampaignServerId]);
  const investigatorData = useMemo(() => campaign?.investigatorData || {}, [campaign?.investigatorData]);
  const showXpDialog = useCallback((investigator: Card) => {
    const data = investigatorData[investigator.code] || {};
    actuallyShowXpDialog(investigator, data?.spentXp || 0, data?.availableXp || 0);
  }, [actuallyShowXpDialog, investigatorData]);
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
  const [cycleScenarios] = useCampaignScenarios(campaign);

  const addScenarioResultPressed = useCallback(() => {
    showAddScenarioResult(componentId, campaignId);
  }, [campaignId, componentId]);
  const [chaosBagDialog, showChaosBag] = useChaosBagDialog({ componentId, allInvestigators, campaignId, chaosBag: campaign?.chaosBag || {} });
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
  const hasCompletedScenario = completedScenario(campaign.scenarioResults);
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <View style={space.paddingSideS}>
            <CampaignSummaryHeader
              name={campaign.cycleCode === CUSTOM ? campaign.name : campaignNames()[campaign.cycleCode]}
              cycle={campaign.cycleCode}
              difficulty={campaign.difficulty}
              buttons={headerButtons}
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
            { false && (
              <DeckButton
                icon="right-arrow"
                title={t`Scenarios`}
                detail={t`Review and play scenarios`}
                color="dark_gray"
                onPress={showScenarios}
                bottomMargin={s}
              />
            ) }
            <View style={[space.paddingBottomS, space.paddingTopS]}>
              <Text style={[typography.large, typography.center, typography.light]}>
                { t`— Investigators · ${investigatorCount} —` }
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
                latestDeckIds={latestDeckIds || []}
                decks={decks}
                allInvestigators={allInvestigators}
                cards={cards}
                investigatorData={investigatorData}
                showTraumaDialog={showTraumaDialog}
                removeInvestigator={onRemoveInvestigator}
                showXpDialog={showXpDialog}
                showChooseDeck={showChooseDeck}
              />
            ) }
            <View style={space.paddingBottomS}>
              <DeckButton
                icon="plus-thin"
                title={t`Add Investigator`}
                onPress={showAddInvestigator}
                color="light_gray"
                thin
              />
            </View>
            <DeckButton
              icon="weakness"
              color="light_gray"
              title={t`Draw random basic weakness`}
              onPress={drawWeaknessPressed}
            />
          </View>
          { (campaign.scenarioResults.length === 0 && cycleScenarios.length === 0) ? (
            <ArkhamButton
              icon="expand"
              title={t`Record Scenario Result`}
              onPress={addScenarioResultPressed}
            />
          ) : (
            <View style={[space.paddingSideS, space.paddingBottomS]}>
              <RoundedFactionBlock faction="neutral"
                header={<DeckSectionHeader faction="neutral" title={t`Scenarios`} />}
                footer={<RoundedFooterButton icon="expand" title={t`Record Scenario Result`} onPress={addScenarioResultPressed} />}
              >
                { map(campaign.scenarioResults, (scenario, idx) => {
                  return (
                    <ScenarioResultButton
                      key={idx}
                      componentId={componentId}
                      campaignId={campaignId}
                      name={scenario.interlude ? scenario.scenario : `${scenario.scenario} (${scenario.resolution}, ${scenario.xp || 0} XP)`}
                      index={idx}
                      status="completed"
                    />
                  );
                }) }
                { map(
                  filter(cycleScenarios, scenario => !hasCompletedScenario(scenario)),
                  (scenario, idx) => (
                    <ScenarioResultButton
                      key={idx}
                      componentId={componentId}
                      campaignId={campaignId}
                      name={scenario.name}
                      index={-1}
                      status="playable"
                      onPress={addScenarioResultPressed}
                    />
                  ))
                }
              </RoundedFactionBlock>
            </View>
          ) }
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
