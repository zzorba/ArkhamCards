import React from 'react';
import { View } from 'react-native';
import { map } from 'lodash';

import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { InvestigatorSection } from '@data/scenario/GuidedCampaignLog';
import space from '@styles/space';
import useSingleCard from '@components/card/useSingleCard';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: InvestigatorSection;
  title?: string;
  width: number;
}

function CampaignLogSuppliesInvestigatorSection({ sectionId, campaignGuide, section, code, title, width }: Props & { code: string }) {
  const [investigator] = useSingleCard(code, 'player');
  if (!investigator) {
    return null;
  }
  const investigatorSection = section[investigator.code];
  return (
    <RoundedFactionBlock
      key={investigator.code}
      header={<CompactInvestigatorRow investigator={investigator} width={width} open />}
      faction={investigator.factionCode()}
      noSpace
      noShadow
    >
      <View style={[space.paddingSideS, space.paddingTopM]}>
        { !!investigatorSection && (
          <CampaignLogSectionComponent
            sectionId={sectionId}
            campaignGuide={campaignGuide}
            section={investigatorSection}
            title={title}
          />
        ) }
      </View>
    </RoundedFactionBlock>
  );
}

export default function CampaignLogSuppliesComponent({ sectionId, campaignGuide, section, title, width }: Props) {
  return (
    <>
      { map(section, (investigatorSection, code) => (
        <CampaignLogSuppliesInvestigatorSection
          sectionId={sectionId}
          campaignGuide={campaignGuide}
          section={section}
          title={title}
          key={code}
          code={code}
          width={width}
        />
      )) }
    </>
  );
}
