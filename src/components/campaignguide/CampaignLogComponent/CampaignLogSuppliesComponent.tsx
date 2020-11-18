import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import InvestigatorNameRow from '../prompts/InvestigatorNameRow';
import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { InvestigatorSection } from '@data/scenario/GuidedCampaignLog';
import { l, m, s } from '@styles/space';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: InvestigatorSection;
}

function CampaignLogSuppliesInvestigatorSection({ sectionId, campaignGuide, section, code }: Props & { code: string }) {
  const [investigator] = useSingleCard(code, 'player');
  if (!investigator) {
    return null;
  }
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

export default function CampaignLogSuppliesComponent({ sectionId, campaignGuide, section }: Props) {
  return (
    <>
      { map(section, (investigatorSection, code) => (
        <CampaignLogSuppliesInvestigatorSection
          sectionId={sectionId}
          campaignGuide={campaignGuide}
          section={section}
          key={code}
          code={code}
        />
      )) }
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
