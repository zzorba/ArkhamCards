import React, { useCallback, useContext } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { SettingsButton } from '@lib/react-native-settings-components';
import { showCampaignScenarios, showAddScenarioResult, showEditChaosBag, showDrawChaosBag, showChaosBagOddsCalculator, showDrawWeakness } from '@components/campaign/nav';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { campaignToText } from '../campaignUtil';
import { ChaosBag } from '@app_constants';
import { updateCampaign, deleteCampaign } from '../actions';
import { NavigationProps } from '@components/nav/types';
import { getAllDecks } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignDetails, useInvestigatorCards } from '@components/core/hooks';
import { ShowTextEditDialog } from '@components/core/withDialogs';

export interface CampaignDetailProps {
  id: number;
  closeMenu: () => void;
  showTextEditDialog: ShowTextEditDialog;
}

export default function CampaignSideMenu({ id, componentId, showTextEditDialog, closeMenu }: CampaignDetailProps & NavigationProps) {
  const campaign = useCampaign(id);
  const investigators = useInvestigatorCards();
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const [latestDeckIds, allInvestigators] = useCampaignDetails(campaign, investigators);
  const decks = useSelector(getAllDecks);

  const dispatch = useDispatch();
  const updateCampaignName = useCallback((name: string) => {
    dispatch(updateCampaign(id, { name }));
  }, [dispatch, id]);
  const updateChaosBag = useCallback((chaosBag: ChaosBag) => {
    dispatch(updateCampaign(id, { chaosBag }));
  }, [dispatch, id]);

  const editNamePressed = useCallback(() => {
    closeMenu();
    if (campaign) {
      showTextEditDialog(
        t`Campaign Name`,
        campaign.name,
        updateCampaignName
      );
    }
  }, [closeMenu, campaign, showTextEditDialog, updateCampaignName]);

  const viewScenariosPressed = useCallback(() => {
    closeMenu();
    showCampaignScenarios(componentId, id);
  }, [id, componentId, closeMenu]);

  const addScenarioResultPressed = useCallback(() => {
    closeMenu();
    showAddScenarioResult(componentId, id);
  }, [id, componentId, closeMenu]);

  const editChaosBagPressed = useCallback(() => {
    if (campaign) {
      closeMenu();
      showEditChaosBag(componentId, campaign, updateChaosBag);
    }
  }, [campaign, closeMenu, componentId, updateChaosBag]);

  const drawChaosBagPressed = useCallback(() => {
    closeMenu();
    showDrawChaosBag(componentId, id, updateChaosBag);
  }, [id, closeMenu, componentId, updateChaosBag]);

  const oddsCalculatorPressed = useCallback(() => {
    closeMenu();
    showChaosBagOddsCalculator(componentId, id, allInvestigators);
  }, [componentId, id, allInvestigators, closeMenu]);

  const drawWeaknessPressed = useCallback(() => {
    closeMenu();
    showDrawWeakness(componentId, id);
  }, [componentId, id, closeMenu]);

  const showShareSheet = useCallback(() => {
    closeMenu();
    if (campaign && investigators) {
      Share.share({
        title: campaign.name,
        message: campaignToText(campaign, latestDeckIds, decks, investigators),
      }, {
        // @ts-ignore
        subject: campaign.name,
      });
    }
  }, [campaign, latestDeckIds, decks, investigators, closeMenu]);


  const handleDelete = useCallback(() => {
    dispatch(deleteCampaign(id));
    Navigation.pop(componentId);
  }, [id, componentId, dispatch]);

  const deletePressed = useCallback(() => {
    closeMenu();
    if (campaign) {
      Alert.alert(
        t`Delete`,
        t`Are you sure you want to delete the campaign: ${campaign.name}`,
        [
          { text: t`Delete`, onPress: handleDelete, style: 'destructive' },
          { text: t`Cancel`, style: 'cancel' },
        ],
      );
    }
  }, [campaign, closeMenu, handleDelete]);

  return (
    <ScrollView style={[styles.menu, borderStyle, backgroundStyle]}>
      <CardSectionHeader section={{ title: t`Campaign` }} />
      { !!campaign && (
        <SettingsButton
          onPress={editNamePressed}
          title={t`Name`}
          titleStyle={typography.text}
          description={campaign.name}
          descriptionStyle={typography.small}
          containerStyle={backgroundStyle}
        />
      ) }
      <SettingsButton
        onPress={viewScenariosPressed}
        title={t`Scenario History`}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <SettingsButton
        onPress={addScenarioResultPressed}
        title={t`Record Scenario Results`}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <CardSectionHeader section={{ title: t`Chaos Bag` }} />
      <SettingsButton
        title={t`Edit Tokens`}
        onPress={editChaosBagPressed}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <SettingsButton
        title={t`Draw Tokens`}
        onPress={drawChaosBagPressed}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <SettingsButton
        title={t`Odds Calculator`}
        onPress={oddsCalculatorPressed}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <CardSectionHeader section={{ title: t`Weakness Set` }} />
      <SettingsButton
        title={t`Draw Basic Weakness`}
        onPress={drawWeaknessPressed}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <CardSectionHeader section={{ title: t`Options` }} />
      <SettingsButton
        onPress={showShareSheet}
        title={t`Share`}
        titleStyle={typography.text}
        containerStyle={backgroundStyle}
      />
      <SettingsButton
        title={t`Delete`}
        titleStyle={styles.destructive}
        onPress={deletePressed}
        containerStyle={backgroundStyle}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menu: {
    borderLeftWidth: 2,
  },
  destructive: {
    color: COLORS.red,
  },
});
