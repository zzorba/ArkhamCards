import React, { useCallback, useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import space from '@styles/space';
import { Question } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import CampaignGuideContext from './CampaignGuideContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { useDismissOnCampaignDeleted } from '@data/remote/campaigns';

export interface ScenarioFaqProps extends CampaignGuideInputProps {
  scenario: string;
}

function ScenarioFaqView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.ScenarioFaq'>>();
  const { scenario } = route.params;
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const campaignData = useContext(CampaignGuideContext);
  const [spoilers, setShowSpoilers] = useState(false);
  const navigation = useNavigation();
  useDismissOnCampaignDeleted(navigation, campaignData.campaign);

  const renderErrata = useCallback((errata: Question, key: number) => {
    return (
      <View style={[styles.entry, borderStyle, space.paddingM]} key={key}>
        <CampaignGuideTextComponent text={errata.question} flavor />
        <CampaignGuideTextComponent text={errata.answer} />
      </View>
    );
  }, [borderStyle]);
  const showSpoilers = useCallback(() => {
    setShowSpoilers(true);
  }, [setShowSpoilers]);

  const errata = campaignData.campaignGuide.scenarioFaq(scenario);
  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <ScrollView style={backgroundStyle}>
        <View style={[space.paddingM, styles.header, borderStyle]}>
          <Text style={typography.text}>
            { t`The following questions contain light spoilers for this scenario.` }
          </Text>
        </View>
        { spoilers ?
          map(errata, (e, idx) => renderErrata(e, idx)) :
          <ArkhamButton icon="show" title={t`Show Spoilers`} onPress={showSpoilers} /> }
      </ScrollView>
    </SafeAreaView>
  );
}

const WrappedComponent = withCampaignGuideContext(ScenarioFaqView, { rootView: false });

export default function CampaignScenarioFaqWrapper() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.ScenarioFaq'>>();
  const { campaignId } = route.params;
  return <WrappedComponent campaignId={campaignId} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  entry: {
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
