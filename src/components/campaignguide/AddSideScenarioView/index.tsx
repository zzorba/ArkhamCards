import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, find, map, partition } from 'lodash';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import SideScenarioButton from './SideScenarioButton';
import { NavigationProps } from '@components/nav/types';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { ScenarioId } from '@data/scenario';
import { Scenario } from '@data/scenario/types';
import { s, m, xs } from '@styles/space';
import SetupStepWrapper from '../SetupStepWrapper';
import DownloadParallelCardsButton from './DownloadParallelCardsButton';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import StyleContext from '@styles/StyleContext';
import { useCounter } from '@components/core/hooks';
import ArkhamButton from '@components/core/ArkhamButton';
import { useDialog } from '@components/deck/dialogs';
import PlusMinusButtons from '@components/core/PlusMinusButtons';

export interface AddSideScenarioProps extends CampaignGuideInputProps {
  latestScenarioId: ScenarioId;
}

type Props = NavigationProps & AddSideScenarioProps;

function AddSideScenarioView({ componentId, latestScenarioId }: Props) {
  const { campaignState, campaignGuide } = useContext(CampaignGuideContext);
  const { backgroundStyle, borderStyle } = useContext(StyleContext);
  const [customScenarioName, setCustomScenarioName] = useState('');
  const [customXpCost, incCustomXpCost, decCustomXpCost, setCustomXpCost] = useCounter(1, { min: 0 });
  const onPress = useCallback((scenario: Scenario) => {
    campaignState.startOfficialSideScenario(
      scenario.id,
      latestScenarioId,
    );
    Navigation.pop(componentId);
  }, [componentId, latestScenarioId, campaignState]);

  const saveCustomScenario = useCallback(() => {
    campaignState.startCustomSideScenario(
      latestScenarioId,
      customScenarioName,
      customXpCost,
    );
    Navigation.pop(componentId);
  }, [componentId, latestScenarioId, campaignState, customScenarioName, customXpCost]);

  const cancelCustomScenario = useCallback(() => {
    setCustomScenarioName('');
    setCustomXpCost(0);
  }, [setCustomScenarioName, setCustomXpCost]);
  const textInputRef = useRef<TextInput>(null);
  const customScenarioContent = useMemo(() => {
    return (
      <View>
        <NewDialog.ContentLine
          icon="name"
          text={t`Scenario Name`}
          control={null}
          paddingBottom={xs}
        />
        <NewDialog.TextInput
          value={customScenarioName}
          placeholder={t`Required`}
          onChangeText={setCustomScenarioName}
          textInputRef={textInputRef}
          paddingBottom={m}
        />
        <NewDialog.ContentLine
          icon="xp"
          text={t`Experience Cost`}
          paddingBottom={s}
          control={(
            <PlusMinusButtons
              count={customXpCost}
              onIncrement={incCustomXpCost}
              onDecrement={decCustomXpCost}
              showZeroCount
              dialogStyle
            />
          )}
        />
      </View>
    );
  }, [customScenarioName, customXpCost, incCustomXpCost, decCustomXpCost, setCustomScenarioName]);
  const { dialog: customDialog, showDialog: customScenarioPressed, visible: customScenarioVisible } = useDialog({
    title: t`Custom side scenario`,
    confirm: {
      title: t`Add`,
      disabled: !customScenarioName,
      onPress: saveCustomScenario,
    },
    dismiss: {
      title: t`Cancel`,
      onPress: cancelCustomScenario,
    },
    content: customScenarioContent,
  });
  useEffect(() => {
    if (customScenarioVisible) {
      if (Platform.OS === 'android' && textInputRef.current) {
        setTimeout(() => {
          textInputRef.current && textInputRef.current.focus();
        }, 100);
      }
    }
  }, [customScenarioVisible]);

  const [processedCampaign] = useMemo(() => campaignGuide.processAllScenarios(campaignState), [campaignGuide, campaignState]);
  const playableScenarios = useMemo(() => {
    return filter(campaignGuide.sideScenarios(), scenario => {
      const alreadyPlayed = !!find(
        processedCampaign?.scenarios || [],
        playedScenario => playedScenario.id.scenarioId === scenario.id
      );
      return !alreadyPlayed && scenario.side_scenario_type !== 'standalone';
    });
  }, [campaignGuide, processedCampaign?.scenarios]);
  const [playableSideScenarios, playableChallengeScenarios] = useMemo(() => partition(playableScenarios, scenario => scenario.side_scenario_type !== 'challenge'), [playableScenarios]);
  const sideTab = useMemo(() => {
    return (
      <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
        <View style={[styles.header, borderStyle]}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent
              text={t`A side-story is a scenario that may be played between any two scenarios of an <i>Arkham Horror: The Card Game</i> campaign.\n- Playing a side-story costs each investigator in the campaign a certain amount of experience, which should be paid when you start the scenario.\n- Weaknesses, trauma, experience, and rewards granted by playing a side-story stay with the investigators for the remainder of the campaign.\n- Each sidestory may only be played once per campaign.\n\n<b>Note:</b> When using this app, the experience required to play these scenarios will be deducted automatically at the <b>end of the scenario</b>, but you should be sure you have sufficient experience set aside to pay for it.`} />
          </SetupStepWrapper>
        </View>
        { map(playableSideScenarios, scenario => (
          <SideScenarioButton
            key={scenario.id}
            componentId={componentId}
            scenario={scenario}
            onPress={onPress}
          />
        )) }
        <ArkhamButton
          icon="expand"
          title={t`Custom scenario`}
          onPress={customScenarioPressed}
        />
      </ScrollView>
    );
  }, [borderStyle, backgroundStyle, playableSideScenarios, componentId, onPress, customScenarioPressed]);
  const challengeTab = useMemo(() => {
    return (
      <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
        <View style={[styles.header, borderStyle]}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={t`Challenge scenarios are special print-and-play scenarios that utilize existing products in the <i>Arkham Horror: The Card Game</i> collection, along with additional print-and-play cards, to create new content. These scenarios are designed with certain prerequisites in mind, in order to craft a challenging puzzle-like experience. Printable cards can be downloaded from Fantasy Flight Games under the \"Parallel Investigators\" section.`} />
          </SetupStepWrapper>
          <DownloadParallelCardsButton />
        </View>
        { map(playableChallengeScenarios, scenario => (
          <SideScenarioButton
            key={scenario.id}
            componentId={componentId}
            scenario={scenario}
            onPress={onPress}
          />
        )) }
      </ScrollView>
    );
  }, [backgroundStyle, borderStyle, playableChallengeScenarios, componentId, onPress]);
  const tabs = useMemo(() => [
    {
      key: 'scenarios',
      title: t`Side`,
      node: sideTab,
    },
    {
      key: 'challenge',
      title: t`Challenge`,
      node: challengeTab,
    },
  ], [sideTab, challengeTab]);
  const [tabView] = useTabView({ tabs });
  return (
    <>
      { tabView }
      { customDialog }
    </>
  );
}

export default withCampaignGuideContext(AddSideScenarioView, { rootView: false });


const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 32,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
