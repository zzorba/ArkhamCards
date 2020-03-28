import React from 'react';
import { StyleSheet, View } from 'react-native'
import { map } from 'lodash';

import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorNameRow from '../../prompts/InvestigatorNameRow';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import { FACTION_LIGHT_GRADIENTS } from 'constants';
import { InvestigatorSection } from 'data/scenario/GuidedCampaignLog';
import Card from 'data/Card';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: InvestigatorSection;
  title: string;
}

export default class CampaignLogSuppliesComponent extends React.Component<Props> {
  _renderInvestigator = (investigator: Card) => {
    const { sectionId, section, campaignGuide, title } = this.props;
    const investigatorSection = section[investigator.code];
    return (
      <View key={investigator.code}>
        <InvestigatorNameRow investigator={investigator} detail={title} />
        <View style={[
          styles.container,
          { backgroundColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0] },
        ]}>
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
          render={this._renderInvestigator}
        />
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 32,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
