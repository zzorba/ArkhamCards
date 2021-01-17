import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { keys, map, filter, flatMap } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignNotes, CUSTOM, Deck, DeckId, getDeckId, InvestigatorData, Slots, WeaknessSet } from '@actions/types';
import CampaignLogSection from '../CampaignLogSection';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { ChaosBag } from '@app_constants';
import { updateCampaign, updateCampaignSpentXp, cleanBrokenCampaigns } from '../actions';
import { NavigationProps } from '@components/nav/types';
import { getAllDecks, getDeck } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignDetails, useCampaignScenarios, useFlag, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import useTraumaDialog from '../useTraumaDialog';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { showAddScenarioResult, showChaosBagOddsCalculator, showDrawWeakness, showDrawChaosBag } from '@components/campaign/nav';
import useTabView from '@components/core/useTabView';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import { EditScenarioResultProps } from '../EditScenarioResultView';
import CampaignScenarioButton from '../CampaignScenarioButton';
import { campaignNames, completedScenario } from '../constants';
import space from '@styles/space';
import CampaignSummaryHeader from '../CampaignSummaryHeader';
import ArkhamButton from '@components/core/ArkhamButton';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { useAlertDialog, useTextDialog } from '@components/deck/dialogs';
import CampaignGuideFab from '@components/campaignguide/CampaignGuideFab';
import { maybeShowWeaknessPrompt } from '../campaignHelper';
import Card from '@data/Card';
import { MyDecksSelectorProps } from '../MyDecksSelectorDialog';

export interface CampaignDetailProps {
  id: number;
}

type Props = NavigationProps & CampaignDetailProps & InjectedDialogProps

function ScenarioResultButton({ name, campaignId, componentId, status, index, onPress }: {
  name: string;
  campaignId: number;
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

function CampaignDetailView({ id, componentId, showTextEditDialog }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaign = useCampaign(id);
  const serverId = campaign?.serverId;
  const campaignId = useMemo(() => {
    return {
      campaignId: id,
      serverId,
    };
  }, [id, serverId]);
  const decks = useSelector(getAllDecks);
  const {
    showTraumaDialog,
    investigatorDataUpdates,
    traumaDialog,
  } = useTraumaDialog({});
  const [latestDeckIds, allInvestigators] = useCampaignDetails(campaign, investigators);

  const dispatch = useDispatch();
  const updateNonDeckInvestigators = useCallback((nonDeckInvestigators: string[]) => {
    dispatch(updateCampaign(campaignId, { nonDeckInvestigators }));
  }, [dispatch, campaignId]);
  const updateLatestDeckIds = useCallback((latestDeckIds: DeckId[]) => {
    dispatch(updateCampaign(campaignId, { latestDeckIds }));
  }, [dispatch, campaignId]);
  const updateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaign(campaignId, { campaignNotes }));
  }, [dispatch, campaignId]);
  const updateInvestigatorData = useCallback((investigatorData: InvestigatorData) => {
    dispatch(updateCampaign(campaignId, { investigatorData }));
  }, [dispatch, campaignId]);
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(campaignId, { chaosBag }));
  }, [dispatch, campaignId]);
  const updateWeaknessSet = useCallback((weaknessSet: WeaknessSet) => {
    dispatch(updateCampaign(campaignId, { weaknessSet }));
  }, [dispatch, campaignId]);
  const addSectionCallback = useRef<AddSectionFunction>();
  const [addSectionVisible, setAddSectionVisible] = useState(false);
  const incSpentXp = useCallback((code: string) => {
    dispatch(updateCampaignSpentXp(id, code, 'inc'));
  }, [id, dispatch]);
  const decSpentXp = useCallback((code: string) => {
    dispatch(updateCampaignSpentXp(id, code, 'dec'));
  }, [id, dispatch]);

  const showAddSectionDialog = useCallback((addSectionFunction: AddSectionFunction) => {
    addSectionCallback.current = addSectionFunction;
    setAddSectionVisible(true);
  }, [addSectionCallback, setAddSectionVisible]);
  const hideAddSectionDialog = useCallback(() => {
    setAddSectionVisible(false);
    addSectionCallback.current = undefined;
  }, [addSectionCallback, setAddSectionVisible]);

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

  const oddsCalculatorPressed = useCallback(() => {
    showChaosBagOddsCalculator(componentId, id, allInvestigators);
  }, [componentId, id, allInvestigators]);

  const cleanBrokenCampaignsPressed = useCallback(() => {
    dispatch(cleanBrokenCampaigns());
    Navigation.pop(componentId);
  }, [componentId, dispatch]);

  const addScenarioResultPressed = useCallback(() => {
    showAddScenarioResult(componentId, id);
  }, [id, componentId]);

  const drawChaosBagPressed = useCallback(() => {
    showDrawChaosBag(componentId, id, updateChaosBag);
  }, [id, componentId, updateChaosBag]);

  const drawWeaknessPressed = useCallback(() => {
    showDrawWeakness(componentId, id);
  }, [componentId, id]);

  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(campaignId, { name, lastUpdated: new Date() }));
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  }, [campaignId, dispatch, componentId]);
  const { dialog, showDialog: showEditNameDialog } = useTextDialog({
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

  const addDeck = useCallback((deck: Deck) => {
    const newLatestDeckIds = [...(latestDeckIds || []), getDeckId(deck)];
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
    if (!cards || !campaign) {
      return;
    }
    const campaignInvestigators = flatMap(latestDeckIds, deckId => {
      const deck = getDeck(decks, deckId);
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

  const showAddInvestigator = useCallback(() => {
    showChooseDeck();
  }, [showChooseDeck]);
  const [removeMode, toggleRemoveMode] = useFlag(false);
  const decksTab = useMemo(() => {
    if (!campaign) {
      return <LoadingSpinner />;
    }
    return (
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            { !!cards && (
              <DecksSection
                showAlert={showAlert}
                header={
                  <CampaignSummaryHeader
                    name={campaign.cycleCode === CUSTOM ? campaign.name : campaignNames()[campaign.cycleCode]}
                    cycle={campaign.cycleCode}
                    difficulty={campaign.difficulty}
                    inverted
                  />
                }
                componentId={componentId}
                campaign={campaign}
                latestDeckIds={latestDeckIds || []}
                decks={decks}
                allInvestigators={allInvestigators}
                cards={cards}
                investigatorData={campaign.investigatorData || {}}
                showTraumaDialog={showTraumaDialog}
                updateLatestDeckIds={updateLatestDeckIds}
                updateNonDeckInvestigators={updateNonDeckInvestigators}
                incSpentXp={incSpentXp}
                decSpentXp={decSpentXp}
                removeMode={removeMode}
                toggleRemoveMode={toggleRemoveMode}
                showChooseDeck={showChooseDeck}
              />
            ) }
          </View>
          <ArkhamButton
            icon="card"
            title={t`Draw random basic weakness`}
            onPress={drawWeaknessPressed}
          />
        </ScrollView>
      </View>
    );
  }, [campaign, latestDeckIds, decks, allInvestigators, cards, backgroundStyle, componentId, removeMode,
    toggleRemoveMode, showChooseDeck, showAlert,
    drawWeaknessPressed, showTraumaDialog, updateLatestDeckIds, updateNonDeckInvestigators, incSpentXp, decSpentXp]);
  const [cycleScenarios] = useCampaignScenarios(campaign);
  const scenariosTab = useMemo(() => {
    if (!campaign) {
      return <LoadingSpinner />;
    }
    const hasCompletedScenario = completedScenario(campaign.scenarioResults);
    return (
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          { (campaign.scenarioResults.length === 0 && cycleScenarios.length === 0) ? (
            <ArkhamButton
              icon="expand"
              title={t`Record Scenario Result`}
              onPress={addScenarioResultPressed}
            />
          ) : (
            <View style={[space.paddingSideS, space.paddingBottomS]}>
              <RoundedFactionBlock faction="neutral"
                header={undefined}
                footer={<RoundedFooterButton icon="expand" title={t`Record Scenario Result`} onPress={addScenarioResultPressed} />}
              >
                { map(campaign.scenarioResults, (scenario, idx) => {
                  console.log(campaign);
                  return (
                    <ScenarioResultButton
                      key={idx}
                      componentId={componentId}
                      campaignId={campaign.id}
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
                      campaignId={campaign.id}
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
    );
  }, [backgroundStyle, campaign, addScenarioResultPressed, componentId, cycleScenarios]);
  const logsTab = useMemo(() => {
    if (!campaign) {
      return <LoadingSpinner />;
    }
    return (
      <View style={[styles.flex, backgroundStyle]}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          <ChaosBagSection
            componentId={componentId}
            updateChaosBag={updateChaosBag}
            chaosBag={campaign.chaosBag}
            showChaosBag={drawChaosBagPressed}
            showOddsCalculator={oddsCalculatorPressed}
          />
          <CampaignLogSection
            campaignNotes={campaign.campaignNotes}
            allInvestigators={allInvestigators}
            updateCampaignNotes={updateCampaignNotes}
            showTextEditDialog={showTextEditDialog}
            showAddSectionDialog={showAddSectionDialog}
          />
        </ScrollView>
      </View>
    );
  }, [campaign, backgroundStyle, allInvestigators, componentId,
    updateChaosBag, drawChaosBagPressed, oddsCalculatorPressed, updateCampaignNotes, showTextEditDialog, showAddSectionDialog]);
  const tabs = useMemo(() => {
    return [
      {
        key: 'investigators',
        title: t`Decks`,
        node: decksTab,
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: scenariosTab,
      },
      {
        key: 'log',
        title: t`Log`,
        node: logsTab,
      },
    ];
  }, [decksTab, scenariosTab, logsTab]);
  const [tabView, setSelectedTab] = useTabView({ tabs });
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
  return (
    <View style={[styles.flex, backgroundStyle]}>
      { tabView }
      <AddCampaignNoteSectionDialog
        visible={addSectionVisible}
        addSection={addSectionCallback.current}
        hide={hideAddSectionDialog}
      />
      <CampaignGuideFab
        setSelectedTab={setSelectedTab}
        componentId={componentId}
        campaignId={campaignId}
        serverCampaignId={campaign?.serverId}
        campaignName={''}
        removeMode={removeMode}
        showEditNameDialog={showEditNameDialog}
        showAddInvestigator={showAddInvestigator}
        toggleRemoveInvestigator={toggleRemoveMode}
        guided={false}
        showAlert={showAlert}
      />
      { alertDialog }
      { traumaDialog }
      { dialog }
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
export default withDialogs(CampaignDetailView);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
