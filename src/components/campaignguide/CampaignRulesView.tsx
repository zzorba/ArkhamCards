import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import { useScenarioGuideContext } from './withScenarioGuideContext';
import LoadingSpinner from '@components/core/LoadingSpinner';
import CampaignGuideContext from './CampaignGuideContext';
import CampaignErrorView from './CampaignErrorView';
import { ProcessedCampaign } from '@data/scenario';
import { CampaignRule, Question } from '@data/scenario/types';
import RuleTitleComponent from '@components/settings/RuleTitleComponent';
import space, { s } from '@styles/space';
import { useFlag, useTabooSetId } from '@components/core/hooks';
import ScenarioGuideContext from './ScenarioGuideContext';
import StepsComponent from './StepsComponent';
import CampaignHeader from './CampaignHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import { CAMPAIGN_SETUP_ID } from '@data/scenario/CampaignGuide';
import { openUrl } from '@components/nav/helper';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';
import { conditionResult } from '@data/scenario/conditionHelper';

export interface CampaignRulesProps {
  header?: string;
  campaignId: CampaignId;
  rules: CampaignRule[];
  campaignErrata: Question[];
  scenarioErrata: Question[];
  scenarioId: string;
  standalone?: boolean;
  processedCampaign?: ProcessedCampaign;
}

function RuleComponent({ rule }: { rule: CampaignRule }) {
  const [expanded, toggleExpanded] = useFlag(false);
  const { width } = useContext(StyleContext);
  const scenarioContext = useContext(ScenarioGuideContext);
  const steps = useMemo(() => {
    const { processedScenario, scenarioState } = scenarioContext;
    return processedScenario.scenarioGuide.expandSteps(rule.steps, scenarioState, processedScenario.latestCampaignLog);
  }, [scenarioContext, rule.steps]);

  if (rule.condition) {
    const result = conditionResult(rule.condition, scenarioContext.processedCampaign.campaignLog);
    switch (result.type) {
      case 'binary':
      case 'number':
      case 'string':
        if (!result.option) {
          return null;
        }
        break;
      case 'investigator':
        if (!result.options.length) {
          return null;
        }
        break;
    }
  }

  return (
    <View style={space.paddingVerticalXs}>
      <TouchableOpacity onPress={toggleExpanded} style={[space.paddingVerticalXs, space.paddingSideS]}>
        <View style={space.paddingSideS}>
          <RuleTitleComponent title={rule.title} />
        </View>
      </TouchableOpacity>
      { !!expanded && (
        <StepsComponent
          steps={steps}
          width={width - s * 2}
          noTitle
        />
      )}
    </View>
  );
}

function ErrataComponent({ errata }: { errata: Question }) {
  const { colors } = useContext(StyleContext);
  const navigation = useNavigation();
  const tabooSetId = useTabooSetId();
  const { db } = useContext(DatabaseContext);
  const linkPressed = useCallback(async(url: string) => {
    await openUrl(navigation, url, db, colors, tabooSetId);
  }, [navigation, tabooSetId, db, colors]);

  return (
    <View style={[space.paddingTopXs, space.paddingBottomS]}>
      <View style={space.paddingSideS}>
        <CampaignGuideTextComponent text={t`Q: ${errata.question}`} flavor onLinkPress={linkPressed} />
        <CampaignGuideTextComponent text={t`A: ${errata.answer}`} />
      </View>
      <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, space.marginTopS]}>
        <View style={{ height: 1, width: '40%', backgroundColor: colors.divider }} />
      </View>
    </View>
  );
}

export default function CampaignRulesView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.Rules'>>();
  const {
    campaignId,
    scenarioId,
    rules,
    campaignErrata,
    scenarioErrata,
    standalone,
    processedCampaign: initialProcessedCampaign,
  } = route.params;
  const { backgroundStyle, typography } = useContext(StyleContext);
  const [campaignContext, scenarioContext, , processedCampaignError] = useScenarioGuideContext(campaignId, scenarioId, false, standalone, initialProcessedCampaign);
  const navigation = useNavigation();
  useDismissOnCampaignDeleted(navigation, campaignContext?.campaign);

  const [showFAQ, toggleShowFAQ] = useFlag(false);
  const hasFAQ = !!(campaignErrata.length || scenarioErrata?.length);
  if (!campaignContext || !scenarioContext) {
    if (processedCampaignError) {
      return <CampaignErrorView message={processedCampaignError} />;
    }
    return <LoadingSpinner large />;
  }
  return (
    <CampaignGuideContext.Provider value={campaignContext}>
      <ScenarioGuideContext.Provider value={scenarioContext}>
        <ScrollView contentContainerStyle={backgroundStyle}>
          { !!rules.length && (
            <>
              <CampaignHeader title={t`Campaign Rules`} style={space.paddingTopM} />
              <View style={space.paddingTopXs} />
              { map(rules, (r, idx) => <RuleComponent key={idx} rule={r} />) }
            </>
          ) }
          { ((campaignErrata.length > 0) || scenarioId === CAMPAIGN_SETUP_ID) && (
            <>
              <CampaignHeader title={t`Campaign FAQ`} style={space.paddingTopM} />
              <View style={space.paddingTopXs} />
            </>
          ) }
          { !!hasFAQ && (
            <>
              { !showFAQ ? (
                <View style={space.paddingS}>
                  <DeckButton
                    icon="show"
                    onPress={toggleShowFAQ}
                    title={t`Show FAQ`}
                    detail={t`May contain light spoilers`}
                  />
                </View>
              ) : (
                <>
                  { map(campaignErrata, (question, idx) => <ErrataComponent key={idx} errata={question} />) }
                  { !!scenarioErrata?.length && (
                    <>
                      <CampaignHeader title={t`Scenario FAQ`} style={space.paddingTopM} />
                      <View style={space.paddingTopXs} />
                      { map(scenarioErrata, (question, idx) => <ErrataComponent key={idx} errata={question} />) }
                    </>
                  )}
                </>
              )}
            </>
          ) }
          { scenarioId === CAMPAIGN_SETUP_ID && (
            <View style={space.paddingS}>
              <Text style={typography.small}>
                {t`Note: To avoid spoilers, scenario specific questions and clarifications can be found within each scenario guide.`}
              </Text>
            </View>
          )}
        </ScrollView>
      </ScenarioGuideContext.Provider>
    </CampaignGuideContext.Provider>
  );
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Guide.Rules'> }): NativeStackNavigationOptions {
  return {
    title: route.params?.header ?? t`Campaign Rules`,
  };
};
CampaignRulesView.options = options;
