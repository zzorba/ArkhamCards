import React, { useCallback, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import space from '@styles/space';
import { Question } from '@data/scenario/types';
import BasicButton from '@components/core/BasicButton';
import StyleContext from '@styles/StyleContext';
import CampaignGuideContext from './CampaignGuideContext';
import ArkhamButton from '@components/core/ArkhamButton';

export interface ScenarioFaqProps extends CampaignGuideInputProps {
  scenario: string;
}

function ScenarioFaqView({ scenario }: ScenarioFaqProps) {
  const { borderStyle, typography } = useContext(StyleContext);
  const campaignData = useContext(CampaignGuideContext);
  const [spoilers, setShowSpoilers] = useState(false);

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[space.paddingM, styles.header, borderStyle]}>
        <Text style={typography.text}>
          { t`The following questions contain light spoilers for this scenario.` }
        </Text>
      </View>
      { spoilers ?
        map(errata, (e, idx) => renderErrata(e, idx)) :
        <ArkhamButton icon="show" title={t`Show Spoilers`} onPress={showSpoilers} /> }
    </ScrollView>
  );
}

ScenarioFaqView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Scenario FAQ`,
      },
      backButton: {
        title: t`Back`,
      },
    },
  };
};

export default withCampaignGuideContext(ScenarioFaqView, { rootView: false });

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
