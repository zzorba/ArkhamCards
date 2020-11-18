import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { keys } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu-updated';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { CampaignNotes, InvestigatorData, WeaknessSet } from '@actions/types';
import CampaignLogSection from '../CampaignLogSection';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { iconsMap } from '@app/NavIcons';
import { ChaosBag } from '@app_constants';
import { updateCampaign, updateCampaignSpentXp, cleanBrokenCampaigns } from '../actions';
import { NavigationProps } from '@components/nav/types';
import { getAllDecks } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignDetails, useFlag, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import useTraumaDialog from '../useTraumaDialog';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { showCampaignScenarios, showAddScenarioResult, showChaosBagOddsCalculator, showDrawWeakness, showDrawChaosBag } from '@components/campaign/nav';
import CampaignSideMenu from './CampaignSideMenu';

export interface CampaignDetailProps {
  id: number;
}

type Props = NavigationProps & CampaignDetailProps & InjectedDialogProps

function CampaignDetailView({ id, componentId, showTextEditDialog }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaign = useCampaign(id);
  const decks = useSelector(getAllDecks);

  const {
    showTraumaDialog,
    investigatorDataUpdates,
    traumaDialog,
  } = useTraumaDialog({});
  const [latestDeckIds, allInvestigators] = useCampaignDetails(campaign, investigators);

  const dispatch = useDispatch();
  const updateNonDeckInvestigators = useCallback((nonDeckInvestigators: string[]) => {
    dispatch(updateCampaign(id, { nonDeckInvestigators }));
  }, [dispatch, id]);
  const updateLatestDeckIds = useCallback((latestDeckIds: number[]) => {
    dispatch(updateCampaign(id, { latestDeckIds }));
  }, [dispatch, id]);
  const updateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaign(id, { campaignNotes }));
  }, [dispatch, id]);
  const updateInvestigatorData = useCallback((investigatorData: InvestigatorData) => {
    dispatch(updateCampaign(id, { investigatorData }));
  }, [dispatch, id]);
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(id, { chaosBag }));
  }, [dispatch, id]);
  const updateWeaknessSet = useCallback((weaknessSet: WeaknessSet) => {
    dispatch(updateCampaign(id, { weaknessSet }));
  }, [dispatch, id]);
  const addSectionCallback = useRef<AddSectionFunction>();
  const [addSectionVisible, setAddSectionVisible] = useState(false);
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);
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

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'menu') {
      toggleMenuOpen();
    }
  }, componentId, [toggleMenuOpen]);

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
    setMenuOpen(false);
    showChaosBagOddsCalculator(componentId, id, allInvestigators);
  }, [componentId, id, allInvestigators, setMenuOpen]);

  const cleanBrokenCampaignsPressed = useCallback(() => {
    dispatch(cleanBrokenCampaigns());
    Navigation.pop(componentId);
  }, [componentId, dispatch]);

  const viewScenariosPressed = useCallback(() => {
    setMenuOpen(false);
    showCampaignScenarios(componentId, id);
  }, [id, componentId, setMenuOpen]);

  const addScenarioResultPressed = useCallback(() => {
    setMenuOpen(false);
    showAddScenarioResult(componentId, id);
  }, [id, componentId, setMenuOpen]);

  const drawChaosBagPressed = useCallback(() => {
    setMenuOpen(false);
    showDrawChaosBag(componentId, id, updateChaosBag);
  }, [id, setMenuOpen, componentId, updateChaosBag]);

  const drawWeaknessPressed = useCallback(() => {
    setMenuOpen(false);
    showDrawWeakness(componentId, id);
  }, [componentId, id, setMenuOpen]);

  const campaignDetails = useMemo(() => {
    if (!campaign) {
      return null;
    }
    return (
      <ScrollView style={[styles.flex, backgroundStyle]}>
        <ScenarioSection
          campaign={campaign}
          addScenarioResult={addScenarioResultPressed}
          viewScenarios={viewScenariosPressed}
        />
        <ChaosBagSection
          chaosBag={campaign.chaosBag}
          showChaosBag={drawChaosBagPressed}
          showOddsCalculator={oddsCalculatorPressed}
        />
        { !!cards && (
          <DecksSection
            componentId={componentId}
            campaign={campaign}
            weaknessSet={campaign.weaknessSet}
            latestDeckIds={latestDeckIds || []}
            decks={decks}
            allInvestigators={allInvestigators}
            cards={cards}
            investigatorData={campaign.investigatorData || {}}
            showTraumaDialog={showTraumaDialog}
            updateLatestDeckIds={updateLatestDeckIds}
            updateNonDeckInvestigators={updateNonDeckInvestigators}
            updateWeaknessSet={updateWeaknessSet}
            incSpentXp={incSpentXp}
            decSpentXp={decSpentXp}
          />
        ) }
        <WeaknessSetSection
          weaknessSet={campaign.weaknessSet}
          showDrawDialog={drawWeaknessPressed}
        />
        <CampaignLogSection
          campaignNotes={campaign.campaignNotes}
          allInvestigators={allInvestigators}
          updateCampaignNotes={updateCampaignNotes}
          showTextEditDialog={showTextEditDialog}
          showAddSectionDialog={showAddSectionDialog}
        />
      </ScrollView>
    );
  }, [
    campaign,
    showAddSectionDialog,
    componentId,
    latestDeckIds,
    showTraumaDialog,
    showTextEditDialog,
    allInvestigators,
    decks,
    cards,
    backgroundStyle,
    addScenarioResultPressed, viewScenariosPressed,
    drawChaosBagPressed, oddsCalculatorPressed,
    updateLatestDeckIds,
    updateNonDeckInvestigators,
    updateWeaknessSet,
    incSpentXp,
    decSpentXp,
    drawWeaknessPressed,
    updateCampaignNotes,
  ]);
  const { width } = useWindowDimensions();
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
  const menuWidth = Math.min(width * 0.60, 240);
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <SideMenu
        isOpen={menuOpen}
        onChange={setMenuOpen}
        menu={<CampaignSideMenu id={id} componentId={componentId} closeMenu={closeMenu} showTextEditDialog={showTextEditDialog} />}
        openMenuOffset={menuWidth}
        autoClosing
        menuPosition="right"
      >
        { campaignDetails }
      </SideMenu>
      <AddCampaignNoteSectionDialog
        visible={addSectionVisible}
        addSection={addSectionCallback.current}
        hide={hideAddSectionDialog}
      />
      { traumaDialog }
    </View>
  );
}

CampaignDetailView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Campaign`,
      },
      rightButtons: [{
        icon: iconsMap.menu,
        id: 'menu',
        color: COLORS.M,
        accessibilityLabel: t`Menu`,
      }],
    },
  };
};
export default withDialogs(CampaignDetailView);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
