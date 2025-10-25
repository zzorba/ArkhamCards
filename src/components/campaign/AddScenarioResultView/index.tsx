import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dropWhile, reverse, throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { t } from 'ttag';

import { CampaignId, CampaignNotes, ScenarioResult } from '@actions/types';
import ScenarioSection from './ScenarioSection';
import CampaignLogSection from '../CampaignLogSection';
import XpComponent from '../XpComponent';
import useAddCampaignNoteSectionDialog from '../useAddCampaignNoteSectionDialog';
import { UpgradeDecksProps } from '../UpgradeDecksView';
import { addScenarioResult } from '../actions';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaignInvestigators, useCampaign } from '@data/hooks';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useCountDialog } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';
import { useAppDispatch } from '@app/store';
import { useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';

export interface AddScenarioResultProps {
  id: CampaignId;
  scenarioCode?: string;
}

function AddScenarioResultView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Campaign.AddResult'>>();
  const navigation = useNavigation();
  const { id, scenarioCode } = route.params
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const { backgroundStyle } = useContext(StyleContext);
  const dispatch = useAppDispatch();

  const campaign = useCampaign(id);
  useDismissOnCampaignDeleted(navigation, campaign);
  const [allInvestigators] = useCampaignInvestigators(campaign);
  const [scenario, setScenario] = useState<ScenarioResult | undefined>();
  const [campaignNotes, setCampaignNotes] = useState<CampaignNotes | undefined>();
  const [xp, setXp] = useState(0);
  const actions = useUpdateCampaignActions();

  const doSave = useCallback((showDeckUpgrade: boolean) => {
    if (scenario && campaign) {
      const scenarioResult: ScenarioResult = { ...scenario, xp };
      dispatch(addScenarioResult(actions, campaign, scenarioResult, campaignNotes));
      const passProps: UpgradeDecksProps = {
        id,
        scenarioResult,
      };
      if (showDeckUpgrade) {

        const state = navigation.getState();
        const routes = dropWhile(
          reverse([...state?.routes ?? []]),
          r => r.name === 'Campaign.AddResult'
        ).reverse();
        navigation.reset({
          index: routes.length,
          routes: [
            ...routes as any,
            {
              name: 'Campaign.UpgradeDecks',
              params: passProps,
            },
          ],
        });
      } else {
        navigation.goBack();
      }
    }
  }, [navigation, campaign, id, actions, dispatch, scenario, xp, campaignNotes]);

  const savePressed = useMemo(() => throttle((showDeckUpgrade: boolean) => doSave(showDeckUpgrade), 200), [doSave]);
  const saveEnabled = useMemo(() => {
    return !!(scenario &&
      scenario.scenario &&
      (scenario.interlude || scenario.resolution !== ''));
  }, [scenario]);
  const onSave = useCallback(() => savePressed(true), [savePressed]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          text={t`Save`}
          accessibilityLabel={t`Save`}
          disabled={!saveEnabled}
          color={COLORS.M}
          onPress={onSave}
        />
      ),
    })
  }, [navigation, saveEnabled, onSave]);

  const saveAndDismiss = useCallback(() => {
    savePressed(false);
  }, [savePressed]);

  const saveAndUpgradeDecks = useCallback(() => {
    savePressed(true);
  }, [savePressed]);

  const scenariosSection = useMemo(() => {
    if (!campaign) {
      return null;
    }
    return (
      <ScenarioSection
        campaign={campaign}
        scenarioChanged={setScenario}
        showTextEditDialog={showTextEditDialog}
        initialScenarioCode={scenarioCode}
      />
    );
  }, [campaign, showTextEditDialog, scenarioCode]);

  const notes = useMemo(() => {
    return campaignNotes || campaign?.campaignNotes;
  }, [campaignNotes, campaign]);

  const hasDecks = campaign && campaign.latestDecks().length > 0;
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        { scenariosSection }
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <XpComponent
            xp={xp}
            onChange={setXp}
            showCountDialog={showCountDialog}
          />
        </View>
        <View style={space.paddingSideS}>
          { hasDecks && (
            <DeckButton
              icon="upgrade"
              title={t`Save and Upgrade Decks`}
              onPress={saveAndUpgradeDecks}
              disabled={!saveEnabled}
              bottomMargin={s}
              color="gold"
              thin
            />
          ) }
          <DeckButton
            icon="check-thin"
            title={hasDecks ? t`Only Save` : t`Save`}
            onPress={saveAndDismiss}
            disabled={!saveEnabled}
            bottomMargin={s}
            thin
          />
        </View>
        { !!notes && (
          <CampaignLogSection
            campaignNotes={notes}
            allInvestigators={allInvestigators}
            updateCampaignNotes={setCampaignNotes}
            showTextEditDialog={showTextEditDialog}
            showCountDialog={showCountDialog}
            showAddSectionDialog={showAddSectionDialog}
          />
        ) }
        <View style={styles.footer} />
      </ScrollView>
      { addSectionDialog }
      { dialog }
      { countDialog }
    </View>
  );
}

AddScenarioResultView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Scenario Result`,
      },
      backButton: {
        title: t`Cancel`,
      },
      rightButtonDisabledColor: COLORS.darkGray,
      rightButtons: [{
        text: t`Save`,
        id: 'save',
        color: COLORS.M,
      }],
    },
  };
};
export default AddScenarioResultView;

const styles = StyleSheet.create({
  container: {
    paddingTop: m,
    paddingBottom: m,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
  flex: {
    flex: 1,
  },
});
