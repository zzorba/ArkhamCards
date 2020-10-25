import React, { useCallback } from 'react';
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

export default function CampaignLogSuppliesComponent({ sectionId, campaignGuide, section }: Props) {
  const renderInvestigator = useCallback((investigator: Card) => {
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
  }, [sectionId, section, campaignGuide]);

  return (
    <>
      { map(section, (investigatorSection, code) => {
        return (
          <SingleCardWrapper
            key={code}
            code={code}
            type="player"
          >
            { renderInvestigator }
          </SingleCardWrapper>
        );
      }) }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: s,
    paddingLeft: m,
    paddingRight: l,
  },
});
