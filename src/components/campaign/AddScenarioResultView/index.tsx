import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

import BasicButton from '@components/core/BasicButton';
import { CampaignId, CampaignNotes, ScenarioResult } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import ScenarioSection from './ScenarioSection';
import CampaignLogSection from '../CampaignLogSection';
import XpComponent from '../XpComponent';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from '../AddCampaignNoteSectionDialog';
import { UpgradeDecksProps } from '../UpgradeDecksView';
import { addScenarioResult } from '../actions';
import space, { m } from '@styles/space';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useCampaignInvestigators, useInvestigatorCards, useNavigationButtonPressed } from '@components/core/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useCountDialog } from '@components/deck/dialogs';

export interface AddScenarioResultProps {
  id: CampaignId;
}

type Props = NavigationProps &
  AddScenarioResultProps;

function AddScenarioResultView({ componentId, id }: Props) {
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const { backgroundStyle, borderStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();

  const campaign = useCampaign(id);
  const investigators = useInvestigatorCards();
  const [scenario, setScenario] = useState<ScenarioResult | undefined>();
  const [campaignNotes, setCampaignNotes] = useState<CampaignNotes | undefined>();
  const allInvestigators = useCampaignInvestigators(campaign, investigators);
  const [xp, setXp] = useState(0);
  const [addSectionVisible, setAddSectionVisible] = useState(false);
  const addSectionFunction = useRef<AddSectionFunction>();

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

  const showAddSectionDialog = useCallback((f: AddSectionFunction) => {
    setAddSectionVisible(true);
    addSectionFunction.current = f;
  }, [addSectionFunction, setAddSectionVisible]);

  const hideAddSectionDialog = useCallback(() => {
    setAddSectionVisible(false);
    addSectionFunction.current = undefined;
  }, [addSectionFunction, setAddSectionVisible]);

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
      />
    );
  }, [componentId, campaign, showTextEditDialog]);

  const notes = useMemo(() => {
    return campaignNotes ||
      (campaign && campaign.campaignNotes);
  }, [campaignNotes, campaign]);

  const hasDecks = !!campaign && !!campaign.deckIds && campaign.deckIds.length > 0;
  return (
    <View style={[styles.flex, backgroundStyle]}>
      <AddCampaignNoteSectionDialog
        visible={addSectionVisible}
        addSection={addSectionFunction.current}
        hide={hideAddSectionDialog}
      />
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        { scenariosSection }
        <View style={[space.paddingSideS, space.paddingBottomS]}>
          <XpComponent
            xp={xp}
            onChange={setXp}
            showCountDialog={showCountDialog}
          />
        </View>
        { hasDecks && (
          <BasicButton
            title={t`Save and Upgrade Decks`}
            onPress={saveAndUpgradeDecks}
            disabled={!saveEnabled}
          />
        ) }
        <View style={[styles.bottomBorder, borderStyle]}>
          <BasicButton
            title={hasDecks ? t`Only Save` : t`Save`}
            onPress={saveAndDismiss}
            disabled={!saveEnabled}
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
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flex: {
    flex: 1,
  },
});
