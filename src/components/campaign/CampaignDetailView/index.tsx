import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { keys, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu-updated';
import { t } from 'ttag';

import { SettingsButton } from '@lib/react-native-settings-components';
import BasicButton from '@components/core/BasicButton';
import { CampaignNotes, InvestigatorData, WeaknessSet } from '@actions/types';
import CampaignLogSection from '../CampaignLogSection';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ChaosBagSection from './ChaosBagSection';
import DecksSection from './DecksSection';
import ScenarioSection from './ScenarioSection';
import WeaknessSetSection from './WeaknessSetSection';
import { AddScenarioResultProps } from '../AddScenarioResultView';
import { CampaignScenarioProps } from '../CampaignScenarioView';
import { CampaignChaosBagProps } from '../CampaignChaosBagView';
import { EditChaosBagProps } from '../EditChaosBagDialog';
import { CampaignDrawWeaknessProps } from '../CampaignDrawWeaknessDialog';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { campaignToText } from '../campaignUtil';
import { OddsCalculatorProps } from '../OddsCalculatorView';
import { iconsMap } from '@app/NavIcons';
import { ChaosBag } from '@app_constants';
import { updateCampaign, updateCampaignSpentXp, deleteCampaign, cleanBrokenCampaigns } from '../actions';
import { NavigationProps } from '@components/nav/types';
import { getAllDecks, getLatestCampaignDeckIds, getLatestCampaignInvestigators, AppState } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useFlag, useInvestigatorCards, useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import useTraumaDialog from '../useTraumaDialog';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import Card from '@data/Card';

export interface CampaignDetailProps {
  id: number;
}

type Props = NavigationProps &
  CampaignDetailProps

const EMPTY_DECK_IDS: number[] = [];
const EMPTY_INVESTIGATORS: Card[] = [];

function CampaignDetailView({ id, componentId, showTextEditDialog }: CampaignDetailProps & NavigationProps & InjectedDialogProps) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const campaign = useCampaign(id);
  const decks = useSelector(getAllDecks);

  const {
    showTraumaDialog,
    investigatorDataUpdates,
    traumaDialog,
  } = useTraumaDialog({});
  const latestDeckIdsSelector = useCallback((state: AppState) => {
    return campaign ? getLatestCampaignDeckIds(state, campaign) : EMPTY_DECK_IDS;
  }, [campaign]);
  const latestDeckIds = useSelector(latestDeckIdsSelector);
  const allInvestigatorsSelector = useCallback((state: AppState) => {
    return investigators && campaign ? getLatestCampaignInvestigators(state, investigators, campaign) : EMPTY_INVESTIGATORS;
  }, [investigators, campaign]);
  const allInvestigators = useSelector(allInvestigatorsSelector);

  const dispatch = useDispatch();
  const onCampaignNameChange = useCallback((name: string) => {
    dispatch(updateCampaign(id, { name }));
  }, [dispatch, id]);
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
  const [addSectionCallback, setAddSectionCallback] = useState<AddSectionFunction | undefined>();
  const [menuOpen, toggleMenuOpen, setMenuOpen] = useFlag(false);
  const incSpentXp = useCallback((code: string) => {
    dispatch(updateCampaignSpentXp(id, code, 'inc'));
  }, [id, dispatch]);
  const decSpentXp = useCallback((code: string) => {
    dispatch(updateCampaignSpentXp(id, code, 'dec'));
  }, [id, dispatch]);

  const showAddSectionDialog = useCallback((addSectionFunction: AddSectionFunction) => {
    setAddSectionCallback(addSectionFunction);
  }, [setAddSectionCallback]);
  const hideAddSectionDialog = useCallback(() => {
    setAddSectionCallback(undefined);
  }, [setAddSectionCallback]);
  const showShareSheet = useCallback(() => {
    setMenuOpen(false);
    if (campaign && investigators) {
      Share.share({
        title: campaign.name,
        message: campaignToText(campaign, latestDeckIds, decks, investigators),
      }, {
        // @ts-ignore
        subject: campaign.name,
      });
    }
  }, [campaign, latestDeckIds, decks, investigators, setMenuOpen]);

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

  const editNamePressed = useCallback(() => {
    setMenuOpen(false);
    if (campaign) {
      showTextEditDialog(
        t`Campaign Name`,
        campaign.name,
        onCampaignNameChange
      );
    }
  }, [campaign, showTextEditDialog, setMenuOpen, onCampaignNameChange]);

  const oddsCalculatorPressed = useCallback(() => {
    setMenuOpen(false);
    Navigation.push<OddsCalculatorProps>(componentId, {
      component: {
        name: 'OddsCalculator',
        passProps: {
          campaignId: id,
          investigatorIds: map(allInvestigators, card => card.code),
        },
        options: {
          topBar: {
            title: {
              text: t`Odds Calculator`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, id, allInvestigators, setMenuOpen]);
  const handleDelete = useCallback(() => {
    dispatch(deleteCampaign(id));
    Navigation.pop(componentId);
  }, [id, componentId, dispatch]);

  const deletePressed = useCallback(() => {
    setMenuOpen(false);
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
  }, [campaign, setMenuOpen, handleDelete]);

  const cleanBrokenCampaignsPressed = useCallback(() => {
    dispatch(cleanBrokenCampaigns());
    Navigation.pop(componentId);
  }, [componentId, dispatch]);

  const addSectionDialog = useMemo(() => {
    return (
      <AddCampaignNoteSectionDialog
        visible={!!addSectionCallback}
        addSection={addSectionCallback}
        hide={hideAddSectionDialog}
      />
    );
  }, [addSectionCallback, hideAddSectionDialog]);

  const viewScenariosPressed = useCallback(() => {
    setMenuOpen(false);
    Navigation.push<CampaignScenarioProps>(componentId, {
      component: {
        name: 'Campaign.Scenarios',
        passProps: {
          id,
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
  }, [id, componentId, setMenuOpen]);

  const addScenarioResultPressed = useCallback(() => {
    setMenuOpen(false);
    Navigation.push<AddScenarioResultProps>(componentId, {
      component: {
        name: 'Campaign.AddResult',
        passProps: {
          id,
        },
      },
    });
  }, [id, componentId, setMenuOpen]);

  const drawChaosBagPressed = useCallback(() => {
    setMenuOpen(false);
    Navigation.push<CampaignChaosBagProps>(componentId, {
      component: {
        name: 'Campaign.ChaosBag',
        passProps: {
          campaignId: id,
          updateChaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [id, setMenuOpen, componentId, updateChaosBag]);

  const editChaosBagPressed = useCallback(() => {
    if (campaign) {
      setMenuOpen(false);
      Navigation.push<EditChaosBagProps>(componentId, {
        component: {
          name: 'Dialog.EditChaosBag',
          passProps: {
            chaosBag: campaign.chaosBag,
            updateChaosBag,
            trackDeltas: true,
          },
          options: {
            topBar: {
              title: {
                text: t`Chaos Bag`,
              },
            },
          },
        },
      });
    }
  }, [campaign, setMenuOpen, componentId, updateChaosBag]);

  const drawWeaknessPressed = useCallback(() => {
    setMenuOpen(false);
    Navigation.push<CampaignDrawWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId: id,
        },
        options: {
          topBar: {
            title: {
              text: t`Draw Weaknesses`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, id, setMenuOpen]);

  const sideMenu = useMemo(() => {
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
  }, [backgroundStyle, borderStyle, typography, campaign, deletePressed, showShareSheet, drawWeaknessPressed, oddsCalculatorPressed,
    drawChaosBagPressed, editChaosBagPressed, addScenarioResultPressed, viewScenariosPressed, editNamePressed]);

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
        menu={sideMenu}
        openMenuOffset={menuWidth}
        autoClosing
        menuPosition="right"
      >
        { campaignDetails }
      </SideMenu>
      { addSectionDialog }
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
  menu: {
    borderLeftWidth: 2,
  },
  destructive: {
    color: COLORS.red,
  },
});
