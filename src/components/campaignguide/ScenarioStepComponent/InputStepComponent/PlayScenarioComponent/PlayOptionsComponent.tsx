import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { findIndex, find, map, flatMap } from 'lodash';
import { t } from 'ttag';

import BranchButton from './BranchButton';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { BinaryConditionalChoice, PlayScenarioInput } from '@data/scenario/types';
import { PlayingScenarioBranch } from '@data/scenario/fixedSteps';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { CampaignId } from '@actions/types';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import space, { s, xs } from '@styles/space';
import DeckButton from '@components/deck/controls/DeckButton';
import useChaosBagDialog from '@components/campaign/CampaignDetailView/useChaosBagDialog';
import { useDialog } from '@components/deck/dialogs';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { calculateBinaryConditionResult } from '@data/scenario/inputHelper';
import StyleContext from '@styles/StyleContext';
import BorderWrapper from '@components/campaignguide/BorderWrapper';


interface Props {
  componentId: string;
  campaignId: CampaignId;
  id: string;
  input: PlayScenarioInput;
}

interface ConditionalBranch {
  choice: BinaryConditionalChoice;
  visible: boolean;
}

export default function PlayOptionsComponent({ input, componentId, campaignId, id }: Props) {
  const { campaign, campaignGuide } = useContext(CampaignGuideContext);
  const { scenarioState, processedScenario } = useContext(ScenarioGuideContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const { colors, typography, width } = useContext(StyleContext);
  const allInvestigators = useMemo(() => processedScenario.latestCampaignLog.investigators(false), [processedScenario.latestCampaignLog]);
  const setChaosBagDialogVisibleRef = useRef<(visible: boolean) => void>();
  const standalone = !!campaign.standaloneId;

  const branchPress = useCallback((index: number) => {
    scenarioState.setChoice(id, index);
  }, [scenarioState, id]);
  const setCampaignLogDialogVisibleRef = useRef<(visible: boolean) => void>();

  const editCampaignLogPressed = useCallback(() => {
    setCampaignLogDialogVisibleRef.current?.(false);
    branchPress(PlayingScenarioBranch.CAMPAIGN_LOG);
  }, [branchPress]);
  const branches: ConditionalBranch[] = useMemo(() => map(input.branches || [], choice => {
    return {
      choice,
      visible: !choice.condition || !!(calculateBinaryConditionResult(choice.condition, campaignLog)?.option),
    };
  }), [input.branches, campaignLog]);
  const chaosBagIndex = useMemo(() => {
    if (!input.chaos_bag_branches) {
      return undefined;
    }
    const chaosBagBranches = new Set(input.chaos_bag_branches);
    const index = findIndex(branches, b => b.visible && chaosBagBranches.has(b.choice.id));
    if (index === -1) {
      return undefined;
    }
    return index;
  }, [branches, input.chaos_bag_branches]);
  const editChaosBagPressed = useCallback(() => {
    if (chaosBagIndex !== undefined) {
      setChaosBagDialogVisibleRef.current?.(false);
      branchPress(chaosBagIndex);
    }
  }, [chaosBagIndex, branchPress]);
  const [chaosBagDialog, showChaosBagDialog, setChaosBagDialogVisible] = useChaosBagDialog({
    componentId,
    allInvestigators,
    campaignId,
    chaosBag: processedScenario.latestCampaignLog.chaosBag,
    guided: true,
    scenarioId: processedScenario.id.scenarioId,
    customEditPressed: chaosBagIndex !== undefined ? editChaosBagPressed : undefined,
    standalone: !!campaign.standaloneId,
    cycleCode: campaign.cycleCode,
  });
  setChaosBagDialogVisibleRef.current = setChaosBagDialogVisible;

  const { dialog: campaignLogDialog, showDialog: showCampaignLogDialog, setVisible: setCampaignLogDialogVisible } = useDialog({
    title: t`Campaign log`,
    alignment: 'bottom',
    content: (
      <CampaignLogComponent
        hideChaosBag
        componentId={componentId}
        campaignId={campaignId}
        campaignGuide={campaignGuide}
        campaignLog={processedScenario.latestCampaignLog}
        scenarioId={processedScenario.id.scenarioId}
        standalone={standalone}
        width={width - s * 4}
      />
    ),
    customButtons: [
      <DeckButton
        key="edit"
        icon="edit"
        title={t`Record in campaign log`}
        onPress={editCampaignLogPressed}
      />,
    ],
    allowDismiss: true,
  });
  setCampaignLogDialogVisibleRef.current = setCampaignLogDialogVisible;
  const resolutionPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.RESOLUTION);
  }, [branchPress]);
  const drawWeaknessPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.DRAW_WEAKNESS);
  }, [branchPress]);
  const recordTraumaPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.RECORD_TRAUMA);
  }, [branchPress]);

  const showScenarioFaq = useCallback(() => {
    Navigation.push<ScenarioFaqProps>(componentId, {
      component: {
        name: 'Guide.ScenarioFaq',
        passProps: {
          scenario: processedScenario.id.scenarioId,
          campaignId,
        },
      },
    });
  }, [componentId, campaignId, processedScenario]);
  const hasFaq = processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;

  return (
    <>
      <InputWrapper editable>
        <DeckButton
          icon="log"
          title={t`Campaign log`}
          detail={t`Review and add records`}
          onPress={showCampaignLogDialog}
          bottomMargin={s}
        />
        <DeckButton
          icon="chaos_bag"
          title={t`Chaos bag`}
          detail={t`Review and simulate draw`}
          onPress={showChaosBagDialog}
          bottomMargin={s}
        />
        <View style={[styles.row, space.paddingBottomS]}>
          <DeckButton
            icon="weakness"
            title={t`Weakness`}
            detail={t`Draw random`}
            color="dark_gray"
            onPress={drawWeaknessPressed}
            rightMargin={xs}
            noShadow
          />
          <DeckButton
            icon="trauma"
            title={t`Trauma`}
            detail={t`Record`}
            color="dark_gray"
            onPress={recordTraumaPressed}
            leftMargin={xs}
            noShadow
          />
        </View>
        { !!hasFaq && (
          <DeckButton
            icon="faq"
            color="dark_gray"
            noShadow
            title={t`Scenario FAQ`}
            onPress={showScenarioFaq}
            bottomMargin={s}
          />
        ) }
        { !!(find(branches, b => b.visible) || input.campaign_log?.length) && (
          <>
            <Text style={[space.paddingS, typography.cardName, typography.center, typography.italic, typography.light]}>
              { t`Scenario effects` }
            </Text>
            { !!input.campaign_log?.length && (
              <BranchButton
                icon={processedScenario.id.scenarioId}
                key="campaign"
                index={-1}
                text={t`Edit campaign log`}
                onPress={editCampaignLogPressed}
              />
            ) }
            { flatMap(
              branches || [],
              ({ choice, visible }, index) => {
                if (!visible) {
                  return null;
                }
                return (
                  <BranchButton
                    icon={processedScenario.id.scenarioId}
                    key={index}
                    index={index}
                    text={choice.text}
                    description={choice.description}
                    onPress={branchPress}
                  />
                );
              }
            ) }
          </>
        ) }
        <View style={space.paddingBottomS}>
          <TouchableOpacity onPress={resolutionPressed}>
            <View style={[styles.resolutionBlock, { backgroundColor: colors.campaign.resolutionBackground }]}>
              <BorderWrapper border color="resolution" width={width - s * 4}>
                <View style={[styles.resolutionContent, space.paddingS, space.paddingTopL]}>
                  <Text style={[typography.bigGameFont, { color: colors.campaign.resolution }]}>{t`Scenario Ended`}</Text>
                  { !input.no_resolutions && <Text style={typography.mediumGameFont}>{t`Proceed to Resolutions`}</Text> }
                </View>
              </BorderWrapper>
            </View>
          </TouchableOpacity>
        </View>
      </InputWrapper>
      { chaosBagDialog }
      { campaignLogDialog }
    </>
  );
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolutionBlock: {
    borderRadius: 8,
  },
  resolutionContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
