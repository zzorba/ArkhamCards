import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { throttle } from 'lodash';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { CampaignId, CampaignNotes, ScenarioResult } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import ScenarioSection from './ScenarioSection';
import CampaignLogSection from '../CampaignLogSection';
import XpComponent from '../XpComponent';
import useAddCampaignNoteSectionDialog from '../useAddCampaignNoteSectionDialog';
import { UpgradeDecksProps } from '../UpgradeDecksView';
import { addScenarioResult } from '../actions';
import space, { m, s } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaignInvestigators, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useCountDialog } from '@components/deck/dialogs';
import DeckButton from '@components/deck/controls/DeckButton';

export interface AddScenarioResultProps {
  id: CampaignId;
  scenarioCode?: string;
}

type Props = NavigationProps &
  AddScenarioResultProps;

function AddScenarioResultView({ componentId, id, scenarioCode }: Props) {
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const { backgroundStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();

  const campaign = useCampaign(id);
  const investigators = useInvestigatorCards();
  const [scenario, setScenario] = useState<ScenarioResult | undefined>();
  const [campaignNotes, setCampaignNotes] = useState<CampaignNotes | undefined>();
  const allInvestigators = useCampaignInvestigators(campaign, investigators);
  const [xp, setXp] = useState(0);

  const doSave = useCallback((showDeckUpgrade: boolean) => {
    if (scenario) {
      const scenarioResult: ScenarioResult = { ...scenario, xp };
      dispatch(addScenarioResult(user, id, scenarioResult, campaignNotes));
      const passProps: UpgradeDecksProps = {
        id,
        scenarioResult,
      };
      if (showDeckUpgrade) {
        Navigation.showModal({
          stack: {
            children: [{
              component: {
                name: 'Campaign.UpgradeDecks',
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
        setTimeout(() => {
          Navigation.pop(componentId);
        }, 1500);
      } else {
        Navigation.pop(componentId);
      }
    }
  }, [componentId, id, dispatch, user, scenario, xp, campaignNotes]);

  const savePressed = useMemo(() => throttle((showDeckUpgrade: boolean) => doSave(showDeckUpgrade), 200), [doSave]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      savePressed(true);
    }
  }, componentId, [savePressed]);

  const saveEnabled = useMemo(() => {
    return !!(scenario &&
      scenario.scenario &&
      (scenario.interlude || scenario.resolution !== ''));
  }, [scenario]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtonDisabledColor: COLORS.darkGray,
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          enabled: saveEnabled,
          color: COLORS.M,
        }],
      },
    });
  }, [componentId, saveEnabled]);

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
        componentId={componentId}
        campaign={campaign}
        scenarioChanged={setScenario}
        showTextEditDialog={showTextEditDialog}
        initialScenarioCode={scenarioCode}
      />
    );
  }, [componentId, campaign, showTextEditDialog, scenarioCode]);

  const notes = useMemo(() => {
    return campaignNotes ||
      (campaign && campaign.campaignNotes);
  }, [campaignNotes, campaign]);

  const hasDecks = !!campaign && !!campaign.deckIds && campaign.deckIds.length > 0;
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
