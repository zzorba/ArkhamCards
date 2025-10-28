import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { filter, find, map, sortBy, partition } from 'lodash';
import { t } from 'ttag';

import NewDialog from '@components/core/NewDialog';
import SideScenarioButton from './SideScenarioButton';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import useTabView from '@components/core/useTabView';
import { ScenarioId } from '@data/scenario';
import { Scenario } from '@data/scenario/types';
import space, { s, m, xs } from '@styles/space';
import SetupStepWrapper from '../SetupStepWrapper';
import DownloadParallelCardsButton from './DownloadParallelCardsButton';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import StyleContext from '@styles/StyleContext';
import { useCounter } from '@components/core/hooks';
import ArkhamButton from '@components/core/ArkhamButton';
import { useDialog } from '@components/deck/dialogs';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import useProcessedCampaign from '../useProcessedCampaign';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { EmbarkData } from '@actions/types';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HeaderTitle from '@components/core/HeaderTitle';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';

export interface AddSideScenarioProps extends CampaignGuideInputProps {
  latestScenarioId: ScenarioId;
  embarkData?: EmbarkData;
  onEmbarkSide?: (embarkData: EmbarkData, xpCost: number) => EmbarkData | undefined;
  subtitle?: string;
}

function SideScenarioList({ scenarios, onPress, useTime }: { scenarios: Scenario[]; onPress: (scenario: Scenario) => void; useTime: boolean }) {
  const { borderStyle } = useContext(StyleContext);
  const [official, custom] = partition(scenarios, s => !s.custom);
  return (
    <>
      { map(official, scenario => (
        <SideScenarioButton
          key={scenario.id}
          scenario={scenario}
          onPress={onPress}
          useTime={useTime}
        />
      )) }
      { !!custom.length && (
        <View style={space.paddingTopM}>
          <View style={[{ borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle, space.paddingBottomM]}>
            <CardDetailSectionHeader normalCase color="dark" title={t`Fan-made Scenarios`} />
          </View>
          { map(custom, scenario => (
            <SideScenarioButton
              key={scenario.id}
              scenario={scenario}
              onPress={onPress}
              useTime={useTime}
            />
          )) }
        </View>
      )}
    </>
  )

}

function AddSideScenarioView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.SideScenario'>>();
  const navigation = useNavigation();
  const { latestScenarioId, embarkData, onEmbarkSide } = route.params;
  const { campaignState, campaignGuide, campaign } = useContext(CampaignGuideContext);
  useDismissOnCampaignDeleted(navigation, campaign);

  const { backgroundStyle, borderStyle } = useContext(StyleContext);
  const [customScenarioName, setCustomScenarioName] = useState('');
  const [customXpCost, incCustomXpCost, decCustomXpCost, setCustomXpCost] = useCounter(1, { min: 0 });
  const onPress = useCallback((scenario: Scenario) => {
    if (embarkData && onEmbarkSide) {
      const newEmbarkData = onEmbarkSide(embarkData, scenario.xp_cost || 0);
      if (newEmbarkData) {
        // Getting back no data means we were sent somewhere else because we ran out of time.
        campaignState.startOfficialSideScenario(
          scenario.id,
          latestScenarioId,
          newEmbarkData
        );
      }
    } else {
      campaignState.startOfficialSideScenario(
        scenario.id,
        latestScenarioId,
        embarkData
      );
    }
    // Always pop
    navigation.goBack();
  }, [latestScenarioId, campaignState, onEmbarkSide, embarkData, navigation]);

  const saveCustomScenario = useCallback(() => {
    if (embarkData && onEmbarkSide) {
      const newEmbarkData = onEmbarkSide(embarkData, customXpCost || 0);
      if (newEmbarkData) {
        campaignState.startCustomSideScenario(
          latestScenarioId,
          customScenarioName,
          customXpCost,
          newEmbarkData,
        );
      }
    } else {
      campaignState.startCustomSideScenario(
        latestScenarioId,
        customScenarioName,
        customXpCost,
        embarkData,
      );
    }
    // Always pop
    navigation.goBack();
  }, [latestScenarioId, campaignState, customScenarioName, customXpCost, onEmbarkSide, embarkData, navigation]);

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

  const [processedCampaign] = useProcessedCampaign(campaignGuide, campaignState);
  const playableScenarios = useMemo(() => {
    return sortBy(filter(campaignGuide.sideScenarios(), scenario => {
      const alreadyPlayed = !!find(
        processedCampaign?.scenarios || [],
        playedScenario => playedScenario.id.scenarioId === scenario.id
      );
      return !alreadyPlayed && scenario.side_scenario_type !== 'standalone';
    }), scenario => scenario.full_name);
  }, [campaignGuide, processedCampaign?.scenarios]);
  const [playableSideScenarios, playableChallengeScenarios] = useMemo(() => partition(playableScenarios, scenario => scenario.side_scenario_type !== 'challenge'), [playableScenarios]);
  const sideTab = useMemo(() => {
    return (
      <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
        <View style={[styles.header, borderStyle]}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent
              text={onEmbarkSide ?
                t`A side-story is a scenario that may be played between any two scenarios of an <i>Arkham Horror: The Card Game</i> campaign.\n- Because you are playing <i>The Scarlet Keys</i> campaign, a side-story costs a certain amount of <b>time</b> instead of experience.\n- Weaknesses, trauma, experience, and rewards granted by playing a side-story stay with the investigators for the remainder of the campaign.\n- Each side-story may only be played once per campaign.`
                : t`A side-story is a scenario that may be played between any two scenarios of an <i>Arkham Horror: The Card Game</i> campaign.\n- Playing a side-story costs each investigator in the campaign a certain amount of experience, which should be paid when you start the scenario.\n- Weaknesses, trauma, experience, and rewards granted by playing a side-story stay with the investigators for the remainder of the campaign.\n- Each side-story may only be played once per campaign.\n\n<b>Note:</b> When using this app, the experience required to play these scenarios will be deducted automatically at the <b>end of the scenario</b>, but you should be sure you have sufficient experience set aside to pay for it.`} />
          </SetupStepWrapper>
        </View>
        <SideScenarioList
          scenarios={playableSideScenarios}
          onPress={onPress}
          useTime={!!onEmbarkSide}
        />
        <ArkhamButton
          icon="expand"
          title={t`Custom scenario`}
          onPress={customScenarioPressed}
        />
        <View style={{ height: NOTCH_BOTTOM_PADDING + 80 }} />
      </ScrollView>
    );
  }, [borderStyle, backgroundStyle, playableSideScenarios, onPress, onEmbarkSide, customScenarioPressed]);
  const challengeTab = useMemo(() => {
    return (
      <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
        <View style={[styles.header, borderStyle]}>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={t`Challenge scenarios are special print-and-play scenarios that utilize existing products in the <i>Arkham Horror: The Card Game</i> collection, along with additional print-and-play cards, to create new content. These scenarios are designed with certain prerequisites in mind, in order to craft a challenging puzzle-like experience. Printable cards can be downloaded from Fantasy Flight Games under the \"Parallel Investigators\" section.`} />
          </SetupStepWrapper>
          <DownloadParallelCardsButton />
        </View>
        <SideScenarioList
          scenarios={playableChallengeScenarios}
          onPress={onPress}
          useTime={!!onEmbarkSide}
        />
        <View style={{ height: NOTCH_BOTTOM_PADDING + 80 }} />
      </ScrollView>
    );
  }, [backgroundStyle, onEmbarkSide, borderStyle, playableChallengeScenarios, onPress]);

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

const WrappedComponent = withCampaignGuideContext(AddSideScenarioView, { rootView: false });

export default function AddSideScenarioWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.SideScenario'>>();
  const { campaignId } = route.params;
  return <WrappedComponent campaignId={campaignId} />;
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Guide.SideScenario'> }): NativeStackNavigationOptions {
  return {
    headerTitle: () => <HeaderTitle title={t`Choose Side-Scenario`} subtitle={route.params?.subtitle} />,
  };
};
AddSideScenarioWrapper.options = options;

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 32,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
