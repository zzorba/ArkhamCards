import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { t } from 'ttag';

import { ScenarioResult, CUSTOM, CampaignId } from '@actions/types';
import { editScenarioResult } from './actions';
import COLORS from '@styles/colors';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign } from '@data/hooks';
import { useCountDialog, useSimpleTextDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import DeckButton from '@components/deck/controls/DeckButton';
import { useDismissOnCampaignDeleted, useUpdateCampaignActions } from '@data/remote/campaigns';
import { useAppDispatch } from '@app/store';
import { BasicStackParamList } from '@navigation/types';
import HeaderButton from '@components/core/HeaderButton';

export interface EditScenarioResultProps {
  campaignId: CampaignId;
  index: number;
}

export default function EditScenarioResultView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Campaign.EditResult'>>();
  const { campaignId, index } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  useDismissOnCampaignDeleted(navigation, campaign);
  const dispatch = useAppDispatch();
  const existingScenarioResult = campaign && campaign.scenarioResults?.[index];
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | undefined>(existingScenarioResult);
  const actions = useUpdateCampaignActions();
  const doSave = useMemo(() => throttle(() => {
    if (scenarioResult && campaign) {
      dispatch(editScenarioResult(actions, campaign, index, scenarioResult));
    }
    navigation.goBack();
  }, 200), [campaign, index, actions, scenarioResult, navigation, dispatch]);

  useLayoutEffect(() => {
    const enabled = scenarioResult && !!(scenarioResult.scenario &&
      (scenarioResult.interlude || scenarioResult.resolution !== ''))
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          text={t`Save`}
          color={COLORS.M}
          onPress={doSave}
          accessibilityLabel={t`Save`}
          disabled={!enabled}
        />
      ),
    });
  }, [scenarioResult, navigation, doSave]);

  const nameChanged = useCallback((value: string) => {
    if (scenarioResult && scenarioResult.scenarioCode === CUSTOM) {
      setScenarioResult({
        ...scenarioResult,
        scenario: value,
      });
    }
  }, [scenarioResult, setScenarioResult]);

  const [nameDialog, showNameDialog] = useSimpleTextDialog({
    title: t`Scenario`,
    value: existingScenarioResult?.scenario || '',
    onValueChange: nameChanged,
  });

  const resolutionChanged = useCallback((value: string) => {
    if (scenarioResult) {
      setScenarioResult({
        ...scenarioResult,
        resolution: value,
      });
    }
  }, [scenarioResult, setScenarioResult]);

  const [resolutionDialog, showResolutionDialog] = useSimpleTextDialog({
    title: t`Resolution`,
    value: existingScenarioResult?.resolution || '',
    onValueChange: resolutionChanged,
  });

  const xpChanged = useCallback((xp: number) => {
    if (scenarioResult) {
      setScenarioResult({
        ...scenarioResult,
        xp,
      });
    }
  }, [scenarioResult, setScenarioResult]);
  const [countDialog, showCountDialog] = useCountDialog();
  const showExperienceDialog = useCallback(() => {
    showCountDialog({
      title: t`Experience`,
      label: t`Earned experience:`,
      value: scenarioResult?.xp || 0,
      update: xpChanged,
    });
  }, [xpChanged, showCountDialog, scenarioResult]);
  if (!scenarioResult) {
    return null;
  }
  const {
    xp,
    scenario,
    scenarioCode,
    interlude,
    resolution,
  } = scenarioResult;
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={[styles.container, backgroundStyle]}>
        <View style={space.paddingS}>
          <DeckPickerStyleButton
            title={interlude ? t`Interlude` : t`Scenario`}
            valueLabel={scenario}
            editable={scenarioCode === CUSTOM}
            icon="name"
            onPress={showNameDialog}
            first
          />
          { (scenarioCode === CUSTOM || !interlude) && (
            <DeckPickerStyleButton
              title={t`Resolution`}
              valueLabel={resolution}
              onPress={showResolutionDialog}
              icon="book"
              editable
            />
          ) }
          <DeckPickerStyleButton
            title={t`Experience`}
            icon="xp"
            editable
            onPress={showExperienceDialog}
            valueLabel={`${xp || 0}`}
            last
          />
        </View>
        <View style={[space.paddingS, styles.row]}>
          <DeckButton icon="check-thin" title={t`Save`} onPress={doSave} thin />
        </View>
      </ScrollView>
      { nameDialog }
      { resolutionDialog }
      { countDialog }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  wrapper: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
