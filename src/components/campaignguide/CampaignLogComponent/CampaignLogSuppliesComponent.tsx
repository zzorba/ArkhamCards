import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import InvestigatorNameRow from '../prompts/InvestigatorNameRow';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { InvestigatorSection } from '@data/scenario/GuidedCampaignLog';
import Card from '@data/Card';
import { l, m, s } from '@styles/space';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: InvestigatorSection;
}

export default class CampaignLogSuppliesComponent extends React.Component<Props> {
  _renderInvestigator = (investigator: Card) => {
    const { sectionId, section, campaignGuide } = this.props;
    const investigatorSection = section[investigator.code];
    return (
      <View key={investigator.code}>
        <InvestigatorNameRow investigator={investigator} />
        <View style={styles.container}>
          { !!investigatorSection && (
            <CampaignLogSectionComponent
              sectionId={sectionId}
              campaignGuide={campaignGuide}
              section={investigatorSection}
            />
          ) }
        </View>
      </View>
    );
  }

  render() {
    const { section } = this.props;
    return map(section, (investigatorSection, code) => {
      return (
        <SingleCardWrapper
          key={code}
          code={code}
          type="player"
        >
          { this._renderInvestigator }
        </SingleCardWrapper>
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingLeft: m,
    paddingRight: l,
  },
});
