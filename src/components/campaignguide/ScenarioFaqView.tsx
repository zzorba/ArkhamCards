import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from '@components/campaignguide/withCampaignGuideContext';
import space from '@styles/space';
import typography from '@styles/typography';
import { Question } from '@data/scenario/types';
import BasicButton from '@components/core/BasicButton';
import COLORS from '@styles/colors';

export interface ScenarioFaqProps extends CampaignGuideInputProps {
  scenario: string;
}

type Props = ScenarioFaqProps & CampaignGuideProps;
interface State {
  showSpoilers: boolean;
}
class ScenarioFaqView extends React.Component<Props, State> {
  state: State = {
    showSpoilers: false,
  };

  static get options() {
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
  }

  _renderErrata = (errata: Question, key: number) => {
    return (
      <View style={[styles.entry, space.paddingM]} key={key}>
        <CampaignGuideTextComponent text={errata.question} flavor />
        <CampaignGuideTextComponent text={errata.answer} />
      </View>
    );
  };

  _showSpoilers = () => {
    this.setState({
      showSpoilers: true,
    });
  };

  render() {
    const { scenario, campaignData } = this.props;
    const { showSpoilers } = this.state;
    const errata = campaignData.campaignGuide.scenarioFaq(scenario);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[space.paddingM, styles.header]}>
          <Text style={typography.text}>
            { t`The following questions contain light spoilers for this scenario.` }
          </Text>
        </View>
        { showSpoilers ?
          map(errata, (e, idx) => this._renderErrata(e, idx)) :
          <BasicButton title={t`Show Spoilers`} onPress={this._showSpoilers} /> }
      </ScrollView>
    );
  }
}

export default withCampaignGuideContext(ScenarioFaqView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  entry: {
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
